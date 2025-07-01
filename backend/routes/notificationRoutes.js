const router = require('express').Router();
const { protectionMW, howCanDo } = require('../Controller/authController');
const { 
  marquerCommeLue, 
  creerNotification,
  getUserNotifications,
  getAdminNotifications,
  verifierAnnoncesNonTraitees
} = require('../Controller/notificationController');

// Marquer une notification comme lue
router.patch('/:id/lue', protectionMW, marquerCommeLue);

// Endpoint pour tester les rappels (à appeler manuellement ou via cron)
router.get('/rappels', async (req, res) => {
  await verifierAnnoncesNonTraitees();
  res.send("Vérification des annonces non traitées effectuée.");
});
// routes/notificationRoutes.js
router.get('/user', protectionMW, getUserNotifications);
router.get('/admin', protectionMW, howCanDo("admin"), getAdminNotifications);

module.exports = router;