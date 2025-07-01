import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaEdit,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaPaw, // Icône pour l'animal
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const DetailAnnonceAdmin = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const token = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData")).token
          : localStorage.getItem("userToken");

        const response = await axios.get(`http://localhost:7777/annonces/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAnnonce(response.data.data || response.data);
        // Vérifier si l'annonce est dans les favoris
        setIsFavorite(false); // À remplacer par une vraie vérification
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ajouter/retirer des favoris via API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: annonce.titre,
        text: annonce.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier!');
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="text-center py-10">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 max-w-md mx-auto">
          <p>{error}</p>
        </div>
        <Link
          to="/admin/gestionAnnonce"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Retour aux annonces
        </Link>
      </div>
    </AdminLayout>
  );

  if (!annonce) return (
    <AdminLayout>
      <div className="text-center py-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 max-w-md mx-auto">
          <p>Annonce non trouvée</p>
        </div>
        <Link
          to="/annonces"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Retour aux annonces
        </Link>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/admin/gestionAnnonce"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6"
          >
            <FaArrowLeft className="mr-2" /> Retour aux annonces
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        >
          {/* Image principale */}
          <div className="relative h-64 sm:h-80 bg-gray-100">
            <img
              src={annonce.image || "/placeholder-product.jpg"}
              alt={annonce.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/default-animal.jpg';
                e.target.onerror = null; // Empêche la boucle d'erreur
              }}
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full shadow-md ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <FaHeart />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full shadow-md bg-white text-gray-700"
              >
                <FaShare />
              </button>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                annonce.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                annonce.statut === 'validé' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {annonce.statut}
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{annonce.titre}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  {annonce.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-6">
                <span className="flex items-center">
                  <FaUser className="mr-2 text-teal-500" />
                  <span className="font-medium">{annonce.user?.name || 'Anonyme'}</span>
                </span>
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-teal-500" />
                  {new Date(annonce.datePublication).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                {annonce.localisation && (
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-teal-500" />
                    {annonce.localisation}
                  </span>
                )}
                {annonce.animal && (
                  <span className="flex items-center">
                    <FaPaw className="mr-2 text-teal-500" />
                    <Link
                      to={`/user/animal/${annonce.animal._id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {annonce.animal.nom}
                    </Link>
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-lg text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{annonce.description}</p>
              </div>

              {/* Détails supplémentaires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {annonce.race && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Race</h3>
                    <p className="font-medium">{annonce.race}</p>
                  </div>
                )}
                {annonce.age && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Âge</h3>
                    <p className="font-medium">{annonce.age} ans</p>
                  </div>
                )}
                {annonce.sexe && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sexe</h3>
                    <p className="font-medium">{annonce.sexe}</p>
                  </div>
                )}
                {annonce.caracteristiques && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Caractéristiques</h3>
                    <p className="font-medium">{annonce.caracteristiques}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
      

              {showContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 bg-blue-50 p-4 rounded-lg"
                >
                  <h3 className="font-medium text-blue-800 mb-2">Coordonnées</h3>
                  <div className="space-y-2">
                    <p className="text-blue-700">{annonce.user?.email || 'Email non disponible'}</p>
                    {annonce.user?.phone && (
                      <p className="text-blue-700">{annonce.user.phone}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DetailAnnonceAdmin;