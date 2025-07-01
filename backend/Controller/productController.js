const Product = require("../Model/productModel"); // Remplacez par le chemin vers votre modèle de produit
const APIFeatures = require("../utils/APIFeatures");
const path = require('path'); // Utilisez votre classe APIFeatures pour pagination, tri, etc.
const { deleteFromCloudinary } = require('../utils/cloudinary');
// ajout produit 
//const fs = require('fs');
//const cloudinary = require('cloudinary').v2;
exports.createProduct = async (req, res) => {
  try {
    // Vérifier si une image a été téléchargée
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path; // Chemin relatif pour le frontend
    } else if (req.body.image) {
      imageUrl = req.body.image; // Utiliser l'URL existante si fournie
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Une image est requise",
      });
    }

    // Créer le nouveau produit avec les données et l'image
    const newProduct = await Product.create({
      ...req.body,
      image: imageUrl,
      userId: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: { newProduct },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// retourner tous les produits 
// http://localhost:7777/products/
exports.getAllProducts = async (req, res) => {
    try {
      // Si une catégorie est spécifiée dans la requête, on filtre les produits par catégorie
      let filter = {};
      if (req.query.category) {
        filter.category = req.query.category;
      }
  
      const features = new APIFeatures(req.query, Product.find(filter))
      //.pagination()
        .filter()
        .sort();
  
      const products = await features.query;
      res.status(200).json({
        status: "success",
        result: products.length,
        data: { products },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail ",
        message: err,
      });
    }
  };
  
// http://localhost:7777/products/67585e1cd7355e32f39330e3
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Produit introuvable",
      });
    }
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getAllCategories = (req, res) => {
  try {
    const categories = Product.getAvailableCategories();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
  }
};
 
// Mettre à jour un produit   
// url postman : http://localhost:7777/products/67585e1cd7355e32f39330e3
const { cloudinary } = require('../utils/cloudinary'); // ou ton chemin correct


exports.getAvailableAnimals = async (req, res) => {
  try {
    const animals = Product.getAvailableAnimals();
    res.status(200).json({
      status: "success",
      data: animals
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Erreur serveur"
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Produit introuvable" });
    }

    // Authorization check
    if (product.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ status: "fail", message: "Action non autorisée" });
    }

    let imageUrl = product.image;

    // Handle image removal
    if (req.body.removeImage === 'true') {
      await deleteFromCloudinary(product.image);
      imageUrl = undefined;
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (product.image) {
        await deleteFromCloudinary(product.image);
      }
      imageUrl = req.file.path; // New Cloudinary URL
    }

    // Validate image requirement
    if (imageUrl === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "L'image du produit est obligatoire"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { product: updatedProduct }
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Erreur lors de la mise à jour"
    });
  }}

// 🔍 Fonction pour extraire le public_id d'une URL Cloudinary
function extractCloudinaryPublicId(url) {
  try {
    const parts = url.split('/');
    const fileWithExt = parts[parts.length - 1]; // ex: image_name.jpg
    const fileName = fileWithExt.split('.')[0];  // => image_name
    return `adoptiPet/${fileName}`;
  } catch {
    return null;
  }
}


// Supprimer un produit
// url : http://localhost:7777/products/67585e1cd7355e32f39330e6   je dois connecter en tant que admin tout d'abord 
// Dans votre controller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Aucun produit trouvé avec cet ID'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
    
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};