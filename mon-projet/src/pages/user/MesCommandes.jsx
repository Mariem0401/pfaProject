import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserLayout from "../../layouts/user/UserLayout";
import { FiShoppingBag, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiChevronRight } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandes = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

      if (!token) {
        navigate('/connexion');
        return;
      }

      try {
        const response = await axios.get('http://localhost:7777/commandes/mes-commandes', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data?.commandes || response.data;
        if (Array.isArray(data)) {
          // Trier les commandes par date (les plus récentes en premier)
          const sortedCommandes = data.sort((a, b) => 
            new Date(b.datePublication || b.createdAt) - new Date(a.datePublication || a.createdAt)
          );
          setCommandes(sortedCommandes);
        } else {
          throw new Error("Format de données inattendu");
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.response?.data?.message || "Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'en attente':
        return { 
          text: 'En attente', 
          style: 'bg-yellow-100 text-yellow-800',
          icon: <FiClock className="mr-1" />
        };
      case 'en cours':
        return { 
          text: 'En cours', 
          style: 'bg-blue-100 text-blue-800',
          icon: <FiTruck className="mr-1" />
        };
      case 'livrée':
        return { 
          text: 'Livrée', 
          style: 'bg-green-100 text-green-800',
          icon: <FiCheckCircle className="mr-1" />
        };
      case 'annulée':
        return { 
          text: 'Annulée', 
          style: 'bg-red-100 text-red-800',
          icon: <FiXCircle className="mr-1" />
        };
      default:
        return { 
          text: 'Inconnu', 
          style: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenId = (id) => {
    return id ? id.substring(0, 8) : 'N/A';
  };

  if (loading) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6C63FF] mb-8 flex items-center">
            <FiShoppingBag className="mr-2" /> Mes commandes
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <Skeleton height={24} width="60%" className="mb-4" />
                  <Skeleton height={20} width="40%" className="mb-6" />
                  <div className="flex justify-between">
                    <Skeleton height={16} width="50%" />
                    <Skeleton height={16} width="20%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6C63FF] mb-8 flex items-center">
            <FiShoppingBag className="mr-2" /> Mes commandes
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6C63FF] mb-8 flex items-center">
            <FiShoppingBag className="mr-2" /> Mes commandes
          </h1>
          
          {!commandes || commandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FiShoppingBag className="text-4xl text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune commande trouvée</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande.</p>
              <button 
                onClick={() => navigate('/boutique')}
                className="px-6 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5a52d6] transition-colors"
              >
                Explorer la boutique
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {commandes.map(commande => {
                const status = getStatusBadge(commande.statut);
                const productsCount = commande.products?.length || 0;
                
                return (
                  <div 
                    key={commande._id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-[#6C63FF] transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Commande #{shortenId(commande._id)}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(commande.datePublication || commande.createdAt)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${status.style}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-600">
                            {productsCount} {productsCount > 1 ? 'articles' : 'article'}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-[#6C63FF]">
                          {commande.totalPrice?.toFixed(2) || '0.00'} TND
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <button 
                         onClick={() => navigate(`/mes-commandes/${commande._id}`)}
                          className="flex items-center text-[#6C63FF] hover:text-[#5a52d6] font-medium text-sm"
                        >
                          Voir les détails de la commande
                          <FiChevronRight className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default MesCommandes;