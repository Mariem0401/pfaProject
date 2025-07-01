const mongoose = require('mongoose');

// models/Notification.js
const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    lien: String,
    raisonRejet: String,
    lue: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ['user', 'admin'], 
      required: true 
    },
    createdAt: { type: Date, default: Date.now }
  });

  
module.exports = mongoose.model('Notification', notificationSchema);