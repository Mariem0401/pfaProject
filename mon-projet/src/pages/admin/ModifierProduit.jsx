import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosConfig from '../../config/axiosConfig';
import AdminLayout from '../../layouts/admin/AdminLayout';

const ModifierProduit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    quantity: 0,
    price: 0,
    category: 'Autre',
    animal: '', // Ajout de la propriété animal avec une valeur par défaut vide
    image: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animals, setAnimals] = useState([]); // État pour stocker la liste des animaux (si nécessaire)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axiosConfig.get(`/products/${id}`);
        setProduct(response.data.data.product);
      } catch (error) {
        console.error('Erreur lors de la récupération du produit', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Si vous avez une API pour récupérer la liste des animaux, vous pouvez l'appeler ici
    // const fetchAnimals = async () => {
    //   try {
    //     const response = await axiosConfig.get('/animals'); // Exemple d'endpoint
    //     setAnimals(response.data.data.animals);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération des animaux', error);
    //   }
    // };

    fetchProduct();
    // fetchAnimals(); // Appeler la fonction pour récupérer les animaux si vous en avez une
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setProduct(prev => ({ ...prev, image: '' }));
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Empêcher les soumissions multiples
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('quantity', product.quantity);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('animal', product.animal); // Ajouter l'animal au formData
    formData.append('description', product.description);

    // Si l'image a été supprimée, on ajoute removeImage dans formData
    if (removeImage) {
      formData.append('removeImage', 'true');
    }

    // Si une nouvelle image a été sélectionnée, on l'ajoute à formData
    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await axiosConfig.patch(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Form Data:', formData);

      // Réinitialiser les états après succès
      setRemoveImage(false);
      setFile(null);
      navigate('/gestionProduit', { replace: true }); // Empêcher le retour arrière
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Modifier le Produit</h2>
              <p className="text-gray-600 mt-1">Mettez à jour les détails du produit</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    >
                      <option value="Nourriture">Nourriture</option>
                      <option value="Jouets">Jouets</option>
                      <option value="Hygiène">Hygiène</option>
                      <option value="Accessoires">Accessoires</option>
                      <option value="Litière">Litière</option>
                      <option value="Vêtements">Vêtements</option>
                      <option value="Santé">Santé</option>
                      <option value="Transport">Transport</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Nouveau champ pour l'animal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                    <input
                      type="text"
                      name="animal"
                      value={product.animal}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                    {/* Si vous avez une liste d'animaux depuis une API, utilisez un select ici */}
                    {/* <select
                      name="animal"
                      value={product.animal}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    >
                      <option value="">Sélectionner un animal</option>
                      {animals.map(animal => (
                        <option key={animal._id} value={animal.nom}>{animal.nom}</option>
                      ))}
                    </select> */}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Choisir un fichier
                      <input type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <span className="ml-2 text-sm text-gray-500">{file ? file.name : "Aucun fichier sélectionné"}</span>
                  </div>

                  {!removeImage && product.image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Image actuelle:</p>
                      <div className="flex items-center gap-2">
                        <img
                          src={product.image.includes('://')
                            ? product.image
                            : `${axiosConfig.defaults.baseURL}${product.image}`}
                          alt="Produit actuel"
                          className="h-32 w-32 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Supprimer cette image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/gestionProduit')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : 'Mettre à jour le produit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModifierProduit;