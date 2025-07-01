const User = require("../Model/userModel");
const Annonce = require("../Model/annonceModel");
const Commande = require("../Model/commandeModel");
const Produit = require("../Model/productModel");
const Animal = require('../Model/animalModel')
const DemandeMigration = require('../Model/DemandeMigration');
// Controller/adminController.js
exports.getStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalAnnonces = await Annonce.countDocuments();
      const totalCommandes = await Commande.countDocuments();
  
      const result = await Commande.aggregate([
        {
          $group: {
            _id: null,
            totalRevenu: { $sum: "$totalPrice" },
          },
        },
      ]);
  
      const revenusMensuels = result[0]?.totalRevenu || 0;
  
      res.status(200).json({
        status: "success",
        data: {
          totalUsers,
          totalAnnonces,
          totalCommandes,
          revenusMensuels
        }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
  
  exports.getChartData = async (req, res) => {
    try {
      // Données pour les utilisateurs (par mois)
      const usersByMonth = await User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      // Données pour les annonces (par mois)
      const annoncesByMonth = await Annonce.aggregate([
        {
          $group: {
            _id: { $month: "$datePublication" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      // Données pour les commandes (par mois)
      const commandesByMonth = await Commande.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      res.status(200).json({
        status: "success",
        data: {
          users: usersByMonth.map(item => ({
            month: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
            count: item.count
          })),
          annonces: annoncesByMonth.map(item => ({
            month: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
            count: item.count
          })),
          commandes: commandesByMonth.map(item => ({
            month: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
            count: item.count
          }))
        }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
const getBestSellerProduct = async () => {
  try {
    const bestSellerAggregate = await Commande.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantiteVendue: { $sum: '$items.quantity' },
        }
      },
      { $sort: { totalQuantiteVendue: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: '$productInfo._id',
          name: '$productInfo.name',
          photo: {
            $cond: {
              if: { $ne: ['$productInfo.image', null] },
              then: '$productInfo.image', // Utilisez directement l'URL Cloudinary
              else: null
            }
          },
          unitsSold: '$totalQuantiteVendue',
          
         category :  '$productInfo.category',
        }
      }
    ]);

    return bestSellerAggregate.length > 0 ? bestSellerAggregate[0] : null;
  } catch (error) {
    console.error('Error in getBestSellerProduct:', error);
    throw error;
  }
};
  
  // --- Nouvelle fonction pour l'endpoint dédié au Best Seller ---
  exports.getOnlyBestSeller = async (req, res) => {
      try {
          // Appeler la fonction helper pour obtenir le best seller
          const bestSellerProduct = await getBestSellerProduct();
  
          // Renvoyer le best seller dans la réponse
          res.status(200).json({
              status: "success",
              data: {
                  bestSellerProduct: bestSellerProduct
              }
          });
  
      } catch (err) {
          console.error('Erreur dans getOnlyBestSeller:', err);
          res.status(500).json({
              status: "error",
              message: err.message || 'Erreur serveur interne lors de la récupération du produit best seller.'
          });
      }
  };

  exports.getProductsSales = async (req, res) => {
  try {
    const result = await Commande.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSales: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }, // Top 10 seulement
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sales: '$totalSales'
        }
      }
    ]);

    res.status(200).json({
      products: result.map(item => item.name),
      sales: result.map(item => item.sales)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDemandesMigration = async (req, res) => {
 try {
    const demandes = await DemandeMigration.find()
      .populate({
        path: "candidat",
        select: "name email profilePic" // ← Ajoute l'image du candidat
      })
      .populate({
        path: "annonce",
        populate: [
          {
            path: "animal",
            select: "nom age espece race genre description photo"
          },
          {
            path: "user", // ← Propriétaire initial
            model: "User",
            select: "name email profilePic" // ← Ajoute l'image du propriétaire
          }
        ]
      });

    res.status(200).json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.accepterMigration = async (req, res) => {
  try {
    const { demandeId } = req.params;

    // 1. Trouver la demande
    const demande = await DemandeMigration.findById(demandeId)
      .populate('annonce')
      .populate('candidat');

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // 2. Vérifier que la demande est en attente
    if (demande.status !== 'en_attente') {
      return res.status(400).json({ message: 'Demande déjà traitée' });
    }

    const annonce = demande.annonce;

    // 3. Vérifier que l’annonce a bien un animal
    if (!annonce.animal) {
      return res.status(400).json({ message: 'Aucun animal lié à cette annonce' });
    }

    // 4. Trouver l’animal
    const animal = await Animal.findById(annonce.animal);
    if (!animal) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // 5. Modifier la propriété de l’animal et ajouter l’historique
    animal.history.push({
      previousOwner: animal.proprietaire,
      adoptedAt: new Date()
    });
    animal.proprietaire = demande.candidat._id;

    await animal.save(); 

    // 6. Fermer l’annonce
    annonce.adoptionStatus = 'terminee';
    await annonce.save();
    annonce.Status = 'terminee';
    await annonce.save(); 
    // 7. Mettre à jour le status de la demande
    demande.status = 'acceptee';
    await demande.save();

    return res.status(200).json({
      message: 'Migration de propriété acceptée',
      data: {
        animalId: animal._id,
        nouveauProprietaire: demande.candidat
      }
    });

  } catch (error) {
    console.error('Erreur lors de l’acceptation de la migration :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
