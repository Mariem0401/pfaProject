import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserLayout from "../../layouts/user/UserLayout";
import {
  ChevronLeft,
  PawPrint,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  Loader,
  AlertCircle,
  User,
  Clock,
  Tag,
  MessageCircle,
  Plus,
  X,
  Paperclip,
  ClipboardList,
  CheckCircle2,
  ShieldCheck,
  Map,
  BriefcaseMedical
} from "lucide-react";

export default function DetailAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [healthForm, setHealthForm] = useState({
    type: "",
    description: "",
    veterinarian: "",
    notes: "",
    nextVisit: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  const healthRecordTypes = [
    "checkup",
    "vaccination",
    "surgery",
    "treatment",
    "other"
  ];

  useEffect(() => {
    const fetchAnimal = async () => {
      setLoading(true);
      setError("");
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
        if (!token) {
          throw new Error("Vous devez être connecté pour voir les détails de l'animal.");
        }

        const [animalRes, healthRes] = await Promise.all([
          axios.get(`http://localhost:7777/animaux/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`http://localhost:7777/animaux/${id}/health`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setAnimal(animalRes.data.data);
        setHealthRecords(healthRes.data.data || []);
      } catch (err) {
        console.error("Erreur lors du fetch des données:", err);
        setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || err.message || "Impossible de charger les détails de l'animal.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
      await axios.delete(`http://localhost:7777/animaux/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      navigate("/user/mes-animaux", { replace: true, state: { message: `${animal?.nom || 'Animal'} supprimé avec succès.` } });
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Erreur lors de la suppression de l'animal.");
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleHealthFormChange = (e) => {
    const { name, value } = e.target;
    setHealthForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateHealthForm = () => {
    const errors = {};
    if (!healthForm.type.trim()) errors.type = "Le type est requis";
    if (!healthForm.description.trim()) errors.description = "La description est requise";
    if (!healthForm.veterinarian.trim()) errors.veterinarian = "Le vétérinaire est requis";
    return errors;
  };

  const handleHealthFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setFormSuccess("");

    const errors = validateHealthForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
      const newRecord = await axios.post(
        `http://localhost:7777/animaux/${id}/health`,
        healthForm,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setHealthRecords(prevRecords => [newRecord.data.data, ...prevRecords]);
      setFormSuccess("Dossier médical ajouté avec succès !");
      setHealthForm({ type: "", description: "", veterinarian: "", notes: "", nextVisit: "" });
      setShowHealthForm(false);
      setTimeout(() => setFormSuccess(""), 3000);

    } catch (err) {
      console.error("Erreur lors de l'ajout du dossier médical:", err);
      setFormErrors({ submit: err.response?.data?.message || "Erreur lors de l'ajout du dossier médical." });
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };


  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center p-8">
            <Loader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-6" />
            <p className="text-gray-700 font-semibold text-lg">Chargement des merveilles...</p>
            <p className="text-gray-500 text-sm">Un instant, nous préparons le profil.</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error && !animal) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto p-6 sm:p-10 text-center">
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl shadow-md">
            <AlertCircle className="text-red-500 mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Réessayer
            </button>
          </div>
          <div className="mt-8">
            <Link
              to="/user/mes-animaux"
              className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Retour à la liste des animaux
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!animal) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto p-6 sm:p-10 text-center">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl shadow-md">
            <PawPrint className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Animal non trouvé</h2>
            <p className="text-yellow-700 mb-6">Cet animal n'existe pas ou a été retiré de nos registres.</p>
            <Link
              to="/user/mes-animaux"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:shadow-md transition-all"
            >
              Retour à mes animaux
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  const PageLevelError = ({ message }) => {
    if (!message) return null;
    return (
      <div className="my-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <div className="flex">
          <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 mr-3" /></div>
          <div>
            <p className="font-bold">Erreur</p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  };


  return (
    <UserLayout>
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <nav className="flex items-center text-gray-500 text-sm mb-6 md:mb-8">
            <Link to="/user/mes-animaux" className="hover:text-indigo-600 transition-colors flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Mes Animaux
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-gray-700 truncate" title={animal.nom}>{animal.nom}</span>
          </nav>

          {error && <PageLevelError message={error} />}


          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">


            <div className="relative h-72 sm:h-80 md:h-[450px] bg-gray-200">
              {animal.photo ? (
                <img
                  src={animal.photo}
                  alt={animal.nom}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = "/default-animal-placeholder.svg"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
                  <PawPrint className="h-24 w-24 text-indigo-300 opacity-70" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end">
                <div className="p-6 sm:p-8 md:p-10">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 shadow-sm">{animal.nom}</h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/30">
                      {animal.espece.charAt(0).toUpperCase() + animal.espece.slice(1)}
                    </span>
                    {animal.race && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/30">
                        {animal.race}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>



            <div className="px-4 py-6 sm:p-8 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Main Column */}
                <div className="flex-grow lg:w-2/3">
                  <section className="mb-8 md:mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                      <MessageCircle className="h-6 w-6 mr-3 text-indigo-600" />
                      À propos de {animal.nom}
                    </h2>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 prose prose-sm sm:prose-base max-w-none text-gray-700">
                      {animal.description ? (
                        <p className="whitespace-pre-line">{animal.description}</p>
                      ) : (
                        <p className="italic text-gray-500">Aucune description affectueuse n'a été ajoutée pour le moment.</p>
                      )}
                    </div>
                  </section>

                  <section className="mb-8 md:mb-10">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <ShieldCheck className="h-6 w-6 mr-3 text-teal-600" />
                        Santé et Suivi
                      </h2>
                      <button
                        onClick={() => { setShowHealthForm(!showHealthForm); if (showHealthForm) setFormErrors({}); setFormSuccess(""); }}
                        className={`flex items-center font-medium py-2 px-4 rounded-lg transition-all text-sm group ${
                          showHealthForm
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-teal-500 text-white hover:bg-teal-600"
                        }`}
                      >
                        {showHealthForm ? <X className="h-4 w-4 mr-1.5" /> : <Plus className="h-4 w-4 mr-1.5" />}
                        {showHealthForm ? "Fermer Formulaire" : "Ajouter Dossier"}
                      </button>
                    </div>

                    {showHealthForm && (
                      <div className="mb-6 p-5 bg-white rounded-xl shadow-lg border border-teal-200 transition-all duration-300 ease-in-out">
                        <h3 className="text-lg font-semibold text-teal-700 mb-4">Nouveau Dossier Médical</h3>
                        {formSuccess && (
                          <div className="flex items-center bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4 text-sm">
                            <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                            <span>{formSuccess}</span>
                          </div>
                        )}
                        {formErrors.submit && (
                          <div className="flex items-center bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                            <span>{formErrors.submit}</span>
                          </div>
                        )}
                        <form onSubmit={handleHealthFormSubmit} className="space-y-4">
                          {/* Type */}
                          <div>
                            <label htmlFor="healthType" className="block text-smfont-medium text-gray-700 mb-1">Type *</label>
                            <div className="relative">
                              <ClipboardList className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <select id="healthType" name="type"
                                className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.type ? "border-red-500 ring-red-500" : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"} rounded-md shadow-sm focus:ring-1 transition-colors text-gray-700`}
                                value={healthForm.type} onChange={handleHealthFormChange}>
                                <option value="">Sélectionner un type</option>
                                {healthRecordTypes.map((type) => (
                                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                ))}
                              </select>
                            </div>
                            {formErrors.type && <p className="text-red-600 text-xs mt-1">{formErrors.type}</p>}
                          </div>
                          {/* Description */}
                          <div>
                            <label htmlFor="healthDescription" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea id="healthDescription" name="description" rows="3"
                              className={`w-full px-3 py-2 border ${formErrors.description ? "border-red-500 ring-red-500" : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"} rounded-md shadow-sm focus:ring-1 transition-colors resize-y text-gray-700`}
                              value={healthForm.description} onChange={handleHealthFormChange} />
                            {formErrors.description && <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>}
                          </div>
                          {/* Veterinarian */}
                          <div>
                            <label htmlFor="veterinarian" className="block text-sm font-medium text-gray-700 mb-1">Vétérinaire *</label>
                            <div className="relative">
                              <BriefcaseMedical className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input type="text" id="veterinarian" name="veterinarian"
                                className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.veterinarian ? "border-red-500 ring-red-500" : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"} rounded-md shadow-sm focus:ring-1 transition-colors text-gray-700`}
                                value={healthForm.veterinarian} onChange={handleHealthFormChange} />
                            </div>
                            {formErrors.veterinarian && <p className="text-red-600 text-xs mt-1">{formErrors.veterinarian}</p>}
                          </div>
                          {/* Notes */}
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optionnel)</label>
                            <textarea id="notes" name="notes" rows="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-y text-gray-700"
                              value={healthForm.notes} onChange={handleHealthFormChange} />
                          </div>
                          {/* Next Visit */}
                          <div>
                            <label htmlFor="nextVisit" className="block text-sm font-medium text-gray-700 mb-1">Prochaine Visite (Optionnel)</label>
                            <input type="date" id="nextVisit" name="nextVisit"
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-gray-700"
                              value={healthForm.nextVisit} onChange={handleHealthFormChange}
                              min={new Date().toISOString().split("T")[0]} />
                          </div>
                          <button type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-70 flex items-center justify-center"
                            disabled={formSubmitting}>
                            {formSubmitting ? <Loader className="animate-spin h-5 w-5" /> : "Enregistrer le Dossier"}
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="space-y-4">
                  

                      {healthRecords.length > 0 ? (
                        <div className="space-y-3 pt-3">
                          <h4 className="text-md font-semibold text-gray-700 mb-1">Historique des Dossiers Médicaux:</h4>
                          {healthRecords.map((record) => (
                            <div key={record._id || record.createdAt} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-semibold text-teal-700 capitalize">{record.type}</h5>
                                <span className="text-xs text-gray-500">{formatDate(record.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">{record.description}</p>
                              <p className="text-xs text-gray-600"><strong className="font-medium">Vétérinaire:</strong> {record.veterinarian}</p>
                              {record.notes && <p className="text-xs text-gray-600 mt-0.5"><strong className="font-medium">Notes:</strong> {record.notes}</p>}
                              {record.nextVisit && <p className="text-xs text-gray-600 mt-0.5"><strong className="font-medium">Suivi prévu le:</strong> {formatDate(record.nextVisit)}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        !showHealthForm && <p className="text-sm text-gray-500 italic mt-4">Aucun dossier médical enregistré pour le moment.</p>
                      )}
                    </div>
                  </section>

                </div>

                {/* Sidebar Column */}
                <aside className="w-full lg:w-1/3 lg:sticky lg:top-8 self-start shrink-0">
                  <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl shadow-lg border border-gray-200/80 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-3">Détails Clés</h3>
                    <ul className="space-y-5">
                      {[
                        { icon: PawPrint, label: "Espèce", value: animal.espece.charAt(0).toUpperCase() + animal.espece.slice(1) },
                        animal.race && { icon: Tag, label: "Race", value: animal.race },
                        animal.age !== undefined && { icon: Clock, label: "Âge", value: `${animal.age} an${animal.age > 1 ? 's' : ''}` },
                        { icon: User, label: "Genre", value: animal.genre === 'male' ? 'Mâle' : 'Femelle' }
                      ].filter(Boolean).map(item => (
                        <li key={item.label} className="flex items-start">
                          <item.icon className="h-5 w-5 text-indigo-500 mr-4 mt-0.5 shrink-0" />
                          <div>
                            <span className="block text-xs text-gray-500 uppercase tracking-wider">{item.label}</span>
                            <p className="font-medium text-gray-800 text-sm">{item.value}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-300 my-6"></div>

                    <div className="space-y-3">
                      <Link
                        to={`/user/modifier-animal/${animal._id}`}
                        className="flex items-center justify-center w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow hover:shadow-md transition-all font-medium"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modifier les Informations
                      </Link>

                      <button
                        onClick={handleDelete}
                        className={`flex items-center justify-center w-full py-2.5 px-4 border rounded-lg transition-all font-medium ${
                          deleteConfirm
                            ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md'
                            : 'bg-white hover:bg-red-50 text-red-600 border-red-300 hover:border-red-500 hover:text-red-700'
                        }`}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <Loader className="animate-spin h-5 w-5 mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        {deleteConfirm ? (deleting ? "Suppression..." : "Confirmer la Suppression") : "Supprimer l'Animal"}
                      </button>
                      {deleteConfirm && !deleting && (
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all text-sm mt-2"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}