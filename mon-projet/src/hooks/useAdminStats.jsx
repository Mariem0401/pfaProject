import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminStats = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    stats: null,
    userActivity: null,
    bestSeller: null,
    productsSales: null // Ajout du state pour productsSales
  });

  const fetchStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const headers = { 
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      };
  
      // Appel parallèle pour les 3 endpoints
      const [dashboardRes, bestSellerRes, productSalesRes] = await Promise.all([
        axios.get('http://localhost:7777/stat/dashboard', { headers, timeout: 5000 }),
        axios.get('http://localhost:7777/admin/bestSeller', { headers }),
        axios.get('http://localhost:7777/admin/productSales', { headers }) // Nouvel appel
      ]);
      
      console.log('Réponse bestSeller:', bestSellerRes.data); // Vérifiez la structure
console.log('Réponse productSales:', productSalesRes.data); // Vérifiez cette structure 

      // Transformation des données
      const userActivity = dashboardRes.data.charts?.userActivity || {
        categories: [],
        series: []
      };
  
      // Mise à jour du state avec toutes les données
      setState({
        loading: false,
        error: null,
        stats: {
          users: dashboardRes.data.overview?.totalUsers || 0,
          products: dashboardRes.data.overview?.totalProducts || 0,
          orders: dashboardRes.data.overview?.totalOrders || 0,
          revenue: dashboardRes.data.overview?.monthlyRevenue || 0
        },
        userActivity,
          bestSeller: bestSellerRes.data.data.bestSellerProduct,
        productsSales: productSalesRes.data // { products: [], sales: [] }
      });
  
    } catch (error) {
      console.error('Erreur API:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("userData");
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 
              error.message || 
              "Erreur de connexion au serveur"
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { 
    ...state, 
    refetch: fetchStats 
  };
};

export default useAdminStats;