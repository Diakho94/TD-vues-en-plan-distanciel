const FREE_HINTS = 1;
const PENALTY_PER_HINT = 0.25;
const MAX_HINT_PENALTY = 3.0;

function getBadge(usedHintsCount) {
    let penalite = 0;
    if (usedHintsCount > FREE_HINTS) {
        penalite = Math.min(MAX_HINT_PENALTY, (usedHintsCount - FREE_HINTS) * PENALTY_PER_HINT);
    }

    if (penalite > 0) {
        return '💡 Utilisés : ' + usedHintsCount + ' (Pénalité : -' + penalite.toFixed(2) + ' pt)';
    } else {
        const restants = Math.max(0, FREE_HINTS - usedHintsCount);
        return '💡 ' + restants + (restants <= 1 ? ' gratuit restant' : ' gratuits restants') + ' | Utilisés : ' + usedHintsCount;
    }
}

console.log('0 used:', getBadge(0));
console.log('1 used:', getBadge(1));
console.log('2 used:', getBadge(2));
console.log('3 used:', getBadge(3));
console.log('6 used:', getBadge(6));
