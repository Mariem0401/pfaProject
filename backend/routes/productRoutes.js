const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const productController = require("../Controller/productController");
const authController = require("../Controller/authController");

// Configuration du middleware d'upload (réutilisable)
const uploadProductImage = upload.single('image');

// Routes pour les catégories
router.get("/categories", 
  authController.protectionMW, 
  productController.getAllCategories
);
router.get("/animalss", 
  authController.protectionMW,
  productController.getAvailableAnimals);
router.get('/animals', authController.protectionMW, async (req, res) => { 
    try {
      // Solution alternative : liste statique des types d'animaux
      const types = [
        "Chien",
        "Chat",
        "Oiseaux",
        "Poissons",
        "Rongeurs",
        "Reptiles",
        "Autre"
      ];
      
      // Vérification si la liste des types est vide
      if (!types || types.length === 0) {
        return res.status(404).json({ message: "Aucun type d'animal trouvé" });
      }
      
      // Renvoi de la liste des types d'animaux en réponse JSON
      res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des types d'animaux:", error);
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur",
        details: error.message 
      });
    }
});

  
router.route("/")
  .get(
    authController.protectionMW, 
    productController.getAllProducts
  )
  .post(
    authController.protectionMW,
    authController.howCanDo("admin"),
    uploadProductImage,
    productController.createProduct
  );

// Routes pour un produit spécifique
router.route("/:id")
  .get(
    authController.protectionMW, 
    productController.getProductById
  )
  .patch(
    authController.protectionMW,
    authController.howCanDo("admin"),
    uploadProductImage,
    productController.updateProduct
  )
  .delete(
    authController.protectionMW,
    authController.howCanDo("admin"),
    productController.deleteProduct
  );

module.exports = router;