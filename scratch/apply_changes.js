const fs = require('fs');

let html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// 1. Read new cipher
const newCipher = fs.readFileSync('scratch/new_cipher_final.txt', 'utf8').trim();

// 2. CSS to add
const cssToAdd = `
        /* Styles spécifiques aux nouveaux exercices (Symboles, Orientation, Calculs) */
        .symbol-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0 4px 0;
            background: #ffffff;
        }
        .symbol-table th {
            background: #facc15;
            color: #0f172a;
            border: 1.5px solid #0f172a;
            padding: 5px 4px;
            text-align: center;
            font-weight: 800;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .symbol-table td {
            border: 1.5px solid #0f172a;
            padding: 4px 6px;
            vertical-align: middle;
        }
        .symbol-table td.rep-col {
            width: 38px;
            text-align: center;
            font-weight: 800;
            font-size: 13px;
            background: #f8fafc;
            color: #1e3a8a;
        }
        .symbol-select,
        .orient-select {
            width: 100%;
            padding: 4px 8px;
            border: 1.5px solid #94a3b8;
            border-radius: 4px;
            font-size: 11.5px;
            font-weight: 600;
            background: #ffffff;
            color: #1e293b;
            outline: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .symbol-select:focus,
        .orient-select:focus {
            border-color: #2563eb;
            background: #ffffff;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }
        .orient-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 16px;
            margin-top: 6px;
        }
        .orient-item {
            display: flex;
            flex-direction: column;
            gap: 3px;
            padding: 6px 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
        }
        .orient-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 700;
            font-size: 12px;
            color: #1e3a8a;
        }
        .circle-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            border: 1.5px solid #1e3a8a;
            font-size: 11px;
            font-weight: 800;
            color: #1e3a8a;
            line-height: 1;
            margin: 0 2px;
        }
        .calc-card-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            padding: 6px 10px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            margin-top: 5px;
        }
        .unit-badge {
            font-weight: 800;
            font-size: 12px;
            color: #1e3a8a;
        }
`;

// Insert CSS before </style>
if (!html.includes('.symbol-table {')) {
    html = html.replace('    </style>', cssToAdd + '\n    </style>');
}

// 3. Update Dock tab titles
html = html.replace(
    `<button class="dock-tab" onclick="naviguerVersPage('page-4-cas1')">4. Act. 1 (Plan RDC)</button>`,
    `<button class="dock-tab" onclick="naviguerVersPage('page-4-cas1')">4. Act. 1 (Symboles & Orientation)</button>`
);
html = html.replace(
    `<button class="dock-tab" onclick="naviguerVersPage('page-5-cas2')">5. Act. 2 (Échelle graduée)</button>`,
    `<button class="dock-tab" onclick="naviguerVersPage('page-5-cas2')">5. Act. 2 (Chauffage & Superficies)</button>`
);
html = html.replace(
    `<button class="dock-tab" onclick="naviguerVersPage('page-6-cas3')">6. Act. 3 (Plan façades)</button>`,
    `<button class="dock-tab" onclick="naviguerVersPage('page-6-cas3')">6. Act. 3 (Échelle & Mesures)</button>`
);

// 4. Build options for symbols dropdown
const symbolsList = [
    "Armoire",
    "Baignoire",
    "Bidet",
    "Commode",
    "Cuisinière",
    "Évacuation des eaux pluviales",
    "Évier à égouttoir",
    "Fauteuil",
    "Lavabo",
    "Lit 1 personne",
    "Lit 2 personnes",
    "Placard fermé",
    "Radiateur",
    "WC"
];

function buildSymbolOptions() {
    let opts = '<option value="">-- Choisir un symbole --</option>\n';
    for (const s of symbolsList) {
        opts += `                                    <option value="${s}">${s}</option>\n`;
    }
    return opts;
}

const orientationsList = [
    "Nord",
    "Sud",
    "Est",
    "Ouest",
    "Nord-Est",
    "Nord-Ouest",
    "Sud-Est",
    "Sud-Ouest"
];

