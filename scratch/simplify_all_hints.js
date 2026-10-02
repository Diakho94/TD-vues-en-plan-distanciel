const fs = require('fs');

const filePath = 'TD_Sequence1_MELEC_Echelle_Document.html';
let content = fs.readFileSync(filePath, 'utf8');

const simplifiedHints = {
    h_q1: "Formule : Dimension réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
    h_q2: "Lecture directe : les dimensions réelles sont inscrites en noir à l'intérieur de la pièce « CH 2 » (Longueur × Largeur en mètres).",
    h_q3: "Formule : Dimension réelle = (Mesure sur plan × 2) / 2,5 (produit en croix à partir de l'échelle graphique).",
    h_q4: "Formule : Échelle = Dimension réelle / Dimension mesurée (pensez à convertir d'abord la dimension réelle en cm pour utiliser la même unité).",
    h_q5: "Formule : Hauteur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
    h_q6: "Formule : Largeur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres)."
};

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

// 1. Update encrypted payload
const encMatch = content.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
const oldCipher = encMatch[1];
const decrypted = rc4Drop512(Buffer.from(oldCipher, 'base64'), '7049').toString('utf8');
const parsed = JSON.parse(decrypted);

parsed.hints = simplifiedHints;

const newCipherBuf = rc4Drop512(Buffer.from(JSON.stringify(parsed), 'utf8'), '7049');
const newCipherB64 = newCipherBuf.toString('base64');

content = content.replace(oldCipher, newCipherB64);
console.log("CORRIGE_ENCRYPTE updated with all simplified hints.");

// 2. Update fallbackHints
const oldFallbackRegex = /const fallbackHints = \{[\s\S]*?\n\s*\};/;
const newFallbackBlock = `const fallbackHints = {
                    'h_q1': "Formule : Dimension réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
                    'h_q2': "Lecture directe : les dimensions réelles sont inscrites en noir à l'intérieur de la pièce « CH 2 » (Longueur × Largeur en mètres).",
                    'h_q3': "Formule : Dimension réelle = (Mesure sur plan × 2) / 2,5 (produit en croix à partir de l'échelle graphique).",
                    'h_q4': "Formule : Échelle = Dimension réelle / Dimension mesurée (pensez à convertir d'abord la dimension réelle en cm pour utiliser la même unité).",
                    'h_q5': "Formule : Hauteur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
                    'h_q6': "Formule : Largeur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres)."
                };`;

content = content.replace(oldFallbackRegex, newFallbackBlock);
console.log("fallbackHints block updated.");

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully!");
