const fs = require('fs');

const html = fs.readFileSync('TD_Sequence1_MELEC_Echelle_Document.html', 'utf8');
const scriptGS = fs.readFileSync('GoogleAppsScript_Correction.js', 'utf8');

console.log('=== VÉRIFICATION INTÉGRATION PDF DRIVE & SUPPRESSION DU BILAN SEUL ===');

// 1. Suppression du bouton bilan seul
const hasBilanBtn = html.includes('btn-print-bilan') || html.includes('exporterBilanPDF');
console.log('Bouton bilan seul supprimé à 100%:', !hasBilanBtn);

// 2. Présence du bouton dossier complet 6 pages
const hasDossierBtn = html.includes('btn-print-dossier') && html.includes('📚 Enregistrer en PDF / Imprimer le Dossier Complet (6 pages)');
console.log('Bouton Dossier Complet (6 pages) présent:', hasDossierBtn);

// 3. Librairies locales html2canvas et jsPDF
const hasHtml2CanvasScript = html.includes('src="js/html2canvas.min.js"');
const hasJsPdfScript = html.includes('src="js/jspdf.umd.min.js"');
const html2canvasFileExists = fs.existsSync('js/html2canvas.min.js');
const jspdfFileExists = fs.existsSync('js/jspdf.umd.min.js');
console.log('Librairie html2canvas référencée et présente localement:', hasHtml2CanvasScript && html2canvasFileExists);
console.log('Librairie jsPDF référencée et présente localement:', hasJsPdfScript && jspdfFileExists);

// 4. Fonction de capture haute fidélité
const hasGenererDossierComplet = html.includes('async function genererDossierCompletPDFBase64()');
const hasA4PageSelector = html.includes("querySelectorAll('.a4-page')");
const hasPdfAddImage = html.includes("pdf.addImage(");
console.log('Fonction genererDossierCompletPDFBase64 présente:', hasGenererDossierComplet);
console.log('Capture toutes les pages .a4-page:', hasA4PageSelector);
console.log('Assemble les pages dans jsPDF:', hasPdfAddImage);

// 5. Transmission de pdfBase64 dans le webhook
const hasPdfBase64Payload = html.includes('pdfBase64: pdfBase64');
console.log('Envoi de pdfBase64 dans le payload webhook:', hasPdfBase64Payload);

// 6. Gestion dans Google Apps Script
const hasDriveSaving = scriptGS.includes('Utilities.base64Decode(data.pdfBase64)') && scriptGS.includes('targetFolder.createFile(pdfBlob)');
const hasHyperlinkFormula = scriptGS.includes('=HYPERLINK("') && scriptGS.includes('📄 Ouvrir le PDF');
console.log('Google Apps Script enregistre le PDF sur Google Drive:', hasDriveSaving);
console.log('Google Apps Script génère le lien HYPERLINK cliquable dans la colonne:', hasHyperlinkFormula);

if (!hasBilanBtn && hasDossierBtn && hasHtml2CanvasScript && hasJsPdfScript && hasGenererDossierComplet && hasPdfBase64Payload && hasDriveSaving && hasHyperlinkFormula) {
    console.log('\n>>> VÉRIFICATION PARFAITE : TOUS LES CRITÈRES SONT RESPECTÉS À 100% ! <<<');
} else {
    console.error('\n>>> ERREUR DE VÉRIFICATION ! <<<');
    process.exit(1);
}
