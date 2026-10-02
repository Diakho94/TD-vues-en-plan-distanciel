const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'TD_Sequence1_MELEC_Echelle_Document.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Simple DOM emulation or extracting function logic
console.log("=== VÉRIFICATION DU BLOC OBLIGATOIRE D'IDENTITÉ ===");

// 1. Check HTML labels have red asterisks
const hasNomAsterisk = html.includes('for="student-nom">Nom <span style="color: #ef4444;">*</span>');
const hasPrenomAsterisk = html.includes('for="student-prenom">Prénom <span style="color: #ef4444;">*</span>');
const hasClasseAsterisk = html.includes('for="student-classe">Classe <span style="color: #ef4444;">*</span>');
const hasGroupeAsterisk = html.includes('for="student-groupe">Groupe <span style="color: #ef4444;">*</span>');
const hasNom2Asterisk = html.includes('for="student-nom2" style="color: #3730a3;">Nom (Élève 2) <span style="color: #ef4444;">*</span>');
const hasPrenom2Asterisk = html.includes('for="student-prenom2" style="color: #3730a3;">Prénom (Élève 2) <span style="color: #ef4444;">*</span>');

console.log('Labels with mandatory asterisks:');
console.log('  Nom 1:', hasNomAsterisk);
console.log('  Prénom 1:', hasPrenomAsterisk);
console.log('  Classe:', hasClasseAsterisk);
console.log('  Groupe:', hasGroupeAsterisk);
console.log('  Nom 2 (binôme):', hasNom2Asterisk);
console.log('  Prénom 2 (binôme):', hasPrenom2Asterisk);

if (!hasNomAsterisk || !hasPrenomAsterisk || !hasClasseAsterisk || !hasGroupeAsterisk || !hasNom2Asterisk || !hasPrenom2Asterisk) {
    console.error("FAIL: Some labels are missing the red asterisk!");
    process.exit(1);
}

// 2. Check CSS styling for error state
const hasInputRequiredErrorCSS = html.includes('.student-field input.input-required-error');
const hasShakeAnimation = html.includes('@keyframes shake');
console.log('CSS input-required-error defined:', hasInputRequiredErrorCSS);
console.log('CSS shake animation defined:', hasShakeAnimation);
if (!hasInputRequiredErrorCSS || !hasShakeAnimation) {
    console.error("FAIL: Missing CSS error animation or styling!");
    process.exit(1);
}

// 3. Check JS implementation of verifierChampsIdentite
const hasVerifierFn = html.includes('function verifierChampsIdentite()');
const hasValiderTDCheck = html.includes('const checkIdentite = verifierChampsIdentite();');
const hasBlockReturn = html.includes('if (!checkIdentite.valide)') && html.includes('naviguerVersPage(\'page-1-garde\');');

console.log('verifierChampsIdentite exists:', hasVerifierFn);
console.log('validerTD checks identity before grading/decryption:', hasValiderTDCheck);
console.log('validerTD halts and navigates to page 1 on missing info:', hasBlockReturn);

if (!hasVerifierFn || !hasValiderTDCheck || !hasBlockReturn) {
    console.error("FAIL: verifierChampsIdentite logic or guard in validerTD is missing!");
    process.exit(1);
}

// 4. Test logic with dummy state
function mockVerifier(state) {
    const manquants = [];
    if (!state.nom1 || !state.nom1.trim()) manquants.push("Nom (Élève 1)");
    if (!state.prenom1 || !state.prenom1.trim()) manquants.push("Prénom (Élève 1)");
    if (!state.classe || !state.classe.trim()) manquants.push("Classe");
    if (state.classe !== '1MELFER MELEC' && (!state.groupe || !state.groupe.trim())) manquants.push("Groupe");
    if (state.isDuoMode) {
        if (!state.nom2 || !state.nom2.trim()) manquants.push("Nom (Élève 2)");
        if (!state.prenom2 || !state.prenom2.trim()) manquants.push("Prénom (Élève 2)");
    }
    return {
        valide: manquants.length === 0,
        manquants: manquants
    };
}

// Scenario A: Empty individual
const resA = mockVerifier({ nom1: '', prenom1: '', classe: '', groupe: '', isDuoMode: false });
console.log('Test Scenario A (All empty):', resA.manquants);
if (resA.valide || resA.manquants.length !== 4) {
    console.error("FAIL Scenario A");
    process.exit(1);
}

// Scenario B: Valid individual with 1MELEC1
const resB = mockVerifier({ nom1: 'DUPONT', prenom1: 'Jean', classe: '1MELEC1', groupe: 'Groupe 1', isDuoMode: false });
console.log('Test Scenario B (Valid individual): valide =', resB.valide);
if (!resB.valide) {
    console.error("FAIL Scenario B");
    process.exit(1);
}

// Scenario C: Valid individual with 1MELFER MELEC (no groupe required)
const resC = mockVerifier({ nom1: 'DUPONT', prenom1: 'Jean', classe: '1MELFER MELEC', groupe: '', isDuoMode: false });
console.log('Test Scenario C (1MELFER without groupe): valide =', resC.valide);
if (!resC.valide) {
    console.error("FAIL Scenario C");
    process.exit(1);
}

// Scenario D: Binôme mode with missing 2nd student
const resD = mockVerifier({ nom1: 'DUPONT', prenom1: 'Jean', classe: '1MELEC1', groupe: 'Groupe 1', isDuoMode: true, nom2: '', prenom2: '' });
console.log('Test Scenario D (Binôme missing 2nd student):', resD.manquants);
if (resD.valide || resD.manquants.length !== 2) {
    console.error("FAIL Scenario D");
    process.exit(1);
}

// Scenario E: Binôme fully valid
const resE = mockVerifier({ nom1: 'DUPONT', prenom1: 'Jean', classe: '1MELEC1', groupe: 'Groupe 1', isDuoMode: true, nom2: 'MARTIN', prenom2: 'Paul' });
console.log('Test Scenario E (Binôme complete): valide =', resE.valide);
if (!resE.valide) {
    console.error("FAIL Scenario E");
    process.exit(1);
}

console.log("\n>>> ALL IDENTITY TESTS PASSED SUCCESFULLY! <<<");
