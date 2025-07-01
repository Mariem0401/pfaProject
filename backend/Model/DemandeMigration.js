const mongoose = require("mongoose");

const demandeMigrationSchema = new mongoose.Schema({
  annonce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Annonce",
    required: true,
  },
  candidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["en_attente", "acceptee", "refusee","terminee"],
    default: "en_attente",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Migration = mongoose.model("DemandeMigration", demandeMigrationSchema);
module.exports = Migration;
