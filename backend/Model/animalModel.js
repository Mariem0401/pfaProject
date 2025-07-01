const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Le type de dossier médical est requis'],
    enum: ['checkup', 'vaccination', 'surgery', 'treatment', 'other'],
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  veterinarian: {
    type: String,
    required: [true, 'Le nom du vétérinaire est requis'],
  },
  notes: String,
  nextVisit: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const animalSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
  },
  age: Number,
  espece: {
    type: String,
    required: [true, 'L\'espèce est requise'],
  },
  race: String,
  genre: String,
  description: String,
  photo: String,
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis'],
  },
  healthRecords: [healthRecordSchema],
  lastCheckup: Date,
  nextCheckup: Date,

history: [{
  previousOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adoptedAt: Date
}]

});

module.exports = mongoose.model('Animal', animalSchema);