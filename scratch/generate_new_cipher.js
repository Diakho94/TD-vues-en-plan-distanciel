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

        // --- QUESTION 6 : CHAUFFAGE CHEMINÉE (1 pt) ---
        "6_pieces_cheminee": { val: "3", pts: 1, alts: ["3", "trois", "3 pieces", "3 pièces"] },

        // --- QUESTION 7 : ÉVACUATIONS EAUX PLUVIALES (1 pt) ---
        "7_evac_pluviales": { val: "3", pts: 1, alts: ["3", "trois", "3 evacuations", "3 évacuations"] },

        // --- QUESTION 8 : SUPERFICIE CHAMBRE 2 (3 pts) ---
        "8_surf_ch2_calc": { val: "5,30 x 3", pts: 1.5, alts: ["5.30*3", "5.3*3", "5,3*3", "5.30 x 3", "5,3 x 3", "5,30 * 3", "5.30 x 3 = 15.9", "15.9", "15,9"] },
        "8_surf_ch2_val": { val: "15.9", pts: 1.5, alts: ["15,9", "15.9 m²", "15,9 m²", "15.90", "15,90", "15.9m2", "15,9m2"] },

        // --- QUESTION 9 : SUPERFICIE CHAMBRE 1 (3 pts) ---
        "9_surf_ch1_calc": { val: "4,50 x 3,60", pts: 1.5, alts: ["4.50*3.60", "4.5*3.6", "4,5*3,6", "4.50 x 3.60", "4,5 x 3,6", "4,50 * 3,60", "4.50 x 3.60 = 16.2", "16.2", "16,2"] },
        "9_surf_ch1_val": { val: "16.2", pts: 1.5, alts: ["16,2", "16.2 m²", "16,2 m²", "16.20", "16,20", "16.2m2", "16,2m2"] },

        // --- QUESTION 10 : ÉCHELLE DU PLAN (1 pt) ---
        "10_echelle_plan": { val: "1:100", pts: 1, alts: ["1 : 100", "1/100", "1 / 100", "100", "1:100e", "1/100e"] },

        // --- QUESTION 11 : DIMENSION RÉELLE POUR 5 CM (2 pts) ---
        "11_dim_reelle_calc": { val: "5 x 100 = 500 cm = 5 m", pts: 1, alts: ["5*100=500", "5*100", "5 x 100", "500 cm", "500", "5 x 100 = 500", "5*100=500cm=5m"] },
        "11_dim_reelle_val": { val: "5", pts: 1, alts: ["5 m", "5m", "5,0", "5.0", "5.00", "5,00"] },

        // --- QUESTION 12 : PROFONDEUR PLACARD N (2 pts) ---
        "12_placard_calc": { val: "0,8 cm x 100 = 80 cm", pts: 1, alts: ["0.8*100=80", "0.8*100", "0,8*100", "0,8 x 100", "0.8 x 100", "80 cm", "80", "0,8 cm x 100", "0.8 cm x 100"] },
        "12_placard_val": { val: "80", pts: 1, alts: ["80 cm", "80cm", "0.8 m", "0,8 m", "0.8", "0,8"] }
    },
    hints: {
        h_q8: "Formule : Surface = Longueur × Largeur",
        h_q9: "Formule : Surface = Longueur × Largeur",
        h_q11: "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle",
        h_q12: "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle"
    }
};

const jsonStr = JSON.stringify(payload);
const cipherBuf = rc4Drop512(Buffer.from(jsonStr, 'utf8'), '7049');
const cipherB64 = cipherBuf.toString('base64');

// Test decryption
const testPlain = rc4Drop512(Buffer.from(cipherB64, 'base64'), '7049').toString('utf8');
const testObj = JSON.parse(testPlain);

console.log("Validation key check:", testObj.token === "MELEC_S1_SECRET_KEY_OK");
console.log("Questions count:", Object.keys(testObj.answers).length);
const totalPts = Object.values(testObj.answers).reduce((s, a) => s + a.pts, 0);
console.log("Total points possible:", totalPts);
console.log("Hints count:", Object.keys(testObj.hints).length);

fs.writeFileSync("scratch/new_cipher_final.txt", cipherB64, "utf8");
console.log("Saved new ciphertext to scratch/new_cipher_final.txt");
