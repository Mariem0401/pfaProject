import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserLayout from "../../layouts/user/UserLayout";

const MesAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) {
      navigate('/connexion');
      return;
    }
    fetchAnnonces();
  }, [navigate]);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:7777/annonces/mes-annonces', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        setAnnonces(data);
      } else {
        throw new Error("Format de données inattendu");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || "Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (annonceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:7777/annonces/${annonceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnonces(prev => prev.filter(a => a._id !== annonceId));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert("Erreur lors de la suppression de l'annonce.");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'acceptee':
        return { text: 'Acceptée', style: 'bg-green-100 text-green-800' };
      case 'refusee':
        return { text: 'Refusée', style: 'bg-red-100 text-red-800' };
      default:
        return { text: 'En attente', style: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_500,h_350,c_fill,q_auto,f_auto/');
    }
    return url;
  };

  if (loading) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p>Chargement en cours...</p>
        </div>
      </div>
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6C63FF] mb-8">Mes annonces</h1>
          
          {!annonces || annonces.length === 0 ? (
            <p>Vous n'avez pas encore publié d'annonces.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {annonces.map(annonce => {
  const status = getStatusBadge(annonce.statut);
  const imageUrl = getOptimizedImageUrl(annonce.image);
  
  return (
    <div key={annonce._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={annonce.titre}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x350?text=Image+non+disponible';
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold line-clamp-1">{annonce.titre}</h2>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.style}`}>
            {status.text}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{annonce.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {annonce.type}
          </span>
          <span className="text-xs text-gray-500">
            {annonce.datePublication 
              ? new Date(annonce.datePublication).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : 'Date inconnue'}
          </span>
          
        </div>

        <div className="flex justify-end space-x-2 mt-2">
          {annonce.statut === 'en_attente' && (
            <button 
              onClick={() => navigate(`/modifier-annonce/${annonce._id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition"
            >
              Modifier
            </button>
          )}
          
          <button 
            onClick={() => handleDelete(annonce._id)}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
          >
            Supprimer
          </button>
    {/* Bouton pour voir les candidats uniquement si type === 'adoption' */}
          {annonce.type === 'adoption' && annonce.statut === 'acceptee' &&(
            <button
              onClick={() => navigate(`/candidats/${annonce._id}`)}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition"
            >
              Voir les candidats
            </button>
          )}
      
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

export default MesAnnonces;
