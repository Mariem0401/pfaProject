const Annonce = require("../Model/annonceModel");
const mongoose = require('mongoose');
const Animal = require('../Model/animalModel');

exports.creerAnnonce = async (req, res) => {
  try {
    // Vérifiez que le fichier a bien été uploadé
    if (!req.file) {
      return res.status(400).json({
        message: "L'image est obligatoire",
        error: "Aucun fichier image reçu"
      });
    }

    const { titre, description, type, animalId } = req.body;
    const imageUrl = req.file.path; // ou req.file.url selon votre config

    const annonce = new Annonce({
      titre,
      description,
      type,
      image: imageUrl,
      user: req.user.id,
      statut: "en_attente"
    });

    // Si le type d'annonce est 'garde_temporaire' ou 'conseil_sante',
    // et que l'animalId est fourni, l'associer à l'annonce
    if (["garde_temporaire", "conseil_sante","adoption"].includes(type)) {
      if (!animalId) {
        return res.status(400).json({
          message: "L'animalId est obligatoire pour les annonces de type garde temporaire ou conseil sante."
        });
      }
      if (!mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({
          message: "L'animalId fourni n'est pas un ID MongoDB valide."
        });
      }
      // Vérifiez si l'animal appartient à l'utilisateur connecté (sécurité)
      const Animal = require('../Model/animalModel');
      const animal = await Animal.findById(animalId);
      if (!animal || animal.proprietaire.toString() !== req.user.id) {
        return res.status(400).json({
          message: "L'animal sélectionné n'appartient pas à cet utilisateur."
        });
      }
      annonce.animal = animalId;
    }

    const savedAnnonce = await annonce.save();
    res.status(201).json(savedAnnonce);

  } catch (err) {
    console.error("Error creating announcement:", err);
    res.status(500).json({
      message: "Erreur lors de la création de l'annonce",
      error: err.message
    });
  }
};

// controllers/annonceController.js
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find({ statut: "acceptee" })
      .populate("user", "name email")
      .populate("animal"); // Populate the animal information
    res.status(200).json({
      status: "success ",
      results: annonces.length,
      data: annonces,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllAnnoncesAdmin = async (req, res) => {
  try {
    const annonces = await Annonce.find()
      .populate('user', 'name email')
      .populate('animal') // Populate the animal information
      .exec();
    res.status(200).json({
      status: "success ",
      results: annonces.length,
      data: annonces,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// Admin : Accepter ou refuser une annonce
exports.updateStatutAnnonce = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    // Valider que le statut est correct
    if (!["acceptee", "refusee"].includes(statut)) {
      return res.status(400).json({
        status: "fail",
        message: "Le statut doit être 'acceptee' ou 'refusee'.",
      });
    }

    const annonce = await Annonce.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    );

    if (!annonce) {
      return res.status(404).json({
        status: "fail",
        message: "Aucune annonce trouvée avec cet ID.",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Annonce ${statut === "acceptee" ? "acceptée" : "refusée"} avec succès.`,
      data: annonce,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getAnnonceById = async (req, res) => {
  try {
    // 1. Vérifiez que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID invalide'
      });
    }

    // 2. Recherchez l'annonce
    const annonce = await Annonce.findById(req.params.id)
      .populate('user', 'name email')
      .populate('animal'); // Populate the animal information

    if (!annonce) {
      return res.status(404).json({
        status: 'fail',
        message: 'Annonce non trouvée'
      });
    }

    // 3. Réponse
    res.status(200).json({
      status: 'success',
      data: annonce
    });

  } catch (err) {
    console.error("Erreur dans getAnnonceById:", err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
// Admin : Récupérer les annonces par statut et/ou type
exports.getAnnoncesByStatutEtType = async (req, res) => {
  try {
    const { statut, type } = req.query;

    const filter = {};
    if (statut) {
      filter.statut = statut;
    }
    if (type) {
      filter.type = type;
    }

    const annonces = await Annonce.find(filter).populate('animal'); // Populate animal here as well

    res.status(200).json({
      status: "success",
      results: annonces.length,
      data: annonces,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMesAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('animal'); // Populate the animal information

    res.status(200).json({
      status: "success",
      results: annonces.length,
      data: annonces
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
exports.deleteAnnonce = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifie si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID invalide'
      });
    }

    // Recherche l'annonce
    const annonce = await Annonce.findById(id);

    if (!annonce) {
      return res.status(404).json({
        status: 'fail',
        message: 'Annonce non trouvée'
      });
    }

    // Vérifie si l'utilisateur connecté est le propriétaire OU un admin
    if (annonce.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: "Vous n'avez pas l'autorisation de supprimer cette annonce."
      });
    }

    // Supprime l'annonce
    await annonce.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Annonce supprimée avec succès.'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
exports.updateAnnonce = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifie si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID invalide'
      });
    }

    const { titre, description, type, animalId } = req.body;

    const updateData = {
      titre,
      description,
      type
    };

    // Si une nouvelle image est fournie (via req.file)
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Si l'animalId est fourni et le type le nécessite
    if (["garde_temporaire", "conseil_sante", "adoption"].includes(type)) {
      if (!animalId) {
        return res.status(400).json({
          message: "L'animalId est obligatoire pour ce type d'annonce."
        });
      }
      if (!mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({
          message: "L'animalId fourni n'est pas valide."
        });
      }

      const animal = await Animal.findById(animalId);
      if (!animal || animal.proprietaire.toString() !== req.user.id) {
        return res.status(400).json({
          message: "L'animal sélectionné n'appartient pas à cet utilisateur."
        });
      }

      updateData.animal = animalId;
    } else {
      // Si pas concerné, on retire l'animal lié
      updateData.animal = undefined;
    }

    const annonce = await Annonce.findById(id);

    if (!annonce) {
      return res.status(404).json({
        status: 'fail',
        message: 'Annonce non trouvée'
      });
    }

    // Vérifie si l'utilisateur connecté est le propriétaire OU un admin
    if (annonce.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: "Vous n'avez pas l'autorisation de modifier cette annonce."
      });
    }

    // Appliquer les mises à jour
    Object.assign(annonce, updateData);

    const updatedAnnonce = await annonce.save();

    res.status(200).json({
      status: 'success',
      message: 'Annonce mise à jour avec succès.',
      data: updatedAnnonce
    });

  } catch (err) {
    console.error("Erreur dans updateAnnonce:", err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
