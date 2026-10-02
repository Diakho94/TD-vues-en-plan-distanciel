const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');
const regex = /<img[^>]+src=["']([^"']+)["']/gi;
let match;
const found = [];
while ((match = regex.exec(html)) !== null) {
    found.push(match[1]);
}
console.log('Images in HTML count:', found.length);
console.log(found);

if (fs.existsSync('js/td_images_data.js')) {
    const dataJs = fs.readFileSync('js/td_images_data.js', 'utf8');
    const dataRegex = /"([^"]+)":\s*"data:image/g;
    let dMatch;
    const dataKeys = [];
    while ((dMatch = dataRegex.exec(dataJs)) !== null) {
        dataKeys.push(dMatch[1]);
    }
    console.log('Keys in td_images_data.js count:', dataKeys.length);
    console.log(dataKeys);
} else {
    console.log('js/td_images_data.js does not exist');
}
