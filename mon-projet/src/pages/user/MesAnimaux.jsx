import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserLayout from "../../layouts/user/UserLayout";
import { PawPrint, Loader, AlertCircle, ChevronRight, Search, Plus } from "lucide-react";

export default function MesAnimaux() {
  const [animaux, setAnimaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAnimaux = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");
        if (!token) {
          setError("Vous n'êtes pas authentifié. Veuillez vous connecter.");
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:7777/animaux/mes-animaux", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAnimaux(res.data.data || []);
      } catch (err) {
        console.error("Erreur lors du fetch des animaux :", err);
        // More user-friendly error message based on status code if possible
        if (err.response && err.response.status === 401) {
          setError("Votre session a expiré. Veuillez vous reconnecter.");
        } else {
          setError("Erreur lors du chargement des animaux. Veuillez réessayer plus tard.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnimaux();
  }, []);

  const filteredAnimaux = animaux.filter(animal =>
    animal.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.espece.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (animal.race && animal.race.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement de vos animaux...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <PawPrint className="h-8 w-8 mr-2 text-blue-600" />
              Mes Animaux
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Gérez les profils de vos compagnons</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un animal..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/user/create-animal"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center text-sm font-medium"
            >
              <Plus className="h-5 w-5 mr-1" />
              Ajouter un animal
            </Link>
          </div>
        </div>

        {/* Contenu principal */}
        {filteredAnimaux.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <PawPrint className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "Aucun animal trouvé" : "Aucun animal ajouté"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Votre recherche n'a renvoyé aucun résultat."
                : "Vous n'avez pas encore ajouté d'animaux à votre profil."
              }
            </p>
            {!searchTerm && (
              <Link
                to="/user/create-animal"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 ease-in-out shadow-md font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter mon premier animal
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimaux.map((animal) => (
              <Link key={animal._id} to={`/animal/${animal._id}`} className="block group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-200"> {/* Added bg-gray-200 as placeholder */}
                    <img
                      src={animal.photo || "/default-animal.jpg"}
                      alt={`Photo de ${animal.nom}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.src = "/default-animal.jpg"; e.target.onerror = null; }} // Added onerror = null to prevent infinite loop
                      loading="lazy" // Add lazy loading for performance
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white drop-shadow">{animal.nom}</h3> {/* Added drop-shadow for text */}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="bg-blue-100 text-blue-800 font-medium py-0.5 px-2 rounded-full"> {/* Changed to rounded-full and smaller padding */}
                        {animal.espece.charAt(0).toUpperCase() + animal.espece.slice(1)}
                      </span>
                      {animal.age !== undefined && animal.age !== null && ( // Improved age check
                        <span className="text-gray-600">{animal.age} an{animal.age > 1 ? 's' : ''}</span>
                      )}
                    </div>

                    <div className="text-gray-700 mb-3 text-sm"> {/* Reduced margin-bottom */}
                      <span className="font-medium">Race:</span> {animal.race || "Non précisé"}
                    </div>

                    {animal.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{animal.description}</p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <span className="text-blue-600 group-hover:text-blue-800 font-semibold flex items-center transition-colors duration-200"> {/* Changed font-medium to font-semibold */}
                        Voir détails
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-200" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}