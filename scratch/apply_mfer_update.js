const fs = require('fs');

let html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// 1. Update student-classe options
const oldClasses = `                        <select id="student-classe" onchange="changerClasse(this.value)">
                            <option value="">-- Choisir la classe --</option>
                            <option value="1MELEC1">1MELEC1</option>
                            <option value="1MELEC2">1MELEC2</option>
                            <option value="1MELFER MELEC">1MELFER MELEC</option>
                        </select>`;

const newClasses = `                        <select id="student-classe" onchange="changerClasse(this.value)">
                            <option value="">-- Choisir la classe --</option>
                            <option value="1MELEC1">1MELEC1</option>
                            <option value="1MELEC2">1MELEC2</option>
                            <option value="1MELFER MELEC">1MELFER MELEC</option>
                            <option value="1MFER">1MFER</option>
                            <option value="1MELFER MFER">1MELFER MFER</option>
                        </select>`;

if (!html.includes(oldClasses)) {
    console.error("ERROR: oldClasses not found in HTML!");
    process.exit(1);
}
html = html.replace(oldClasses, newClasses);
console.log("1. Classes updated!");

// 2. Dock filiere badge & Page 1 badges
html = html.replace(
    `<span class="dock-title-badge">MELEC | Séquence 1</span>`,
    `<span class="dock-title-badge" id="dock-filiere-badge">MELEC | Séquence 1</span>`
);

html = html.replace(
    `<span style="color: #1e3a8a; font-size: 12px;">Section Bac Pro MELEC</span>`,
    `<span id="p1-filiere-badge" style="color: #1e3a8a; font-size: 12px;">Section Bac Pro MELEC</span>`
);

html = html.replace(
    `Étude de dossier technique et exploitation des plans de bâtiment en Bac Pro MELEC`,
    `<span id="p1-filiere-subtitle">Étude de dossier technique et exploitation des plans de bâtiment en Bac Pro MELEC</span>`
);
console.log("2. Page 1 & dock tags updated!");

// 3. Header table tags on all 6 pages
const oldHeaderCell = `<td style="width: 25%; font-weight: bold; font-size: 12px; background: #f8fafc;">
                        Bac Pro MELEC
                    </td>`;

const newHeaderCell = `<td style="width: 25%; font-weight: bold; font-size: 12px; background: #f8fafc;" class="header-filiere-tag">
                        Bac Pro MELEC
                    </td>`;

html = html.replaceAll(oldHeaderCell, newHeaderCell);

// Footers
const oldFooterSpan = `<span>Lycée Professionnel — Bac Pro MELEC | M. DIAKHO</span>`;
const newFooterSpan = `<span>Lycée Professionnel — <span class="footer-filiere-tag">Bac Pro MELEC</span> | M. DIAKHO</span>`;
html = html.replaceAll(oldFooterSpan, newFooterSpan);
console.log("3. Header and footer tags updated across all pages!");

// 4. Page 2: Wrap existing in #contexte-melec and add #contexte-mfer
const oldP2ContentStart = `            <!-- Activités Ciblées & Tâches -->
            <div class="section-box">`;

const oldP2ContentEnd = `            <!-- Données & Conditions de Réalisation -->
            <div class="section-box">
                <h3>Données & Conditions de Réalisation</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11.5px;">
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                        <strong style="color: #1e3a8a;">ON DONNE :</strong>
                        <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                            <li>Plan de R.D.C. (Échelle 1:76).</li>
                            <li>Plan avec échelle graduée (2,5 cm ↔ 2 m).</li>
                            <li>Plans des façades du pavillon.</li>
                        </ul>
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                        <strong style="color: #1e3a8a;">ON DEMANDE :</strong>
                        <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                            <li>Calculer les 4 cotes réelles en mètres (Q1).</li>
                            <li>Identifier les dimensions de la chambre 2 (Q2).</li>
                            <li>Exploiter l'échelle graphique (Q3).</li>
                            <li>Déduire l'échelle et cotes façades (Q4-Q6).</li>
                        </ul>
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                        <strong style="color: #1e3a8a;">ON EXIGE :</strong>
                        <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                            <li>Rigueur mathématique et conversions.</li>
                            <li>Indication systématique des unités (m, cm).</li>
                        </ul>
                    </div>
                </div>
            </div>`;

if (!html.includes(oldP2ContentStart) || !html.includes(oldP2ContentEnd)) {
    console.error("ERROR: old Page 2 content markers not found!");
    process.exit(1);
}

