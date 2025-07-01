import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UserLayout from "../../layouts/user/UserLayout";
import { 
  FiShoppingBag, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiChevronLeft, 
  FiMapPin, 
  FiPhone, 
  FiCreditCard 
} from 'react-icons/fi';

const DetailsCommande = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandeDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || 
                      localStorage.getItem("userToken");

        if (!token) {
          navigate('/connexion');
          return;
        }

        const response = await axios.get(`http://localhost:7777/commandes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          setCommande(response.data.commande || response.data);
        } else {
          throw new Error("Données de commande invalides");
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.response?.data?.message || 
                error.message || 
                "Erreur lors du chargement des détails de la commande");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommandeDetails();
    } else {
      setError("ID de commande non spécifié");
      setLoading(false);
    }
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    if (!status || typeof status !== 'string') {
      return { 
        text: 'Statut inconnu', 
        style: 'bg-gray-100 text-gray-800',
        icon: null
      };
    }

    const cleanedStatus = status.trim().toLowerCase();

    switch(cleanedStatus) {
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
          text: status,
          style: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 text-[#6C63FF] hover:text-[#5a52d6] text-sm font-medium"
            >
              <FiChevronLeft className="inline mr-1" /> Retour
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  if (!commande) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600">Commande introuvable</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 mx-auto flex items-center text-[#6C63FF] hover:text-[#5a52d6] text-sm font-medium"
          >
            <FiChevronLeft className="mr-1" /> Retour à mes commandes
          </button>
        </div>
      </div>
    </UserLayout>
  );

  const status = getStatusBadge(commande.statut);
  const details = commande.detailsCommande || {};

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#6C63FF] hover:text-[#5a52d6] mb-6"
          >
            <FiChevronLeft className="mr-1" /> Retour à mes commandes
          </button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Commande #{commande._id.substring(0, 8)}</h1>
              <p className="text-gray-600 mt-2">{formatDate(commande.createdAt)}</p>
            </div>
            <span className={`inline-flex items-center text-sm font-medium px-4 py-2 rounded-full ${status.style}`}>
              {status.icon}
              {status.text}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Articles</h2>
                <div className="space-y-6">
                  {commande.items?.map((item, index) => (
                    <div key={index} className="flex border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.image && (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-800">{item.product?.name || 'Produit inconnu'}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.product?.description?.substring(0, 60) || 'Aucune description disponible'}...
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-gray-800 font-medium">
                            {(item.product?.price || 0).toFixed(2)} TND
                          </span>
                          <span className="text-gray-600">Quantité: {item.quantity || 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Résumé de la commande</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="text-gray-800">
                      {(commande.totalPrice - (commande.shippingFee || 0)).toFixed(2)} TND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="text-gray-800">
                      {(commande.shippingFee || 0).toFixed(2)} TND
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-[#6C63FF]">
                      {(commande.totalPrice || 0).toFixed(2)} TND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiMapPin className="mr-2 text-[#6C63FF]" /> Adresse de livraison
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>{details.adresse || 'Non spécifiée'}</p>
                  <p>{details.ville || ''}, {details.gouvernorat || ''}</p>
                  <p>Tunisie</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiPhone className="mr-2 text-[#6C63FF]" /> Contact
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>{commande.user?.name || 'Non spécifié'}</p>
                  <p>{details.email || 'Non spécifié'}</p>
                  <p>{details.telephone || 'Non spécifié'}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiCreditCard className="mr-2 text-[#6C63FF]" /> Paiement
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>Méthode: {commande.paymentMethod || 'Non spécifiée'}</p>
                  <p>Statut: {commande.paymentStatus === 'paid' ? 'Payé' : 'Non payé'}</p>
                  <p>Date: {commande.paymentDate ? formatDate(commande.paymentDate) : 'Non spécifiée'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DetailsCommande;