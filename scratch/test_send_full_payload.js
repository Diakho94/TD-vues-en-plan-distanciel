const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec";

// Petit PDF Base64 valide pour tester la création de fichier dans Drive
// Header d'un PDF minimal de 1 page
const minimalPdfBase64 = Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF").toString('base64');

const nom1 = "DIOUF";
const prenom1 = "Ali";
const classe = "1MELEC2";
const groupe = "Groupe 2";
const baseNomFichier = `${nom1}_${prenom1}_${classe}_${groupe.replace(/\s+/g, '_')}_S1_Echelle`;

const payload = JSON.stringify({
    horodatage: new Date().toLocaleString('fr-FR'),
    titreTD: "Séquence 1 : Séance Échelle MELEC",
    classe: classe,
    groupe: groupe,
    isBinome: "Non",
    eleve1: `${nom1} ${prenom1}`,
    eleve2: "-",
    scoreBrut: "Score brut : 18.0 / 20",
    indicesUtilises: 2,
    penaliteNoteSur20: "-0.25 pt",
    noteSur20: 17.75,
    competenceC1: "TRÈS BONNE MAÎTRISE",
    competenceC2: "TRÈS BONNE MAÎTRISE",
    nomFichier: baseNomFichier,
    nomFichierPDF: baseNomFichier + ".pdf",
    pdfBase64: minimalPdfBase64,

    // Compatibilité
    eleve1_nom: nom1,
    eleve1_prenom: prenom1,
    eleve2_nom: "",
    eleve2_prenom: ""
});

console.log("Sending payload to GAS...");

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
                console.log("GAS Server Response:", data);
            });
        });
    }
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
