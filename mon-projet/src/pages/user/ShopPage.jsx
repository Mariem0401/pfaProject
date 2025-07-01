import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserLayout from "../../layouts/user/UserLayout";
import {
    FaShoppingBasket,
    FaHeart,
    FaStar,
    FaSearch,
    FaRegHeart,
    FaFilter,
    FaTimes
} from "react-icons/fa";
import { Slider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import Toast from "./Toast";

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availability, setAvailability] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortOption, setSortOption] = useState("");
    const [categories, setCategories] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { addItemToCart } = useCart();
    const [animal, setAnimal] = useState("all");
    const [animals, setAnimals] = useState([]); // State to hold available animal types

    const [toast, setToast] = useState({
        show: false,
        message: ''
    });
    const navigate = useNavigate();

    const defaultCategories = [
        "Nourriture", "Jouets", "Hygiène", "Accessoires",
        "Litière", "Vêtements", "Santé", "Transport", "Autre"
    ];

    const fetchCategories = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const res = await axios.get("http://localhost:7777/products/categories", {
                headers: { Authorization: `Bearer ${userData?.token}` }
            });
            setCategories(res.data.data || defaultCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories(defaultCategories);
        }
    };

    const fetchProducts = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            if (!userData?.token) return navigate("/login");

            const res = await axios.get("http://localhost:7777/products/", {
                headers: { Authorization: `Bearer ${userData.token}` }
            });

            const fetchedProducts = res.data.data?.products || [];
            setProducts(fetchedProducts);
            setFilteredProducts(fetchedProducts);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const fetchAnimals = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
             const res = await axios.get("http://localhost:7777/products/animals", {
                headers: { Authorization: `Bearer ${userData?.token}` }
            });
            setAnimals(["all", ...res.data.data]); // Assuming the API returns an array of animal types
        } catch (error) {
            console.error("Error fetching animals:", error);
            setAnimals(["all"]); // Default to "all" if there's an error
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const result = await addItemToCart(product._id);

            if (result.success) {
                setToast({
                    show: true,
                    message: `${product.name} a été ajouté au panier`
                });
                setTimeout(() => setToast({ show: false, message: '' }), 3000);
            } else {
                console.error("Error adding to cart:", result.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleAnimalChange = (newAnimal) => {
        setAnimal(newAnimal);
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchAnimals(); // Fetch animal types
    }, []);

    useEffect(() => {
        if (!products.length) return;

        let result = [...products];

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter(product =>
                product.category && selectedCategories.includes(product.category)
            );
        }

        if (availability === "inStock") {
            result = result.filter(product => product.quantity > 0);
        } else if (availability === "outOfStock") {
            result = result.filter(product => product.quantity <= 0);
        }

        result = result.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        ).filter(product =>
            animal === "all" ? true : product.animal === animal
        );

        if (sortOption === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "discount") {
            result = result.filter(product => product.oldPrice);
            result.sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price));
        } else if (sortOption === "popular") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setFilteredProducts(result);
    }, [products, searchTerm, selectedCategories, availability, priceRange, sortOption, animal]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setAvailability("all");
        setPriceRange([0, 1000]);
        setSortOption("");
        setAnimal("all"); // Reset the animal filter as well
    };

    return (
        <UserLayout>
            <section className="py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters (Desktop - Sidebar) */}
                <aside className="hidden md:block bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-20 h-fit">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filtrer par</h2>
                        <button
                            onClick={resetFilters}
                            className="text-sm text-teal-600 hover:text-teal-800"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Animal Filter (Moved Here) */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-700">Animal</h3>
                            <div className="flex flex-col space-y-2">
                                {animals.map((animalType) => (
                                    <label key={animalType} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="animal"
                                            value={animalType}
                                            checked={animal === animalType}
                                            onChange={(e) => handleAnimalChange(e.target.value)}
                                            className="rounded-full text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                        />
                                        <span className="text-gray-700">
                                            {animalType === "all" ? "Tous" : animalType}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Categories Filter */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-700">Catégories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="rounded text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                        />
                                        <span className="text-gray-700">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-700">Disponibilité</h3>
                            <div className="flex flex-col space-y-2">
                                {[ "all", "inStock", "outOfStock" ].map((option) => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value={option}
                                            checked={availability === option}
                                            onChange={(e) => setAvailability(e.target.value)}
                                            className="rounded-full text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                        />
                                        <span className="text-gray-700">
                                            {option === "all" && "Tous"}
                                            {option === "inStock" && "En stock"}
                                            {option === "outOfStock" && "Rupture"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-700">Prix (DT)</h3>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1000}
                                className="text-teal-500"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{priceRange[0]} DT</span>
                                <span>{priceRange[1]} DT</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Listing Area */}
                <div className="col-span-1 md:col-span-3">
                    {/* Mobile Filter Toggle and Sort Options */}
                    <div className="mb-6 flex justify-between items-center">
                        <button
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <FaFilter /> Filtres
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 min-w-[200px] md:flex-none">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all bg-white"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Trier par</option>
                                <option value="price-desc">Prix: décroissant</option>
                                <option value="price-asc">Prix: croissant</option>
                                <option value="discount">Promotions</option>
                                <option value="popular">Populaires</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-block p-5 bg-teal-50 rounded-full mb-4">
                                <FaSearch className="text-teal-400 text-2xl" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
                            <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
                            <button
                                onClick={resetFilters}
                                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-100"
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            <Link to={`/product/${product._id}`} className="block h-full">
                                                <img
                                                    src={product.image || "/placeholder-product.jpg"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Link>

                                            <div className="absolute top-3 left-3 flex space-x-2">
                                                {product.oldPrice && (
                                                    <span className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full shadow-md">
                                                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                                    </span>
                                                )}
                                                {product.quantity <= 0 && (
                                                    <span className="bg-gray-700 text-white text-xs px-2.5 py-1 rounded-full shadow-md">
                                                        Rupture
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-rose-500 hover:text-white transition-colors"
                                                aria-label="Ajouter aux favoris"
                                            >
                                                <FaRegHeart className="text-gray-400 group-hover:text-white" size={14} />
                                            </button>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-3">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-semibold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2 h-12">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                {product.category && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-600 text-xs rounded-full">
                                                        {product.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <div className="flex text-amber-400 mr-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            size={12}
                                                            className={i < (product.rating || 4) ? "text-amber-400" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400">({product.reviewCount || 24} avis)</span>
                                            </div>

                                            <div className="mt-4 flex justify-between items-center">
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {product.price.toFixed(2)} DT
                                                    </span>
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-gray-400 line-through ml-2">
                                                            {product.oldPrice.toFixed(2)} DT
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    className={`p-2.5 rounded-full shadow-md transition-all ${product.quantity > 0
                                                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105"
                                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                    disabled={product.quantity <= 0}
                                                    onClick={() => handleAddToCart(product)}
                                                    aria-label="Ajouter au panier"
                                                >
                                                    <FaShoppingBasket size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Filters */}
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filtres</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Animal Filter (Mobile) */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-700">Animal</h3>
                                <div className="flex flex-col space-y-2">
                                    {animals.map((animalType) => (
                                        <label key={animalType} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="animal-mobile"
                                                value={animalType}
                                                checked={animal === animalType}
                                                onChange={(e) => handleAnimalChange(e.target.value)}
                                                className="rounded-full text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                            />
                                            <span className="text-gray-700">
                                                {animalType === "all" ? "Tous" : animalType}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Filter (Mobile) */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-700">Catégories</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                                className="rounded text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                            />
                                            <span className="text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Filter (Mobile) */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-700">Disponibilité</h3>
                                <div className="flex flex-col space-y-2">
                                    {[ "all", "inStock", "outOfStock" ].map((option) => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="availability-mobile"
                                                value={option}
                                                checked={availability === option}
                                                onChange={(e) => setAvailability(e.target.value)}
                                                className="rounded-full text-teal-500 border-gray-300 focus:ring-teal-300 h-4 w-4"
                                            />
                                            <span className="text-gray-700">
                                                {option === "all" && "Tous"}
                                                {option === "inStock" && "En stock"}
                                                {option === "outOfStock" && "Rupture"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter (Mobile) */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-700">Prix (DT)</h3>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000}
                                    className="text-teal-500"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{priceRange[0]} DT</span>
                                    <span>{priceRange[1]} DT</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                                >
                                    Réinitialiser
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium shadow-md"
                                >
                                    Afficher les résultats
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <Toast message={toast.message} show={toast.show} />
            </section>
        </UserLayout>
    );
};

export default ShopPage;