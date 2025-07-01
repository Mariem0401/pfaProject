import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLayout from "../../layouts/user/UserLayout";
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const CreerAnnonce = () => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '',
    image: null
  });
  const [typesAnnonces, setTypesAnnonces] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();
  const [userAnimals, setUserAnimals] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  useEffect(() => {
    const fetchTypesAndAnimals = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

      if (!token || token === 'undefined') {
        setMessage({ text: "Vous devez être connecté pour créer une annonce", type: 'error' });
        return;
      }

      setLoadingAnimals(true);
      try {
        const [typesResponse, animalsResponse] = await Promise.all([
          axios.get('http://localhost:7777/annonces/types', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:7777/animaux/mes-animaux', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setTypesAnnonces(typesResponse.data);
        if (animalsResponse.data && Array.isArray(animalsResponse.data.data)) {
          setUserAnimals(animalsResponse.data.data);
          console.log("État userAnimals après mise à jour:", userAnimals);
        } else {
          console.error("Erreur: La structure de la réponse des animaux est incorrecte.", animalsResponse.data);
          setMessage({ text: 'Erreur lors du chargement des animaux', type: 'error' });
          setUserAnimals([]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setMessage({ text: 'Erreur lors du chargement des données', type: 'error' });
        setUserAnimals([]);
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchTypesAndAnimals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnimalSelect = (e) => {
    setSelectedAnimalId(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setMessage({
        text: "Format d'image non supporté (seuls JPG, PNG sont acceptés)",
        type: 'error'
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage({
        text: "L'image est trop volumineuse (max 5MB)",
        type: 'error'
      });
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

    if (!token) {
      setMessage({ text: "Authentification requise", type: 'error' });
      setIsLoading(false);
      return;
    }

    if (!formData.image) {
      setMessage({
        text: "Une image est obligatoire pour créer une annonce",
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('image', formData.image);

    if (["garde_temporaire", "conseil_sante", "adoption"].includes(formData.type) && selectedAnimalId) {
      data.append('animalId', selectedAnimalId);
    }

    try {
      const response = await axios.post('http://localhost:7777/annonces', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Votre annonce a été créée avec succès ! Elle sera visible pour tous le monde après validation de l administrateur .', {
        position: "top-right",
        autoClose: 5000,
      });

      setFormData({ titre: '', description: '', type: '', image: null });
      setPreviewImage('');
      setSelectedAnimalId('');

      setTimeout(() => navigate('/user/mes-annonces'), 3000);

    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la création";
      setMessage({ text: errorMessage, type: 'error' });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto"> {/* Limiter la largeur du formulaire */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#6C63FF] mb-2">Publier une nouvelle annonce</h1>
            <p className="text-gray-600">Partagez avec la communauté AdoptiPet</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-y-6">
                {/* Titre */}
                <div>
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de l'annonce *
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
                    placeholder="Ex: Cherche famille aimante pour mon chaton"
                    required
                  />
                </div>

                {/* Type et Sélection de l'animal (sur la même ligne si applicable) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'annonce *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      {typesAnnonces.map((type) => (
                        <option key={type} value={type}>
                          {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {["garde_temporaire", "conseil_sante", "adoption"].includes(formData.type) && (
                    <div className="mb-6">
                      <label htmlFor="animalId" className="block text-sm font-medium text-gray-700 mb-1">
                        Sélectionner un animal *
                      </label>
                      <select
                        id="animalId"
                        name="animalId"
                        value={selectedAnimalId}
                        onChange={handleAnimalSelect}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
                        required
                        disabled={loadingAnimals || !Array.isArray(userAnimals) || userAnimals.length === 0}
                      >
                        <option value="">-- Sélectionner un animal --</option>
                        {Array.isArray(userAnimals) && userAnimals.map(animal => (
                          <option key={animal._id} value={animal._id}>
                            {animal.nom} ({animal.espece})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description détaillée *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
                    placeholder="Décrivez en détail votre annonce..."
                    required
                  />
                </div>

                {/* Upload d'image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo (optionnelle)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="mx-auto h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage('');
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                          </div>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#6C63FF] hover:text-[#5A52E0] focus-within:outline-none"
                            >
                              <span>Uploader une image</span>
                              <input
                                id="image-upload"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG jusqu'à 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[#6C63FF] hover:bg-[#5A52E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] transition ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="mr-2 animate-spin" />
                        En cours...
                      </>
                    ) : (
                      'Publier l\'annonce'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CreerAnnonce;