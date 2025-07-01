const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  detailsCommande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DetailsCommande",
    required: false // Changed to optional
  },
  statut: {
    type: String,
    enum: ["en attente", "en cours", "livrée", "annulée"],
    default: "en attente",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;