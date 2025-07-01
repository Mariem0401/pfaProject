// models/AdoptionApplication.js
const mongoose = require('mongoose');
const AdoptionApplicationSchema = new mongoose.Schema({
  announcement: { type: mongoose.Schema.Types.ObjectId, ref: 'Announcement', required: true },
  animal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Animal',       required: true },
  applicant:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
  status:       { type: String, enum: ['pending', 'selected', 'rejected', 'approved'], default: 'pending' },
  createdAt:    { type: Date, default: Date.now }
});
module.exports = mongoose.model('AdoptionApplication', AdoptionApplicationSchema);
