const fs = require('fs');

const filePath = 'TD_Sequence1_MELEC_Echelle_Document.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Q5 Question Title to include "4,5 cm"
const oldTitle = "Q5 - En déduire la HAUTEUR de la maison sur l'image ci-dessous (échelle identique) :";
const newTitle = "Q5 - En déduire la HAUTEUR réelle de la maison à partir de la façade arrière ci-dessous sachant que la hauteur mesurée sur le plan est de 4,5 cm (échelle identique à la question Q4) :";

if (!content.includes(oldTitle)) {
    console.error("Old Q5 title not found in HTML!");
    process.exit(1);
}
content = content.replace(oldTitle, newTitle);
console.log("Q5 title updated with 4,5 cm.");

// Also update sub-label above image
const oldSubLabel = "FAÇADE\n                            ARRIÈRE</div>";
const newSubLabel = "FAÇADE\n                            ARRIÈRE (Hauteur mesurée sur plan : 4,5 cm)</div>";
if (content.includes(oldSubLabel)) {
    content = content.replace(oldSubLabel, newSubLabel);
    console.log("Sub-label Q5 updated.");
}

// 2. RC4 cipher update with new simple formula hint for Q5
const newHintQ5 = "Formule : Hauteur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à convertir le résultat en mètres en divisant par 100).";

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

parsed.hints.h_q5 = newHintQ5;

const newCipherBuf = rc4Drop512(Buffer.from(JSON.stringify(parsed), 'utf8'), '7049');
const newCipherB64 = newCipherBuf.toString('base64');

content = content.replace(oldCipher, newCipherB64);
console.log("CORRIGE_ENCRYPTE updated with new hint for Q5.");

// 3. Update fallbackHints in JS
const oldFallbackQ5Regex = /'h_q5':\s*"[^"]*",/;
const newFallbackQ5 = `'h_q5': "${newHintQ5}",`;
if (!oldFallbackQ5Regex.test(content)) {
    console.error("fallbackHints h_q5 regex not matched!");
    process.exit(1);
}
content = content.replace(oldFallbackQ5Regex, newFallbackQ5);
console.log("fallbackHints h_q5 updated.");

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully!");
