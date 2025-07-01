import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { FaSpinner, FaUpload, FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AjouterProduit = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    animal: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData?.token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:7777/products/categories", {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setCategories(res.data.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories", err);
        setErrors({
          ...errors,
          global: "Erreur lors du chargement des catégories. Veuillez rafraîchir la page.",
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();

    const fetchAnimals = async () => {
      try {
        setLoadingAnimals(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const res = await axios.get("http://localhost:7777/products/animals", {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setAnimals(res.data.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des animaux", err);
        setErrors({
          ...errors,
          global: "Erreur lors du chargement des animaux. Veuillez rafraîchir la page.",
        });
      } finally {
        setLoadingAnimals(false);
      }
    };
    fetchAnimals();
  }, [navigate, errors]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.match("image.*")) {
          setErrors({ ...errors, image: "Veuillez sélectionner une image valide (JPG, PNG, GIF)" });
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, image: "L'image ne doit pas dépasser 5MB" });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({
            ...formData,
            image: file,
            imagePreview: reader.result,
          });
          setErrors({ ...errors, image: null });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Prix invalide (doit être un nombre positif)";
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 0)
      newErrors.quantity = "Quantité invalide (doit être un nombre positif)";
    if (!formData.category) newErrors.category = "Catégorie requise";
    if (!formData.animal) newErrors.animal = "Animal requis";
    if (!formData.description.trim()) newErrors.description = "Description requise";
    if (!formData.image) newErrors.image = "Image requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      setLoadingCategories(true);
      const userData = JSON.parse(localStorage.getItem("userData"));

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("quantity", parseInt(formData.quantity));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("animal", formData.animal);
      formDataToSend.append("description", formData.description);

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      } else {
        throw new Error("Aucune image valide sélectionnée");
      }

      const response = await axios.post(
        "http://localhost:7777/products",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Réponse du serveur:", response.data);

      navigate("/gestionProduit", {
        state: {
          toast: {
            type: "success",
            message: "Produit ajouté avec succès!",
          },
        },
      });
    } catch (err) {
      console.error("Erreur complète:", {
        message: err.message,
        response: err.response?.data,
        config: err.config,
      });

      setErrors({
        global:
          err.response?.data?.message ||
          "Échec de l'ajout du produit. Veuillez vérifier les données et réessayer.",
        ...(err.response?.data?.errors || {}),
      });
    } finally {
      setLoadingCategories(false);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <AdminLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen p-6 bg-gray-100"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Ajouter un nouveau produit
            </h2>
            <p className="text-gray-600">
              Remplissez les détails du nouveau produit. Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires.
            </p>
          </motion.div>

          {errors.global && (
            <motion.div
              variants={itemVariants}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              {errors.global}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du produit"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (TND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantité disponible"
                  min="0"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {loadingCategories ? (
                  <option disabled>Chargement des catégories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                )}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="animal" className="block text-sm font-medium text-gray-700 mb-1">
                Animal <span className="text-red-500">*</span>
              </label>
              <select
                id="animal"
                name="animal"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.animal ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formData.animal}
                onChange={handleChange}
              >
                <option value="">-- Sélectionner un animal --</option>
                {loadingAnimals ? (
                  <option disabled>Chargement des animaux...</option>
                ) : (
                  animals.map((animal) => (
                    <option key={animal} value={animal}>
                      {animal}
                    </option>
                  ))
                )}
              </select>
              {errors.animal && <p className="mt-1 text-sm text-red-600">{errors.animal}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre produit en détail..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image du produit <span className="text-red-500">*</span>
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } border-dashed rounded-md`}
              >
                <div className="space-y-1 text-center">
                  {formData.imagePreview ? (
                    <div className="relative group">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300 rounded-md">
                        <label className="cursor-pointer opacity-0 group-hover:opacity-100">
                          <div className="bg-white p-2 rounded-full shadow-md">
                            <FaUpload className="text-blue-600" />
                          </div>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF jusqu'à 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="mr-4 px-4 py-2 rounded-md  text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  loadingCategories || loadingAnimals || isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center`}
                disabled={loadingCategories || loadingAnimals || isSubmitting}
              >
                {loadingCategories || loadingAnimals || isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    En cours...
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="mr-2" />
                    Ajouter le produit
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AjouterProduit;