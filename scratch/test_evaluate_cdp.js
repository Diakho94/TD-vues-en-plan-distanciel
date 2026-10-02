const { execFile } = require('child_process');
const http = require('http');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetUrl = "file:///d:/Users/adiak/Documents/000_Cours%20new%20gen/Lecture%20de%20plans/Echelle%20d%27un%20document/TD1%20%C3%A9chelle%20d%27un%20document/TD_Sequence1_MELEC_Echelle_Document.html";

const child = execFile(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    targetUrl
]);

setTimeout(async () => {
    try {
        const listData = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9223/json', (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve(JSON.parse(d)));
            }).on('error', reject);
        });

        const page = listData.find(p => p.type === 'page' && p.url.includes('TD_Sequence1_MELEC_Echelle_Document'));
        if (!page) {
            console.error("Target page not found!");
            child.kill();
            return;
        }

        console.log("Connecting to WebSocket:", page.webSocketDebuggerUrl);
        const ws = new WebSocket(page.webSocketDebuggerUrl);

        ws.addEventListener('open', () => {
            console.log("WebSocket connected. Evaluating scripts...");

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

            async function runTests() {
                // 1. Check window objects
                const eval1 = await sendCDP('Runtime.evaluate', {
                    expression: 'JSON.stringify({ hasHtml2Canvas: typeof html2canvas !== "undefined", hasJsPdf: typeof jspdf !== "undefined" || typeof jsPDF !== "undefined" })',
                    returnByValue: true
                });
                console.log("Libraries check:", eval1.result.value);

                // 2. Fill identity
                await sendCDP('Runtime.evaluate', {
                    expression: `
                        document.getElementById('student-nom').value = 'DIOUF';
                        document.getElementById('student-prenom').value = 'Ali';
                        document.getElementById('student-classe').value = '1MELEC2';
                        document.getElementById('student-groupe').value = 'Groupe 2';
                        mettreAJourIdentite();
                    `
                });

                // 3. Test genererDossierCompletPDFBase64
                const testFullCapture = await sendCDP('Runtime.evaluate', {
                    expression: `
                        (async () => {
                            const logs = [];
                            try {
                                // 1. Inject script if not loaded
                                if (!window.TD_IMAGES_DATA) {
                                    const s = document.createElement('script');
                                    s.src = 'js/td_images_data.js';
                                    document.head.appendChild(s);
                                    await new Promise(r => s.onload = r);
                                }
                                logs.push("TD_IMAGES_DATA loaded: " + Object.keys(window.TD_IMAGES_DATA).length + " images");

                                // 2. Remplacer les src par les Data URIs et attendre le décodage
                                const imgs = Array.from(document.querySelectorAll('img'));
                                for (const img of imgs) {
                                    const src = img.getAttribute('src');
                                    if (src && (src.startsWith('img/') || !src.startsWith('data:'))) {
                                        const fn = src.replace('img/', '');
                                        if (window.TD_IMAGES_DATA[fn]) {
                                            img.src = window.TD_IMAGES_DATA[fn];
                                            if (img.decode) {
                                                try { await img.decode(); } catch(e){}
                                            }
                                        }
                                    }
                                }
                                logs.push("Images sources replaced with Data URIs and decoded");

                                // 3. Tester genererDossierCompletPDFBase64
                                const b64 = await genererDossierCompletPDFBase64();
                                logs.push("PDF Base64 generated, length: " + (b64 ? b64.length : 0));
                                return { success: !!b64, length: b64 ? b64.length : 0, logs };
                            } catch (e) {
                                return { success: false, logs, error: e.stack || e.toString() };
                            }
                        })()
                    `,
                    awaitPromise: true,
                    returnByValue: true
                });
                console.log("Full capture test result:", JSON.stringify(testFullCapture.result.value, null, 2));

                child.kill();
                process.exit(0);
            }

            runTests().catch(err => {
                console.error("Test error:", err);
                child.kill();
                process.exit(1);
            });
        });

    } catch (e) {
        console.error("Fatal error:", e);
        child.kill();
        process.exit(1);
    }
}, 2500);
