import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const location = useLocation();
  const { email } = location.state || { email: "" };
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetCode || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:7777/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Mot de passe réinitialisé avec succès.");
        navigate("/login");
      } else {
        setError(data.message || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
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
          backgroundImage: "url('/Dog paw-cuate.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgb(108, 99, 255)",
        }}
      >
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Réinitialisation</h1>
          <p className="text-lg drop-shadow-md">
            Entrez le code reçu par email et définissez un nouveau mot de passe.
          </p>
        </div>
      </div>

      {/* Formulaire à droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#E0E7FF]">
          <h2 className="text-3xl font-bold text-center" style={{ color: "rgb(108, 99, 255)" }}>
            Réinitialiser le mot de passe
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Code de réinitialisation */}
            <div className="mb-5">
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Code de réinitialisation"
                className="w-full py-3 px-4 border border-[#E0E7FF] rounded-xl focus:ring-2 focus:outline-none"
                style={{ focusRingColor: "rgb(108, 99, 255)" }}
              />
            </div>

            {/* Nouveau mot de passe */}
            <div className="mb-5 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "rgb(108, 99, 255)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                className="w-full pl-10 py-3 border border-[#E0E7FF] rounded-xl focus:ring-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "rgb(108, 99, 255)" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirmer le mot de passe */}
            <div className="mb-5 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "rgb(108, 99, 255)" }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="w-full pl-10 py-3 border border-[#E0E7FF] rounded-xl focus:ring-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "rgb(108, 99, 255)" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Erreur ou succès */}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl transition-all"
              style={{
                backgroundColor: "rgb(108, 99, 255)",
                hover: { backgroundColor: "#4e46d4" },
              }}
            >
              {loading ? "Chargement..." : "Réinitialiser"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "rgb(108, 99, 255)" }}>
            <Link to="/login" className="underline font-medium">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
