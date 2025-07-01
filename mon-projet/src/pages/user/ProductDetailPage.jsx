import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../../layouts/user/UserLayout';
import { FaShoppingCart, FaHeart, FaStar, FaArrowLeft } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const fetchProduct = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.token) return navigate('/login');

      const res = await axios.get(`http://localhost:7777/products/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setProduct(res.data.data.product);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage('');

      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.token) return navigate('/login');

      await axios.post(
        'http://localhost:7777/panier',
        { productId: product._id, quantity },
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );

      setCartMessage('✅ Produit ajouté au panier !');
    } catch (err) {
      console.error('Erreur ajout panier:', err);
      setCartMessage("❌ Impossible d'ajouter au panier.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </UserLayout>
    );
  }

  if (!product) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700">Produit non trouvé</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour
          </button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux produits
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description || 'Aucune description.'}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">{product.price} Dt</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.oldPrice} Dt
                </span>
              )}
            </div>

            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} className={i < 3 ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">236 avis</span>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    product.quantity > 0
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.quantity <= 0}
                >
                  Acheter
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.quantity <= 0}
                  className={`px-6 py-2 rounded-md border font-medium flex items-center space-x-2 ${
                    product.quantity > 0
                      ? 'border-blue-500 text-blue-500 hover:bg-blue-50'
                      : 'border-gray-400 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart />
                  <span>{addingToCart ? 'Ajout...' : 'Ajouter au panier'}</span>
                </button>
              </div>
              {cartMessage && (
                <p className="mt-2 text-sm font-medium text-green-600">{cartMessage}</p>
              )}
            </div>

            <div className="text-gray-500">
              <p>Livraison estimée : 2 à 3 semaines</p>
              <button className="text-blue-500 hover:underline text-sm">
                Pourquoi ce délai ?
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProductDetailPage;
