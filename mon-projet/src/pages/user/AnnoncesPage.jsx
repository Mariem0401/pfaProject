import React, { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../../layouts/user/UserLayout"; // Assuming this provides general layout
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AnnoncesPage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [annonceTypes, setAnnonceTypes] = useState([]);
  const [loading, setLoading] = useState({
    annonces: true,
    types: true
  });
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    search: ""
  });
  const [showWelcome, setShowWelcome] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken") || '';

      try {
        setTimeout(() => {
          setShowWelcome(false);
        }, 1500);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const typesResponse = await axios.get("http://localhost:7777/annonces/types", { headers });
        setAnnonceTypes(typesResponse.data || []);
        setLoading(prev => ({ ...prev, types: false }));

        const annoncesResponse = await axios.get("http://localhost:7777/annonces/AllAnnonce", { headers });
        const data = annoncesResponse.data.data || annoncesResponse.data.annonces || annoncesResponse.data;
        setAnnonces(Array.isArray(data) ? data : []);
        setLoading(prev => ({ ...prev, annonces: false }));

      } catch (err) {
        console.error("Erreur:", err);
        setError(err.response?.data?.message || err.message || "Une erreur est survenue lors de la récupération des données.");
        setLoading({ annonces: false, types: false });
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAnnonces = annonces.filter(annonce => {
    const matchesType = !filters.type || annonce.type === filters.type;
    const title = annonce.titre || "";
    const description = annonce.description || "";
    const matchesSearch = !filters.search ||
      title.toLowerCase().includes(filters.search.toLowerCase()) ||
      description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeEmoji = (type) => {
    const emojiMap = {
      'adoption': '🏠',
      'garde_temporaire': '⏱️',
      'animal_perdu': '😿',
      'animal_trouve': '🔍',
      'conseil_sante': '💊',
      'conseil_education': '📚',
      'autre': '✨'
    };
    return emojiMap[type] || '📋';
  };

  const formatType = (type) => {
    if (!type) return "Non Défini";
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getOptimizedImageUrl = (url) => {
    if (!url) return '/default-animal-placeholder.svg'; // Use a dedicated placeholder SVG
    try {
      if (url.includes('res.cloudinary.com')) {
        return url.replace('/upload/', '/upload/w_600,h_400,c_fill,q_auto:good,f_auto/');
      }
      return url;
    } catch (error) {
      console.error("Erreur lors de l'optimisation de l'URL:", error);
      return '/default-animal-placeholder.svg';
    }
  };

  const isLoading = loading.annonces || loading.types;

  if (showWelcome) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="text-center p-8"
          >
            <div className="text-7xl mb-6 animate-bounce">🐾</div>
            <h1 className="text-4xl font-bold text-indigo-700 mb-3">Bienvenue sur PetConnect</h1>
            <p className="text-lg text-gray-700">Découvrez les annonces qui attendent votre attention.</p>
          </motion.div>
        </div>
      </UserLayout>
    );
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-50">
          <div className="text-center p-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🐾</div>
            </div>
            <p className="mt-8 text-xl font-semibold text-indigo-700">Chargement des annonces...</p>
            <p className="text-md text-gray-600 mt-2">Nos amis à quatre pattes patientent, un instant s'il vous plaît.</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-red-50 p-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-l-8 border-red-500 text-red-800 p-8 rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mr-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold">Oups! Une Erreur Est Survenue</h2>
            </div>
            <p className="mb-6 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg font-semibold transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réessayer
            </button>
          </motion.div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-screen-xxl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 p-6 bg-gradient-to-r from-white-400 to-gray-100
                 rounded-xl shadow-lg text-black flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div>
                <h1 className="text-3xl font-bold mb-2">Explorez les Annonces</h1>
                <p className="text-black ">Trouvez votre prochain compagnon ou partagez une annonce.</p>
            </div>
            <Link
              to="/user/AjouterAnnonnce" // Ensure this path is correct for your routing
              className="group bg-white hover:bg-gray-100 text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Publier une Annonce
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-96 w-full"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Filtrer les Annonces</h2>
                <div className="mb-6">
                  <label htmlFor="search" className="block text-md font-medium text-gray-700 mb-2">Recherche</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Titre, description..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div className="mb-7">
                  <label htmlFor="type" className="block text-md font-medium text-gray-700 mb-2">Type d'Annonce</label>
                  <div className="relative">
                    <select
                      id="type"
                      name="type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-200 shadow-sm bg-white"
                      value={filters.type}
                      onChange={handleFilterChange}
                    >
                      <option value="">Tous les types</option>
                      {annonceTypes.map(type => (
                        <option key={type} value={type}>
                          {getTypeEmoji(type)} {formatType(type)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setFilters({ type: "", search: "" })}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser les Filtres
                </button>
              </div>
            </motion.aside>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
              >
               
              </motion.div>

              {filteredAnnonces.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg p-10 sm:p-16 text-center flex flex-col items-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14h6" />
                    </svg>
                    <div className="absolute bottom-2 right-2 bg-gray-100 rounded-full p-2 shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-800">Aucune annonce trouvée</h3>
                  <p className="mt-3 text-gray-600 max-w-md mx-auto">Nous n'avons pas trouvé d'annonces correspondant à vos critères. Essayez d'ajuster vos filtres ou publiez la vôtre!</p>
                  <div className="mt-10">
                    <Link
                      to="/user/AjouterAnnonnce" // Ensure this path is correct for your routing
                      className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Publier une Nouvelle Annonce
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredAnnonces.map((annonce) => {
                    const imageUrl = getOptimizedImageUrl(annonce.image);
                    return (
                      <motion.div
                        key={annonce._id}
                        variants={itemVariants}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 border border-gray-200"
                      >
                        <div className="h-48 w-full relative overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={annonce.titre || "Image de l'annonce"}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-animal-placeholder.svg';
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 shadow-sm">
                              {getTypeEmoji(annonce.type)} {formatType(annonce.type)}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-grow">
                          <h2 className="text-lg font-bold text-gray-800 mb-2 truncate" title={annonce.titre || "Sans titre"}>{annonce.titre || "Sans titre"}</h2>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{annonce.description || "Pas de description disponible."}</p>
                          
                          <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {new Date(annonce.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                            <Link
                              to={`/annonce/${annonce._id}`} // Ensure this path is correct for your routing
                              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-3 py-1 rounded-md transition-all duration-300 ease-in-out flex items-center gap-1 text-xs shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              Voir Détails
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* "Voir plus" Button - Assuming you might implement pagination later */}
              {/* This is a placeholder; actual "load more" logic is not in the original code */}
              {filteredAnnonces.length > 0 && annonces.length > 0 && filteredAnnonces.length < annonces.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center mt-12"
                >
                  <button 
                    // onClick={handleLoadMore} // You would add a handler for this
                    className="bg-white hover:bg-gray-100 text-indigo-700 font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 border border-indigo-200"
                  >
                    Voir plus d'Annonces
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
export default AnnoncesPage;