function buildOrientationOptions() {
    let opts = '<option value="">-- Choisir l\'orientation --</option>\n';
    for (const o of orientationsList) {
        opts += `                            <option value="${o}">${o}</option>\n`;
    }
    return opts;
}

// 5. New Page 4 HTML
const page4Html = `    <!-- =========================================================================
         PAGE 4 / 6 : ACTIVITÉ 1 — SYMBOLES & ORIENTATION GÉOGRAPHIQUE
         ========================================================================= -->
    <div class="a4-page" id="page-4-cas1">
        <div>
            <!-- En-tête Page 4 -->
            <table class="header-table">
                <tr>
                    <td style="width: 25%; font-weight: bold; font-size: 12px; background: #f8fafc;">
                        Bac Pro MELEC
                    </td>
                    <td style="width: 50%;" class="header-title">
                        ACTIVITÉ 1 : SYMBOLES & ORIENTATION DU PLAN
                    </td>
                    <td style="width: 25%; font-size: 12px; background: #f8fafc;">
                        Feuille 4 / 6
                    </td>
                </tr>
            </table>

            <!-- Question 1 : Symboles normalisés -->
            <div class="question-card" style="margin-bottom: 8px;">
                <div class="question-header">
                    <div class="question-title">
                        1 - Donner la signification des SYMBOLES repérés par les lettres suivantes sur le plan du bâtiment :
                    </div>
                    <span class="question-points">/ 14 pts</span>
                </div>

                <!-- Tableau 3 colonnes Rep / Signification -->
                <table class="symbol-table">
                    <thead>
                        <tr>
                            <th style="width: 6%;">Rep</th>
                            <th style="width: 27%;">SIGNIFICATION</th>
                            <th style="width: 6%;">Rep</th>
                            <th style="width: 27%;">SIGNIFICATION</th>
                            <th style="width: 6%;">Rep</th>
                            <th style="width: 28%;">SIGNIFICATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Ligne 1 : A, F, K -->
                        <tr>
                            <td class="rep-col">A</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_A" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_A"></div>
                            </td>
                            <td class="rep-col">F</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_F" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_F"></div>
                            </td>
                            <td class="rep-col">K</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_K" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_K"></div>
                            </td>
                        </tr>

                        <!-- Ligne 2 : B, G, L -->
                        <tr>
                            <td class="rep-col">B</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_B" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_B"></div>
                            </td>
                            <td class="rep-col">G</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_G" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_G"></div>
                            </td>
                            <td class="rep-col">L</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_L" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_L"></div>
                            </td>
                        </tr>

                        <!-- Ligne 3 : C, H, M -->
                        <tr>
                            <td class="rep-col">C</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_C" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_C"></div>
                            </td>
                            <td class="rep-col">H</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_H" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_H"></div>
                            </td>
                            <td class="rep-col">M</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_M" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_M"></div>
                            </td>
                        </tr>

                        <!-- Ligne 4 : D, I, N -->
                        <tr>
                            <td class="rep-col">D</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_D" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_D"></div>
                            </td>
                            <td class="rep-col">I</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_I" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_I"></div>
                            </td>
                            <td class="rep-col">N</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_N" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_N"></div>
                            </td>
                        </tr>

                        <!-- Ligne 5 : E, J, Vide -->
                        <tr>
                            <td class="rep-col">E</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_E" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_E"></div>
                            </td>
                            <td class="rep-col">J</td>
                            <td>
                                <select class="symbol-select" data-qid="1_symb_J" onchange="calculerProgression()">
${buildSymbolOptions()}                                </select>
                                <div class="feedback-box" id="fb-1_symb_J"></div>
                            </td>
                            <td colspan="2" style="background: #f8fafc; text-align: center; color: #94a3b8; font-size: 11px;">
                                —
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Question 2 : Orientation géographique -->
            <div class="question-card">
                <div class="question-header">
                    <div class="question-title">
                        2 - Indiquer l'orientation géographique de : <span style="font-weight: normal; font-size: 11.5px; color: #64748b;">(exemple de réponse attendue : Sud-Ouest...)</span>
                    </div>
                    <span class="question-points">/ 12 pts</span>
                </div>

                <div class="orient-grid">
                    <!-- Colonne 1 -->
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div class="orient-item">
                            <div class="orient-label">➤ la cuisine :</div>
                            <select class="orient-select" data-qid="2_orient_cuisine" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_cuisine"></div>
                        </div>

                        <div class="orient-item">
                            <div class="orient-label">➤ la chambre <span class="circle-num">1</span> :</div>
                            <select class="orient-select" data-qid="2_orient_ch1" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_ch1"></div>
                        </div>

                        <div class="orient-item">
                            <div class="orient-label">➤ la chambre <span class="circle-num">2</span> :</div>
                            <select class="orient-select" data-qid="2_orient_ch2" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_ch2"></div>
                        </div>
                    </div>

                    <!-- Colonne 2 -->
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div class="orient-item">
                            <div class="orient-label">➤ la porte d'entrée :</div>
                            <select class="orient-select" data-qid="2_orient_porte" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_porte"></div>
                        </div>

                        <div class="orient-item">
                            <div class="orient-label">➤ la salle de bains :</div>
                            <select class="orient-select" data-qid="2_orient_sdb" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_sdb"></div>
                        </div>

                        <div class="orient-item">
                            <div class="orient-label">➤ la fenêtre du séjour :</div>
                            <select class="orient-select" data-qid="2_orient_sejour" onchange="calculerProgression()">
${buildOrientationOptions()}                            </select>
                            <div class="feedback-box" id="fb-2_orient_sejour"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span>Lycée Professionnel — Bac Pro MELEC | M. DIAKHO</span>
            <span>Lecture de plans : Vues en plan</span>
            <span>Page 4 / 6</span>
        </div>
    </div>`;

