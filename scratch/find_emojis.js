const fs = require('fs');
const content = fs.readFileSync('./TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
const lines = content.split('\n');
lines.forEach((line, idx) => {
    const matches = line.match(emojiRegex);
    if (matches) {
        console.log(`Line ${idx + 1}: [${matches.join(' ')}] ${line.trim()}`);
    }
});
