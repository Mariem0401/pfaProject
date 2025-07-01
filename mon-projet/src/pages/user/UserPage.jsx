import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../layouts/user/UserLayout";
import { FaPaw, FaHeart, FaShoppingCart, FaDog, FaCat, FaHome, FaSearch } from "react-icons/fa";
import { FaBowlFood, FaHandHoldingHeart, FaStar } from "react-icons/fa6";
import { motion } from "framer-motion";

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-50px" }}
  >
    {children}
  </motion.div>
);

const UserPage = () => {
  const [activeCategory, setActiveCategory] = useState("tous");
  const [animals, setAnimals] = useState([]);

  // Données simulées pour les annonces et produits
  const allPets = [
    { id: 1, name: "Max", type: "Chien", age: "2 ans", location: "Tunis", image: "/dog-sample.jpg", category: "chiens" },
    { id: 2, name: "Misty", type: "Chat", age: "6 mois", location: "Sousse", image: "/cat-sample.jpg", category: "chats" },
    { id: 3, name: "Rocky", type: "Chien", age: "4 ans", location: "Sfax", image: "/dog2-sample.jpg", category: "chiens" },
    { id: 4, name: "Luna", type: "Chat", age: "1 an", location: "Tunis", image: "/cat2-sample.jpg", category: "chats" },
  ];

  const featuredProducts = [
    { id: 1, name: "Nourriture Premium", price: "25 TND", image: "/food-sample.jpg", rating: 4.8, reviews: 56 },
    { id: 2, name: "Jouet interactif", price: "12 TND", image: "/toy-sample.jpg", rating: 4.6, reviews: 32 },
    { id: 3, name: "Panier confort luxe", price: "35 TND", image: "/bed-sample.jpg", rating: 4.9, reviews: 78 },
  ];

  const testimonials = [
    {
      id: 1,
      content: "J'ai adopté mon chat Misty grâce à cette plateforme. Le processus était simple et l'équipe très professionnelle.",
      author: "Amira",
      location: "Tunis",
      rating: 5,
      avatar: "/avatar1.jpg"
    },
    {
      id: 2,
      content: "La garde temporaire m'a sauvé la vie quand j'ai dû voyager. Mon chien a été bien traité et j'ai reçu des photos quotidiennes.",
      author: "Mehdi",
      location: "Sousse",
      rating: 5,
      avatar: "/avatar2.jpg"
    },
    {
      id: 3,
      content: "Boutique avec des prix compétitifs et livraison rapide. Je recommande pour les produits de qualité.",
      author: "Leila",
      location: "Sfax",
      rating: 4,
      avatar: "/avatar3.jpg"
    }
  ];

  // Filtrer les animaux en fonction de la catégorie sélectionnée
  useEffect(() => {
    if (activeCategory === "tous") {
      setAnimals(allPets);
    } else {
      setAnimals(allPets.filter(pet => pet.category === activeCategory));
    }
  }, [activeCategory]);

  // Générer les étoiles pour les évaluations
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return { stars };
  };

  return (
    <UserLayout>
      <section className="relative py-16 md:py-24 bg-indigo-50 overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute -bottom-10 -left-10 opacity-10">
          <svg width="300" height="300" viewBox="0 0 100 100">
            <path d="M30,10 C40,10 40,20 50,20 C60,20 60,10 70,10 C80,10 80,20 90,20"
              stroke="white" strokeWidth="8" fill="none"
              strokeLinecap="round" />
            <path d="M10,30 C10,40 20,40 20,50 C20,60 10,60 10,70 C10,80 20,80 20,90"
              stroke="white" strokeWidth="8" fill="none"
              strokeLinecap="round" />
            <path d="M30,90 C40,90 40,80 50,80 C60,80 60,90 70,90 C80,90 80,80 90,80"
              stroke="white" strokeWidth="8" fill="none"
              strokeLinecap="round" />
            <path d="M90,30 C90,40 80,40 80,50 C80,60 90,60 90,70 C90,80 80,80 80,90"
              stroke="white" strokeWidth="8" fill="none"
              strokeLinecap="round" />
          </svg>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 flex items-center"
        >
          <div className="hidden md:block w-1/2 mr-8">
            <div
              className="overflow-hidden "
              style={{
                backgroundImage: "url('/acc.png')", // Remplace par ton chemin d'image
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: '400px'
              }}
            ></div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <span className="text-6xl text-indigo-600">🐾</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              Trouvez votre compagnon idéal <br className="hidden md:block" />
              en <span className="text-yellow-400">Tunisie</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-gray-700 opacity-90 max-w-md">
              Adoptez, gardez et prenez soin de vos animaux grâce à notre
              plateforme 100% tunisienne dédiée au bien-être animal.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link
                to="/annonce"
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaHeart className="group-hover:scale-110 transition-transform" />
                Voir les animaux à adopter
              </Link>
              <Link
                to="/shop"
                className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaShoppingCart className="group-hover:scale-110 transition-transform" />
                Découvrir la boutique
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="mt-12 relative z-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center bg-white rounded-2xl shadow-lg p-2 border border-indigo-100">
            <div className="hidden md:flex items-center gap-2 border-r border-gray-200 pr-4">
              <div className="text-gray-600 font-medium">Rechercher:</div>
              <select className="bg-transparent border-none focus:ring-0 text-gray-600 font-medium cursor-pointer">
                <option>Tous les animaux</option>
                <option>Chiens</option>
                <option>Chats</option>
                <option>Autres</option>
              </select>
            </div>
            <div className="flex-1 flex items-center px-4">
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                className="w-full py-3 border-none focus:ring-0 text-gray-800 placeholder-gray-400"
              />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <FaSearch /> <span className="hidden md:inline">Rechercher</span>
            </button>
          </div>
        </div>
      </section>

      {/* Statistiques avec nouvelles couleurs */}
      <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        <AnimatedCard>
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-indigo-400 group hover:-translate-y-1 transition-transform duration-200">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FaPaw className="text-indigo-600 text-xl" />
              </div>
              <div className="text-3xl font-bold text-indigo-600">1,200+</div>
              <div className="text-gray-600 mt-2 text-sm md:text-base">Animaux adoptés</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-purple-400 group hover:-translate-y-1 transition-transform duration-200">
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FaHome className="text-purple-600 text-xl" />
              </div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600 mt-2 text-sm md:text-base">Gardiens vérifiés</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-pink-400 group hover:-translate-y-1 transition-transform duration-200">
            <div className="flex flex-col items-center">
              <div className="bg-pink-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FaBowlFood className="text-pink-600 text-xl" />
              </div>
              <div className="text-3xl font-bold text-pink-600">300+</div>
              <div className="text-gray-600 mt-2 text-sm md:text-base">Produits disponibles</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-violet-400 group hover:-translate-y-1 transition-transform duration-200">
            <div className="flex flex-col items-center">
              <div className="bg-violet-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FaHandHoldingHeart className="text-violet-600 text-xl" />
              </div>
              <div className="text-3xl font-bold text-violet-600">20+</div>
              <div className="text-gray-600 mt-2 text-sm md:text-base">Villes couvertes</div>
            </div>
          </div>
        </AnimatedCard>
      </section>

      {/* Section Annonces */}
      <section className="mt-24 px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nos protégés cherchent une famille</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des animaux adorables attendent leur foyer pour toujours ou une garde temporaire en Tunisie.
          </p>

          {/* Catégories de filtre */}
          <div className="flex justify-center mt-8 gap-3 flex-wrap">
            <button
              onClick={() => setActiveCategory("tous")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "tous"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveCategory("chiens")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${activeCategory === "chiens"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FaDog /> Chiens
            </button>
            <button
              onClick={() => setActiveCategory("chats")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${activeCategory === "chats"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <FaCat /> Chats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {animals.map((pet, index) => (
            <AnimatedCard key={pet.id} delay={index * 0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`${pet.type === "Chien"
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-pink-100 text-pink-800'
                      } text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5`}
                    >
                      {pet.type === "Chien" ? <FaDog /> : <FaCat />}
                      {pet.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
                  <div className="text-gray-500 text-sm flex items-center gap-2 mb-3">
                    <span>{pet.age}</span>
                    <span>•</span>
                    <span>{pet.location}</span>
                  </div>
                  <Link
                    to={`/annonce/${pet.id}`}
                    className="mt-2 flex justify-between items-center"
                  >
                    <span className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                      Voir détails
                    </span>
                    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <FaHeart />
                    </span>
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/annonce"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            <FaHeart className="mr-2" />
            Voir tous les animaux disponibles
          </Link>
        </div>
      </section>

      {/* Section Services */}
      <section className="mt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-16 px-4 md:px-12 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nos services complets</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous et votre animal avez besoin en un seul endroit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCard>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all group hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Adoption</h3>
              <p className="text-gray-600 mb-4">
                Trouvez votre compagnon idéal parmi nos animaux à adopter dans toute la Tunisie.
              </p>
              <Link
                to="/annonce"
                className="text-indigo-600 font-medium inline-flex items-center group-hover:text-indigo-800"
              >
                Découvrir
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all group hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="bg-gradient-to-br from-pink-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-200 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                <FaHome className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Garde temporaire</h3>
              <p className="text-gray-600 mb-4">
                Des gardiens vérifiés pour s'occuper de votre animal lorsque vous êtes absent.
              </p>
              <Link
                to="/garde"
                className="text-pink-600 font-medium inline-flex items-center group-hover:text-pink-800"
              >
                Découvrir
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition-all group hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                <FaBowlFood className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Boutique en ligne</h3>
              <p className="text-gray-600 mb-4">
                Tout le nécessaire pour le bien-être de votre animal avec livraison en Tunisie.
              </p>
              <Link
                to="/shop"
                className="text-purple-600 font-medium inline-flex items-center group-hover:text-purple-800"
              >
                Découvrir
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Section Produits */}
      <section className="mt-24 px-4 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nos produits populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des produits de qualité pour le confort et la santé de votre animal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {featuredProducts.map((product, index) => (
            <AnimatedCard key={product.id} delay={index * 0.1}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
                <div className="relative">
                  <div className="h-56 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-800 font-medium">{product.rating}</span>
                      <span className="text-gray-500 text-xs">({product.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  <div className="mt-2 text-indigo-600 font-bold mb-3">{product.price}</div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/shop/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center"
                    >
                      Voir détails
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
                      aria-label="Ajouter au panier"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-purple-600 hover:bg-purple-700 transition-all transform hover:scale-105"
          >
            <FaShoppingCart className="mr-2" />
            Explorer toute la boutique
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className="mt-24 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Prêt à trouver votre compagnon idéal ?
        </h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Créer un compte gratuit
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white text-teal-600 border-2 border-teal-600 rounded-full font-bold hover:bg-teal-50 transition-all transform hover:scale-105"
          >
            En savoir plus sur nous
          </Link>
        </div>
      </section>
    </UserLayout>
  );
};

export default UserPage;