// 6. New Page 5 HTML
const page5Html = `    <!-- =========================================================================
         PAGE 5 / 6 : ACTIVITÉ 2 — CHAUFFAGE & SUPERFICIES
         ========================================================================= -->
    <div class="a4-page" id="page-5-cas2">
        <div>
            <!-- En-tête Page 5 -->
            <table class="header-table">
                <tr>
                    <td style="width: 25%; font-weight: bold; font-size: 12px; background: #f8fafc;">
                        Bac Pro MELEC
                    </td>
                    <td style="width: 50%;" class="header-title">
                        ACTIVITÉ 2 : CHAUFFAGE & SUPERFICIES
                    </td>
                    <td style="width: 25%; font-size: 12px; background: #f8fafc;">
                        Feuille 5 / 6
                    </td>
                </tr>
            </table>

            <!-- Question 6 : Pièces chauffées -->
            <div class="question-card" style="margin-bottom: 8px;">
                <div class="question-header">
                    <div class="question-title">
                        6 - Préciser le nombre de pièces chauffées par la cheminée <strong>(toutes portes fermées)</strong> :
                    </div>
                    <span class="question-points">/ 1 pt</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a;">Nombre de pièces =</label>
                    <input type="text" class="val-input" style="width: 70px; text-align: center;" data-qid="6_pieces_cheminee" placeholder="..." oninput="calculerProgression()">
                    <span class="unit-badge">pièce(s)</span>
                    <div class="feedback-box" id="fb-6_pieces_cheminee"></div>
                </div>
            </div>

            <!-- Question 7 : Évacuations d'eaux pluviales -->
            <div class="question-card" style="margin-bottom: 8px;">
                <div class="question-header">
                    <div class="question-title">
                        7 - Préciser le nombre d'évacuations d'eaux pluviales :
                    </div>
                    <span class="question-points">/ 1 pt</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a;">Nombre d'évacuations =</label>
                    <input type="text" class="val-input" style="width: 70px; text-align: center;" data-qid="7_evac_pluviales" placeholder="..." oninput="calculerProgression()">
                    <span class="unit-badge">évacuation(s)</span>
                    <div class="feedback-box" id="fb-7_evac_pluviales"></div>
                </div>
            </div>

            <!-- Question 8 : Superficie chambre 2 -->
            <div class="question-card" style="margin-bottom: 8px;">
                <div class="question-header">
                    <div class="question-title">
                        8 - Calculer la superficie de la chambre <span class="circle-num">2</span> :
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="btn-hint" onclick="activerIndice('h_q8')">💡 Indice Q8</button>
                        <span class="question-points">/ 3 pts</span>
                    </div>
                </div>
                <div class="hint-text" id="h_q8"><strong>💡 Indice :</strong> Formule : Surface = Longueur × Largeur</div>

                <div class="calc-card-row">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a; min-width: 60px;">Calcul :</label>
                    <div style="flex: 1; min-width: 140px;">
                        <input type="text" class="calc-input" data-qid="8_surf_ch2_calc" placeholder="ex : 5,30 x 3" oninput="calculerProgression()">
                        <div class="feedback-box" id="fb-8_surf_ch2_calc"></div>
                    </div>
                    <span style="font-weight: bold; font-size: 14px;">=</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="text" class="val-input" style="width: 90px; text-align: center;" data-qid="8_surf_ch2_val" placeholder="Valeur" oninput="calculerProgression()">
                        <span class="unit-badge">m²</span>
                        <div class="feedback-box" id="fb-8_surf_ch2_val"></div>
                    </div>
                </div>
            </div>

            <!-- Question 9 : Superficie chambre 1 -->
            <div class="question-card">
                <div class="question-header">
                    <div class="question-title">
                        9 - Calculer la superficie de la chambre <span class="circle-num">1</span> :
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="btn-hint" onclick="activerIndice('h_q9')">💡 Indice Q9</button>
                        <span class="question-points">/ 3 pts</span>
                    </div>
                </div>
                <div class="hint-text" id="h_q9"><strong>💡 Indice :</strong> Formule : Surface = Longueur × Largeur</div>

                <div class="calc-card-row">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a; min-width: 60px;">Calcul :</label>
                    <div style="flex: 1; min-width: 140px;">
                        <input type="text" class="calc-input" data-qid="9_surf_ch1_calc" placeholder="ex : 4,50 x 3,60" oninput="calculerProgression()">
                        <div class="feedback-box" id="fb-9_surf_ch1_calc"></div>
                    </div>
                    <span style="font-weight: bold; font-size: 14px;">=</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="text" class="val-input" style="width: 90px; text-align: center;" data-qid="9_surf_ch1_val" placeholder="Valeur" oninput="calculerProgression()">
                        <span class="unit-badge">m²</span>
                        <div class="feedback-box" id="fb-9_surf_ch1_val"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span>Lycée Professionnel — Bac Pro MELEC | M. DIAKHO</span>
            <span>Lecture de plans : Vues en plan</span>
            <span>Page 5 / 6</span>
        </div>
    </div>`;

