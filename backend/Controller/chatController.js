// controllers/chatController.js
const Chat = require('../Model/Chat'); // Vous devrez créer ce modèle

const envoyerMessage = async (req, res) => {
  try {
      const { expediteur, destinataire, contenu } = req.body;
      
      const nouveauMessage = await Chat.create({
          expediteur,
          destinataire,
          contenu,
          dateEnvoi: new Date()
      });

      res.status(201).json(nouveauMessage);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Fonction pour récupérer les messages
const recupererMessages = async (req, res) => {
  try {
      const { utilisateur1, utilisateur2 } = req.params;
      
      const messages = await Chat.find({
          $or: [
              { expediteur: utilisateur1, destinataire: utilisateur2 },
              { expediteur: utilisateur2, destinataire: utilisateur1 }
          ]
      }).sort('dateEnvoi');

      res.json(messages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Exportez bien toutes les fonctions
module.exports = {
  envoyerMessage,
  recupererMessages
};