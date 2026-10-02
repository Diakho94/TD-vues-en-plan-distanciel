const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec";

const nom1 = "BENALI";
const prenom1 = "Karim";
const classe = "1MELEC1";
const groupe = "G1";
const nomFichierPDF = `${nom1}_${prenom1}_${classe}_${groupe}_S1_Echelle.pdf`;

const payload = JSON.stringify({
    horodatage: new Date().toLocaleString('fr-FR'),
    titreTD: "Séquence 1 : Séance Échelle d'un document",
    filiere: "MELEC",
    classe: classe,
    groupe: groupe,
    isBinome: "Non",
    eleve1: `${nom1} ${prenom1}`,
    eleve2: "-",
    scoreBrut: "Score brut : 18.0 / 20",
    indicesUtilises: 2,
    penaliteNoteSur20: "-0.25 pt",
    noteSur20: 17.75,
    competenceC1: "Très bonne maîtrise",
    competenceC2: "Très bonne maîtrise",
    nomFichierPDF: nomFichierPDF,

    // Clés alternatives pour compatibilité totale
    eleve1_nom: nom1,
    eleve1_prenom: prenom1,
    eleve2_nom: "",
    eleve2_prenom: "",
    nomFichier: nomFichierPDF
});

console.log("Sending payload:", payload);

const req = https.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
    }
}, (res) => {
    console.log("POST Status:", res.statusCode);
    if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, (redirRes) => {
            let data = '';
            redirRes.on('data', c => data += c);
            redirRes.on('end', () => {
                console.log("Server Response:", data);
            });
        });
    }
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
