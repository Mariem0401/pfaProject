import React, { useState } from 'react';
import UserLayout from "../../layouts/user/UserLayout";
import { useNavigate } from 'react-router-dom';

const CreateAnimalForm = () => {
  const [nom, setNom] = useState('');
  const [espece, setEspece] = useState('');
  const [age, setAge] = useState('');
  const [race, setRace] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 const navigate = useNavigate();
  // List of species
  const speciesList = [
    'Chien',
    'Chat',
    'Oiseau',
    'Lapin',
    'Reptile',
    'Poisson',
    'Cheval',
  ];

  // Breed lists for specific species
  const breedLists = {
    Chien: [
      'Labrador',
      'Berger Allemand',
      'Golden Retriever',
      'Bulldog',
      'Caniche',
      'Chihuahua',
    ],
    Chat: [
      'Maine Coon',
      'Siamois',
      'Persan',
      'Bengal',
      'Ragdoll',
      'Sphynx',
    ],
    Oiseau: ['Perroquet', 'Canari', 'Perruche', 'Toui'],
    Lapin: ['Bélier', 'Nain', 'Angora', 'Rex'],
    Reptile: ['Iguane', 'Serpent', 'Tortue', 'Gecko'],
    Poisson: ['Poisson rouge', 'Betta', 'Guppy', 'Discus'],
    Cheval: ['Pur-sang', 'Arabe', 'Quarter Horse', 'Frison'],
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!nom || !espece) {
      setErrorMessage('Le nom et l\'espèce sont obligatoires.');
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('espece', espece);
    if (age) formData.append('age', age);
    if (race) formData.append('race', race);
    if (genre) formData.append('genre', genre);
    if (description) formData.append('description', description);
    if (photo) formData.append('photo', photo);

    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token || localStorage.getItem("userToken");

      const response = await fetch('http://localhost:7777/animaux/createProfil', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      navigate("/user/mes-animaux", { replace: true });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Animal créé avec succès!');
        setNom('');
        setEspece('');
        setAge('');
        setRace('');
        setGenre('');
        setDescription('');
        setPhoto(null);
      } else {
        setErrorMessage(data.message || 'Erreur lors de la création de l\'animal.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setErrorMessage('Une erreur s\'est produite lors de l\'envoi du formulaire.');
    }
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  // Reset breed when species changes
  const handleSpeciesChange = (e) => {
    setEspece(e.target.value);
    setRace(''); // Reset breed when species changes
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ajouter un Animal</h2>

          {/* Error and Success Messages */}
          {errorMessage && (
            <div className="flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                id="nom"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="espece" className="block text-sm font-medium text-gray-700 mb-1">Espèce</label>
              <select
                id="espece"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={espece}
                onChange={handleSpeciesChange}
                required
              >
                <option value="" disabled>Sélectionner l'espèce</option>
                {speciesList.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-1">Race</label>
              <select
                id="race"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                disabled={!espece}
              >
                <option value="" disabled>Sélectionner la race</option>
                {espece && breedLists[espece]?.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
                {!breedLists[espece] && (
                  <option value="Autre">Autre</option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
              <input
                type="number"
                id="age"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                id="genre"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">Sélectionner le genre</option>
                <option value="male">Mâle</option>
                <option value="femelle">Femelle</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                id="photo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                onChange={handlePhotoChange}
              />
              {photo && (
                <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: <span className="italic">{photo.name}</span></p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default CreateAnimalForm;