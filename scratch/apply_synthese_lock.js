const fs = require('fs');

// =========================================================================
// 1. MODIFICATION DE FICHE_SYNTHESE_ECHELLE_DOCUMENT.HTML
// =========================================================================
let syntheseHtml = fs.readFileSync('Fiche_Synthese_Echelle_Document.html', 'utf8');

// A. Supprimer la partie 5
const part5Regex = /<!-- 5\. L'Échelle Graphique Graduée -->[\s\S]*?<!-- 6\. Les Outils de Mesure de l'Électricien -->/;
if (!part5Regex.test(syntheseHtml)) {
    console.error("Part 5 not found in Fiche_Synthese_Echelle_Document.html!");
    process.exit(1);
}
syntheseHtml = syntheseHtml.replace(part5Regex, "<!-- 5. Les Outils de Mesure de l'Électricien -->");
console.log("Part 5 removed from Fiche Synthèse.");

// B. Renuméroter les sections suivantes
syntheseHtml = syntheseHtml.replace("<h3>6. Les Instruments de Mesure sur Plan</h3>", "<h3>5. Les Instruments de Mesure sur Plan</h3>");
syntheseHtml = syntheseHtml.replace("<!-- 7. Tableau des Échelles Normalisées en Bâtiment MELEC -->", "<!-- 6. Tableau des Échelles Normalisées en Bâtiment MELEC -->");
syntheseHtml = syntheseHtml.replace("<h3>7. Tableau des Échelles Courantes en Électrotechnique & Bâtiment</h3>", "<h3>6. Tableau des Échelles Courantes en Électrotechnique & Bâtiment</h3>");
syntheseHtml = syntheseHtml.replace("<!-- 8. Mémo Conversions Rapides & Pièges Fréquents -->", "<!-- 7. Mémo Conversions Rapides & Pièges Fréquents -->");
syntheseHtml = syntheseHtml.replace("<h3>💡 8. Mémo Conversions & Pièges à Éviter sur Chantier</h3>", "<h3>💡 7. Mémo Conversions & Pièges à Éviter sur Chantier</h3>");

// Ajuster le sous-titre de la page 2
syntheseHtml = syntheseHtml.replace("Échelle graduée, Kutch & Applications Chantier Électrique", "Kutch, Instruments de mesure & Applications Chantier");

// C. Ajouter le style pour le lock-overlay
const styleInsertion = `
        /* =========================================================================
           ÉCRAN DE VERROUILLAGE SÉCURISÉ (ACCÈS CODE ENSEIGNANT)
           ========================================================================= */
        #lock-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.96);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            backdrop-filter: blur(8px);
        }

        .lock-card {
            background: #1e293b;
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 32px 28px;
            max-width: 440px;
            width: 90%;
            text-align: center;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
        }
    </style>`;
syntheseHtml = syntheseHtml.replace("    </style>", styleInsertion);

// D. Envelopper le contenu et insérer l'overlay + script de verrouillage
const bodyOpen = "<body>";
const lockMarkupAndWrapper = `<body>

    <!-- Overlay de Verrouillage (Code Enseignant 7049 Requis) -->
    <div id="lock-overlay" style="display: flex;">
        <div class="lock-card">
            <div style="font-size: 38px; margin-bottom: 10px;">🔒</div>
            <h2 style="margin: 0 0 6px 0; color: #93c5fd; font-size: 20px;">Accès Enseignant Requis</h2>
            <div style="font-size: 12.5px; color: #cbd5e1; margin-bottom: 16px;">
                Fiche de Synthèse — Bac Pro MELEC<br>
                <span style="color: #94a3b8; font-size: 11.5px;">Cette fiche de cours est accessible uniquement après validation du TD par le professeur.</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; max-width: 280px; margin: 0 auto;">
                <input type="password" id="code-enseignant-input" placeholder="Code secret enseignant"
                    onkeydown="if(event.key==='Enter') validerCodeDirect()"
                    style="padding: 9px 12px; border: 2px solid #3b82f6; border-radius: 6px; font-size: 14px; font-weight: bold; text-align: center; outline: none; background: white; color: #0f172a;">
                <button type="button" onclick="validerCodeDirect()"
                    style="background: #2563eb; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 700; font-size: 13.5px; cursor: pointer; transition: background 0.2s;">
                    Déverrouiller la Fiche
                </button>
                <div id="code-error-msg" style="color: #f87171; font-size: 12px; font-weight: bold; display: none;">Code enseignant incorrect !</div>
                <a href="TD_Sequence1_MELEC_Echelle_Document.html" style="color: #94a3b8; font-size: 12px; text-decoration: none; margin-top: 4px;">
                    ← Retourner au TD Interactif
                </a>
            </div>
        </div>
    </div>

    <!-- Contenu de la Fiche Synthèse -->
    <div id="synthese-content" style="display: none;">`;

