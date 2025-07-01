import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../../layouts/user/UserLayout';
import { 
  FaArrowLeft, 
  FaPaw, 
  FaTag, 
  FaCalendar, 
  FaVenusMars, 
  FaFileMedicalAlt, 
  FaPrint,
  FaEdit,
  FaClipboardList
} from 'react-icons/fa';

const VoirProfilAnimal = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('infos');

  useEffect(() => {
    const fetchAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
        const response = await axios.get(`http://localhost:7777/animaux/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          setAnimal(response.data.data);
        } else {
          setError('Profil animal non trouvé.');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du profil animal:', err);
        setError('Erreur lors du chargement du profil animal.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Health status indicator
  const getHealthStatus = () => {
    if (!animal || !animal.healthRecords || animal.healthRecords.length === 0) {
      return { color: 'yellow', text: 'Aucune information' };
    }
    
    // Example logic - could be enhanced based on actual requirements
    const hasRecentVisit = animal.healthRecords.some(record => {
      const nextVisit = new Date(record.nextVisit);
      const now = new Date();
      return nextVisit > now;
    });
    
    return hasRecentVisit 
    //  ? { color: 'green', text: 'À jour' }
     // : { color: 'red', text: 'Visite requise' };
  };

  const healthStatus = animal ? getHealthStatus() : { color: 'gray', text: 'Inconnu' };

  // Loading state
  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Link to="/annonce" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" /> Retour au annonce
          </Link>
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UserLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Link to="/annonce" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" /> Retour au annonce
          </Link>
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="rounded-full bg-red-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Une erreur est survenue</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  // No animal found
  if (!animal) {
    return (
      <UserLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Link to="/user/annonce" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" /> Retour au annonce
          </Link>
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="rounded-full bg-yellow-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <FaPaw className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun profil animal trouvé</h3>
            <p className="text-gray-500">Le profil que vous recherchez n'existe pas ou a été supprimé.</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/annonce" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <FaArrowLeft className="mr-2" /> Retour au annonce
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {/* Hero section with photo */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-teal-500 to-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold shadow-sm">{animal.nom}</h1>
                <p className="text-lg font-medium mt-2">
                  {animal.espece} {animal.race ? `• ${animal.race}` : ''}
                </p>
              </div>
            </div>
            {animal.photo && (
              <div className="absolute -bottom-16 w-full flex justify-center">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                  <img 
                    src={animal.photo} 
                    alt={animal.nom} 
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            )}
            {!animal.photo && (
              <div className="absolute -bottom-16 w-full flex justify-center">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg">
                  <FaPaw className="h-16 w-16 text-gray-300" />
                </div>
              </div>
            )}
          </div>

          {/* Status indicator */}
          <div className="pt-20 px-4 sm:px-6">
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-${healthStatus.color}-100 text-${healthStatus.color}-800`}>
                {healthStatus.text}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mt-6">
            <nav className="-mb-px flex justify-center space-x-8">
              <button
                className={`${
                  activeTab === 'infos'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('infos')}
              >
                Informations générales
              </button>
              <button
                className={`${
                  activeTab === 'sante'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('sante')}
              >
                Dossier médical
              </button>
            </nav>
          </div>

          {/* Content section */}
          <div className="px-4 py-6 sm:px-6">
            {activeTab === 'infos' && (
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <FaPaw className="text-teal-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Identité</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-500 w-24">Nom:</span>
                      <span className="text-sm text-gray-900">{animal.nom}</span>
                    </div>
                    {animal.espece && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-500 w-24">Espèce:</span>
                        <span className="text-sm text-gray-900">{animal.espece}</span>
                      </div>
                    )}
                    {animal.race && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-500 w-24">Race:</span>
                        <span className="text-sm text-gray-900">{animal.race}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <FaVenusMars className="text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Caractéristiques</h3>
                  </div>
                  <div className="space-y-3">
                    {animal.age !== undefined && animal.age !== null && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-500 w-24">Âge:</span>
                        <span className="text-sm text-gray-900">{animal.age} an{animal.age > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {animal.genre && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-500 w-24">Genre:</span>
                        <span className="text-sm text-gray-900">
                          {animal.genre === 'male' ? 'Mâle' : 'Femelle'}
                        </span>
                      </div>
                    )}
                    {/* On pourrait ajouter d'autres caractéristiques ici */}
                  </div>
                </div>

                {/* Autres sections d'informations */}
                {/* Vous pouvez ajouter d'autres blocs d'informations ici */}
              </div>
            )}

            {activeTab === 'sante' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <FaFileMedicalAlt className="inline mr-2 text-red-500" /> 
                    Dossier médical
                  </h3>
                  
                </div>

                {(!animal.healthRecords || animal.healthRecords.length === 0) ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <FaFileMedicalAlt className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier médical</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par ajouter une première visite médicale.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {animal.healthRecords.map((record, index) => (
                      <div key={record._id || index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-medium text-gray-900">{record.type}</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {formatDate(record.nextVisit)}
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h5>
                              <p className="text-sm text-gray-900">{record.description}</p>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Vétérinaire</h5>
                              <p className="text-sm text-gray-900">{record.veterinarian}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default VoirProfilAnimal;