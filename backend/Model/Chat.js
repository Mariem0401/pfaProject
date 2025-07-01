// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contenu: { type: String, required: true },
    dateEnvoi: { type: Date, default: Date.now },
    lu: { type: Boolean, default: false }
});

module.exports = mongoose.model('Chat', chatSchema);