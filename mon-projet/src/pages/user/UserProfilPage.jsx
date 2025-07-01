import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaExclamationCircle, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaInfoCircle,
  FaUser,
  FaCheckCircle,
  FaStar,
  FaHeart
} from 'react-icons/fa';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { id, annonceId } = useParams();

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
    return `https://ui-avatars.com/api/?name=${name}&background=6366F1&color=fff&size=200&font-size=0.5`;
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
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <p className="text-gray-700 font-medium text-lg">Chargement du profil...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter un instant</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationCircle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Oops! Une erreur s'est produite</h3>
              <p className="text-red-600 text-lg mb-8">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Réessayer
                </button>
                <Link
                  to="/user/mes-annonces"
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Retour aux annonces
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation améliorée */}
          <nav className="flex items-center text-sm mb-8 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-white/20">
            <Link 
              to="/user/mes-annonces" 
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 flex items-center"
            >
              <FaArrowLeft className="mr-2 text-xs" />
              Mes Annonces
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <span className="font-semibold text-gray-800 flex items-center">
              <FaUser className="mr-2 text-xs" />
              Profil Candidat
            </span>
          </nav>

          {/* Header du profil */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl mb-8 overflow-hidden">
            <div className="relative p-8 pb-24">
              {/* Décoration de fond */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Profil de {user.name}
                </h1>
                <p className="text-indigo-100 text-lg opacity-90">
                  Découvrez les informations détaillées du candidat
                </p>
              </div>
            </div>
          </div>

          {/* Card principale du profil */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            {/* Avatar et informations principales */}
            <div className="relative -mt-16 px-8 pt-8 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={getAvatarUrl(user)}
                    alt={`Avatar de ${user.name}`}
                    className={`relative h-32 w-32 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-all duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => { 
                      e.target.src = '/default-avatar.jpg';
                      setImageLoaded(true);
                    }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 h-32 w-32 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse border-4 border-white"></div>
                  )}
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-1" />
                      Profil vérifié
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaStar className="mr-1" />
                      Candidat actif
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Colonne gauche - Informations de contact */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Informations de contact
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <FaEnvelope className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="text-gray-800 font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-200">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <FaPhone className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Téléphone</p>
                        <p className="text-gray-800 font-semibold">
                          {user.phone || 'Non renseigné'}
                        </p>
                      </div>
                    </div>

                    {user.address && (
                      <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <FaMapMarkerAlt className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Adresse</p>
                          <p className="text-gray-800 font-semibold">{user.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Informations personnelles */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Informations personnelles
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow duration-200">
  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
    <FaCalendar className="text-orange-600" />
  </div>
  <div>
    <p className="text-sm text-gray-500 font-medium">Date de naissance</p>
    <p className="text-gray-800 font-semibold">
      {user.birthdate ? ( // Changed from user.datebirth to user.birthdate
        <>
          {new Date(user.birthdate).toLocaleDateString('fr-FR')} {/* Changed from user.datebirth to user.birthdate */}
          {calculateAge(user.birthdate) && ( // Changed from user.datebirth to user.birthdate
            <span className="text-sm text-gray-500 ml-2">
              ({calculateAge(user.birthdate)} ans) {/* Changed from user.datebirth to user.birthdate */}
            </span>
          )}
        </>
      ) : (
        'Non renseignée'
      )}
    </p>
  </div>
</div>

                    {user.bio && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                            <FaInfoCircle className="text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">À propos</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed pl-14">{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de retour amélioré */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to={`/condidats/${annonceId}`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl group"
                >
                  <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform duration-200" />
                  Retour à la liste des candidatures
                  <div className="ml-3 w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors duration-200"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Badge flottant */}
          <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-2xl border border-white/20 hover:scale-110 transition-transform duration-200 cursor-pointer group">
              <FaHeart className="text-red-500 text-xl group-hover:text-red-600 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;