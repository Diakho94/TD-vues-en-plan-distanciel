const { execFile } = require('child_process');
const http = require('http');
const path = require('path');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const htmlPath = path.resolve(__dirname, '..', 'TD_Sequence1_MELEC_Echelle_Document.html');
const targetUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

console.log("Target URL:", targetUrl);

const child = execFile(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1600,1200',
    targetUrl
]);

setTimeout(async () => {
    try {
        const listData = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9227/json', (res) => {
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

            // Test 1: Check document title and question cards
            const resInit = await sendCDP('Runtime.evaluate', {
                expression: `(() => {
                    const titles = Array.from(document.querySelectorAll('.question-title')).map(t => t.innerText.trim());
                    return {
                        title: document.title,
                        questionTitles: titles,
                        pages: Array.from(document.querySelectorAll('.a4-page')).map(p => ({
                            id: p.id,
                            scrollHeight: p.scrollHeight,
                            clientHeight: p.clientHeight,
                            hasOverflow: p.scrollHeight > (p.clientHeight + 5)
                        }))
                    };
                })()`,
                returnByValue: true
            });
            console.log("Question Titles & Overflow:", JSON.stringify(resInit.result.value, null, 2));

            // Test 2: Fill identity
            await sendCDP('Runtime.evaluate', {
                expression: `(() => {
                    document.getElementById('student-nom').value = 'TEST';
                    document.getElementById('student-prenom').value = 'Eleve';
                    document.getElementById('student-classe').value = '1MELFER MELEC';
                    document.getElementById('student-classe').dispatchEvent(new Event('change'));
                })()`
            });

            // Test 3: Test Hint clicking on Q5 and Q8
            const resHint = await sendCDP('Runtime.evaluate', {
                expression: `(() => {
                    activerIndice('h_q5');
                    activerIndice('h_q8');
                    return {
                        hintQ5: document.getElementById('h_q5').innerText,
                        hintQ8: document.getElementById('h_q8').innerText,
                        usedHints: usedHintsCount
                    };
                })()`,
                returnByValue: true
            });
            console.log("Hints test:", JSON.stringify(resHint.result.value, null, 2));

            // Test 4: Fill answers with correct values
            const resFill = await sendCDP('Runtime.evaluate', {
                expression: `(() => {
                    // Q1 Symboles
                    document.querySelector('[data-qid="1_symb_A"]').value = 'Cuisinière';
                    document.querySelector('[data-qid="1_symb_B"]').value = 'Évier à égouttoir';
                    document.querySelector('[data-qid="1_symb_C"]').value = 'WC';
                    document.querySelector('[data-qid="1_symb_D"]').value = 'Lavabo';
                    document.querySelector('[data-qid="1_symb_E"]').value = 'Bidet';
                    document.querySelector('[data-qid="1_symb_F"]').value = 'Radiateur';
                    document.querySelector('[data-qid="1_symb_G"]').value = 'Fauteuil';
                    document.querySelector('[data-qid="1_symb_H"]').value = 'Lit 2 personnes';
                    document.querySelector('[data-qid="1_symb_I"]').value = 'Armoire';
                    document.querySelector('[data-qid="1_symb_J"]').value = 'Baignoire';
                    document.querySelector('[data-qid="1_symb_K"]').value = 'Lit 1 personne';
                    document.querySelector('[data-qid="1_symb_L"]').value = 'Commode';
                    document.querySelector('[data-qid="1_symb_M"]').value = 'Évacuation des eaux pluviales';
                    document.querySelector('[data-qid="1_symb_N"]').value = 'Placard fermé';

                    // Q2 Orientation
                    document.querySelector('[data-qid="2_orient_cuisine"]').value = 'Nord-Est';
                    document.querySelector('[data-qid="2_orient_porte"]').value = 'Sud-Ouest';
                    document.querySelector('[data-qid="2_orient_ch1"]').value = 'Sud-Est';
                    document.querySelector('[data-qid="2_orient_sdb"]').value = 'Sud-Est';
                    document.querySelector('[data-qid="2_orient_ch2"]').value = 'Sud-Est';
                    document.querySelector('[data-qid="2_orient_sejour"]').value = 'Nord-Est';

                    // Q3, Q4
                    document.querySelector('[data-qid="3_pieces_cheminee"]').value = '3';
                    document.querySelector('[data-qid="4_evac_pluviales"]').value = '3';

                    // Q5, Q6
                    document.querySelector('[data-qid="5_surf_ch2_calc"]').value = '5,30 x 3';
                    document.querySelector('[data-qid="5_surf_ch2_val"]').value = '15,9';
                    document.querySelector('[data-qid="6_surf_ch1_calc"]').value = '4,50 x 3,60';
                    document.querySelector('[data-qid="6_surf_ch1_val"]').value = '16,2';

                    // Q7, Q8, Q9
                    document.querySelector('[data-qid="7_echelle_plan"]').value = '1 : 100';
                    document.querySelector('[data-qid="8_dim_reelle_calc"]').value = '5 x 100 = 500 cm';
                    document.querySelector('[data-qid="8_dim_reelle_val"]').value = '5';
                    document.querySelector('[data-qid="9_placard_calc"]').value = '0,8 x 100';
                    document.querySelector('[data-qid="9_placard_val"]').value = '80';

                    calculerProgression();
                    return {
                        progressBar: document.getElementById('dock-progress-bar').style.width,
                        progressText: document.getElementById('dock-progress-text').innerText
                    };
                })()`,
                returnByValue: true
            });
            console.log("Progression after fill:", JSON.stringify(resFill.result.value, null, 2));

            // Test 5: Teacher validation with 7049
            const resVal = await sendCDP('Runtime.evaluate', {
                expression: `(() => {
                    document.getElementById('prof-code').value = '7049';
                    validerTD();
                    return {
                        globalScore: document.getElementById('global-score-display').innerText,
                        globalScoreDetails: document.getElementById('global-score-details').innerText,
                        badgeC1: document.getElementById('badge-c1').innerText,
                        badgeC2: document.getElementById('badge-c2').innerText,
                        isValidated: isDossierValide
                    };
                })()`,
                returnByValue: true
            });
            console.log("Validation result:", JSON.stringify(resVal.result.value, null, 2));

            ws.close();
            child.kill();
            process.exit(0);
        });

    } catch (e) {
        console.error("Test error:", e);
        child.kill();
        process.exit(1);
    }
}, 2500);
