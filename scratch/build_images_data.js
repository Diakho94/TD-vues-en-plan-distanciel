const fs = require('fs');
const path = require('path');

const files = [
    'illustration_garde.jpg',
    'plan_rdc_clean.png',
    'plan_rdc_corrige.png',
    'plan_echelle_graduee_clean.png',
    'plan_echelle_graduee_corrige.png',
    'facade_principale_clean.png',
    'facade_principale_corrige.png',
    'facade_arriere_clean.png',
    'facade_arriere_corrige.png',
    'facade_gauche_clean.png',
    'facade_gauche_corrige.png'
];

const dict = {};
files.forEach(f => {
    const p = path.join('img', f);
    if (fs.existsSync(p)) {
        const ext = path.extname(f).toLowerCase().replace('.', '');
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
        const b64 = fs.readFileSync(p).toString('base64');
        dict[f] = `data:${mime};base64,${b64}`;
        console.log(`Embedded ${f}: ${(b64.length / 1024).toFixed(1)} KB base64`);
    } else {
        console.warn(`File missing: ${p}`);
    }
});

const content = `// Dictionnaire d'images embarquées en Data URI pour neutraliser tout blocage de canvas sur file:///\nwindow.TD_IMAGES_DATA = ` + JSON.stringify(dict) + `;\n`;

fs.writeFileSync('js/td_images_data.js', content, 'utf8');
console.log('Successfully written js/td_images_data.js, total size:', (content.length / 1024 / 1024).toFixed(2), 'MB');
