const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// Simple DOM simulation
class ElementMock {
    constructor(id, tagName = 'div', attributes = {}) {
        this.id = id;
        this.tagName = tagName.toUpperCase();
        this.attributes = attributes;
        this.value = attributes.value || '';
        this.innerText = '';
        this.innerHTML = '';
        this.className = '';
        this.style = {};
        this.classList = {
            add: (c) => { this.className += ' ' + c; },
            remove: (c) => { this.className = this.className.replace(c, '').trim(); },
            contains: (c) => this.className.includes(c)
        };
        this.checked = true;
    }
    getAttribute(attr) {
        return this.attributes[attr];
    }
}

// Extract answers from decrypted payload
function rc4Drop512(buf, key) {
    let s = new Array(256);
    for (let i = 0; i < 256; i++) s[i] = i;
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
    }
    let i = 0; j = 0;
    for (let k = 0; k < 512; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
    }
    let out = Buffer.alloc(buf.length);
    for (let k = 0; k < buf.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        let temp = s[i]; s[i] = s[j]; s[j] = temp;
        let K = s[(s[i] + s[j]) % 256];
        out[k] = buf[k] ^ K;
    }
    return out;
}

const encMatch = html.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
const payload = JSON.parse(rc4Drop512(Buffer.from(encMatch[1], 'base64'), '7049').toString('utf8'));

// Test normaliserTexte
function normaliserTexte(txt) {
    return String(txt || '')
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/,/g, '.')
        .replace(/×/g, 'x')
        .replace(/\*/g, 'x')
        .replace(/\//g, ':')
        .replace(/\s+/g, '')
        .replace(/m²$/, '')
        .replace(/m2$/, '')
        .replace(/m$/, '')
        .replace(/cm$/, '');
}

console.log("Testing normaliserTexte:");
console.log("  'Cuisinière' ->", normaliserTexte("Cuisinière"));
console.log("  'Sud-Est' ->", normaliserTexte("Sud-Est"));
console.log("  '5,30 x 3' ->", normaliserTexte("5,30 x 3"));
console.log("  '15,9 m²' ->", normaliserTexte("15,9 m²"));
console.log("  '1 : 100' ->", normaliserTexte("1 : 100"));
console.log("  '1/100' ->", normaliserTexte("1/100"));

// Simulate perfect answers
let totalPointsEarned = 0;
let totalPossible = 0;

for (const [qid, data] of Object.entries(payload.answers)) {
    totalPossible += data.pts;
    const userVal = normaliserTexte(data.val);
    const expected = normaliserTexte(data.val);
    if (userVal === expected) {
        totalPointsEarned += data.pts;
    }
}

const score20 = (totalPointsEarned / totalPossible) * 20;
console.log(`\nSimulation with all correct answers:`);
console.log(`Earned: ${totalPointsEarned} / ${totalPossible} points`);
console.log(`Score / 20: ${score20.toFixed(1)} / 20`);

if (score20 === 20 && totalPointsEarned === 39) {
    console.log("✅ Perfect score test passed!");
} else {
    console.error("❌ Score test failed!", score20);
}
