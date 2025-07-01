const Commande = require('../Model/commandeModel');
const Produit = require('../Model/productModel');
const User = require('../Model/userModel');


exports.getDashboardStats = async (req, res) => {
  try {
    // Dates importantes
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Statistiques globales
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Produit.countDocuments(),
      Commande.countDocuments()
    ]);

    // 2. Revenus
    const revenueStats = await Commande.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          todayRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfDay] }, "$totalPrice", 0]
            }
          },
          monthlyRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$totalPrice", 0]
            }
          }
        }
      }
    ]);

    // 3. Évolution hebdomadaire des revenus
    const weeklyRevenue = await Commande.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Produits les plus vendus
    const topProducts = await Commande.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "produits",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }
    ]);

    // 5. Activité des utilisateurs
    const userActivity = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6. Statut des commandes
    const orderStatus = await Commande.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Formatage de la réponse
    const response = {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        todayRevenue: revenueStats[0]?.todayRevenue || 0,
        monthlyRevenue: revenueStats[0]?.monthlyRevenue || 0
      },
      charts: {
        weeklyRevenue: {
          categories: weeklyRevenue.map(d => `Semaine ${d._id}`),
          series: weeklyRevenue.map(d => d.total)
        },
        userActivity: {
          categories: userActivity.map(d => new Date(2023, d._id - 1).toLocaleString('default', { month: 'short' })),
          series: userActivity.map(d => d.count)
        },
        orderStatus: orderStatus.map(item => ({
          name: item._id,
          value: item.count
        }))
      },
      topProducts: topProducts.map(item => ({
        name: item.productDetails.name,
        image: item.productDetails.images[0],
        totalSold: item.totalSold,
        revenue: item.totalRevenue
      }))
    };

    res.json(response);
  } catch (err) {
    console.error('Erreur dans getDashboardStats:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Version alternative pour les gros volumes de données
exports.getPaginatedStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const data = await Commande.aggregate([
      { $match: matchStage },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                avgOrderValue: { $avg: "$totalPrice" },
                count: { $sum: 1 }
              }
            }
          ],
          dailyTrend: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$totalPrice" },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    res.json({
      summary: data[0].summary[0] || {},
      dailyTrend: data[0].dailyTrend || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getSalesByCategory = async (req, res) => {
  try {
    const stats = await Commande.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "produits",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: "$products.quantity" },
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, newUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30*24*60*60*1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } })
    ]);

    res.json({ totalUsers, activeUsers, newUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getGeographicalStats = async (req, res) => {
  try {
    const stats = await Commande.aggregate([
      {
        $group: {
          _id: "$shippingAddress.city",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getSalesTrend = async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    
    let groupFormat;
    if (period === 'day') {
      groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (period === 'week') {
      groupFormat = { $dateToString: { format: "%Y-%U", date: "$createdAt" } };
    } else {
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }

    const stats = await Commande.aggregate([
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Produit.find({ stock: { $lte: 0 } }).limit(10);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};