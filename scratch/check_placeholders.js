const fs = require('fs');
const content = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

const regex = /<input[^>]*data-qid[^>]*>/gi;
let match;
console.log('=== LISTE DES 26 ZONES DE SAISIE ET LEURS PLACEHOLDERS ===');
while ((match = regex.exec(content)) !== null) {
  const qidMatch = match[0].match(/data-qid="([^"]+)"/);
  const phMatch = match[0].match(/placeholder="([^"]+)"/);
  console.log((qidMatch ? qidMatch[1].padEnd(20) : '?') + ' -> ' + (phMatch ? phMatch[1] : 'AUCUN'));
}
