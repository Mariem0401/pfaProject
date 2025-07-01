const express = require("express");
const { upload } = require("../utils/cloudinary");
const router = express.Router();

const Annonce = require("../Model/annonceModel");
const annonceController = require("../Controller/annonceController");
const { protectionMW, howCanDo } = require("../Controller/authController");// si tu as un middleware d'auth
// Configuration du middleware d'upload (réutilisable)
const uploadImage = upload.single('image');
// Mettre à jour le statut d'une annonce (réservé à l'admin)
router.patch(
    "/statut/:id",
    protectionMW,
    howCanDo("admin"), // Seul un admin peut faire ça
    annonceController.updateStatutAnnonce
  );
  
  router.get('/mes-annonces', protectionMW, annonceController.getMesAnnonces);
// Créer une annonce (authentifié)


router.post("/", 
  protectionMW,
  uploadImage,
  annonceController.creerAnnonce
);
router.get('/types', protectionMW, async (req, res) => { // Ajout de protectionMW
  try {
    // Solution 1: Récupération depuis le schéma (si enum est bien défini)
    //const types = Annonce.schema.path('type').enumValues;
    
    // Solution alternative si la première ne fonctionne pas
     const types = ["adoption", "garde_temporaire", "animal_perdu", 
                "animal_trouve", "conseil_sante", "conseil_education", "autre"];
    
    if (!types || types.length === 0) {
      return res.status(404).json({ message: "Aucun type d'annonce trouvé" });
    }
    
    res.status(200).json(types);
  } catch (error) {
    console.error("Erreur lors de la récupération des types:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      details: error.message 
    });
  }
});

// Récupérer toutes les annonces
router.get("/AllAnnonce", protectionMW ,annonceController.getAllAnnonces);
router.get("/AllAnnonceAdmin", protectionMW,  howCanDo("admin") ,annonceController.getAllAnnoncesAdmin);

// Récupérer une seule annonce
router.get("/:id", protectionMW,annonceController.getAnnonceById);
// Admin : Liste des annonces selon statut ou type
router.get(
    "/admin/filtrer",
    protectionMW,
    howCanDo("admin"),
    annonceController.getAnnoncesByStatutEtType
  );
// Pour un utilisateur (ou admin) qui veut supprimer une annonce
router.delete('/:id', protectionMW, annonceController.deleteAnnonce);
router.patch("/id",protectionMW, annonceController.updateAnnonce)

  
  
module.exports = router;
