const Commande = require('../Model/commandeModel');
const Product = require('../Model/productModel'); // Assure-toi d'importer ton modèle Product
const DetailsCommande = require("../Model/DetailsCommandeModel");


exports.createCommande = async (req, res) => {
  try {
    const { items, totalPrice, adresse, gouvernorat, ville, telephone, email } = req.body;

    // Validate input
    if (!items || !totalPrice || !adresse || !gouvernorat || !ville || !telephone || !email) {
      return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    // Validate stock and calculate total price
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Produit ${item.product} introuvable` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Produit ${product.name} n'est pas disponible en quantité suffisante`
        });
      }
      calculatedTotal += product.price * item.quantity;
    }

    // Validate totalPrice
    if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
      return res.status(400).json({ success: false, message: "TotalPrice incorrect" });
    }

    // Create Commande without detailsCommande initially
    const commande = new Commande({
      user: req.user.id,
      items,
      totalPrice
    });
    const savedCommande = await commande.save();

    // Create DetailsCommande with commande reference
    const detailsCommande = new DetailsCommande({
      commande: savedCommande._id,
      adresse,
      gouvernorat,
      ville,
      telephone,
      email
    });
    const savedDetails = await detailsCommande.save();

    // Update Commande with detailsCommande reference
    savedCommande.detailsCommande = savedDetails._id;
    await savedCommande.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Populate details for response
    const populatedCommande = await Commande.findById(savedCommande._id)
      .populate("items.product")
      .populate("detailsCommande");

    res.status(201).json({ success: true, commande: populatedCommande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getCommandesUtilisateur = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (req.user.role === 'admin') {
      // Si l'utilisateur est admin, retourner toutes les commandes
      const commandes = await Commande.find()
        .populate("items.product")
        .populate("detailsCommande")
        .sort({ createdAt: -1 });

      if (!commandes.length) {
        return res.status(404).json({ success: false, message: "Aucune commande trouvée" });
      }

      return res.status(200).json({ success: true, commandes });
    }

    // Si l'utilisateur n'est pas un admin, retourner uniquement ses propres commandes
    const commandes = await Commande.find({ user: req.user.id })
      .populate("items.product")
      .populate("detailsCommande")
      .sort({ createdAt: -1 });

    if (!commandes.length) {
      return res.status(404).json({ success: false, message: "Vous n'avez pas encore passé de commande" });
    }

    return res.status(200).json({ success: true, commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getToutesCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().populate("user").populate("items.product");
    res.status(200).json({ success: true, commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCommandeStatus = async (req, res) => {
  try {
    const commandeId = req.params.id;
    const { statut } = req.body;

    // Vérifier si l'utilisateur est un administrateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Seul un administrateur peut modifier le statut des commandes' });
    }

    // Valider le statut
    const validStatuts = ['en attente', 'en cours', 'livrée', 'annulée'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ success: false, message: 'Statut invalide' });
    }

    // Trouver la commande
    const commande = await Commande.findById(commandeId);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    // Mettre à jour le statut
    commande.statut = statut;
    await commande.save();

    res.status(200).json({ success: true, message: 'Statut de la commande mis à jour', commande });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande :', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCommandesUtilisateurConnecte = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est authentifié (le middleware `protectionMW` devrait s'en occuper)
    const userId = req.user.id;  // L'ID de l'utilisateur connecté est dans `req.user.id` grâce au middleware de protection

    // Récupérer les commandes de l'utilisateur connecté
    const commandes = await Commande.find({ user: userId })
      .populate("items.product")  // Peupler les informations sur les produits
      .populate("detailsCommande") // Peupler les détails de la commande
      .sort({ createdAt: -1 });   // Trier les commandes par date, de la plus récente à la plus ancienne

    // Vérifier si l'utilisateur n'a pas encore passé de commande
    if (!commandes.length) {
      return res.status(404).json({ success: false, message: "Vous n'avez pas encore passé de commande" });
    }

    // Retourner les commandes de l'utilisateur
    return res.status(200).json({ success: true, commandes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getCommandeById = async (req, res) => {
  try {
    const commandeId = req.params.id;

    // Trouver la commande et peupler les informations nécessaires
    const commande = await Commande.findById(commandeId)
      .populate("user", "name email") // Peupler seulement le nom et l'email de l'utilisateur
      .populate("items.product")
      .populate("detailsCommande");

    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    // Vérifier si l'utilisateur a le droit de voir cette commande
    // (soit il est admin, soit c'est sa propre commande)
    if (req.user.role !== 'admin' && commande.user._id.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: "Non autorisé - Vous ne pouvez voir que vos propres commandes" 
      });
    }

    res.status(200).json({ success: true, commande });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Erreur lors de la récupération de la commande" 
    });
  }
};