// 7. New Page 6 HTML
const page6Html = `    <!-- =========================================================================
         PAGE 6 / 6 : ACTIVITÉ 3 — ÉCHELLE & COTES RÉELLES
         ========================================================================= -->
    <div class="a4-page" id="page-6-cas3">
        <div>
            <!-- En-tête Page 6 -->
            <table class="header-table">
                <tr>
                    <td style="width: 25%; font-weight: bold; font-size: 12px; background: #f8fafc;">
                        Bac Pro MELEC
                    </td>
                    <td style="width: 50%;" class="header-title">
                        ACTIVITÉ 3 : ÉCHELLE & COTES RÉELLES
                    </td>
                    <td style="width: 25%; font-size: 12px; background: #f8fafc;">
                        Feuille 6 / 6
                    </td>
                </tr>
            </table>

            <!-- Question 10 : Échelle du plan -->
            <div class="question-card" style="margin-bottom: 10px;">
                <div class="question-header">
                    <div class="question-title">
                        10 - Indiquer l'échelle du plan :
                    </div>
                    <span class="question-points">/ 1 pt</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a;">Échelle du plan =</label>
                    <input type="text" class="val-input" style="width: 140px; text-align: center; font-weight: bold;" data-qid="10_echelle_plan" placeholder="ex : 1 : 100" oninput="calculerProgression()">
                    <div class="feedback-box" id="fb-10_echelle_plan"></div>
                </div>
            </div>

            <!-- Question 11 : Dimension réelle pour 5 cm -->
            <div class="question-card" style="margin-bottom: 10px;">
                <div class="question-header">
                    <div class="question-title">
                        11 - Donner la dimension réelle (en m.) correspondant à 5 cm mesuré sur le plan :
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="btn-hint" onclick="activerIndice('h_q11')">💡 Indice Q11</button>
                        <span class="question-points">/ 2 pts</span>
                    </div>
                </div>
                <div class="hint-text" id="h_q11"><strong>💡 Indice :</strong> Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle</div>

                <div class="calc-card-row">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a; min-width: 110px;">Calcul détaillé :</label>
                    <div style="flex: 1; min-width: 160px;">
                        <input type="text" class="calc-input" data-qid="11_dim_reelle_calc" placeholder="ex : 5 x 100 = 500 cm" oninput="calculerProgression()">
                        <div class="feedback-box" id="fb-11_dim_reelle_calc"></div>
                    </div>
                    <span style="font-weight: bold; font-size: 14px;">=</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="text" class="val-input" style="width: 80px; text-align: center;" data-qid="11_dim_reelle_val" placeholder="Valeur" oninput="calculerProgression()">
                        <span class="unit-badge">m</span>
                        <div class="feedback-box" id="fb-11_dim_reelle_val"></div>
                    </div>
                </div>
            </div>

            <!-- Question 12 : Profondeur du placard N -->
            <div class="question-card">
                <div class="question-header">
                    <div class="question-title">
                        12 - Déterminer la profondeur du placard <strong>N</strong> :
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="btn-hint" onclick="activerIndice('h_q12')">💡 Indice Q12</button>
                        <span class="question-points">/ 2 pts</span>
                    </div>
                </div>
                <div class="hint-text" id="h_q12"><strong>💡 Indice :</strong> Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle</div>

                <div class="calc-card-row">
                    <label style="font-weight: 700; font-size: 12px; color: #1e3a8a; min-width: 110px;">Calcul détaillé :</label>
                    <div style="flex: 1; min-width: 160px;">
                        <input type="text" class="calc-input" data-qid="12_placard_calc" placeholder="ex : 0,8 cm x 100" oninput="calculerProgression()">
                        <div class="feedback-box" id="fb-12_placard_calc"></div>
                    </div>
                    <span style="font-weight: bold; font-size: 14px;">=</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="text" class="val-input" style="width: 80px; text-align: center;" data-qid="12_placard_val" placeholder="Valeur" oninput="calculerProgression()">
                        <span class="unit-badge">cm</span>
                        <div class="feedback-box" id="fb-12_placard_val"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span>Lycée Professionnel — Bac Pro MELEC | M. DIAKHO</span>
            <span>Lecture de plans : Vues en plan</span>
            <span>Page 6 / 6</span>
        </div>
    </div>`;

