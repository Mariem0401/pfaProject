const mongoose = require('mongoose');
const Animal = require("../Model/animalModel");
const { cloudinary, upload, deleteFromCloudinary } = require("../utils/cloudinary");

// Assuming 'upload' is configured correctly for single file upload with field name 'photo'
exports.uploadAnimalImage = upload.single('photo');

// --- CREATE Animal ---
// This controller correctly assigns the logged-in user as the owner ('proprietaire')
exports.createAnimal = async (req, res) => {
    try {
        // Basic validation
        if (!req.body.nom || !req.body.espece) {
            // If a file was uploaded before the validation failed, delete it from Cloudinary
            if (req.file?.path) {
                await deleteFromCloudinary(req.file.path).catch(console.error);
            }
            return res.status(400).json({
                status: "fail",
                message: "Le nom et l'espèce sont obligatoires."
            });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path; // Cloudinary path from upload middleware
        }

        const animalData = {
            nom: req.body.nom,
            age: req.body.age,
            espece: req.body.espece,
            race: req.body.race,
            genre: req.body.genre,
            description: req.body.description,
            photo: imageUrl,
            proprietaire: req.user.id // Assign the logged-in user's ID as the owner
        };

        const animal = await Animal.create(animalData);

        res.status(201).json({
            status: "success",
            data: animal
        });
    } catch (err) {
        // If an error occurs after file upload but before saving to DB, delete the file
        if (req.file?.path) {
            await deleteFromCloudinary(req.file.path).catch(console.error);
        }
        console.error("Erreur lors de la création de l'animal:", err); // Log the full error
        res.status(500).json({
            status: "error",
            message: err.message || 'Erreur serveur interne lors de la création de l\'animal.'
        });
    }
};


exports.getMesAnimaux = async (req, res) => {
    try {
       
        const animaux = await Animal.find({ proprietaire: req.user.id });

        res.status(200).json({
            status: "success",
            results: animaux.length,
            data: animaux,
        });
    } catch (err) {
        console.error("Erreur lors de la récupération de mes animaux:", err);
        res.status(500).json({
            status: "error", 
            message: err.message || 'Erreur serveur interne lors de la récupération de vos animaux.'
        });
    }
};


exports.getAnimalById = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "fail",
                message: "ID d'animal invalide."
            });
        }

       
        const animal = await Animal.findById(req.params.id); // Using findById is cleaner here

        if (!animal) {
            // If animal is not found with this ID
            return res.status(404).json({
                status: "fail",
                message: "Animal non trouvé."
            });
        }

     

        res.status(200).json({
            status: "success",
            data: animal
        });
    } catch (err) {
        console.error("Erreur lors de la récupération du profil animal:", err);
        res.status(500).json({
            status: "error",
            message: err.message || 'Erreur serveur interne lors de la récupération du profil animal.'
        });
    }
};


exports.updateAnimal = async (req, res) => {
    let uploadedFilePath = null; 
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             if (req.file?.path) { await deleteFromCloudinary(req.file.path).catch(console.error); } // Clean up if file was uploaded
            return res.status(400).json({
                status: "fail",
                message: "ID d'animal invalide."
            });
        }

        // Find the animal by ID first
        const animal = await Animal.findById(req.params.id);

        // Check if animal exists and if the logged-in user is the owner
        if (!animal) {
             if (req.file?.path) { await deleteFromCloudinary(req.file.path).catch(console.error); } // Clean up if file was uploaded
            return res.status(404).json({
                status: "fail",
                message: "Animal non trouvé."
            });
        }

        // Explicit Ownership Check
        // Use toString() to compare ObjectId with string ID from req.user
        if (animal.proprietaire.toString() !== req.user.id.toString()) {
             if (req.file?.path) { await deleteFromCloudinary(req.file.path).catch(console.error); } // Clean up if file was uploaded
            return res.status(403).json({ // 403 Forbidden: Resource found, but user not authorized
                status: "fail",
                message: "Vous n'êtes pas autorisé à modifier ce profil animal."
            });
        }

        // If a new file was uploaded, handle it (delete old one, update path)
        if (req.file) {
            uploadedFilePath = req.file.path; // Store path in case of later errors
            // Delete old photo from Cloudinary if it exists
            if (animal.photo) {
                await deleteFromCloudinary(animal.photo).catch(console.error);
            }
            animal.photo = uploadedFilePath; // Update photo path
        }

        // Update other fields from req.body (only update if provided)
        animal.nom = req.body.nom !== undefined ? req.body.nom : animal.nom;
        animal.age = req.body.age !== undefined ? req.body.age : animal.age;
        animal.espece = req.body.espece !== undefined ? req.body.espece : animal.espece;
        animal.race = req.body.race !== undefined ? req.body.race : animal.race;
        animal.genre = req.body.genre !== undefined ? req.body.genre : animal.genre;
        animal.description = req.body.description !== undefined ? req.body.description : animal.description;

        // Save the updated animal document
        const updatedAnimal = await animal.save();

        res.status(200).json({
            status: "success",
            data: updatedAnimal
        });
    } catch (err) {
         // If an error occurred after uploading a file but before saving/sending response
        if (uploadedFilePath) {
            await deleteFromCloudinary(uploadedFilePath).catch(console.error);
        }
        console.error("Erreur lors de la mise à jour de l'animal:", err);
        res.status(500).json({
            status: "error",
            message: err.message || 'Erreur serveur interne lors de la mise à jour du profil animal.'
        });
    }
};

// --- DELETE Animal ---
// >>> ADJUSTMENT HERE <<<
// Add an explicit ownership check AFTER finding the animal
exports.deleteAnimal = async (req, res) => {
    try {
        // Log for debugging (Keep this if helpful during development)
        // console.log('Tentative de suppression - ID:', req.params.id, 'Utilisateur:', req.user);

        // Check authentication (protectionMW already does this, but good as a fallback)
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: "fail",
                message: "Authentification requise."
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "fail",
                message: "ID d'animal invalide."
            });
        }

        // Find the animal by ID first
        const animal = await Animal.findById(req.params.id);

        // Check if animal exists and if the logged-in user is the owner
        if (!animal) {
            return res.status(404).json({
                status: "fail",
                message: "Animal non trouvé."
            });
        }

    
        if (animal.proprietaire.toString() !== req.user.id.toString()) {
            return res.status(403).json({ 
                status: "fail",
                message: "Vous n'êtes pas autorisé à supprimer ce profil animal."
            });
        }

      
        const deletedAnimal = await Animal.findByIdAndDelete(req.params.id);


        if (!deletedAnimal) {
             
            return res.status(404).json({ 
                status: "fail",
                message: "Animal introuvable pour la suppression."
            });
        }

        // Delete associated image from Cloudinary
        if (deletedAnimal.photo) {
            try {
                await deleteFromCloudinary(deletedAnimal.photo);
            } catch (cloudinaryErr) {
                console.error('Erreur lors de la suppression de l\'image Cloudinary:', cloudinaryErr);
              
            }
        }

        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        console.error('Erreur dans deleteAnimal:', err.stack); // Log full stack trace for server errors
        res.status(500).json({
            status: "error",
            message: err.message || 'Erreur serveur interne lors de la suppression de l\'animal.'
        });
    }
};