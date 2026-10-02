const fs = require('fs');

const html = fs.readFileSync('./TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// 1. Extract QIDs from HTML inputs only (ignore JS template literals)
const qidRegex = /<input[^>]+data-qid="([^"]+)"/g;
const htmlQids = [];
let m;
while ((m = qidRegex.exec(html)) !== null) {
    htmlQids.push(m[1]);
}
console.log('Total input data-qid in HTML:', htmlQids.length);

// 2. Extract encrypted string from HTML
const encMatch = html.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
if (!encMatch) {
    console.error('CORRIGE_ENCRYPTE not found!');
    process.exit(1);
}
const encStr = encMatch[1];

// 3. Decrypt
function rc4Drop512Decrypt(base64Cipher, key) {
    let s = new Array(256);
    for (let i = 0; i < 256; i++) s[i] = i;
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
    }
    let i = 0; j = 0;
    for (let k = 0; k < 512; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
    }
    let binaryStr = Buffer.from(base64Cipher, 'base64');
    let plain = [];
    for (let k = 0; k < binaryStr.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
        let K = s[(s[i] + s[j]) % 256];
        plain.push(binaryStr[k] ^ K);
    }
    return Buffer.from(plain).toString('utf8');
}

const dec = rc4Drop512Decrypt(encStr, '7049');
const parsed = JSON.parse(dec);
console.log('Decrypted token:', parsed.token);
const answers = parsed.answers;
const answerQids = Object.keys(answers);
console.log('Total answers in encrypted dictionary:', answerQids.length);

// Check if all answer QIDs are present in HTML
const missingInHtml = answerQids.filter(q => !htmlQids.includes(q));
const extraInHtml = htmlQids.filter(q => !answerQids.includes(q));

console.log('Missing in HTML:', missingInHtml);
console.log('Extra in HTML:', extraInHtml);

// 4. Check images referenced in HTML
const imgRegex = /src="img\/([^"]+)"/g;
const images = [];
while ((m = imgRegex.exec(html)) !== null) {
    images.push(m[1]);
}
console.log('Images referenced:', images);
let allImagesOk = true;
images.forEach(img => {
    const exists = fs.existsSync('./img/' + img);
    console.log('  Image img/' + img + ' exists:', exists);
    if (!exists) allImagesOk = false;
});

// 5. Total points in answer key
let totalPoints = 0;
for (const k in answers) {
    totalPoints += answers[k].pts;
}
console.log('Total points in answer key:', totalPoints);

// 6. Check Hint Quota & Display
const hasFreeHint1 = html.includes('const FREE_HINTS = 1;');
const hasBadgeText = html.includes('💡 1 indice gratuit | Utilisés : 0');
console.log('FREE_HINTS = 1 in JS:', hasFreeHint1);
console.log('Initial badge has 1 indice gratuit:', hasBadgeText);

// 7. Check 2-lines Layout (Row 1: Pages 1-3, Row 2: Pages 4-6)
const p1 = html.indexOf('id="page-1-garde"');
const p2 = html.indexOf('id="page-2-contexte"');
const p3 = html.indexOf('id="page-3-bilan"');
const r1End = html.indexOf('<!-- FIN LIGNE 1 -->');
const r2Start = html.indexOf('id="pages-row-2"');
const p4 = html.indexOf('id="page-4-cas1"');
const p5 = html.indexOf('id="page-5-cas2"');
const p6 = html.indexOf('id="page-6-cas3"');
const r2End = html.indexOf('<!-- FIN LIGNE 2 -->');

const row1Ok = (p1 !== -1 && p2 !== -1 && p3 !== -1 && p1 < p2 && p2 < p3 && p3 < r1End);
const row2Ok = (r1End < r2Start && r2Start < p4 && p4 < p5 && p5 < p6 && p6 < r2End);
console.log('Row 1 (Pages 1, 2, 3) correctly enclosed:', row1Ok);
console.log('Row 2 (Pages 4, 5, 6) correctly enclosed below Row 1:', row2Ok);

if (parsed.token === 'MELEC_S1_SECRET_KEY_OK' && missingInHtml.length === 0 && extraInHtml.length === 0 && allImagesOk && totalPoints === 20 && hasFreeHint1 && hasBadgeText && row1Ok && row2Ok) {
    console.log('\n>>> ALL CHECKS PASSED 100% SUCCESFULLY! <<<');
} else {
    console.error('\n>>> SOME CHECKS FAILED! <<<');
    process.exit(1);
}
