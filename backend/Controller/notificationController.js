const Notification = require('../Model/notification');

const Annonce = require('../Model/annonceModel'); // Supposons que ce modèle existe

// Marquer une notification comme lue
exports.marquerCommeLue = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { lue: true });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une notification
exports.creerNotification = async (userId, message, lien = null, raisonRejet = null) => {
    return await Notification.create({
        user: userId,
        message,
        lien,
        raisonRejet
    });
};

// Vérifier les annonces non traitées
exports.verifierAnnoncesNonTraitees = async () => {
    try {
        const annoncesEnAttente = await Annonce.find({ statut: 'en_attente' });
        const delaiLimite = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h

        for (const annonce of annoncesEnAttente) {
            if (annonce.createdAt < delaiLimite) {
                await this.creerNotification(
                    annonce.auteur,
                    `L'annonce "${annonce.titre}" n'a pas encore été traitée.`,
                    `/annonces/${annonce._id}`
                );
                // Ici vous pourriez aussi envoyer une notification à l'admin
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des annonces:", error);
    }
};

exports.getUserNotifications = async (req, res) => {
    const notifications = await Notification.find({ 
      user: req.user.id,
      type: 'user'
    }).sort('-createdAt');
    res.json(notifications);
  };
  
  // Pour les administrateurs
  exports.getAdminNotifications = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send('Accès refusé');
    
    const notifications = await Notification.find({
      type: 'admin'
    }).sort('-createdAt');
    res.json(notifications);
  };
  
  // Création de notification (adaptée)
  exports.creerNotification = async (userId, message, type, lien = null, raisonRejet = null) => {
    return await Notification.create({
      user: userId,
      message,
      type,
      lien,
      raisonRejet
    });
  };