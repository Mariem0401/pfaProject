const AdoptionApplication = require('../Model/AdoptionApplication');
const Annonce = require('../Model/annonceModel');

const  DemandeMigration = require('../Model/DemandeMigration.js');

exports.applyToAdoption = async (req, res) => {
  try {
    
    const annonceId = req.params.annonceId;
    const userId = req.user._id;

    const annonce = await Annonce.findById(annonceId).populate("animal");

    if (!annonce) {
      return res.status(404).json({ message: "Annonce introuvable." });
    }

    if (annonce.type !== "adoption") {
      return res.status(400).json({ message: "Vous ne pouvez postuler qu'à une annonce d'adoption." });
    }

    if (annonce.user.toString() === userId.toString()) {
      return res.status(403).json({ message: "Vous ne pouvez pas postuler à votre propre annonce." });
    }

    // Vérifier si l'utilisateur a déjà postulé
    const existingApp = await AdoptionApplication.findOne({
      announcement: annonceId,
      applicant: userId,
    });

    if (existingApp) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette annonce." });
    }

    const application = await AdoptionApplication.create({
      announcement: annonce._id,
      animal: annonce.animal,
      applicant: userId,
    });

    res.status(201).json({ message: "Candidature envoyée avec succès.", application });

  } catch (err) {
    console.error("Erreur dans applyToAdoption:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// controllers/AdoptionApplicationController.js
exports.getCandidatsByAnnonce = async (req, res) => {
  try {
    const annonceId = req.params.annonceId;          // ← bonne clé
    const userId    = req.user.id;                   // depuis protectionMW

    // 1) Vérifier l’existence de l’annonce
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) return res.status(404).json({ message: "Annonce non trouvée" });

    // 2) Vérifier que l’utilisateur est bien le propriétaire
    if (annonce.user.toString() !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // 3) Chercher les candidatures liées à cette annonce
    const candidatures = await AdoptionApplication.find({ announcement: annonceId })
                           .populate('applicant', 'name email'); // données du candidat

    res.json({ data: candidatures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// controllers/adoptionController.js

// PATCH  /adoptions/candidats/:candidatId/accepter
// controllers/AdoptionApplicationController.js
exports.accepterCandidature = async (req, res) => {
  try {
    const { applicationId } = req.params;          // <-- même nom que la route
    const userId = req.user._id;

    /* 1. Récupère la candidature + l’annonce liée             */
    /*    - path  : 'announcement' (nom du champ)              */
    /*    - model : 'Annonce' (nom du modèle)                  */
    const candidature = await AdoptionApplication
        .findById(applicationId)
        .populate({ path: 'announcement', model: 'Annonce' });

    if (!candidature)
      return res.status(404).json({ message: 'Candidature non trouvée' });

    const annonce = candidature.announcement;
    if (!annonce)
      return res.status(404).json({ message: 'Annonce liée non trouvée' });

    /* 2. Vérifie le propriétaire de l’annonce */
    if (annonce.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Accès refusé' });

    /* 3. Passe la candidature à "selected" */
    candidature.status = 'selected';
    await candidature.save();

    /* 4. Crée / met à jour la demande de migration */
    const demande = await DemandeMigration.findOneAndUpdate(
      { annonce: annonce._id, candidat: candidature.applicant },
      { annonce: annonce._id, candidat: candidature.applicant },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: 'Candidature acceptée ; demande envoyée à l’admin.',
      data: { candidature, demande }
    });
  } catch (err) {
    console.error('Erreur accepterCandidature :', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};




exports.creerDemandeMigration = async (req, res) => {
  const { annonceId, candidatId } = req.params;
  const userId = req.user._id;

  try {
    const annonce = await Annonce.findById(annonceId);

    if (!annonce) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    if (annonce.proprietaire.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas le propriétaire de cette annonce." });
    }

    const demandeExistante = await DemandeMigration.findOne({
      annonce: annonceId,
      candidat: candidatId,
    });

    if (demandeExistante) {
      return res.status(400).json({ message: "Une demande de migration existe déjà pour ce candidat." });
    }

    const nouvelleDemande = new DemandeMigration({
      annonce: annonceId,
      candidat: candidatId,
    });

    await nouvelleDemande.save();

    res.status(201).json({
      message: "Demande de migration créée avec succès.",
      data: nouvelleDemande,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la demande de migration :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
