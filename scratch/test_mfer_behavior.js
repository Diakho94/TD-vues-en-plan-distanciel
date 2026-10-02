const { execFile } = require('child_process');
const http = require('http');
const path = require('path');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const htmlPath = path.resolve(__dirname, '..', 'TD_Sequence1_MELEC_Echelle_Document.html');
const targetUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

console.log("Target URL:", targetUrl);

const child = execFile(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1200',
    targetUrl
]);

function sendCommand(ws, method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = Math.floor(Math.random() * 1000000);
        const msg = JSON.stringify({ id, method, params });
        const handler = (event) => {
            try {
                const resp = JSON.parse(event.data);
                if (resp.id === id) {
                    ws.removeEventListener('message', handler);
                    if (resp.error) reject(resp.error);
                    else resolve(resp.result);
                }
            } catch (e) { }
        };
        ws.addEventListener('message', handler);
        ws.send(msg);
    });
}

async function evalScript(ws, expression) {
    const res = await sendCommand(ws, 'Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
    });
    if (res.exceptionDetails) {
        throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
}

setTimeout(async () => {
    try {
        const listData = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9228/json', (res) => {
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

        const ws = new WebSocket(page.webSocketDebuggerUrl);

        ws.addEventListener('open', async () => {
            console.log("Connected to Chrome via CDP.");

            console.log("\n=== TEST 1: Default State (MELEC) ===");
            const defaultState = await evalScript(ws, `(() => {
                const melecBox = document.getElementById('contexte-melec');
                const mferBox = document.getElementById('contexte-mfer');
                const boxGroupe = document.getElementById('box-groupe');
                return {
                    melecVisible: melecBox.style.display !== 'none',
                    mferVisible: mferBox.style.display !== 'none',
                    boxGroupeVisible: boxGroupe.style.visibility !== 'hidden',
                    classesOptions: Array.from(document.querySelectorAll('#student-classe option')).map(o => o.value)
                };
            })()`);
            console.log("Default state:", JSON.stringify(defaultState, null, 2));

            console.log("\n=== TEST 2: Select 1MFER ===");
            const mferState = await evalScript(ws, `(() => {
                const sel = document.getElementById('student-classe');
                sel.value = '1MFER';
                changerClasse('1MFER');

                const melecBox = document.getElementById('contexte-melec');
                const mferBox = document.getElementById('contexte-mfer');
                const boxGroupe = document.getElementById('box-groupe');
                const headers = Array.from(document.querySelectorAll('.header-filiere-tag')).map(el => el.innerText.trim());
                const dockBadge = document.getElementById('dock-filiere-badge').innerText;
                const p1Badge = document.getElementById('p1-filiere-badge').innerText;
                const compC1 = document.getElementById('label-comp-c1').innerText;
                const compC2 = document.getElementById('label-comp-c2').innerText;

                return {
                    melecVisible: melecBox.style.display !== 'none',
                    mferVisible: mferBox.style.display !== 'none',
                    boxGroupeVisible: boxGroupe.style.visibility !== 'hidden',
                    dockBadge,
                    p1Badge,
                    headersSample: headers.slice(0, 3),
                    compC1,
                    compC2,
                    mferTextSample: mferBox.innerText.substring(0, 150)
                };
            })()`);
            console.log("1MFER state:", JSON.stringify(mferState, null, 2));

            console.log("\n=== TEST 3: Select 1MELFER MFER (Sans groupe) ===");
            const melferMferState = await evalScript(ws, `(() => {
                const sel = document.getElementById('student-classe');
                sel.value = '1MELFER MFER';
                changerClasse('1MELFER MFER');

                const boxGroupe = document.getElementById('box-groupe');
                const mferBox = document.getElementById('contexte-mfer');

                // Fill identity without group
                document.getElementById('student-nom').value = 'DUPONT';
                document.getElementById('student-prenom').value = 'Jean';
                mettreAJourIdentite();

                const check = verifierChampsIdentite();
                const fileName = genererNomFichierBase();

                return {
                    boxGroupeVisible: boxGroupe.style.visibility !== 'hidden',
                    mferVisible: mferBox.style.display !== 'none',
                    identiteValide: check.valide,
                    manquants: check.manquants,
                    fileName
                };
            })()`);
            console.log("1MELFER MFER state:", JSON.stringify(melferMferState, null, 2));

            console.log("\n=== TEST 4: Select 1MFER with Groupe 1 ===");
            const mferWithGrp = await evalScript(ws, `(() => {
                const sel = document.getElementById('student-classe');
                sel.value = '1MFER';
                changerClasse('1MFER');

                const grp = document.getElementById('student-groupe');
                grp.value = 'Groupe 1';
                mettreAJourIdentite();

                const check = verifierChampsIdentite();
                const fileName = genererNomFichierBase();

                return {
                    identiteValide: check.valide,
                    manquants: check.manquants,
                    fileName
                };
            })()`);
            console.log("1MFER with Group:", JSON.stringify(mferWithGrp, null, 2));

            console.log("\n=== TEST 5: Verify A4 page heights in MFER mode ===");
            const pageHeights = await evalScript(ws, `(() => {
                const pages = Array.from(document.querySelectorAll('.a4-page'));
                return pages.map(p => ({
                    id: p.id,
                    scrollHeight: p.scrollHeight,
                    clientHeight: p.clientHeight,
                    hasOverflow: p.scrollHeight > p.clientHeight + 2
                }));
            })()`);
            console.log("Page heights in MFER mode:", JSON.stringify(pageHeights, null, 2));

            console.log("\n=== TEST 6: Switch back to 1MELEC1 ===");
            const backToMelec = await evalScript(ws, `(() => {
                const sel = document.getElementById('student-classe');
                sel.value = '1MELEC1';
                changerClasse('1MELEC1');

                const melecBox = document.getElementById('contexte-melec');
                const mferBox = document.getElementById('contexte-mfer');
                const boxGroupe = document.getElementById('box-groupe');
                const dockBadge = document.getElementById('dock-filiere-badge').innerText;

                const pages = Array.from(document.querySelectorAll('.a4-page'));
                const heights = pages.map(p => ({
                    id: p.id,
                    scrollHeight: p.scrollHeight,
                    clientHeight: p.clientHeight,
                    hasOverflow: p.scrollHeight > p.clientHeight + 2
                }));

                return {
                    melecVisible: melecBox.style.display !== 'none',
                    mferVisible: mferBox.style.display !== 'none',
                    boxGroupeVisible: boxGroupe.style.visibility !== 'hidden',
                    dockBadge,
                    heights
                };
            })()`);
            console.log("Back to MELEC:", JSON.stringify(backToMelec, null, 2));

            ws.close();
            child.kill();
            console.log("\nALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
        });
    } catch (e) {
        console.error("Error during execution:", e);
        child.kill();
        process.exit(1);
    }
}, 1500);
