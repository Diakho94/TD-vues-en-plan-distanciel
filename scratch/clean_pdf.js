const fs = require('fs');
const zlib = require('zlib');

const raw = fs.readFileSync('C:/Users/adiak/.gemini/antigravity-ide/brain/27387d7b-1a12-443a-b402-3a43cc5beb0e/.user_uploaded/media_1789942600264.pdf');

const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
const objects = [];
let match;
const rawStr = raw.toString('latin1');
let cleanCount = 0;

while ((match = objRegex.exec(rawStr)) !== null) {
    const objNum = parseInt(match[1], 10);
    const objGen = parseInt(match[2], 10);
    const bodyStr = match[3];
    
    let newBody = bodyStr;
    const streamIdx = bodyStr.indexOf('stream');
    if (streamIdx !== -1) {
        const header = bodyStr.substring(0, streamIdx);
        const endStreamIdx = bodyStr.lastIndexOf('endstream');
        if (endStreamIdx !== -1) {
            let afterStream = streamIdx + 6;
            if (bodyStr[afterStream] === '\r' && bodyStr[afterStream+1] === '\n') afterStream += 2;
            else if (bodyStr[afterStream] === '\n' || bodyStr[afterStream] === '\r') afterStream += 1;
            
            let streamData = Buffer.from(bodyStr.substring(afterStream, endStreamIdx), 'latin1');
            if (header.includes('FlateDecode')) {
                try {
                    let decomp = zlib.inflateSync(streamData);
                    let decompStr = decomp.toString('latin1');
                    if (decompStr.includes('/OC /MC1 BDC')) {
                        const mc1Idx = decompStr.indexOf('/OC /MC1 BDC');
                        console.log(`Obj ${objNum}: removing corrigé block from pos ${mc1Idx} to ${decompStr.length} (cut ${decompStr.length - mc1Idx} chars)`);
                        decompStr = decompStr.substring(0, mc1Idx).trimEnd() + '\n';
                        cleanCount++;
                        
                        const recomp = zlib.deflateSync(Buffer.from(decompStr, 'latin1'));
                        let newHeader = header.replace(/\/Length\s+\d+/, `/Length ${recomp.length}`);
                        newBody = newHeader + 'stream\r\n' + recomp.toString('latin1') + '\r\nendstream';
                    }
                } catch(e) {
                    // Ignore non-zlib streams
                }
            }
        }
    }
    objects.push({ num: objNum, gen: objGen, body: newBody });
}

console.log('Cleaned objects count:', cleanCount);

// Sort objects by objNum
objects.sort((a, b) => a.num - b.num);

// Write new PDF
let output = '%PDF-1.5\r\n%\xE2\xE3\xCF\xD3\r\n';
const offsets = {};

for (const obj of objects) {
    offsets[obj.num] = output.length;
    output += `${obj.num} ${obj.gen} obj${obj.body}endobj\r\n`;
}

const xrefStart = output.length;
const maxNum = objects[objects.length - 1].num;
output += `xref\r\n0 ${maxNum + 1}\r\n`;
output += '0000000000 65535 f\r\n';

for (let i = 1; i <= maxNum; i++) {
    if (offsets[i] !== undefined) {
        const off = String(offsets[i]).padStart(10, '0');
        const gen = String(objects.find(o => o.num === i).gen).padStart(5, '0');
        output += `${off} ${gen} n\r\n`;
    } else {
        output += '0000000000 65535 f\r\n';
    }
}

// Find trailer dict in raw
const trailerMatch = rawStr.match(/trailer\s*<<([\s\S]*?)>>\s*startxref/);
let trailerDict = trailerMatch ? trailerMatch[1] : '';
trailerDict = trailerDict.replace(/\/Prev\s+\d+/, '');
trailerDict = trailerDict.replace(/\/Size\s+\d+/, `/Size ${maxNum + 1}`);

output += `trailer\r\n<<${trailerDict}>>\r\nstartxref\r\n${xrefStart}\r\n%%EOF\r\n`;

fs.writeFileSync('./scratch/clean_student.pdf', Buffer.from(output, 'latin1'));
console.log('Successfully saved ./scratch/clean_student.pdf, total size:', output.length);
