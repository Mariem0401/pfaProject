// routes/healthRoutes.js
const express = require("express");
const router = express.Router();
const healthController = require("../Controller/healthController");
const { protectionMW, restrictTo } = require("../Controller/authController");

// Protection de toutes les routes
router.use(protectionMW);

// Routes pour les dossiers de santé
router.post("/animal/:id/health-record", healthController.addHealthRecord);
router.get("/animal/:id/health-records", healthController.getHealthRecords);

// Routes pour les vaccinations et les préférences de notifications
router.post("/animal/:id/vaccination", healthController.addVaccination);
router.patch("/animal/:id/notifications", healthController.updateNotificationPreferences);

// Route pour tester les rappels (seulement pour les admins)
router.post("/test-reminders", restrictTo('admin'), healthController.testReminders);

module.exports = router;