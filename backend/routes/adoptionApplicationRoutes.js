const express = require('express');
const router = express.Router();
const { applyToAdoption ,getCandidatsByAnnonce,accepterCandidature} = require('../Controller/AdoptionApplicationController');
const { protectionMW, howCanDo } = require("../Controller/authController");

// Route pour postuler
router.post('/:annonceId/apply', protectionMW, applyToAdoption);
router.get('/annonces/:annonceId/candidats', protectionMW,  getCandidatsByAnnonce);
router.patch('/candidats/:applicationId/accepter', protectionMW, accepterCandidature);

module.exports = router;
