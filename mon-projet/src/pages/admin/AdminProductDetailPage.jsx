import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../config/axiosConfig';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { FaArrowLeft, FaExclamationTriangle, FaTag, FaPaw, FaCoins, FaBoxes, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const res = await axiosConfig.get(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        setProduct(res.data.data.product);
      } catch (err) {
        console.error('Erreur lors du chargement du produit', err);
        setError('Impossible de charger les détails du produit.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    try {
      setIsDeleting(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      await axiosConfig.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      toast.success('Produit supprimé avec succès');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-500 text-lg">Chargement des détails du produit...</div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-3xl mx-auto border border-gray-100">
        <div className="flex items-center text-red-600 mb-6">
          <FaExclamationTriangle className="mr-3 text-xl" />
          <h1 className="text-xl font-medium">{error}</h1>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
        >
          <FaArrowLeft className="mr-2" /> Retour à la liste des produits
        </button>
      </div>
    </AdminLayout>
  );

  if (!product) return null;

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto border border-gray-100">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/products/edit/${productId}`)}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium"
            >
              <FaEdit className="mr-2" /> Modifier
            </button>
            <button
              onClick={handleDelete}
              className={`flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isDeleting}
            >
              {isDeleting ? <FaSpinner className="animate-spin mr-2" /> : <FaTrash className="mr-2" />} Supprimer
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-md border border-gray-100"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <p className="text-gray-600 flex items-center text-sm">
                  <FaTag className="mr-2 text-gray-400" /> <span className="font-medium">Catégorie :</span> {product.category}
                </p>
              </div>
              {product.animal && (
                <div className="mb-4">
                  <p className="text-gray-600 flex items-center text-sm">
                    <FaPaw className="mr-2 text-gray-400" /> <span className="font-medium">Animal :</span> {product.animal}
                  </p>
                </div>
              )}
              <div className="mb-4">
                <p className="text-gray-800 font-medium text-base flex items-center">
                  <FaCoins className="mr-2 text-gray-400" /> Prix : {product.price} TND
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 flex items-center text-sm">
                  <FaBoxes className="mr-2 text-gray-400" /> <span className="font-medium">Quantité :</span> {product.quantity}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Description :</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-all duration-200 text-sm font-medium w-fit"
            >
              <FaArrowLeft className="mr-2" /> Retour
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductDetailPage;