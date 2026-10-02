const fs = require('fs');
const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

const encMatch = html.match(/const CORRIGE_ENCRYPTE = "([^"]+)";/);
const encStr = encMatch[1];

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

const dec = rc4Drop512(Buffer.from(encStr, 'base64'), '7049').toString('utf8');
const p = JSON.parse(dec);
console.log('5_mesure:', p.answers['5_mesure']);
console.log('5_calc:', p.answers['5_calc']);
console.log('5_val:', p.answers['5_val']);
console.log('h_q5:', p.hints['h_q5']);
