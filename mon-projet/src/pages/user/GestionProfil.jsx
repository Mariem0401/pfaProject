import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import UserLayout from "../../layouts/user/UserLayout";

const GestionProfil = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [annonces, setAnnonces] = useState([]);
  const [panier, setPanier] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  /* ------------------ RÉCUP PROFIL ------------------ */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.token) {
      toast.error("Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    axios
      .get("http://localhost:7777/users/me", {
        headers: { Authorization: `Bearer ${userData.token}` },
      })
      .then(({ data }) => {
        const u = data.data.user;
        setUser(u);
        setFormData({
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          password: "",
        });
        setPreviewPic(u.profilePic || u.profileImage || null);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        toast.error(`Échec de la récupération du profil : ${msg}`);
        setMessage(`Échec : ${msg}`);
      })
      .finally(() => setIsLoading(false));

    /* ---------- Activités ---------- */
    Promise.all([
      axios.get("http://localhost:7777/annonces/mes-annonces", {
        headers: { Authorization: `Bearer ${userData.token}` },
      }),
      axios.get("http://localhost:7777/panier", {
        headers: { Authorization: `Bearer ${userData.token}` },
      }),
    ])
      .then(([annoncesRes, panierRes]) => {
        setAnnonces(annoncesRes.data.data || []);
        setPanier(panierRes.data.data.items || []);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        toast.error(`Échec de la récupération des activités : ${msg}`);
      });
  }, [navigate]);

  /* ------------------ VALIDATION ------------------ */
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Le nom est requis";
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
      errors.email = "Email invalide";
    if (formData.phone && !formData.phone.match(/^\+?\d{8,15}$/))
      errors.phone = "Numéro de téléphone invalide";
    if (formData.password && formData.password.length < 6)
      errors.password = "Mot de passe trop court (min 6 caractères)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      toast.error("Seuls les formats JPEG, PNG, GIF et WEBP sont acceptés.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La taille de l’image ne doit pas dépasser 10 Mo.");
      return;
    }
    setProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.token) {
      toast.error("Authentification requise.");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.password) data.append("password", formData.password);
    if (profilePic) data.append("profilePic", profilePic);

    try {
      const res = await axios.patch("http://localhost:7777/users/updateMe", data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profil mis à jour avec succès !");
      const u = res.data.data.user;
      setUser(u);
      setPreviewPic(u.profilePic || u.profileImage || previewPic);
      setFormData((p) => ({ ...p, password: "" }));
      localStorage.setItem("userData", JSON.stringify({ ...userData, token: res.data.data.token || userData.token }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(`Échec de la mise à jour : ${msg}`);
      setMessage(`Échec : ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Déconnexion réussie !");
    navigate("/login");
  };

  /* ------------------ RENDER ------------------ */
  return (
    <UserLayout>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto p-6 mt-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Mon Profil
          </h2>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img
                    src={previewPic || "/images/avatar-placeholder.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <label
                    htmlFor="profilePic"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Cliquer ou glisser une image"
                  >
                    <span className="text-white text-sm">📸 Changer</span>
                    <input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="image de profil"
                    />
                  </label>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-2" aria-label="Tabs">
                  {["info", "annonces", "panier"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {tab === "info" ? "Informations" : tab === "annonces" ? "Annonces" : "Panier"}
                      {activeTab === tab && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                          layoutId="underline"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "info" && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handleUpdate} className="space-y-4 max-w-lg mx-auto">
                      <Input
                        id="name"
                        label="Nom"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        required
                      />
                      <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        required
                      />
                      <Input
                        id="phone"
                        type="tel"
                        label="Téléphone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={formErrors.phone}
                        placeholder="+216 12 345 678"
                      />
                      <Input
                        id="password"
                        type="password"
                        label="Nouveau mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        error={formErrors.password}
                        placeholder="Laisser vide pour ne pas changer"
                      />
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 rounded-lg text-white font-medium ${
                          isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        } transition-colors`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Mise à jour...
                          </span>
                        ) : (
                          "Mettre à jour"
                        )}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                      >
                        Déconnexion
                      </motion.button>
                    </form>
                    <div className="mt-6 pt-4 border-t border-gray-200 max-w-lg mx-auto">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">Détails du profil</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <strong>Date de naissance :</strong>{" "}
                          {user.birthdate
                            ? new Date(user.birthdate).toLocaleDateString("fr-FR")
                            : "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "annonces" && (
                  <motion.div
                    key="annonces"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionList
                      title="Mes Annonces"
                      items={annonces}
                      emptyMsg="Aucune annonce trouvée."
                      render={(a) => (
                        <div className="space-y-2">
                          <p><strong>Titre :</strong> {a.titre || "Sans titre"}</p>
                          <p>
                            <strong>Date :</strong>{" "}
                            {a.datePublication
                              ? new Date(a.datePublication).toLocaleDateString("fr-FR")
                              : "Non spécifiée"}
                          </p>
                          <p><strong>Statut :</strong> {a.statut || "Inconnu"}</p>
                          <p><strong>Description :</strong> {a.description || "Aucune description"}</p>
                          {a.image && (
                            <img
                              src={a.image}
                              alt={a.titre}
                              className="mt-2 w-full h-40 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      )}
                    />
                  </motion.div>
                )}
                {activeTab === "panier" && (
                  <motion.div
                    key="panier"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionList
                      title="Mon Panier"
                      items={panier}
                      emptyMsg="Votre panier est vide."
                      render={(i) => (
                        <div className="space-y-2">
                          <p><strong>Produit :</strong> {i.product.name || "Sans nom"}</p>
                          <p>
                            <strong>Prix :</strong>{" "}
                            {i.priceAtAddition ? `${i.priceAtAddition} €` : "Non spécifié"}
                          </p>
                          <p><strong>Quantité :</strong> {i.quantity || 1}</p>
                          <p>
                            <strong>Date d'ajout :</strong>{" "}
                            {i.product.createdAt
                              ? new Date(i.product.createdAt).toLocaleDateString("fr-FR")
                              : "Non spécifiée"}
                          </p>
                          {i.product.image && (
                            <img
                              src={i.product.image}
                              alt={i.product.name}
                              className="mt-2 w-full h-40 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Logout Modal */}
              {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-white rounded-lg p-6 max-w-sm w-full"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Confirmer la déconnexion
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={confirmLogout}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600">Aucun utilisateur chargé.</p>
          )}
        </div>
      </motion.div>
    </UserLayout>
  );
};

/* ------------- SOUS-COMPOSANTS UTILITAIRES ------------- */
const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder = "",
  required,
}) => (
  <div className="relative">
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

const SectionList = ({ title, items, emptyMsg, render }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    {items.length ? (
      <ul className="space-y-4">
        {items.map((el) => (
          <motion.li
            key={el._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {render(el)}
          </motion.li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">{emptyMsg}</p>
    )}
  </div>
);

export default GestionProfil;