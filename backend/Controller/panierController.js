
const Cart = require('../Model/panierModel');
const Product = require('../Model/productModel');
const mongoose = require('mongoose');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Vérifie si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    // Trouve ou crée un panier pour l'utilisateur
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ 
        user: req.user.id, 
        items: [],
        totalPrice: 0
      });
    }

    // Vérifie si le produit est déjà dans le panier
    const existingItem = cart.items.find((item) => item.product.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Ajoute le prix actuel du produit
      cart.items.push({ 
        product: productId, 
        quantity,
        priceAtAddition: product.price // Ajout de ce champ
      });
    }

    // Recalcule le prix total
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + ((item.priceAtAddition || product.price) * item.quantity);
    }, 0);

    await cart.save();
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ 
      status: 'fail', 
      message: err.message,
      error: err // Ajout pour le débogage
    });
  }
};
// Récupérer le panier de l'utilisateur
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Panier vide' });
    }
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Mettre à jour la quantité d'un article dans le panier
// Mettre à jour la quantité
exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Validation
    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }

    // 1. Trouver le panier avec les produits peuplés
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: "Panier non trouvé" });
    }

    // 2. Vérifier si le produit existe dans le panier
    const itemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Produit non trouvé dans le panier" });
    }

    // 3. Mettre à jour la quantité
    cart.items[itemIndex].quantity = quantity;

    // 4. Recalculer le total avec les produits peuplés
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // 5. Sauvegarder
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    console.error("Erreur updateCart:", err);
    res.status(500).json({ 
      status: 'error',
      message: "Erreur serveur",
      error: err.message
    });
  }
};

// Supprimer un article
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id; // Utilisez _id au lieu de id

    // Validation de l'ID produit
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'ID produit invalide'
      });
    }

    // 1. Trouver le panier avec les produits peuplés
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'Panier non trouvé' 
      });
    }

    // 2. Vérifier la présence du produit
    const itemIndex = cart.items.findIndex(item => 
      item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'Produit non trouvé dans le panier'
      });
    }

    // 3. Supprimer l'item
    cart.items.splice(itemIndex, 1);

    // 4. Recalculer le total
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // 5. Sauvegarder
    const savedCart = await cart.save();

    res.status(200).json({ 
      status: 'success',
      data: savedCart
    });

  } catch (err) {
    console.error("Erreur removeFromCart:", {
      message: err.message,
      stack: err.stack,
      productId: req.params.productId,
      userId: req.user?._id
    });

    res.status(500).json({ 
      status: 'error',
      message: 'Erreur lors de la suppression du produit',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // Vérifier l'ID utilisateur

    // Vérification de l'ID de l'utilisateur
    console.log("ID utilisateur connecté:", userId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    // Si le panier existe, vider le panier
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, message: 'Panier vidé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
