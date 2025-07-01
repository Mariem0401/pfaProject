import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Login() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = inputs;

    if (!email || !password) {
      setError("Veuillez remplir tous les champs requis !");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:7777/users/login", { email, password });
      const data = response.data;

      if (data.status === "success") {
        localStorage.setItem("userData", JSON.stringify({
          email: data.data.user.email,
          name: data.data.user.name,
          token: data.token,
          role: data.data.user.role
        }));

        navigate(data.data.user.role === "admin" ? "/dashboard-admin" : "/UserPage");
      } else {
        setError(data.message || "Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8FC]">
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
  <div className="mt-6 text-center">
    <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">AdoptiPet</h1>
    <p className="text-lg drop-shadow-md">Bienvenue sur votre plateforme d’adoption préférée !</p>
  </div>
</div>




      {/* Formulaire à droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#E0E7FF]">
          <h2 className="text-3xl font-bold text-center text-[#6C63FF] mb-8">Connexion</h2>
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type="email"
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                value={inputs.email}
                placeholder="Votre email"
                className="w-full pl-10 py-3 border border-[#E0E7FF] rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]" />
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                value={inputs.password}
                placeholder="Mot de passe"
                className="w-full pl-10 py-3 border border-[#E0E7FF] rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C63FF]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Erreur */}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C63FF] text-white font-semibold py-3 rounded-xl hover:bg-[#5753c9] transition-all"
            >
              {loading ? "Chargement..." : "Se connecter"}
            </button>
          </form>

          {/* Lien */}
          <p className="mt-6 text-center text-sm text-[#6C63FF]">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="underline font-medium">S'inscrire</Link><br />
            <Link to="/forgot-password" className="underline font-medium">Mot de passe oublié ?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
