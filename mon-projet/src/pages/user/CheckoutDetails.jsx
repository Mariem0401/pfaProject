import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import UserLayout from '../../layouts/user/UserLayout';
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const CheckoutDetails = () => {
  const { cart, loading, clearUserCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    adresse: '',
    gouvernorat: '',
    ville: '',
    telephone: '',
    email: '',
    rue: ''
  });

  const gouvernorats = {
    'Tunis': ['Tunis', 'La Marsa', 'Carthage', 'Le Bardo', 'El Menzah', 'Bab Souika', 'Cité El Khadra'],
    'Ariana': ['Ariana Ville', 'Raoued', 'Kalaat Landlous', 'Mnihla', 'Ennasr'],
    'Ben Arous': ['Ben Arous', 'Mégrine', 'Fouchana', 'Hammam Lif', 'Radès', 'Boumhel'],
    'Nabeul': ['Nabeul', 'Hammamet', 'Kélibia', 'Korba', 'Menzel Temime', 'El Haouaria'],
    'Bizerte': ['Bizerte', 'Menzel Bourguiba', 'Utique', 'Ras Jebel', 'Mateur'],
    'Beja': ['Beja', 'Tajerouine', 'Nadhour', 'Goubellat'],
    'Jendouba': ['Jendouba', 'Oued Meliz', 'Fernana', 'Tabarka', 'Aïn Draham'],
    'Kef': ['Le Kef', 'Tajerouine', 'Dahmani', 'Ksar el Boukhari'],
    'Sousse': ['Sousse Medina', 'Kondar', 'Hergla', 'Sidi Bou Ali', 'Enfidha'],
    'Monastir': ['Monastir', 'Moknine', 'Sousse', 'Benzart'],
    'Mahdia': ['Mahdia Centre', 'El Jem', 'Chorbane', 'Hbira'],
    'Sfax': ['Sfax', 'Mahrès', 'Kerkennah', 'Skhira', 'Gremda'],
    'Gabès': ['Gabès', 'Matmata', 'El Hamma', 'Mareth'],
    'Mednine': ['Mednine', 'Ben Guerdane', 'Zarzis', 'Benkhadra'],
    'Kairouan': ['Kairouan', 'Chouaia', 'Sidi Bouzid', 'El Ala'],
    'Sidi Bouzid': ['Sidi Bouzid', 'Mezzouna', 'Bir Lahmar', 'Bouarada'],
    'Gafsa': ['Gafsa', 'Redeyef', 'Mdhila', 'Metlaoui', 'Thala'],
    'Tozeur': ['Tozeur', 'Nefta', 'Tamerza', 'Degache'],
    'Tataouine': ['Tataouine', 'Bir Aouinine', 'Ksar Ouled Soltane'],
    'Zaghouan': ['Zaghouan', 'Nadhour', 'Tebourba'],
    'Kébili': ['Kébili', 'Douz', 'Chébika', 'Sidi Bouzid'],
    'Siliana': ['Siliana', 'Makthar', 'El Haria', 'Goubellat'],
  };

  const [villes, setVilles] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setForm(prev => ({ ...prev, nom: parsedUser.nom || parsedUser.name || '', email: parsedUser.email || '' }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGouvernoratChange = (e) => {
    const selectedGouvernorat = e.target.value;
    setForm({ ...form, gouvernorat: selectedGouvernorat, ville: '' });
    setVilles(gouvernorats[selectedGouvernorat] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) {
        alert("Vous devez être connecté pour passer une commande.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser.token;

      const commandeData = {
        adresse: form.rue,
        gouvernorat: form.gouvernorat,
        ville: form.ville,
        telephone: form.telephone,
        email: form.email,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalPrice: cart.totalPrice
      };

      const response = await axios.post(
        "http://localhost:7777/commandes/",
        commandeData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Commande passée avec succès !');
      await clearUserCart();
      navigate('/user/panier');
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
      if (error.response) {
        alert(`Erreur : ${error.response.data.message || 'Une erreur est survenue lors de la validation de votre commande.'}`);
      } else {
        alert('Une erreur est survenue lors de la validation de votre commande.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/user/panier');
  };

  if (loading) return (
    <UserLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    </UserLayout>
  );

  if (!cart || cart.items.length === 0) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Votre panier est vide</h2>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à la boutique
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Détails de la commande</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
              <FaUser className="text-teal-500 mr-2" />
              <input 
                type="text"
                name="nom"
                placeholder="Nom"
                value={form.nom}
                readOnly
                className="w-full outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <FaMapMarkerAlt className="text-teal-500 mr-2" />
              <select 
                name="gouvernorat"
                value={form.gouvernorat}
                onChange={handleGouvernoratChange}
                required
                className="w-full outline-none"
              >
                <option value="">Sélectionnez un gouvernorat</option>
                {Object.keys(gouvernorats).map((gov, index) => (
                  <option key={index} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <FaMapMarkerAlt className="text-teal-500 mr-2" />
              <select 
                name="ville"
                value={form.ville}
                onChange={handleChange}
                required
                className="w-full outline-none"
                disabled={!form.gouvernorat}
              >
                <option value="">Sélectionnez une ville</option>
                {villes.map((ville, index) => (
                  <option key={index} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-2 col-span-2">
              <FaMapMarkerAlt className="text-teal-500 mr-2" />
              <input 
                type="text"
                name="rue"
                placeholder="Rue"
                value={form.rue}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <FaPhone className="text-teal-500 mr-2" />
              <input 
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <FaEnvelope className="text-teal-500 mr-2" />
              <input 
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-xl font-bold mb-2">Résumé de la commande</h2>
            <ul className="space-y-2">
              {cart.items.map(item => (
                <li key={item.product._id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toFixed(2)} DT</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total :</span>
              <span>{cart.totalPrice.toFixed(2)} DT</span>
            </div>
          </div>
          <div className="flex justify-between gap-4">
  <button
    type="submit"
    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition transform hover:scale-105 shadow-md"
  >
    Confirmer la commande
  </button>
  <button
    type="button"
    onClick={() => navigate('/user/panier')}
    className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-semibold transition transform hover:scale-105 shadow-md"
  >
    Annuler
  </button>
</div>

        </form>
      </div>
    </UserLayout>
  );
};

export default CheckoutDetails;
