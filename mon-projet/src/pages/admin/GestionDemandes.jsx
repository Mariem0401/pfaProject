// src/pages/admin/GestionDemandes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaHeart,
  FaBan,
  FaInfoCircle,
  FaClock,
  FaBox,
  FaShippingFast,
} from "react-icons/fa";
import AdminLayout from "../../layouts/admin/AdminLayout";

const GestionDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token =
    JSON.parse(localStorage.getItem("userData"))?.token ||
    localStorage.getItem("userToken");

  /** ──────────────────────────────────────────────────────────
   *  Charger toutes les demandes en attente
   *  ──────────────────────────────────────────────────────────
   */
  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:7777/admin/migrations/getAllDemande",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDemandes(data);
      setFilteredDemandes(data);
    } catch (e) {
      setError("Erreur de chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = demandes;

    // Filtre par statut
    if (filter !== "all") {
      filtered = filtered.filter((d) => {
        switch (filter) {
          case "en_attente":
            return d.status === "en_attente" || !d.status;
          case "acceptee":
            return d.status === "acceptee";
          case "refusee":
            return d.status === "refusee";
          default:
            return true;
        }
      });
    }

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.annonce.animal?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.annonce.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.candidat?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par espèce
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (d) => d.annonce.animal?.espece.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredDemandes(filtered);
  }, [searchTerm, filter, filterStatus, demandes]);

  /** ──────────────────────────────────────────────────────────
   *  Handler accept / refuse
   *  ──────────────────────────────────────────────────────────
   */
  const handleAction = async (id, action) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir ${
          action === "accepter" ? "accepter" : "refuser"
        } cette demande d'adoption ?`
      )
    )
      return;

    setActionId(id);
    try {
      const endpoint = action === "accepter" ? "accepter" : "refuser";
      await axios.patch(
        `http://localhost:7777/admin/migrations/${id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Enlever la demande localement
      setDemandes((prev) => prev.filter((d) => d._id !== id));
      setShowModal(false);
      
      // Notification de succès
      const message = action === "accepter" 
        ? "Demande d'adoption acceptée avec succès!" 
        : "Demande d'adoption refusée.";
      
      // Vous pouvez remplacer alert par une notification toast
      alert(message);
      
    } catch (e) {
      alert(
        e.response?.data?.message || `Erreur lors de l'${action} de la demande`
      );
    } finally {
      setActionId(null);
    }
  };

  const openModal = (demande) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
  };

  const getEspeceIcon = (espece) => {
    switch (espece?.toLowerCase()) {
      case "chien":
        return "🐕";
      case "chat":
        return "🐱";
      case "oiseau":
        return "🐦";
      case "lapin":
        return "🐰";
      default:
        return "🐾";
    }
  };

  const getStatusBadge = (status, createdAt) => {
    if (status === "acceptee") {
      return { text: "Acceptée", color: "bg-green-100 text-green-800" };
    }
    if (status === "refusee") {
      return { text: "Refusée", color: "bg-red-100 text-red-800" };
    }
    
    // Pour les demandes en attente, on utilise l'ancienneté
    const days = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    if (days === 0) return { text: "Nouveau", color: "bg-green-100 text-green-800" };
    if (days <= 3) return { text: "Récent", color: "bg-blue-100 text-blue-800" };
    if (days <= 7) return { text: "En attente", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Urgent", color: "bg-red-100 text-red-800" };
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                Demandes d'Adoption
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les demandes de migration et d'adoption des animaux
              </p>
            </div>
            {/*
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-700 font-semibold">
                  {filteredDemandes.length} demande(s) en attente
                </span>
              </div>
              <button
                onClick={fetchDemandes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaSpinner className={loading ? "animate-spin" : ""} />
                Actualiser
              </button>
            </div>
            */}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Filtres par statut */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex space-x-2 flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FaBox className="mr-2" /> Toutes les demandes
              </button>
              <button
                onClick={() => setFilter('en_attente')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'en_attente' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FaClock className="mr-2" /> En attente
              </button>
              <button
                onClick={() => setFilter('acceptee')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'acceptee' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FaCheckCircle className="mr-2" /> Acceptées
              </button>
              <button
                onClick={() => setFilter('refusee')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${filter === 'refusee' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <FaBan className="mr-2" /> Refusées
              </button>
            </div>

            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtre par espèce */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les espèces</option>
                <option value="chien">Chiens</option>
                <option value="chat">Chats</option>
                <option value="oiseau">Oiseaux</option>
                <option value="lapin">Lapins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
            <FaSpinner className="animate-spin mr-3 text-2xl text-blue-600" />
            <span className="text-lg">Chargement des demandes...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
            <span className="text-red-700">{error}</span>
          </div>
        ) : filteredDemandes.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <FaPaw className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Toutes les demandes ont été traitées"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDemandes.map((demande) => {
              const statusBadge = getStatusBadge(demande.status, demande.createdAt);
              const isProcessed = demande.status === "acceptee" || demande.status === "refusee";
              return (
                <div
                  key={demande._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getEspeceIcon(demande.annonce.animal?.espece)}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {demande.annonce.titre}
                          </h3>
                          <p className="text-gray-600">
                            {demande.annonce.animal?.nom} • {demande.annonce.animal?.age} ans
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Photo de l'animal */}
                      <div className="md:col-span-1">
                        {demande.annonce.animal?.photo ? (
                          <img
                            src={demande.annonce.animal.photo}
                            alt={demande.annonce.animal.nom}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaPaw className="text-4xl text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Détails de l'animal */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FaPaw className="text-blue-500" />
                            Détails de l'animal
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span><strong>Espèce:</strong> {demande.annonce.animal?.espece}</span>
                            <span><strong>Race:</strong> {demande.annonce.animal?.race}</span>
                            <span><strong>Genre:</strong> {demande.annonce.animal?.genre}</span>
                            <span><strong>Âge:</strong> {demande.annonce.animal?.age} ans</span>
                          </div>
                          {demande.annonce.description && (
                            <p className="mt-2 text-sm text-gray-600">
                              {demande.annonce.description}
                            </p>
                          )}
                        </div>

                        {/* Propriétaire et candidat */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Propriétaire actuel */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                              <FaUser className="text-blue-500" />
                              Propriétaire actuel
                            </h5>
                            {demande.annonce.user ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={demande.annonce.user.profilePic || "/images/avatar-placeholder.png"}
                                  alt="Propriétaire"
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {demande.annonce.user.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {demande.annonce.user.email}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Informations indisponibles</span>
                            )}
                          </div>

                          {/* Candidat adoptant */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <FaHeart className="text-green-500" />
                              Candidat adoptant
                            </h5>
                            {demande.candidat ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={demande.candidat.profilePic || "/images/avatar-placeholder.png"}
                                  alt="Candidat"
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {demande.candidat.name || "Nom inconnu"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {demande.candidat.email}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Informations indisponibles</span>
                            )}
                          </div>
                        </div>

                        {/* Date et actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaCalendarAlt />
                            <span>
                              Demande reçue le {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => openModal(demande)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                            >
                              <FaEye />
                              Voir détails
                            </button>
                            
                            {!isProcessed && (
                              <>
                                <button
                                  onClick={() => handleAction(demande._id, "refuser")}
                                  disabled={actionId === demande._id}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm disabled:opacity-50"
                                >
                                  {actionId === demande._id ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <FaBan />
                                  )}
                                  Refuser
                                </button>
                                <button
                                  onClick={() => handleAction(demande._id, "accepter")}
                                  disabled={actionId === demande._id}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm disabled:opacity-50"
                                >
                                  {actionId === demande._id ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <FaCheckCircle />
                                  )}
                                  Accepter
                                </button>
                              </>
                            )}
                            
                            {isProcessed && (
                              <div className="px-4 py-2 text-gray-500 text-sm italic">
                                Demande déjà traitée
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de détails */}
        {showModal && selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FaInfoCircle className="text-blue-500" />
                    Détails de la demande d'adoption
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedDemande.annonce.animal?.photo || "/images/no-photo.png"}
                      alt={selectedDemande.annonce.animal?.nom}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedDemande.annonce.titre}
                      </h3>
                      <p className="text-gray-600">
                        Animal: {selectedDemande.annonce.animal?.nom}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p><strong>Espèce:</strong> {selectedDemande.annonce.animal?.espece}</p>
                      <p><strong>Race:</strong> {selectedDemande.annonce.animal?.race}</p>
                      <p><strong>Genre:</strong> {selectedDemande.annonce.animal?.genre}</p>
                      <p><strong>Âge:</strong> {selectedDemande.annonce.animal?.age} ans</p>
                    </div>
                    
                    {selectedDemande.annonce.description && (
                      <div>
                        <h4 className="font-semibold mb-2">Description:</h4>
                        <p className="text-gray-700">{selectedDemande.annonce.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(() => {
                  const isProcessed = selectedDemande.status === "acceptee" || selectedDemande.status === "refusee";
                  return (
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={closeModal}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Fermer
                      </button>
                      
                      {!isProcessed && (
                        <>
                          <button
                            onClick={() => handleAction(selectedDemande._id, "refuser")}
                            disabled={actionId === selectedDemande._id}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                          >
                            {actionId === selectedDemande._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaBan />
                            )}
                            Refuser
                          </button>
                          <button
                            onClick={() => handleAction(selectedDemande._id, "accepter")}
                            disabled={actionId === selectedDemande._id}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                          >
                            {actionId === selectedDemande._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}
                            Accepter
                          </button>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GestionDemandes;