// Replace lines 2 (page-4-cas1, page-5-cas2, page-6-cas3)
const startMarker = '<div class="pages-row pages-row-2" id="pages-row-2">';
const endMarker = '    <!-- FIN LIGNE 2 -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find startMarker or endMarker for pages-row-2!");
    process.exit(1);
}

const newPagesRow2 = `${startMarker}\n\n${page4Html}\n\n${page5Html}\n\n${page6Html}\n\n    </div>\n`;

html = html.substring(0, startIndex) + newPagesRow2 + html.substring(endIndex);

// 8. Replace CORRIGE_ENCRYPTE with new cipher
html = html.replace(/const CORRIGE_ENCRYPTE = "[^"]+";/, `const CORRIGE_ENCRYPTE = "${newCipher}";`);

// 9. Update activerIndice fallback hints
const oldActiverIndice = `                const fallbackHints = {
                    'h_q1': "Formule : Dimension réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
                    'h_q2': "Lecture directe : les dimensions réelles sont inscrites en noir à l'intérieur de la pièce « CH 2 » (Longueur × Largeur en mètres).",
                    'h_q3': "Formule : Dimension réelle = (Mesure sur plan × 2) / 2,5 (produit en croix à partir de l'échelle graphique).",
                    'h_q4': "Formule : Échelle = Dimension réelle / Dimension mesurée (pensez à convertir d'abord la dimension réelle en cm pour utiliser la même unité).",
                    'h_q5': "Formule : Hauteur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres).",
                    'h_q6': "Formule : Largeur réelle = Mesure sur plan × Dénominateur de l'échelle (pensez à diviser par 100 pour obtenir des mètres)."
                };`;

const newActiverIndice = `                const fallbackHints = {
                    'h_q8': "Formule : Surface = Longueur × Largeur",
                    'h_q9': "Formule : Surface = Longueur × Largeur",
                    'h_q11': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle",
                    'h_q12': "Formule : Dimension réelle = Mesure sur le plan × Dénominateur de l'échelle"
                };`;

html = html.replace(oldActiverIndice, newActiverIndice);

// 10. Update normaliserTexte
const oldNormaliser = `        function normaliserTexte(txt) {
            return String(txt || '')
                .trim()
                .toLowerCase()
                .replace(/,/g, '.')
                .replace(/\\s+/g, '')
                .replace(/m$/, '')
                .replace(/cm$/, '');
        }`;

const newNormaliser = `        function normaliserTexte(txt) {
            return String(txt || '')
                .trim()
                .toLowerCase()
                .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
                .replace(/,/g, '.')
                .replace(/×/g, 'x')
                .replace(/\\*/g, 'x')
                .replace(/\\//g, ':')
                .replace(/\\s+/g, '')
                .replace(/m²$/, '')
                .replace(/m2$/, '')
                .replace(/m$/, '')
                .replace(/cm$/, '');
        }`;

html = html.replace(oldNormaliser, newNormaliser);

// 11. Update calculerNotesEtCompetences to handle totalPossible and element styling
const oldCalcNotes = `        function calculerNotesEtCompetences() {
            if (!payloadDechiffre || !payloadDechiffre.answers) return;

            const answers = payloadDechiffre.answers;
            let earnedPoints = 0;
            let totalPossible = 20;

            for (const [qid, data] of Object.entries(answers)) {
                const inputElem = document.querySelector(\`[data-qid="\${qid}"]\`);
                const fbElem = document.getElementById(\`fb-\${qid}\`);
                if (!inputElem) continue;

                const userValRaw = inputElem.value.trim();
                const userVal = normaliserTexte(userValRaw);
                const attenduVal = normaliserTexte(data.val);

                let isCorrect = (userVal === attenduVal);

                // Vérifier les alternatives valides
                if (!isCorrect && data.alts && Array.isArray(data.alts)) {
                    for (const alt of data.alts) {
                        if (userVal === normaliserTexte(alt)) {
                            isCorrect = true;
                            break;
                        }
                    }
                }

                // Tolérance numérique relative sur les calculs (ex : 7.68 vs 7.676)
                if (!isCorrect && !isNaN(parseFloat(userVal)) && !isNaN(parseFloat(attenduVal))) {
                    const diff = Math.abs(parseFloat(userVal) - parseFloat(attenduVal));
                    if (diff <= 0.05) {
                        isCorrect = true;
                    }
                }

                if (isCorrect) {
                    earnedPoints += data.pts;
                    if (fbElem) {
                        fbElem.className = 'feedback-box feedback-correct';
                        fbElem.innerText = '+' + data.pts + ' pt';
                    }
                } else {
                    if (fbElem) {
                        fbElem.className = 'feedback-box feedback-wrong';
                        fbElem.innerText = 'Attendu : ' + data.val;
                    }
                }
            }

            // Calcul de la pénalité d'indices (Option 1)
            let penaliteIndices = 0;
            if (usedHintsCount > FREE_HINTS) {
                penaliteIndices = Math.min(MAX_HINT_PENALTY, (usedHintsCount - FREE_HINTS) * PENALTY_PER_HINT);
            }

            const noteFinale = Math.max(0, Math.min(20, Math.round((earnedPoints - penaliteIndices) * 10) / 10));

            // Affichage du score
            document.getElementById('global-score-display').innerText = noteFinale.toFixed(1) + ' / 20';
            document.getElementById('global-score-details').innerText =
                'Score brut : ' + earnedPoints.toFixed(1) + ' / 20 | Pénalité indices (' + usedHintsCount + ') : -' + penaliteIndices.toFixed(2) + ' pt';

            // Attribution des 4 paliers officiels Éduscol pour C1
            const badgeC1 = document.getElementById('badge-c1');
            const detailC1 = document.getElementById('detail-c1');

            if (noteFinale >= 17) {
                badgeC1.className = 'badge badge-vert-fonce';
                badgeC1.innerText = 'Très bonne maîtrise';
                detailC1.innerText = 'Note ≥ 17/20 (Maîtrise excellente des échelles)';
            } else if (noteFinale >= 13) {
                badgeC1.className = 'badge badge-vert-clair';
                badgeC1.innerText = 'Maîtrise satisfaisante';
                detailC1.innerText = '13 ≤ Note < 17 (Compétence validée - Coeur de cible)';
            } else if (noteFinale >= 8) {
                badgeC1.className = 'badge badge-jaune';
                badgeC1.innerText = 'Maîtrise fragile';
                detailC1.innerText = '8 ≤ Note < 13 (Des erreurs d\\'application ou de calcul)';
            } else {
                badgeC1.className = 'badge badge-rouge';
                badgeC1.innerText = 'Maîtrise insuffisante';
                detailC1.innerText = 'Note < 8/20 (Méthode non acquise)';
            }

            // Mettre à jour C2
            mettreAJourC2();
        }`;

