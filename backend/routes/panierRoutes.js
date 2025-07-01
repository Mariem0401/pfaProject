const express = require('express');
const {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  clearCart,
} = require('../Controller/panierController');
const { protectionMW } = require('../Controller/authController');

const router = express.Router();

// Protéger les routes du panier pour les utilisateurs connectés
router.use(protectionMW);

// Récupérer le panier ou ajouter un produit
router.route('/').get(getCart).post(addToCart);

// Mettre à jour ou supprimer un produit du panier
router.route('/:productId').patch(updateCart).delete(removeFromCart);

// Vider le panier (POST)
router.route('/clear').post(clearCart);

module.exports = router;
