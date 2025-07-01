const User = require("../Model/userModel");
const APIFeatures = require("../utils/APIFeatures");
const cloudinary = require("../utils/cloudinary").uploader;
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const features = new APIFeatures(req.query, User.find({ role: "user" }))
      //.pagination()
      .filter()
      .sort();
    const users = await features.query;
    res.status(200).json({
      status: "success",
      result: users.length,
      data:  users ,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Update User

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(202).json({
      status: "success",
      data: { updatedUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Delete User

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(203).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Récupérer les infos du profil connecté
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateMe = async (req, res) => {
  try {
    // Récupérer les champs à mettre à jour
    const { name, email, phone, gender, birthdate } = req.body;
    const updateData = { name, email, phone, gender, birthdate };

    // Récupérer l'utilisateur actuel
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({
        status: "fail",
        message: "Utilisateur non trouvé",
      });
    }

    // Gérer la mise à jour de l'image de profil
    if (req.file) {
      // Supprimer l'ancienne image Cloudinary si elle existe
      if (currentUser.profilePicPublicId) {
        await cloudinary.uploader.destroy(currentUser.profilePicPublicId);
      }

      // Ajouter la nouvelle image
      updateData.profilePic = req.file.path || req.file.url; // dépend comment tu reçois l'URL
      updateData.profilePicPublicId = req.file.public_id;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    console.error("Erreur mise à jour utilisateur :", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Erreur serveur lors de la mise à jour",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); // ne pas envoyer le mdp

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