const melecP2Block = `            <!-- BLOC MELEC (Actif par défaut ou si classe 1MELEC1, 1MELEC2, 1MELFER MELEC) -->
            <div id="contexte-melec">
                <!-- Activités Ciblées & Tâches MELEC -->
                <div class="section-box" style="border: 1.5px solid #4472c4; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 8px 0; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0;">
                        Activités Ciblées & Tâches Professionnelles
                    </h3>
                    <div style="background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 7px 12px; border-radius: 0 4px 4px 0; margin-bottom: 8px;">
                        <div style="color: #1e3a8a; font-weight: 700; font-size: 12px; margin-bottom: 2px;">Activité Ciblée :</div>
                        <div style="font-size: 12px; color: #1e293b;">
                            <strong style="color: #1e3a8a;">A1</strong> – Préparation des opérations de réalisation, de mise en service et de maintenance.
                        </div>
                    </div>
                    <div style="background: #f8fafc; border-left: 4px solid #4472c4; padding: 7px 12px; border-radius: 0 4px 4px 0;">
                        <div style="color: #4472c4; font-weight: 700; font-size: 12px; margin-bottom: 2px;">Tâche Professionnelle :</div>
                        <div style="font-size: 12px; color: #1e293b;">
                            <strong style="color: #4472c4;">T1-1</strong> – Prendre connaissance du dossier relatif aux opérations à réaliser.
                        </div>
                    </div>
                </div>

                <!-- Compétences Visées du Référentiel MELEC -->
                <div class="section-box" style="border: 1.5px solid #4472c4; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 8px 0; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0;">
                        Compétences Évaluées du Référentiel
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 7px;">
                        <div style="padding: 8px 12px; background: #f0f4fc; border-left: 4px solid #1e3a8a; border-radius: 0 4px 4px 0;">
                            <strong style="color: #1e3a8a; font-size: 12.5px;">C1 – Analyser les conditions de l'opération et son contexte</strong>
                        </div>
                        <div style="padding: 8px 12px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 0 4px 4px 0;">
                            <strong style="color: #15803d; font-size: 12.5px;">C2 – Organiser son intervention / Poste de travail</strong>
                        </div>
                    </div>
                </div>

                <!-- Mise en situation & Problématique Professionnelle MELEC -->
                <div class="section-box" style="border: 1.5px solid #4472c4; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 6px 0; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0;">
                        Mise en Situation & Problématique Professionnelle
                    </h3>
                    <p style="font-size: 12px; line-height: 1.5; color: #1e293b; margin: 4px 0 8px 0;">
                        Vous intervenez au sein d'une entreprise d'installation et de maintenance électrique. Votre chef d'équipe vous confie le dossier d'exécution électrique d'un pavillon d'habitation individuelle. Vous devez implanter l'armoire de répartition, les prises de courant, les circuits d'éclairage et déterminer le linéaire de gaines techniques.
                    </p>
                    <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 6px; padding: 8px 12px;">
                        <strong style="color: #92400e; font-size: 12px;">Problématique de chantier :</strong>
                        <div style="font-size: 11.5px; color: #78350f; margin-top: 3px; line-height: 1.45;">
                            Avant d'entamer le traçage et la pose des conduits, vous devez impérativement vérifier les dimensions réelles des locaux et la validité des échelles indiquées sur les plans d'architecte (RDC, échelle graduée, plans des façades). Comment déduire les cotes réelles à partir des différentes échelles fournies ?
                        </div>
                    </div>
                </div>

                <!-- Données & Conditions de Réalisation MELEC -->
                <div class="section-box" style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white;">
                    <h3 style="color: #1e3a8a; font-size: 12.5px; font-weight: 700; margin: 0 0 6px 0;">Données & Conditions de Réalisation</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11.5px;">
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #1e3a8a;">ON DONNE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Dossier technique d'exécution pavillon.</li>
                                <li>Plan d'architecte du R.D.C. (Échelle 1:100).</li>
                                <li>Plans et coupes des façades.</li>
                            </ul>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #1e3a8a;">ON DEMANDE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Identifier les symboles du bâtiment (Q1).</li>
                                <li>Déterminer les orientations géographiques (Q2).</li>
                                <li>Analyser le chauffage et évacuations (Q3-Q4).</li>
                                <li>Calculer les superficies et cotes (Q5-Q9).</li>
                            </ul>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #1e3a8a;">ON EXIGE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Rigueur mathématique et conversions.</li>
                                <li>Indication systématique des unités (m, cm, m²).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- =========================================================================
                 BLOC MFER (Affiché si classe 1MFER ou 1MELFER MFER)
                 ========================================================================= -->
            <div id="contexte-mfer" style="display: none;">
                <!-- Activités Ciblées & Tâches Professionnelles MFER -->
                <div class="section-box" style="border: 1.5px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 8px 0; padding-bottom: 5px; border-bottom: 1px solid #e0f2fe;">
                        Activités Ciblées & Tâches Professionnelles
                    </h3>
                    <div style="background: #f0f7ff; border-left: 4px solid #0284c7; padding: 7px 12px; border-radius: 0 4px 4px 0; margin-bottom: 8px;">
                        <div style="color: #0284c7; font-weight: 700; font-size: 12px; margin-bottom: 2px;">Activité ciblée :</div>
                        <div style="font-size: 12px; color: #0f172a;">
                            <strong style="color: #0284c7;">A1</strong> : Préparation des opérations à réaliser
                        </div>
                    </div>
                    <div style="background: #f0f7ff; border-left: 4px solid #38bdf8; padding: 7px 12px; border-radius: 0 4px 4px 0;">
                        <div style="color: #0284c7; font-weight: 700; font-size: 12px; margin-bottom: 2px;">Tâches professionnelles :</div>
                        <div style="font-size: 12px; color: #0f172a; margin-bottom: 3px;">
                            <strong style="color: #0284c7;">A1T1</strong> : Prendre connaissance des dossiers relatifs aux opérations à réaliser
                        </div>
                        <div style="font-size: 12px; color: #0f172a;">
                            <strong style="color: #0284c7;">A1T2</strong> : Analyser et exploiter les données techniques d'une installation
                        </div>
                    </div>
                </div>

                <!-- Compétences Évaluées du Référentiel MFER -->
                <div class="section-box" style="border: 1.5px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 8px 0; padding-bottom: 5px; border-bottom: 1px solid #e0f2fe;">
                        Compétences Évaluées du Référentiel
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 7px;">
                        <div style="padding: 8px 12px; background: #f0f9ff; border-left: 4px solid #0284c7; border-radius: 0 4px 4px 0;">
                            <strong style="color: #0369a1; font-size: 12.5px;">C1 – Analyser les conditions de l'opération et son contexte</strong>
                        </div>
                        <div style="padding: 8px 12px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 0 4px 4px 0;">
                            <strong style="color: #15803d; font-size: 12.5px;">C2 – Analyser et exploiter les données techniques de l'intervention</strong>
                        </div>
                        <div style="padding: 8px 12px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 4px 4px 0;">
                            <strong style="color: #b45309; font-size: 12.5px;">C4 – Organiser son intervention / poste de travail</strong>
                        </div>
                    </div>
                </div>

                <!-- Mise en Situation & Problématique Professionnelle MFER -->
                <div class="section-box" style="border: 1.5px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; background: white;">
                    <h3 style="color: #003366; font-size: 13.5px; font-weight: 700; margin: 0 0 6px 0; padding-bottom: 5px; border-bottom: 1px solid #e0f2fe;">
                        Mise en Situation & Problématique Professionnelle
                    </h3>
                    <p style="font-size: 12px; line-height: 1.5; color: #1e293b; margin: 4px 0 8px 0;">
                        Vous intervenez au sein d'une entreprise spécialisée dans les installations climatiques, frigorifiques et thermiques (Bac Pro MFER). Votre chef d'équipe vous confie le dossier technique d'exécution d'un pavillon d'habitation individuelle équipé d'une pompe à chaleur (PAC) air/eau et d'une climatisation réversible. Vous devez implanter l'unité extérieure, les liaisons frigorifiques, les émetteurs intérieurs et déterminer les passages des réseaux fluidiques.
                    </p>
                    <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 6px; padding: 8px 12px;">
                        <strong style="color: #92400e; font-size: 12px;">Problématique de chantier :</strong>
                        <div style="font-size: 11.5px; color: #78350f; margin-top: 3px; line-height: 1.45;">
                            Avant d'entamer le tracé et la pose des réseaux frigorifiques, vous devez impérativement vérifier les dimensions réelles des locaux et la validité des échelles indiquées sur les plans d'architecte (plan du RDC, échelle graduée, plans des façades).<br>
                            Comment déduire avec précision les cotes et hauteurs réelles à partir des différentes échelles fournies sur le dossier technique ?
                        </div>
                    </div>
                </div>

                <!-- Données & Conditions de Réalisation MFER -->
                <div class="section-box" style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: white;">
                    <h3 style="color: #1e3a8a; font-size: 12.5px; font-weight: 700; margin: 0 0 6px 0;">Données & Conditions de Réalisation</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11.5px;">
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #0284c7;">ON DONNE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Dossier technique d'exécution (PAC & VMC).</li>
                                <li>Plan d'architecte du R.D.C. (Échelle 1:100).</li>
                                <li>Plans et coupes des façades.</li>
                            </ul>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #0284c7;">ON DEMANDE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Identifier les symboles du bâtiment (Q1).</li>
                                <li>Déterminer les orientations géographiques (Q2).</li>
                                <li>Analyser le chauffage et évacuations (Q3-Q4).</li>
                                <li>Calculer les superficies et cotes (Q5-Q9).</li>
                            </ul>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px 8px;">
                            <strong style="color: #0284c7;">ON EXIGE :</strong>
                            <ul style="margin: 4px 0; padding-left: 14px; font-size: 10.5px;">
                                <li>Rigueur des calculs et conversions.</li>
                                <li>Indication systématique des unités (m, cm, m²).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;

// Replace entire Page 2 inner content
const p2OuterStart = html.indexOf(oldP2ContentStart);
const p2OuterEnd = html.indexOf(oldP2ContentEnd) + oldP2ContentEnd.length;
html = html.substring(0, p2OuterStart) + melecP2Block + html.substring(p2OuterEnd);
console.log("4. Page 2 dual templates (MELEC & MFER) integrated!");

// 5. Page 3 Competences labels IDs
const oldPage3CompRow1 = `                        <td>
                            <strong style="color: #1e3a8a; font-size: 13px;">C1</strong> – Analyser les conditions de
                            l'opération et son contexte
                        </td>`;
const newPage3CompRow1 = `                        <td id="label-comp-c1">
                            <strong style="color: #1e3a8a; font-size: 13px;">C1</strong> – Analyser les conditions de l'opération et son contexte
                        </td>`;

const oldPage3CompRow2 = `                        <td>
                            <strong style="color: #15803d; font-size: 13px;">C2</strong> – Organiser son poste de
                            travail
                        </td>`;
const newPage3CompRow2 = `                        <td id="label-comp-c2">
                            <strong style="color: #15803d; font-size: 13px;">C2</strong> – Organiser son poste de travail
                        </td>`;

const oldProfEvalC2 = `<strong style="font-size: 12px; color: #1e3a8a;">Évaluation de la compétence C2 (Organisation du
                        poste de travail) :</strong>`;
const newProfEvalC2 = `<strong id="label-prof-eval-c2" style="font-size: 12px; color: #1e3a8a;">Évaluation de la compétence C2 (Organisation du poste de travail) :</strong>`;

html = html.replace(oldPage3CompRow1, newPage3CompRow1);
html = html.replace(oldPage3CompRow2, newPage3CompRow2);
html = html.replace(oldProfEvalC2, newProfEvalC2);
console.log("5. Page 3 competence labels IDs added!");

// 6. Update JavaScript logic for changerClasse, mettreAJourIdentite, verifierChampsIdentite, genererNomFichierBase, envoyerSynchronisationGoogleSheets
const oldChangerClasse = `        function changerClasse(classe) {
            const boxGroupe = document.getElementById('box-groupe');
            if (classe === '1MELFER MELEC') {
                boxGroupe.style.visibility = 'hidden';
                const grp = document.getElementById('student-groupe');
                if (grp) grp.classList.remove('input-required-error');
            } else {
                boxGroupe.style.visibility = 'visible';
            }
            mettreAJourIdentite();
        }`;

const newChangerClasse = `        function changerClasse(classe) {
            const boxGroupe = document.getElementById('box-groupe');
            const grp = document.getElementById('student-groupe');
            const sansGroupe = (classe === '1MELFER MELEC' || classe === '1MELFER MFER');
            const isMFER = (classe === '1MFER' || classe === '1MELFER MFER');

            // 1. Visibilité du groupe (masqué pour 1MELFER MELEC et 1MELFER MFER)
            if (sansGroupe) {
                boxGroupe.style.visibility = 'hidden';
                if (grp) {
                    grp.value = '';
                    grp.classList.remove('input-required-error');
                }
            } else {
                boxGroupe.style.visibility = 'visible';
            }

            // 2. Bascule dynamique du contenu de la Page 2 (MELEC vs MFER)
            const melecBox = document.getElementById('contexte-melec');
            const mferBox = document.getElementById('contexte-mfer');
            if (melecBox && mferBox) {
                if (isMFER) {
                    melecBox.style.display = 'none';
                    mferBox.style.display = 'block';
                } else {
                    melecBox.style.display = 'block';
                    mferBox.style.display = 'none';
                }
            }

            // 3. Mise à jour des badges et en-têtes de filière (MELEC / MFER)
            const filiereTexte = isMFER ? "Bac Pro MFER" : "Bac Pro MELEC";
            const filiereCode = isMFER ? "MFER" : "MELEC";

            document.querySelectorAll('.header-filiere-tag').forEach(el => {
                el.innerText = filiereTexte;
            });
            document.querySelectorAll('.footer-filiere-tag').forEach(el => {
                el.innerText = filiereTexte;
            });

            const dockFiliere = document.getElementById('dock-filiere-badge');
            if (dockFiliere) dockFiliere.innerText = filiereCode + ' | Séquence 1';

            const p1Badge = document.getElementById('p1-filiere-badge');
            if (p1Badge) p1Badge.innerText = 'Section ' + filiereTexte;

            const p1Sub = document.getElementById('p1-filiere-subtitle');
            if (p1Sub) p1Sub.innerText = 'Étude de dossier technique et exploitation des plans de bâtiment en ' + filiereTexte;

            // 4. Adaptation Page 3 (Bilan des compétences)
            const compC1Label = document.getElementById('label-comp-c1');
            const compC2Label = document.getElementById('label-comp-c2');
            const profC2Label = document.getElementById('label-prof-eval-c2');

            if (isMFER) {
                if (compC1Label) compC1Label.innerHTML = '<strong style="color: #1e3a8a; font-size: 13px;">C1 / C2</strong> – Analyser les conditions de l\\'opération et exploiter les données techniques';
                if (compC2Label) compC2Label.innerHTML = '<strong style="color: #b45309; font-size: 13px;">C4</strong> – Organiser son intervention / poste de travail';
                if (profC2Label) profC2Label.innerText = "Évaluation de la compétence C4 (Organisation de son intervention / poste de travail) :";
            } else {
                if (compC1Label) compC1Label.innerHTML = '<strong style="color: #1e3a8a; font-size: 13px;">C1</strong> – Analyser les conditions de l\\'opération et son contexte';
                if (compC2Label) compC2Label.innerHTML = '<strong style="color: #15803d; font-size: 13px;">C2</strong> – Organiser son poste de travail';
                if (profC2Label) profC2Label.innerText = "Évaluation de la compétence C2 (Organisation du poste de travail) :";
            }

            mettreAJourIdentite();
        }`;

html = html.replace(oldChangerClasse, newChangerClasse);

// mettreAJourIdentite
html = html.replace(
    `const groupe = (classe === '1MELFER MELEC') ? '' : (groupeInput ? groupeInput.value : '');`,
    `const sansGroupe = (classe === '1MELFER MELEC' || classe === '1MELFER MFER');
            const groupe = sansGroupe ? '' : (groupeInput ? groupeInput.value : '');`
);

html = html.replace(
    `if ((groupe || classe === '1MELFER MELEC') && groupeInput) groupeInput.classList.remove('input-required-error');`,
    `if ((groupe || sansGroupe) && groupeInput) groupeInput.classList.remove('input-required-error');`
);

// verifierChampsIdentite
html = html.replace(
    `if (classeInput && classeInput.value !== '1MELFER MELEC' && (!groupeInput || !groupeInput.value.trim())) {`,
    `const isSansGroupe = (classeInput && (classeInput.value === '1MELFER MELEC' || classeInput.value === '1MELFER MFER'));
            if (classeInput && !isSansGroupe && (!groupeInput || !groupeInput.value.trim())) {`
);

// genererNomFichierBase
html = html.replace(
    `const groupe = classe === '1MELFER MELEC' ? '' : document.getElementById('student-groupe').value.replace(/\\s+/g, '');`,
    `const sansGroupe = (classe === '1MELFER MELEC' || classe === '1MELFER MFER');
            const groupe = sansGroupe ? '' : document.getElementById('student-groupe').value.replace(/\\s+/g, '');`
);

// envoyerSynchronisationGoogleSheets
html = html.replace(
    `const groupe = classe === '1MELFER MELEC' ? 'Classe entière' : document.getElementById('student-groupe').value;`,
    `const sansGroupe = (classe === '1MELFER MELEC' || classe === '1MELFER MFER');
            const isMFER = (classe === '1MFER' || classe === '1MELFER MFER');
            const groupe = sansGroupe ? 'Classe entière' : document.getElementById('student-groupe').value;`
);

html = html.replace(
    `filiere: "MELEC",`,
    `filiere: isMFER ? "MFER" : "MELEC",`
);

fs.writeFileSync('TD_Sequence1_MELEC_Echelle_Document.html', html, 'utf8');
console.log("SUCCESS! All MFER & MELEC class/group and dynamic context updates written.");
