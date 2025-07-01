// services/cronService.js
const cron = require('node-cron');
const { verifierAnnoncesNonTraitees } = require('../Controller/notificationController');

function demarrerRappelsAdmin() {
    // Planifie une tâche qui s'exécute tous les jours à minuit
    cron.schedule('0 0 * * *', () => {
        console.log('Vérification des annonces non traitées...');
        verifierAnnoncesNonTraitees();
    });
}

module.exports = { demarrerRappelsAdmin };