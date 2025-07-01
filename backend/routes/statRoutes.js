const express = require('express');
const router = express.Router();
const statsController = require('../Controller/statController');

const{ getDashboardStats ,getPaginatedStats,
       getSalesByCategory,getUserStats,
       getGeographicalStats,getSalesTrend ,
       getOutOfStockProducts} = require("../Controller/statController");
// Route pour les statistiques du tableau de bord
router.get('/dashboard',getDashboardStats);

// Route alternative pour les gros volumes de données avec pagination/filtrage
router.get('/paginated', getPaginatedStats);

// Ajoutez ces nouvelles routes pour des statistiques complémentaires:

// Statistiques des ventes par catégorie
router.get('/sales-by-category', getSalesByCategory);

// Statistiques des utilisateurs (nouveaux, actifs, etc.)
router.get('/user-stat', getUserStats);

// Statistiques géographiques (ventes par région)
router.get('/geo-stats', getGeographicalStats);

// Tendance des ventes sur une période (pour les graphiques)
router.get('/sales-trend', getSalesTrend);

// Produits en rupture de stock
router.get('/out-of-stock', getOutOfStockProducts);

module.exports = router;