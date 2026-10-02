const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

function rc4Drop512(buf, key) {
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
    let out = Buffer.alloc(buf.length);
    for (let k = 0; k < buf.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
        let K = s[(s[i] + s[j]) % 256];
        out[k] = buf[k] ^ K;
    }
    return out;
}

const encMatch = html.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
if (!encMatch) {
    console.error("❌ CORRIGE_ENCRYPTE not found!");
    process.exit(1);
}

const decrypted = rc4Drop512(Buffer.from(encMatch[1], 'base64'), '7049').toString('utf8');
const payload = JSON.parse(decrypted);

console.log("✅ Decryption successful. Key OK:", payload.token === "MELEC_S1_SECRET_KEY_OK");

// Find all data-qid in HTML
const qidMatches = [...html.matchAll(/data-qid="([^"]+)"/g)].map(m => m[1]);
console.log("Total data-qid fields in HTML:", qidMatches.length);

const answerKeys = Object.keys(payload.answers);
console.log("Total answer keys in payload:", answerKeys.length);

let missingInPayload = qidMatches.filter(q => !answerKeys.includes(q));
let missingInHtml = answerKeys.filter(a => !qidMatches.includes(a));

if (missingInPayload.length > 0) {
    console.error("❌ Missing in payload:", missingInPayload);
} else {
    console.log("✅ All HTML data-qid fields exist in payload!");
}

if (missingInHtml.length > 0) {
    console.error("❌ Missing in HTML:", missingInHtml);
} else {
    console.log("✅ All payload answer keys exist in HTML!");
}

// Check feedback divs
let missingFb = [];
for (const qid of qidMatches) {
    if (!html.includes(`id="fb-${qid}"`)) {
        missingFb.push(qid);
    }
}

if (missingFb.length > 0) {
    console.error("❌ Missing feedback divs:", missingFb);
} else {
    console.log("✅ All feedback divs exist!");
}

// Check hints
const hintBtns = [...html.matchAll(/activerIndice\('([^']+)'\)/g)].map(m => m[1]);
console.log("Hint buttons in HTML:", hintBtns);
console.log("Payload hints:", Object.keys(payload.hints));

for (const hb of hintBtns) {
    if (!payload.hints[hb]) {
        console.error("❌ Hint missing in payload:", hb);
    }
}

console.log("Hint contents:");
for (const [k, v] of Object.entries(payload.hints)) {
    console.log(`  ${k}: "${v}"`);
}

// Check total points
const totalPts = Object.values(payload.answers).reduce((s, a) => s + a.pts, 0);
console.log("Total points:", totalPts);

console.log("🎉 ALL TESTS PASSED!");
