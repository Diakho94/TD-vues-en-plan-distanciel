const fs = require('fs');

const filePath = 'TD_Sequence1_MELEC_Echelle_Document.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Read new cipher from scratch/new_cipher.txt
const newCipher = fs.readFileSync('scratch/new_cipher.txt', 'utf8').trim();

// 2. Replace CORRIGE_ENCRYPTE
const oldEncRegex = /const CORRIGE_ENCRYPTE = "[^"]+";/;
if (!oldEncRegex.test(content)) {
    console.error("CORRIGE_ENCRYPTE regex not matched!");
    process.exit(1);
}
content = content.replace(oldEncRegex, `const CORRIGE_ENCRYPTE = "${newCipher}";`);
console.log("CORRIGE_ENCRYPTE updated.");

// 3. Update fallbackHints
const oldHintsBlockRegex = /const fallbackHints = \{[\s\S]*?\n\s*\};/;
const newHintsBlock = `const fallbackHints = {
                    'h_q1': "Multipliez la dimension mesurée sur le plan (en cm) par le dénominateur de l'échelle (76) pour trouver la dimension réelle en cm. Convertissez ensuite ce résultat en mètres en divisant par 100 (1 m = 100 cm).",
                    'h_q2': "Observez attentivement l'intérieur de la pièce « CH 2 » sur le plan : les dimensions réelles y sont directement écrites en noir. La plus grande valeur correspond à la longueur et la plus petite à la largeur. Aucun calcul d'échelle n'est nécessaire.",
                    'h_q3': "Utilisez l'échelle graphique comme référence : 2,5 cm mesurés sur la règle du plan représentent 2 m dans la réalité. Appliquez le produit en croix pour chaque dimension : Dimension réelle (m) = (Mesure sur le plan en cm × 2) / 2,5.",
                    'h_q4': "1. Mesurez d'abord au double décimètre la largeur totale de la façade principale sur le dessin (en cm). 2. Convertissez la dimension réelle (14,85 m) en cm (1 m = 100 cm). 3. Calculez le dénominateur de l'échelle avec la formule : Dénominateur = Dimension réelle (en cm) / Dimension mesurée (en cm). L'échelle s'écrit sous la forme 1 / Dénominateur.",
                    'h_q5': "1. Mesurez précisément la hauteur totale du bâtiment au double décimètre sur le dessin de la façade arrière (en cm). 2. Multipliez cette mesure par le dénominateur de l'échelle trouvé à la question Q4 pour obtenir la hauteur réelle en cm. 3. Convertissez enfin le résultat en mètres en divisant par 100.",
                    'h_q6': "1. Mesurez la largeur totale du bâtiment sur la façade gauche avec votre règle (en cm). 2. Multipliez cette mesure par le dénominateur de l'échelle trouvé à la question Q4. 3. Divisez par 100 pour donner le résultat final en mètres."
                };`;

if (!oldHintsBlockRegex.test(content)) {
    console.error("fallbackHints regex not matched!");
    process.exit(1);
}
content = content.replace(oldHintsBlockRegex, newHintsBlock);
console.log("fallbackHints updated.");

fs.writeFileSync(filePath, content, 'utf8');
console.log("File saved successfully!");
