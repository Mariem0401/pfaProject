const mongoose = require("mongoose");

const detailsCommandeSchema = new mongoose.Schema({
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commande",
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  gouvernorat: {
    type: String,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

const DetailsCommande = mongoose.model("DetailsCommande", detailsCommandeSchema);
module.exports = DetailsCommande;
