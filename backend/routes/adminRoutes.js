const express = require("express");
const router = express.Router();
const { protectionMW, howCanDo } = require("../Controller/authController");
const adminController = require("../Controller/adminController");

// routes/adminRoutes.js
router.get("/stats", protectionMW, howCanDo("admin"), adminController.getStats);
router.get("/stats/chart", protectionMW, howCanDo("admin"), adminController.getChartData);
router.get("/bestSeller", protectionMW, /*howCanDo("admin"),*/ adminController.getOnlyBestSeller);
router.get("/productSales", protectionMW, /*howCanDo("admin"),*/ adminController.getProductsSales);
router.get('/migrations/getAllDemande', protectionMW, adminController.getAllDemandesMigration);
router.patch('/migrations/:demandeId/accepter', protectionMW, adminController.accepterMigration);
module.exports = router;
