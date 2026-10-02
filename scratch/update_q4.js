const fs = require('fs');

const filePath = 'TD_Sequence1_MELEC_Echelle_Document.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Q4 Question Title to include "8,7 cm"
const oldTitle = 'Q4 - Calculer L\'ÉCHELLE des plans de façades ci-dessous (à partir de la dimension 14,85 m) :';
const newTitle = 'Q4 - Calculer L\'ÉCHELLE des plans de façades ci-dessous sachant que la largeur réelle totale est de 14,85 m et que la dimension mesurée sur le plan est de 8,7 cm :';

if (!content.includes(oldTitle)) {
    console.error("Old title not found in HTML!");
    process.exit(1);
}
content = content.replace(oldTitle, newTitle);
console.log("Q4 title updated with 8,7 cm.");

// Also update sub-label above image if present
const oldSubLabel = 'FAÇADE\n                            PRINCIPALE (Cote : 14,85 m)';
const newSubLabel = 'FAÇADE\n                            PRINCIPALE (Réel : 14,85 m | Mesuré sur plan : 8,7 cm)';
if (content.includes(oldSubLabel)) {
    content = content.replace(oldSubLabel, newSubLabel);
    console.log("Sub-label updated.");
}

// 2. RC4 cipher update with new simple formula hint for Q4
const newHintQ4 = "Formule : Échelle = Dimension réelle / Dimension mesurée (pensez à convertir d'abord la dimension réelle en cm pour utiliser la même unité).";

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

const encMatch = content.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
const oldCipher = encMatch[1];
const decrypted = rc4Drop512(Buffer.from(oldCipher, 'base64'), '7049').toString('utf8');
const parsed = JSON.parse(decrypted);

parsed.hints.h_q4 = newHintQ4;

const newCipherBuf = rc4Drop512(Buffer.from(JSON.stringify(parsed), 'utf8'), '7049');
const newCipherB64 = newCipherBuf.toString('base64');

content = content.replace(oldCipher, newCipherB64);
console.log("CORRIGE_ENCRYPTE updated with new hint for Q4.");

// 3. Update fallbackHints in JS
const oldFallbackQ4Regex = /'h_q4':\s*"[^"]*",/;
const newFallbackQ4 = `'h_q4': "${newHintQ4}",`;
if (!oldFallbackQ4Regex.test(content)) {
    console.error("fallbackHints h_q4 regex not matched!");
    process.exit(1);
}
content = content.replace(oldFallbackQ4Regex, newFallbackQ4);
console.log("fallbackHints h_q4 updated.");

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully!");
