const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

console.log("=== VÉRIFICATION DU RETRAIT DE L'ONGLET 1 PAR 1 ===");
const hasBtnSingle = html.includes('id="btn-mode-single"');
const hasSingleText = html.includes('>1 par 1<');
console.log("btn-mode-single présent dans le dock:", hasBtnSingle);
console.log("Texte '1 par 1' présent dans le dock:", hasSingleText);
if (hasBtnSingle || hasSingleText) {
    console.error("FAIL: '1 par 1' button is still present in the dock!");
    process.exit(1);
}

console.log("\n=== VÉRIFICATION DES INDICES PÉDAGOGIQUES (AUCUNE RÉPONSE DONNÉE) ===");

// Check that answers are NOT present in the hint texts
// Q1 answers: 8.36, 7.68, 9.27, 5.55
// Q2 answers: 4.32, 3.13
// Q4 answers: 170, 8.7
// Q5 answers: 4.5, 7.65, 765
// Q6 answers: 6.2, 10.54, 1054

const forbiddenPatterns = [
    '836', '8,36', '8.36',
    '4.32', '4,32', '3.13', '3,13',
    '1485 / 8,7 = 170', '1:170', '170.',
    '4,5 cm', '4.5 cm', '765', '7,65', '7.65',
    '6,2 cm', '6.2 cm', '1054', '10,54', '10.54'
];

function checkTextForForbidden(label, text) {
    console.log(`Checking ${label}...`);
    for (const pattern of forbiddenPatterns) {
        if (text.includes(pattern)) {
            console.error(`FAIL: ${label} contains forbidden answer leak: "${pattern}"`);
            console.error("Full text:", text);
            process.exit(1);
        }
    }
    console.log(`  -> ${label} is clean: NO answers leaked!`);
}

// 1. Check fallbackHints in code
const fallbackMatch = html.match(/const fallbackHints = \{([\s\S]*?)\n\s*\};/);
if (!fallbackMatch) {
    console.error("FAIL: fallbackHints not found in code!");
    process.exit(1);
}
const fallbackStr = fallbackMatch[1];
checkTextForForbidden("fallbackHints", fallbackStr);

// 2. Check encrypted hints
const encMatch = html.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
const encStr = encMatch[1];

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

const plain = rc4Drop512(Buffer.from(encStr, 'base64'), '7049').toString('utf8');
const parsed = JSON.parse(plain);
const encHintsStr = JSON.stringify(parsed.hints);
checkTextForForbidden("encryptedHints", encHintsStr);

console.log("\nDecrypted Hints Content:");
for (const [k, v] of Object.entries(parsed.hints)) {
    console.log(`  [${k}]: ${v}\n`);
}

console.log(">>> TOUTES LES VÉRIFICATIONS SONT VALIDÉES À 100% ! <<<");
