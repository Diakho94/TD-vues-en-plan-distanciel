const { execFile } = require('child_process');
const http = require('http');
const path = require('path');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const htmlPath = path.resolve(__dirname, '..', 'TD_Sequence1_MELEC_Echelle_Document.html');
const targetUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const child = execFile(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    targetUrl
]);

setTimeout(async () => {
    try {
        const listData = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9226/json', (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve(JSON.parse(d)));
            }).on('error', reject);
        });

        const page = listData.find(p => p.type === 'page' && p.url.includes('TD_Sequence1_MELEC_Echelle_Document'));
        const ws = new WebSocket(page.webSocketDebuggerUrl);

        ws.addEventListener('open', async () => {
            let msgId = 1;
            function sendCDP(method, params = {}) {
                return new Promise((res) => {
                    const id = msgId++;
                    const handler = (evt) => {
                        const resp = JSON.parse(evt.data);
                        if (resp.id === id) {
                            ws.removeEventListener('message', handler);
                            res(resp.result);
                        }
                    };
                    ws.addEventListener('message', handler);
                    ws.send(JSON.stringify({ id, method, params }));
                });
            }

            console.log("Testing genererDossierCompletPDFBase64...");
            const resPdf = await sendCDP('Runtime.evaluate', {
                expression: `(async () => {
                    const b64 = await genererDossierCompletPDFBase64();
                    return {
                        success: !!b64,
                        length: b64 ? b64.length : 0
                    };
                })()`,
                awaitPromise: true,
                returnByValue: true
            });
            console.log("PDF generation result:", resPdf.result.value);

            ws.close();
            child.kill();
            process.exit(0);
        });
    } catch (e) {
        console.error(e);
        child.kill();
        process.exit(1);
    }
}, 2500);