const newCalcNotes = `        function calculerNotesEtCompetences() {
            if (!payloadDechiffre || !payloadDechiffre.answers) return;

            const answers = payloadDechiffre.answers;
            let earnedPoints = 0;
            let totalPossible = 0;

            for (const [qid, data] of Object.entries(answers)) {
                totalPossible += (data.pts || 0);
                const inputElem = document.querySelector(\`[data-qid="\${qid}"]\`);
                const fbElem = document.getElementById(\`fb-\${qid}\`);
                if (!inputElem) continue;

                const userValRaw = inputElem.value.trim();
                const userVal = normaliserTexte(userValRaw);
                const attenduVal = normaliserTexte(data.val);

                let isCorrect = (userVal === attenduVal);

                // Vérifier les alternatives valides
                if (!isCorrect && data.alts && Array.isArray(data.alts)) {
                    for (const alt of data.alts) {
                        if (userVal === normaliserTexte(alt)) {
                            isCorrect = true;
                            break;
                        }
                    }
                }

                // Tolérance numérique relative sur les calculs (ex : 15.9 vs 15.90)
                if (!isCorrect && !isNaN(parseFloat(userVal)) && !isNaN(parseFloat(attenduVal))) {
                    const diff = Math.abs(parseFloat(userVal) - parseFloat(attenduVal));
                    if (diff <= 0.05) {
                        isCorrect = true;
                    }
                }

                if (isCorrect) {
                    earnedPoints += data.pts;
                    inputElem.style.borderColor = '#16a34a';
                    inputElem.style.backgroundColor = '#f0fdf4';
                    if (fbElem) {
                        fbElem.className = 'feedback-box feedback-correct';
                        fbElem.innerText = '+' + data.pts + (data.pts <= 1 ? ' pt' : ' pts');
                    }
                } else {
                    inputElem.style.borderColor = '#dc2626';
                    inputElem.style.backgroundColor = '#fef2f2';
                    if (fbElem) {
                        fbElem.className = 'feedback-box feedback-wrong';
                        fbElem.innerText = 'Attendu : ' + data.val;
                    }
                }
            }

            // Calcul de la pénalité d'indices (Option 1)
            let penaliteIndices = 0;
            if (usedHintsCount > FREE_HINTS) {
                penaliteIndices = Math.min(MAX_HINT_PENALTY, (usedHintsCount - FREE_HINTS) * PENALTY_PER_HINT);
            }

            const scoreSur20 = totalPossible > 0 ? (earnedPoints / totalPossible) * 20 : 0;
            const noteFinale = Math.max(0, Math.min(20, Math.round((scoreSur20 - penaliteIndices) * 10) / 10));

            // Affichage du score
            document.getElementById('global-score-display').innerText = noteFinale.toFixed(1) + ' / 20';
            document.getElementById('global-score-details').innerText =
                'Score brut : ' + earnedPoints.toFixed(1) + ' / ' + totalPossible + ' pts (' + scoreSur20.toFixed(1) + ' / 20) | Pénalité indices (' + usedHintsCount + ') : -' + penaliteIndices.toFixed(2) + ' pt';

            // Attribution des 4 paliers officiels Éduscol pour C1
            const badgeC1 = document.getElementById('badge-c1');
            const detailC1 = document.getElementById('detail-c1');

            if (noteFinale >= 17) {
                badgeC1.className = 'badge badge-vert-fonce';
                badgeC1.innerText = 'Très bonne maîtrise';
                detailC1.innerText = 'Note ≥ 17/20 (Maîtrise excellente de la lecture de plan)';
            } else if (noteFinale >= 13) {
                badgeC1.className = 'badge badge-vert-clair';
                badgeC1.innerText = 'Maîtrise satisfaisante';
                detailC1.innerText = '13 ≤ Note < 17 (Compétence validée - Cœur de cible)';
            } else if (noteFinale >= 8) {
                badgeC1.className = 'badge badge-jaune';
                badgeC1.innerText = 'Maîtrise fragile';
                detailC1.innerText = '8 ≤ Note < 13 (Des erreurs d\\'analyse ou de calcul)';
            } else {
                badgeC1.className = 'badge badge-rouge';
                badgeC1.innerText = 'Maîtrise insuffisante';
                detailC1.innerText = 'Note < 8/20 (Méthode non acquise)';
            }

            // Mettre à jour C2
            mettreAJourC2();
        }`;

