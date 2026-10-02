const fs = require('fs');

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

const payload = {
    token: "MELEC_S1_SECRET_KEY_OK",
    answers: {
        // --- QUESTION 1 : SYMBOLES (14 pts) ---
        "1_symb_A": { val: "Cuisinière", pts: 1, alts: ["cuisiniere", "cuisinière"] },
        "1_symb_B": { val: "Évier à égouttoir", pts: 1, alts: ["evier a egouttoir", "évier à égouttoir", "evier", "évier"] },
        "1_symb_C": { val: "WC", pts: 1, alts: ["wc", "toilettes"] },
        "1_symb_D": { val: "Lavabo", pts: 1, alts: ["lavabo"] },
        "1_symb_E": { val: "Bidet", pts: 1, alts: ["bidet"] },
        "1_symb_F": { val: "Radiateur", pts: 1, alts: ["radiateur"] },
        "1_symb_G": { val: "Fauteuil", pts: 1, alts: ["fauteuil"] },
        "1_symb_H": { val: "Lit 2 personnes", pts: 1, alts: ["lit 2 personnes", "lit double"] },
        "1_symb_I": { val: "Armoire", pts: 1, alts: ["armoire"] },
        "1_symb_J": { val: "Baignoire", pts: 1, alts: ["baignoire"] },
        "1_symb_K": { val: "Lit 1 personne", pts: 1, alts: ["lit 1 personne", "lit simple"] },
        "1_symb_L": { val: "Commode", pts: 1, alts: ["commode"] },
        "1_symb_M": { val: "Évacuation des eaux pluviales", pts: 1, alts: ["evacuation des eaux pluviales", "évacuation des eaux pluviales", "descente eaux pluviales", "eaux pluviales"] },
        "1_symb_N": { val: "Placard fermé", pts: 1, alts: ["placard ferme", "placard fermé", "placard"] },

        // --- QUESTION 2 : ORIENTATION GÉOGRAPHIQUE (12 pts) ---
        "2_orient_cuisine": { val: "Nord-Est", pts: 2, alts: ["nord-est", "nord est", "ne"] },
        "2_orient_porte": { val: "Sud-Ouest", pts: 2, alts: ["sud-ouest", "sud ouest", "so"] },
        "2_orient_ch1": { val: "Sud-Est", pts: 2, alts: ["sud-est", "sud est", "se"] },
        "2_orient_sdb": { val: "Sud-Est", pts: 2, alts: ["sud-est", "sud est", "se"] },
        "2_orient_ch2": { val: "Sud-Est", pts: 2, alts: ["sud-est", "sud est", "se"] },
        "2_orient_sejour": { val: "Nord-Est", pts: 2, alts: ["nord-est", "nord est", "ne"] },

        // --- QUESTION 3 : CHAUFFAGE CHEMINÉE (1 pt) ---
        "3_pieces_cheminee": { val: "3", pts: 1, alts: ["3", "trois", "3 pieces", "3 pièces"] },

        // --- QUESTION 4 : ÉVACUATIONS EAUX PLUVIALES (1 pt) ---
        "4_evac_pluviales": { val: "3", pts: 1, alts: ["3", "trois", "3 evacuations", "3 évacuations"] },

        // --- QUESTION 5 : SUPERFICIE CHAMBRE 2 (3 pts) ---
        "5_surf_ch2_calc": { val: "5,30 x 3", pts: 1.5, alts: ["5.30*3", "5.3*3", "5,3*3", "5.30 x 3", "5,3 x 3", "5,30 * 3", "5.30 x 3 = 15.9", "15.9", "15,9"] },
        "5_surf_ch2_val": { val: "15.9", pts: 1.5, alts: ["15,9", "15.9 m²", "15,9 m²", "15.90", "15,90", "15.9m2", "15,9m2"] },

        // --- QUESTION 6 : SUPERFICIE CHAMBRE 1 (3 pts) ---
        "6_surf_ch1_calc": { val: "4,50 x 3,60", pts: 1.5, alts: ["4.50*3.60", "4.5*3.6", "4,5*3,6", "4.50 x 3.60", "4,5 x 3,6", "4,50 * 3,60", "4.50 x 3.60 = 16.2", "16.2", "16,2"] },
        "6_surf_ch1_val": { val: "16.2", pts: 1.5, alts: ["16,2", "16.2 m²", "16,2 m²", "16.20", "16,20", "16.2m2", "16,2m2"] },

        // --- QUESTION 7 : ÉCHELLE DU PLAN (1 pt) ---
        "7_echelle_plan": { val: "1:100", pts: 1, alts: ["1 : 100", "1/100", "1 / 100", "100", "1:100e", "1/100e"] },

        // --- QUESTION 8 : DIMENSION RÉELLE POUR 5 CM (2 pts) ---
        "8_dim_reelle_calc": { val: "5 x 100 = 500 cm = 5 m", pts: 1, alts: ["5*100=500", "5*100", "5 x 100", "500 cm", "500", "5 x 100 = 500", "5*100=500cm=5m"] },
        "8_dim_reelle_val": { val: "5", pts: 1, alts: ["5 m", "5m", "5,0", "5.0", "5.00", "5,00"] },

        // --- QUESTION 9 : PROFONDEUR PLACARD N (2 pts) ---
        "9_placard_calc": { val: "0,8 cm x 100 = 80 cm", pts: 1, alts: ["0.8*100=80", "0.8*100", "0,8*100", "0,8 x 100", "0.8 x 100", "80 cm", "80", "0,8 cm x 100", "0.8 cm x 100"] },
        "9_placard_val": { val: "80", pts: 1, alts: ["80 cm", "80cm", "0.8 m", "0,8 m", "0.8", "0,8"] }
    },
    hints: {
        h_q5: "Formule : Surface = Longueur × Largeur",
        h_q6: "Formule : Surface = Longueur × Largeur",
        h_q8: "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle",
        h_q9: "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle"
    }
};

