const fs = require('fs');
const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');
const p1Start = html.indexOf('id="page-1-garde"');
const p1End = html.indexOf('id="page-2-contexte"');
const p1 = html.slice(p1Start, p1End);
console.log('Images in page 1:', (p1.match(/<img[^>]+>/g) || []));
console.log('url() in page 1:', (p1.match(/url\([^)]+\)/g) || []));
