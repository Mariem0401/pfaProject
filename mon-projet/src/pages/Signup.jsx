import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaCalendarAlt, FaMale, FaFemale, FaDog, FaCat, FaPaw
} from "react-icons/fa";

export default function Signup() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, birthdate, gender } = inputs;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!name || !email || !birthdate || !gender) {
      setError("Veuillez remplir tous les champs requis !");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:7777/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (data.status === "success") {
        navigate("/login");
      } else {
        setError(data.message || "Une erreur s'est produite.");
      }
    } catch (error) {
      setError(error.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8FC]">
      
      {/* Partie gauche avec image sans teinte */}
     {/* Illustration à gauche */}
     <div
  className="w-1/2 hidden md:flex flex-col items-center justify-start text-white p-12"
  style={{
    backgroundImage: "url('/adopt.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
       backgroundColor: "#6C63FF"

  }}
      >
       
        <div className="mt-10 text-white text-center px-6">
          <h2 className="text-3xl font-bold mb-4 drop-shadow">Bienvenue sur AdoptiPet !</h2>
          <p className="text-lg drop-shadow">
            Rejoignez-nous et trouvez votre compagnon idéal.
            Adoptez un animal et offrez-lui un foyer aimant.
          </p>
        </div>
   
      </div>

      {/* Partie droite : Formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full border border-[#D1D5FD]">
          <h2 className="text-3xl font-bold text-center text-[#6C63FF] mb-6">Inscription</h2>
          <form onSubmit={handleSignup}>
            
            {/* Nom */}
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type="text"
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                value={inputs.name}
                placeholder="Nom complet"
                className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D1D5FD] focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type="email"
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                value={inputs.email}
                placeholder="Email"
                className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D1D5FD] focus:outline-none"
                required
              />
            </div>

            {/* Genre */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center">
                <FaMale className="text-[#6C63FF]" />
                <input
                  type="radio"
                  name="gender"
                  value="homme"
                  onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                  checked={inputs.gender === "homme"}
                  className="ml-2"
                />
                <span className="ml-2">Homme</span>
              </label>
              <label className="flex items-center">
                <FaFemale className="text-[#6C63FF]" />
                <input
                  type="radio"
                  name="gender"
                  value="femme"
                  onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                  checked={inputs.gender === "femme"}
                  className="ml-2"
                />
                <span className="ml-2">Femme</span>
              </label>
            </div>

            {/* Date de naissance */}
            <div className="mb-4 relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type="date"
                value={inputs.birthdate}
                onChange={(e) => setInputs({ ...inputs, birthdate: e.target.value })}
                className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D1D5FD] focus:outline-none"
                required
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                value={inputs.password}
                placeholder="Mot de passe"
                className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D1D5FD] focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirmer mot de passe */}
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={inputs.confirmPassword}
                onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                placeholder="Confirmer le mot de passe"
                className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D1D5FD] focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Erreur */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Bouton */}
            <button
              type="submit"
              className="w-full py-3 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#4E4AE0] transition"
              disabled={loading}
            >
              {loading ? "Chargement..." : "S'inscrire"}
            </button>
          </form>

          {/* Lien vers login */}
          <p className="mt-4 text-center text-[#6C63FF]">
            Déjà un compte ?{" "}
            <Link to="/login" className="underline font-semibold hover:text-[#4E4AE0]">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
