const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec";

const nom1 = "TRAORE";
const prenom1 = "Moussa";
const nom2 = "DIAKITE";
const prenom2 = "Ibrahim";
const classe = "1MELEC2";
const groupe = "G2";
const nomFichierPDF = `${nom1}_${prenom1}_et_${nom2}_${prenom2}_${classe}_${groupe}_S1_Echelle.pdf`;

const payload = JSON.stringify({
    horodatage: new Date().toLocaleString('fr-FR'),
    titreTD: "Séquence 1 : Séance Échelle d'un document",
    filiere: "MELEC",
    classe: classe,
    groupe: groupe,
    isBinome: "Oui",
    eleve1: `${nom1} ${prenom1}`,
    eleve2: `${nom2} ${prenom2}`,
    scoreBrut: "Score brut : 19.5 / 20",
    indicesUtilises: 1,
    penaliteNoteSur20: "0.00 pt",
    noteSur20: 19.5,
    competenceC1: "Très bonne maîtrise",
    competenceC2: "Très bonne maîtrise",
    nomFichierPDF: nomFichierPDF,
    eleve1_nom: nom1,
    eleve1_prenom: prenom1,
    eleve2_nom: nom2,
    eleve2_prenom: prenom2,
    nomFichier: nomFichierPDF
});

const req = https.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
    }
}, (res) => {
    if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, redirRes => {
            let data = '';
            redirRes.on('data', c => data += c);
            redirRes.on('end', () => console.log("Binôme Test Result:", data));
        });
    }
});
req.write(payload);
req.end();
