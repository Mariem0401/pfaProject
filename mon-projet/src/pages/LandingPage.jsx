import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-orange-500">🐾 AdoptiPet</h1>
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="px-5 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition">
            Connexion
          </Link>
          <Link to="/signup" className="px-5 py-2 border border-orange-500 text-orange-500 hover:bg-orange-100 rounded-xl transition">
            Inscription
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white text-orange-600 rounded-lg shadow-lg flex flex-col space-y-2 p-4 md:hidden">
            <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg">Connexion</Link>
            <Link to="/signup" className="px-4 py-2 border border-orange-500 rounded-lg">Inscription</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-orange-100 to-yellow-50 py-24 px-6 text-center overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-orange-600 mb-6 drop-shadow-sm"
        >
          Offrez un foyer à un ami à quatre pattes 🐶🐱
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg text-gray-700 max-w-xl mx-auto mb-10"
        >
          Adoptez ou accueillez un animal, découvrez des produits, et soutenez une communauté bienveillante.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/signup">
            <button className="px-8 py-3 bg-orange-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:scale-105 transition">
              Je commence maintenant
            </button>
          </Link>
        </motion.div>

        {/* Illustration */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
          alt="Dog and cat"
          className="w-40 mx-auto mt-10 opacity-80"
        />
      </header>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-14 text-orange-600">Pourquoi choisir AdoptiPet ?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Adoptez simplement",
                emoji: "🐾",
                desc: "Parcourez les profils d’animaux et trouvez votre futur compagnon.",
              },
              {
                title: "Accueil temporaire",
                emoji: "🏠",
                desc: "Aidez un animal à patienter en l’hébergeant jusqu’à son adoption.",
              },
              {
                title: "Boutique solidaire",
                emoji: "🛍️",
                desc: "Achetez nourriture, jouets et accessoires – une partie des ventes aide les refuges.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-orange-50 border border-orange-200 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h4 className="text-2xl font-semibold mb-2 text-orange-600">{item.title}</h4>
                <p className="text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
