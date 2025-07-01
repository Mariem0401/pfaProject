import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast"; // ✅ importe le toast

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:7777/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Un email de réinitialisation a été envoyé.");
        toast.success("Email envoyé avec succès ! 📧"); // ✅ toast de succès
        navigate("/reset-password", { state: { email } });
      } else {
        setError(data.message || "Erreur. Veuillez réessayer.");
        toast.error(data.message || "Erreur. Veuillez réessayer."); // ✅ toast d’erreur
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
      toast.error("Une erreur réseau est survenue."); // ✅ toast d’erreur
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4FA]">
      {/* Illustration à gauche */}
      <div
        className="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-10"
        style={{
          backgroundImage: "url('/forr.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgb(108, 99, 255)",
        }}
      />

      {/* Formulaire à droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(108, 99, 255)" }}>
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-gray-600">
              Entrez votre adresse email pour recevoir un code de réinitialisation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: "rgb(108, 99, 255)" }}
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            <span className="text-gray-500">Retour à la </span>
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
