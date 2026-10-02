const { execFile } = require('child_process');
const http = require('http');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetUrl = "file:///d:/Users/adiak/Documents/000_Cours%20new%20gen/Lecture%20de%20plans/Echelle%20d%27un%20document/TD1%20%C3%A9chelle%20d%27un%20document/TD_Sequence1_MELEC_Echelle_Document.html";

console.log("Launching headless Chrome to inspect TD...");
const child = execFile(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    targetUrl
]);

setTimeout(() => {
    http.get('http://127.0.0.1:9222/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log("Chrome targets:", data);
            child.kill();
            process.exit(0);
        });
    }).on('error', (err) => {
        console.error("HTTP error:", err.message);
        child.kill();
        process.exit(1);
    });
}, 2000);
