const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');
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

const plainBuf = rc4Drop512(Buffer.from(encStr, 'base64'), '7049');
const parsed = JSON.parse(plainBuf.toString('utf8'));

// New methodological hints (no answers, pure guidance)
parsed.hints = {
    h_q1: "Multipliez la dimension mesurée sur le plan (en cm) par le dénominateur de l'échelle (76) pour trouver la dimension réelle en cm. Convertissez ensuite ce résultat en mètres en divisant par 100 (1 m = 100 cm).",
    h_q2: "Observez attentivement l'intérieur de la pièce « CH 2 » sur le plan : les dimensions réelles y sont directement écrites en noir. La plus grande valeur correspond à la longueur et la plus petite à la largeur. Aucun calcul d'échelle n'est nécessaire.",
    h_q3: "Utilisez l'échelle graphique comme référence : 2,5 cm mesurés sur la règle du plan représentent 2 m dans la réalité. Appliquez le produit en croix pour chaque dimension : Dimension réelle (m) = (Mesure sur le plan en cm × 2) / 2,5.",
    h_q4: "1. Mesurez d'abord au double décimètre la largeur totale de la façade principale sur le dessin (en cm). 2. Convertissez la dimension réelle (14,85 m) en cm (1 m = 100 cm). 3. Calculez le dénominateur de l'échelle avec la formule : Dénominateur = Dimension réelle (en cm) / Dimension mesurée (en cm). L'échelle s'écrit sous la forme 1 / Dénominateur.",
    h_q5: "1. Mesurez précisément la hauteur totale du bâtiment au double décimètre sur le dessin de la façade arrière (en cm). 2. Multipliez cette mesure par le dénominateur de l'échelle trouvé à la question Q4 pour obtenir la hauteur réelle en cm. 3. Convertissez enfin le résultat en mètres en divisant par 100.",
    h_q6: "1. Mesurez la largeur totale du bâtiment sur la façade gauche avec votre règle (en cm). 2. Multipliez cette mesure par le dénominateur de l'échelle trouvé à la question Q4. 3. Divisez par 100 pour donner le résultat final en mètres."
};

const newJsonStr = JSON.stringify(parsed);
const newCipherBuf = rc4Drop512(Buffer.from(newJsonStr, 'utf8'), '7049');
const newCipherB64 = newCipherBuf.toString('base64');

// Verify decryption of new cipher
const checkPlain = rc4Drop512(Buffer.from(newCipherB64, 'base64'), '7049').toString('utf8');
const checkParsed = JSON.parse(checkPlain);
console.log('Decryption check passed:', checkParsed.token === 'MELEC_S1_SECRET_KEY_OK');
console.log('Total answers intact:', Object.keys(checkParsed.answers).length);
console.log('New hints:', checkParsed.hints);

fs.writeFileSync('scratch/new_cipher.txt', newCipherB64, 'utf8');
console.log('New cipher written to scratch/new_cipher.txt');
