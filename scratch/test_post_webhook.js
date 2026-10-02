const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec";

const testPayload = JSON.stringify({
    titreTD: "Test Connexion Echelle",
    filiere: "MELEC",
    classe: "1MELEC1",
    groupe: "G1",
    isBinome: false,
    eleve1_nom: "TEST_VERIF",
    eleve1_prenom: "Robot",
    noteSur20: 20,
    scoreBrut: "20/20",
    competenceC1: "Très bonne maîtrise",
    competenceC2: "Très bonne maîtrise",
    indicesUtilises: 0,
    penaliteIndicesValeur: 0,
    nomFichier: "TEST_VERIF_ROBOT"
});

console.log("Sending POST to:", url);

const req = https.request(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(testPayload)
    }
}, (res) => {
    console.log("POST Status Code:", res.statusCode);
    if (res.statusCode === 302 && res.headers.location) {
        console.log("Following redirect to:", res.headers.location.substring(0, 80) + "...");
        https.get(res.headers.location, (redirRes) => {
            console.log("Redirected Status:", redirRes.statusCode);
            let data = '';
            redirRes.on('data', c => data += c);
            redirRes.on('end', () => {
                console.log("Returned data from Google Apps Script:", data);
            });
        });
    }
});

req.on('error', e => console.error("Error:", e));
req.write(testPayload);
req.end();