syntheseHtml = syntheseHtml.replace(bodyOpen, lockMarkupAndWrapper);

// Fermer #synthese-content et insérer le script avant </body>
const scriptAndClose = `    </div>
    <!-- FIN SYNTHESE CONTENT -->

    <script>
        const TEACHER_CODE = "7049";

        function verifierAuthentification() {
            const urlParams = new URLSearchParams(window.location.search);
            const codeParam = urlParams.get('auth');
            const sessionCode = sessionStorage.getItem('synthese_auth_code');

            if (codeParam === TEACHER_CODE || sessionCode === TEACHER_CODE) {
                deverrouillerPage();
                return true;
            }
            verrouillerPage();
            return false;
        }

        function validerCodeDirect() {
            const input = document.getElementById('code-enseignant-input');
            const errorMsg = document.getElementById('code-error-msg');
            if (!input) return;

            if (input.value.trim() === TEACHER_CODE) {
                sessionStorage.setItem('synthese_auth_code', TEACHER_CODE);
                if (errorMsg) errorMsg.style.display = 'none';
                deverrouillerPage();
            } else {
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = "Code enseignant incorrect !";
                }
                input.focus();
                input.select();
            }
        }

        function deverrouillerPage() {
            const overlay = document.getElementById('lock-overlay');
            const content = document.getElementById('synthese-content');
            if (overlay) overlay.style.display = 'none';
            if (content) content.style.display = 'block';
        }

        function verrouillerPage() {
            const overlay = document.getElementById('lock-overlay');
            const content = document.getElementById('synthese-content');
            if (overlay) overlay.style.display = 'flex';
            if (content) content.style.display = 'none';
            const input = document.getElementById('code-enseignant-input');
            if (input) setTimeout(() => input.focus(), 150);
        }

        window.addEventListener('DOMContentLoaded', verifierAuthentification);
    </script>
</body>`;

syntheseHtml = syntheseHtml.replace("</body>", scriptAndClose);

fs.writeFileSync('Fiche_Synthese_Echelle_Document.html', syntheseHtml, 'utf8');
console.log("Fiche_Synthese_Echelle_Document.html updated and protected!");


// =========================================================================
// 2. MODIFICATION DE TD_SEQUENCE1_MELEC_ECHELLE_DOCUMENT.HTML
// =========================================================================
let tdHtml = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');

// A. Remplacer le lien <a> du dock par un bouton interactif
const oldDockLink = `<a href="Fiche_Synthese_Echelle_Document.html" target="_blank" class="dock-btn dock-btn-synthese">Fiche
                    Synthèse</a>`;

const newDockBtn = `<button type="button" id="btn-dock-synthese" class="dock-btn dock-btn-synthese" onclick="ouvrirFicheSynthese()"
                    style="opacity: 0.6; cursor: not-allowed;" title="Accessible uniquement après validation enseignant">🔒 Fiche Synthèse</button>`;

if (!tdHtml.includes(oldDockLink)) {
    console.error("Old dock link not found in TD HTML!");
    process.exit(1);
}
tdHtml = tdHtml.replace(oldDockLink, newDockBtn);
console.log("TD dock link replaced with protected button.");

// B. Ajouter fonction ouvrirFicheSynthese() et mise à jour de validerTD()
const targetInScript = "function ajusterEcran() {";
const newFnSynthese = `function ouvrirFicheSynthese() {
            if (!isDossierValide) {
                alert("⚠️ Accès verrouillé !\\n\\nLa fiche synthèse est accessible uniquement après validation du dossier par l'enseignant (code secret 7049).");
                return;
            }
            sessionStorage.setItem('synthese_auth_code', '7049');
            window.open('Fiche_Synthese_Echelle_Document.html?auth=7049', '_blank');
        }

        function ajusterEcran() {`;

tdHtml = tdHtml.replace(targetInScript, newFnSynthese);

// C. Dans validerTD(), déverrouiller la fiche synthèse
const targetValider = "const btnPrint = document.getElementById('btn-print-dossier');";
const unlockSynthese = `// Déverrouiller l'accès à la fiche synthèse
            sessionStorage.setItem('synthese_auth_code', '7049');
            const btnSynthese = document.getElementById('btn-dock-synthese');
            if (btnSynthese) {
                btnSynthese.style.opacity = '1';
                btnSynthese.style.cursor = 'pointer';
                btnSynthese.innerHTML = '📄 Fiche Synthèse';
                btnSynthese.title = "Consulter la fiche synthèse";
            }

            const btnPrint = document.getElementById('btn-print-dossier');`;

tdHtml = tdHtml.replace(targetValider, unlockSynthese);

fs.writeFileSync('TD_Sequence1_MELEC_Echelle_Document.html', tdHtml, 'utf8');
console.log("TD_Sequence1_MELEC_Echelle_Document.html updated with lock logic!");