const jsonStr = JSON.stringify(payload);
const cipherBuf = rc4Drop512(Buffer.from(jsonStr, 'utf8'), '7049');
const newCipher = cipherBuf.toString('base64');

// Load HTML
let html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// 1. Replace question titles in Page 5
html = html.replace(
    `6 - Préciser le nombre de pièces chauffées par la cheminée <strong>(toutes portes fermées)</strong> :`,
    `3 - Préciser le nombre de pièces chauffées par la cheminée <strong>(toutes portes fermées)</strong> :`
);
html = html.replace(`data-qid="6_pieces_cheminee"`, `data-qid="3_pieces_cheminee"`);
html = html.replace(`id="fb-6_pieces_cheminee"`, `id="fb-3_pieces_cheminee"`);

html = html.replace(
    `7 - Préciser le nombre d'évacuations d'eaux pluviales :`,
    `4 - Préciser le nombre d'évacuations d'eaux pluviales :`
);
html = html.replace(`data-qid="7_evac_pluviales"`, `data-qid="4_evac_pluviales"`);
html = html.replace(`id="fb-7_evac_pluviales"`, `id="fb-4_evac_pluviales"`);

html = html.replace(
    `8 - Calculer la superficie de la chambre <span class="circle-num">2</span> :`,
    `5 - Calculer la superficie de la chambre <span class="circle-num">2</span> :`
);
html = html.replace(`onclick="activerIndice('h_q8')"`, `onclick="activerIndice('h_q5')"`);
html = html.replace(`>💡 Indice Q8<`, `>💡 Indice Q5<`);
html = html.replace(`id="h_q8"`, `id="h_q5"`);
html = html.replace(`data-qid="8_surf_ch2_calc"`, `data-qid="5_surf_ch2_calc"`);
html = html.replace(`id="fb-8_surf_ch2_calc"`, `id="fb-5_surf_ch2_calc"`);
html = html.replace(`data-qid="8_surf_ch2_val"`, `data-qid="5_surf_ch2_val"`);
html = html.replace(`id="fb-8_surf_ch2_val"`, `id="fb-5_surf_ch2_val"`);

