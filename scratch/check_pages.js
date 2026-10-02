const fs = require('fs');
const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');
const regex = /<div[^>]*class=["'][^"']*a4-page[^"']*["'][^>]*>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log(match[0]);
}
