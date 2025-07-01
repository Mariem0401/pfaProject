const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom du produit est obligatoire"],
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Le prix du produit est obligatoire"],
  },
  category: {
    type: String,
    required: [true, "La catégorie du produit est obligatoire"],
    enum: [
      "Nourriture",
      "Jouets",
      "Hygiène",
      "Accessoires",
      "Litière",
      "Vêtements",
      "Santé",
      "Transport",
      "Autre",
    ],
    default: "Autre",
  },
  // Nouveau champ ajouté pour les animaux
  animal: {
    type: String,
    required: [true, "Le type d'animal est obligatoire"],
    enum: [
      "Chien",
      "Chat",
      "Oiseaux",
      "Poissons",
      "Rongeurs",
      "Reptiles",
      "Autre"
    ],
    default: "Autre",
  },
  image: {
    type: String,
    required: [true, "L'image du produit est obligatoire"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Méthodes statiques conservées
productSchema.statics.getAvailableCategories = function () {
  return this.schema.path("category").enumValues;
};

// Nouvelle méthode pour récupérer les animaux disponibles
productSchema.statics.getAvailableAnimals = function () {
  return this.schema.path("animal").enumValues;
};

module.exports = mongoose.model("Product", productSchema);