html = html.replace(
    `9 - Calculer la superficie de la chambre <span class="circle-num">1</span> :`,
    `6 - Calculer la superficie de la chambre <span class="circle-num">1</span> :`
);
html = html.replace(`onclick="activerIndice('h_q9')"`, `onclick="activerIndice('h_q6')"`);
html = html.replace(`>💡 Indice Q9<`, `>💡 Indice Q6<`);
html = html.replace(`id="h_q9"`, `id="h_q6"`);
html = html.replace(`data-qid="9_surf_ch1_calc"`, `data-qid="6_surf_ch1_calc"`);
html = html.replace(`id="fb-9_surf_ch1_calc"`, `id="fb-6_surf_ch1_calc"`);
html = html.replace(`data-qid="9_surf_ch1_val"`, `data-qid="6_surf_ch1_val"`);
html = html.replace(`id="fb-9_surf_ch1_val"`, `id="fb-6_surf_ch1_val"`);

// 2. Replace question titles in Page 6
html = html.replace(
    `10 - Indiquer l'échelle du plan :`,
    `7 - Indiquer l'échelle du plan :`
);
html = html.replace(`data-qid="10_echelle_plan"`, `data-qid="7_echelle_plan"`);
html = html.replace(`id="fb-10_echelle_plan"`, `id="fb-7_echelle_plan"`);

html = html.replace(
    `11 - Donner la dimension réelle (en m.) correspondant à 5 cm mesuré sur le plan :`,
    `8 - Donner la dimension réelle (en m.) correspondant à 5 cm mesuré sur le plan :`
);
html = html.replace(`onclick="activerIndice('h_q11')"`, `onclick="activerIndice('h_q8')"`);
html = html.replace(`>💡 Indice Q11<`, `>💡 Indice Q8<`);
html = html.replace(`id="h_q11"`, `id="h_q8"`);
html = html.replace(`data-qid="11_dim_reelle_calc"`, `data-qid="8_dim_reelle_calc"`);
html = html.replace(`id="fb-11_dim_reelle_calc"`, `id="fb-8_dim_reelle_calc"`);
html = html.replace(`data-qid="11_dim_reelle_val"`, `data-qid="8_dim_reelle_val"`);
html = html.replace(`id="fb-11_dim_reelle_val"`, `id="fb-8_dim_reelle_val"`);

html = html.replace(
    `12 - Déterminer la profondeur du placard <strong>N</strong> :`,
    `9 - Déterminer la profondeur du placard <strong>N</strong> :`
);
html = html.replace(`onclick="activerIndice('h_q12')"`, `onclick="activerIndice('h_q9')"`);
html = html.replace(`>💡 Indice Q12<`, `>💡 Indice Q9<`);
html = html.replace(`id="h_q12"`, `id="h_q9"`);
html = html.replace(`data-qid="12_placard_calc"`, `data-qid="9_placard_calc"`);
html = html.replace(`id="fb-12_placard_calc"`, `id="fb-9_placard_calc"`);
html = html.replace(`data-qid="12_placard_val"`, `data-qid="9_placard_val"`);
html = html.replace(`id="fb-12_placard_val"`, `id="fb-9_placard_val"`);

// 3. Replace ciphertext
html = html.replace(/const CORRIGE_ENCRYPTE = "[^"]+";/, `const CORRIGE_ENCRYPTE = "${newCipher}";`);

// 4. Update fallback hints in JS
const oldFallback = `                const fallbackHints = {
                    'h_q8': "Formule : Surface = Longueur × Largeur",
                    'h_q9': "Formule : Surface = Longueur × Largeur",
                    'h_q11': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle",
                    'h_q12': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle"
                };`;

const newFallback = `                const fallbackHints = {
                    'h_q5': "Formule : Surface = Longueur × Largeur",
                    'h_q6': "Formule : Surface = Longueur × Largeur",
                    'h_q8': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle",
                    'h_q9': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle"
                };`;

html = html.replace(oldFallback, newFallback);

fs.writeFileSync('TD_Sequence1_MELEC_Echelle_Document.html', html, 'utf8');
console.log("Successfully updated question numbering (1 to 9) and ciphertext!");
