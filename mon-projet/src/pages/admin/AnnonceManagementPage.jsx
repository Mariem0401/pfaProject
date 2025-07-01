import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnnonceManagementPage = () => {
  const [allAnnonces, setAllAnnonces] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [typesAnnonces, setTypesAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    statut: "",
    type: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchTypes = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

      if (!token || token === 'undefined') {
        toast.error("Vous devez être connecté pour accéder à cette page");
        return;
      }

      try {
        const response = await axios.get('http://localhost:7777/annonces/types', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTypesAnnonces(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des types:', error);
        toast.error('Erreur lors du chargement des types d\'annonces');
      }
    };

    const fetchAllAnnonces = async () => {
      try {
        const response = await axiosConfig.get(`/annonces/AllAnnonceAdmin`);
        setAllAnnonces(response.data.data);
        setAnnonces(response.data.data); // Initialize displayed annonces with all annonces
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de toutes les annonces:", error);
        setLoading(false);
        toast.error("Erreur lors de la récupération des annonces");
      }
    };

    fetchTypes();
    fetchAllAnnonces();
  }, []); // Fetch all annonces only once on component mount

  useEffect(() => {
    const filterAnnonces = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter.statut) params.append('statut', filter.statut);
        if (filter.type) params.append('type', filter.type);

        const response = await axiosConfig.get(`/annonces/admin/filtrer?${params.toString()}`);
        setAnnonces(response.data.data);
        setCurrentPage(1); // Reset to the first page after filtering
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du filtrage des annonces:", error);
        setLoading(false);
        toast.error("Erreur lors du filtrage des annonces");
      }
    };

    if (filter.statut !== "" || filter.type !== "") {
      filterAnnonces();
    } else {
      setAnnonces(allAnnonces); // If no filter, show all annonces
      setCurrentPage(1);
    }
  }, [filter, allAnnonces]);

  const formatTypeName = (type) => {
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleStatutChange = async (id, statut) => {
    try {
      await axiosConfig.patch(`/annonces/statut/${id}`, { statut });
      setAllAnnonces(prevAnnonces =>
        prevAnnonces.map(annonce =>
          annonce._id === id ? { ...annonce, statut } : annonce
        )
      );
      setAnnonces(prevAnnonces =>
        prevAnnonces.map(annonce =>
          annonce._id === id ? { ...annonce, statut } : annonce
        )
      );

      if (statut === 'acceptee') {
        toast.success(
          <div>
            <p>Annonce acceptée avec succès !</p>
            <p className="text-sm">Elle sera maintenant visible par tous les utilisateurs.</p>
          </div>,
          { autoClose: 4000 }
        );
      } else if (statut === 'refusee') {
        toast.warning(
          <div>
            <p>Annonce refusée</p>
            <p className="text-sm">Elle ne sera plus visible sur la plateforme.</p>
          </div>,
          { autoClose: 4000 }
        );
      } else {
        toast.success(`Statut de l'annonce changé en "${getStatusText(statut)}" avec succès`, { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error(
        <div>
          <p>Erreur lors de la mise à jour du statut</p>
          <p className="text-sm">Veuillez réessayer.</p>
        </div>
      );
    }
  };

  const totalPages = Math.ceil(annonces.length / itemsPerPage);
  const paginatedAnnonces = annonces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusText = (statut) => {
    const text = { 'en_attente': 'En attente', 'acceptee': 'Acceptée', 'refusee': 'Refusée' };
    return text[statut] || statut;
  };

  const getStatusBadge = (statut) => {
    const classes = { 'en_attente': 'bg-yellow-100 text-yellow-800', 'acceptee': 'bg-green-100 text-green-800', 'refusee': 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes[statut]}`}>{getStatusText(statut)}</span>;
  };

  const getTypeBadge = (type) => {
    const classes = { 'adoption': 'bg-blue-100 text-blue-800', 'garde_temporaire': 'bg-purple-100 text-purple-800', 'animal_perdu': 'bg-orange-100 text-orange-800' };
    const text = { 'adoption': 'Adoption', 'garde_temporaire': 'Garde temporaire', 'animal_perdu': 'Animal Perdu' };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes[type]}`}>{text[type]}</span>;
  };

  const getUserInfo = (user) => {
    if (!user || typeof user !== 'object') return <span className="text-gray-400">Inconnu</span>;
    return (
      <div className="flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-900">{user?.name || 'ID: ' + user}</p>
         {/*<p className="text-xs text-gray-500">{user?.email || ''}</p>*/}
        </div>
      </div>
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    // The filtering logic is now in the second useEffect
    // triggered by changes in the 'filter' state.
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Annonces</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                id="statut"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                name="statut"
                value={filter.statut}
                onChange={handleFilterChange}
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="acceptee">Acceptées</option>
                <option value="refusee">Refusées</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="type"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
              >
                <option value="">Tous les types</option>
                {typesAnnonces.map((type) => (
                  <option key={type} value={type}>
                    {formatTypeName(type)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                onClick={applyFilters}
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publié par</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAnnonces.length > 0 ? (
                      paginatedAnnonces.map((annonce) => (
                        <tr key={annonce._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{annonce.titre}</div></td>
                          <td className="px-6 py-4"><div className="text-sm text-gray-500 max-w-xs truncate">{annonce.description}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(annonce.type)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(annonce.statut)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getUserInfo(annonce.user)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {annonce.statut !== 'acceptee' && (
                                <button onClick={() => handleStatutChange(annonce._id, "acceptee")} className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Accepter</button>
                              )}
                              {annonce.statut !== 'refusee' && (
                                <button onClick={() => handleStatutChange(annonce._id, "refusee")} className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Refuser</button>
                              )}
                              <Link to={`/admin/detailAnnonce/${annonce._id}`} className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Détails</Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Aucune annonce trouvée avec ces critères</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Précédent</button>
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Suivant</button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, annonces.length)}</span> sur <span className="font-medium">{annonces.length}</span> annonces</p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Première page</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M8.707 5.293a1 1 0 010 1.414L5.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Précédent</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Suivant</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Dernière page</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M12.707 14.707a1 1 0 010-1.414L15.586 10l-2.879-2.879a1 1 0 011.414-1.414l3.586 3.586a1 1 0 010 1.414l-3.586 3.586a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnnonceManagementPage;