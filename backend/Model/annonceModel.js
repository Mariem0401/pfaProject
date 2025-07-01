// models/annonceModel.js
const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: [
      "adoption",
      "garde_temporaire",
      "animal_perdu",
      "animal_trouve",
      "conseil_sante",
      "conseil_education",
      "autre"
    ],
    required: true,
  },
  statut: {
    type: String,
    enum: ["en_attente", "acceptee", "refusee","terminee"],
    default: "en_attente",
  },
  datePublication: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: [true, "L'image du produit est obligatoire"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  animal: { // ADD THIS FIELD TO YOUR SCHEMA
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal", // Assuming your Animal model is named 'Animal'
    default: null, // Animal is not required for all annonce types
  },
  selectedApplicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Aucun candidat sélectionné au départ
  },
  adoptionStatus: {
    type: String,
    enum: ["open", "waiting_admin", "closed","terminee"],
    default: "open", // uniquement pour les annonces d’adoption
  }
});

const Annonce = mongoose.model("Annonce", annonceSchema);
module.exports = Annonce;