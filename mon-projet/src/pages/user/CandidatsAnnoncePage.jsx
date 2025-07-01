import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../../layouts/user/UserLayout';
import { FaArrowLeft, FaSpinner, FaExclamationCircle, FaEnvelope, FaCalendar, FaUser } from 'react-icons/fa';

const CandidatsAnnoncePage = () => {
  const { id } = useParams(); // id de l'annonce
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        const token = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData")).token
          : localStorage.getItem("userToken");

        const response = await axios.get(`http://localhost:7777/adoptions/annonces/${id}/candidats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCandidats(response.data.data || response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de chargement des candidats");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, [id]);

  // Fonction pour générer l'URL de l'avatar
  const getAvatarUrl = (applicant) => {
    if (applicant.avatar) return applicant.avatar;
    const name = applicant.name ? encodeURIComponent(applicant.name) : 'Default';
    return `https://ui-avatars.com/api/?name=${name}&background=6C63FF&color=fff&size=128`;
  };
// Ajoute ce state juste après const [error, setError] = useState(null);
const [acceptingId, setAcceptingId] = useState(null);

// Ajoute cette fonction juste avant le return principal :
const handleAccept = async (applicationId) => {
  try {
    setAcceptingId(applicationId);
    const token = JSON.parse(localStorage.getItem('userData')).token;

    await axios.patch(
      `http://localhost:7777/adoptions/candidats/${applicationId}/accepter`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Mise à jour locale
    setCandidats(prev =>
      prev.map(c =>
        c._id === applicationId ? { ...c, status: 'selected' } : c
      )
    );
    alert('Candidature acceptée !');
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur lors de l’acceptation.');
  } finally {
    setAcceptingId(null);
  }
};


  if (loading) return (
    <UserLayout>
      <div className="flex justify-center items-center min-h-[60vh] bg-[#F8F8FC]">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-[#6C63FF] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement des candidats...</p>
        </div>
      </div>
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#F8F8FC]">
        <div className="bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-xl flex items-start">
          <FaExclamationCircle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Erreur</h3>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1.5 bg-[#E0E7FF] text-[#6C63FF] font-semibold rounded-xl hover:bg-[#D1D7FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Link
          to="/user/mes-annonces"
          className="mt-6 inline-flex items-center px-4 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
        >
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Retour aux annonces
        </Link>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#F8F8FC]">
        {/* Navigation */}
        <nav className="flex items-center text-gray-500 text-sm mb-6">
          <Link to="/user/mes-annonces" className="text-[#6C63FF] hover:text-[#5753C9] transition-colors">
            Mes Annonces
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-800">Candidats</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Candidats pour votre annonce
        </h1>

        {candidats.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#E0E7FF] shadow-xl">
            <img
              src="https://ui-avatars.com/api/?name=Default&background=6C63FF&color=fff&size=128"
              alt="Avatar par défaut"
              className="h-12 w-12 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg font-medium">
              Aucun candidat pour le moment
            </p>
            <p className="text-gray-500 mt-2">
              Les candidatures apparaîtront ici lorsqu'elles seront soumises.
            </p>
            <Link
              to="/user/mes-annonces"
              className="mt-4 inline-flex items-center px-4 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Retour aux annonces
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {candidats.map((candidat) => (
              <div
                key={candidat._id}
                className="bg-white rounded-xl shadow-xl border border-[#E0E7FF] p-5 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={getAvatarUrl(candidat.applicant)}
                      alt={`Avatar de ${candidat.applicant.name}`}
                      className="h-10 w-10 rounded-full object-cover bg-[#E0E7FF] hover:scale-105 transition-transform duration-200"
                      onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {candidat.applicant.name}
                      </h2>
                      <span
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[#E0E7FF] text-[#6C63FF]"
                      >
                        {candidat.status === 'pending' ? 'En attente' : candidat.status}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-gray-600 flex items-center text-sm">
                        <FaEnvelope className="h-4 w-4 mr-2 text-[#6C63FF]" />
                        {candidat.applicant.email}
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <FaCalendar className="h-4 w-4 mr-2 text-[#6C63FF]" />
                        Date de candidature :{' '}
                        {new Date(candidat.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                      {candidat.message && (
                        <p className="text-gray-600 mt-2 text-sm italic bg-gray-50 p-3 rounded-md">
                          <strong>Message :</strong> {candidat.message}
                        </p>
                      )}
                    </div>
                   <div className="mt-3 flex flex-wrap gap-2">
  <button
    className="group relative inline-flex items-center px-3 py-1.5 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5753C9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 text-sm"
    aria-label={`Contacter ${candidat.applicant.name}`}
  >
    <FaEnvelope className="h-4 w-4 mr-1" />
    Contacter
    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-opacity">
      Envoyer un message
    </span>
  </button>

  <Link
    to={`/condidat/profil/${candidat.applicant._id}`}
    className="group relative inline-flex items-center px-3 py-1.5 bg-[#E0E7FF] text-[#6C63FF] font-semibold rounded-xl hover:bg-[#D1D7FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 text-sm"
    aria-label={`Voir le profil de ${candidat.applicant.name}`}
  >
    <FaUser className="h-4 w-4 mr-1" />
    Voir le profil
    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-opacity">
      Voir les détails
    </span>
  </Link>

  {candidat.status === 'pending' && (
    <button
      onClick={() => handleAccept(candidat._id)}
      disabled={acceptingId === candidat._id}
      className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        acceptingId === candidat._id
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
          : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
      }`}
    >
      ✅ Accepter la candidature
    </button>
  )}
</div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          to="/user/mes-annonces"
          className="mt-8 inline-flex items-center px-4 py-3 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#7C3AED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
        >
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Retour aux annonces
        </Link>
      </div>
    </UserLayout>
  );
};

export default CandidatsAnnoncePage;