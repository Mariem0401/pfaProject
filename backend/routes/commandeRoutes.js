const express = require("express");
const router = express.Router();
const commandeController = require("../Controller/commandeController");
const { protectionMW, howCanDo } = require("../Controller/authController");

router.post("/", protectionMW, commandeController.createCommande);
router.get("/mes-commandes", protectionMW, commandeController.getCommandesUtilisateur);
router.get("/:id", protectionMW , commandeController.getCommandeById);
// Routes admin
router.get("/", protectionMW, howCanDo("admin"), commandeController.getToutesCommandes);
router.patch("/:id", protectionMW, howCanDo("admin"), commandeController.updateCommandeStatus);
// Route pour récupérer les commandes de l'utilisateur connecté

  
module.exports = router;