html = html.replace(oldCalcNotes, newCalcNotes);

// 12. Guard old image element changes in validerTD
const oldImgSwap = `            // Basculer les images vers la version corrigée annotée pour le contrôle prof
            document.getElementById('img-plan-rdc').src = 'img/plan_rdc_corrige.png';
            document.getElementById('img-plan-graduee').src = 'img/plan_echelle_graduee_corrige.png';
            if (document.getElementById('img-facade-principale')) document.getElementById('img-facade-principale').src = 'img/facade_principale_corrige.png';
            if (document.getElementById('img-facade-arriere')) document.getElementById('img-facade-arriere').src = 'img/facade_arriere_corrige.png';
            if (document.getElementById('img-facade-gauche')) document.getElementById('img-facade-gauche').src = 'img/facade_gauche_corrige.png';`;

const newImgSwap = `            // Basculer les images vers la version corrigée annotée pour le contrôle prof si présentes
            if (document.getElementById('img-plan-rdc')) document.getElementById('img-plan-rdc').src = 'img/plan_rdc_corrige.png';
            if (document.getElementById('img-plan-graduee')) document.getElementById('img-plan-graduee').src = 'img/plan_echelle_graduee_corrige.png';
            if (document.getElementById('img-facade-principale')) document.getElementById('img-facade-principale').src = 'img/facade_principale_corrige.png';
            if (document.getElementById('img-facade-arriere')) document.getElementById('img-facade-arriere').src = 'img/facade_arriere_corrige.png';
            if (document.getElementById('img-facade-gauche')) document.getElementById('img-facade-gauche').src = 'img/facade_gauche_corrige.png';`;

html = html.replace(oldImgSwap, newImgSwap);

// Write output file
fs.writeFileSync('TD_Sequence1_MELEC_Echelle_Document.html', html, 'utf8');
console.log('Successfully updated TD_Sequence1_MELEC_Echelle_Document.html');
