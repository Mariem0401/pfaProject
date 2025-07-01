import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUser,
  FaExclamationCircle
} from 'react-icons/fa';

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('userData')
          ? JSON.parse(localStorage.getItem('userData')).token
          : localStorage.getItem('userToken');

        const response = await axios.get(`http://localhost:7777/users/condidat/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Fonction pour générer l'URL de l'avatar
  const getAvatarUrl = (user) => {
    if (user?.avatar) return user.avatar;
    const name = user?.name ? encodeURIComponent(user.name) : 'Default';
    return `https://ui-avatars.com/api/?name=${name}&background=6B7280&color=fff&size=120&font-size=0.5`;
  };

  // Fonction pour calculer l'âge
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <FaExclamationCircle className="text-red-500 text-2xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Réessayer
              </button>
              <Link
                to="/gestionUser"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* En-tête */}
          <div className="mb-6">
            <Link
              to="/gestionUser"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Retour à la liste des utilisateurs
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Détails de l'utilisateur
            </h1>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            
            {/* En-tête de la carte avec avatar */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={getAvatarUrl(user)}
                  alt={`Avatar de ${user.name}`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">ID: {user._id}</p>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Informations de contact */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations de contact
                  </h3>
                  <div className="space-y-4">
                    
                    <div className="flex items-start space-x-3">
                      <FaEnvelope className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <FaPhone className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Téléphone</p>
                        <p className="text-gray-900">{user.phone || 'Non renseigné'}</p>
                      </div>
                    </div>

                    {user.address && (
                      <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Adresse</p>
                          <p className="text-gray-900">{user.address}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations personnelles
                  </h3>
                  <div className="space-y-4">
                    
                    <div className="flex items-start space-x-3">
                      <FaCalendar className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                        <p className="text-gray-900">
                          {user.birthdate ? (
                            <>
                              {new Date(user.birthdate).toLocaleDateString('fr-FR')}
                              {calculateAge(user.birthdate) && (
                                <span className="text-gray-500 ml-2">
                                  ({calculateAge(user.birthdate)} ans)
                                </span>
                              )}
                            </>
                          ) : (
                            'Non renseignée'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <FaUser className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Statut</p>
                        <p className="text-gray-900">
                          {user.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactif
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {user.createdAt && (
                      <div className="flex items-start space-x-3">
                        <FaCalendar className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Inscription</p>
                          <p className="text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Bio si présente */}
              {user.bio && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">À propos</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              )}

            </div>

            {/* Pied de page avec actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Dernière mise à jour : {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
                <Link
                  to="/gestionUser"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Retour à la liste
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetailsPage;