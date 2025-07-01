import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLayout from "../../layouts/user/UserLayout";
import { FaCloudUploadAlt } from 'react-icons/fa';

const ModifierAnnonce = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '',
    image: null,
  });
  const [typesAnnonces, setTypesAnnonces] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [userAnimals, setUserAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
      try {
        const [typesRes, annonceRes, animalsRes] = await Promise.all([
          axios.get('http://localhost:7777/annonces/types', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:7777/annonces/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:7777/animaux/mes-animaux', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
  
        setTypesAnnonces(typesRes.data);
        const annonce = annonceRes.data.data;
        setFormData({
          titre: annonce.titre || '',
          description: annonce.description || '',
          type: annonce.type || '',
          image: null, // pas de fichier, on garde le preview
        });
        setSelectedAnimalId(annonce.animal?._id || '');
        setPreviewImage(annonce.image || '');
        setUserAnimals(animalsRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, [id]);
  

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
      toast.error("Format d'image non supporté (seuls JPG, PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
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

    const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('type', formData.type);
    if (formData.image) data.append('image', formData.image);
    if (["garde_temporaire", "conseil_sante", "adoption"].includes(formData.type) && selectedAnimalId) {
      data.append('animalId', selectedAnimalId);
    }

    try {
      await axios.patch(`http://localhost:7777/annonces/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Annonce mise à jour avec succès !");
      setTimeout(() => navigate('/user/mes-annonces'), 3000);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#6C63FF] mb-2">Modifier l'annonce</h1>
            <p className="text-gray-600">Mettez à jour les détails de votre annonce</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
              >
                <option value="">Sélectionner un type</option>
                {typesAnnonces.map((type) => (
                  <option key={type} value={type}>
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {["garde_temporaire", "conseil_sante", "adoption"].includes(formData.type) && (
              <div>
                <label htmlFor="animalId" className="block text-sm font-medium text-gray-700 mb-1">Animal *</label>
                <select
                  id="animalId"
                  name="animalId"
                  value={selectedAnimalId}
                  onChange={handleAnimalSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                  required
                >
                  <option value="">-- Sélectionner un animal --</option>
                  {userAnimals.map(animal => (
                    <option key={animal._id} value={animal._id}>
                      {animal.nom} ({animal.espece})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optionnelle)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="mx-auto h-40 object-cover rounded-lg" />
                  ) : (
                    <>
                      <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">Uploader une nouvelle image</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-lg font-medium text-white ${isLoading ? 'bg-gray-400' : 'bg-[#6C63FF] hover:bg-[#5A52E0]'}`}
            >
              {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default ModifierAnnonce;
