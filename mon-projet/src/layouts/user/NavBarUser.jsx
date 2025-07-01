import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IoMdSearch,
  IoMdHeartEmpty,
  IoMdCart,
  IoMdPerson,
  IoMdLogOut,
  IoMdMenu,
  IoMdClose,
  IoMdHome,
  IoMdPaw,
  IoMdPricetags,
  IoIosArrowDown,
} from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../pages/user/CartContext"; // Ensure this path is correct

const ProfileDropdown = ({ user, onLogout, isMobile = false }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`${
      isMobile
        ? "bg-white p-2 rounded-lg shadow-inner border border-gray-100"
        : "absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
    } overflow-hidden z-50`}
  >
    <div className="px-4 py-3 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-900">{user?.name || "Invité"}</p>
      <p className="text-xs text-gray-500 truncate">{user?.email || "example@email.com"}</p>
    </div>
    <Link
      to="/user/profil"
      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
    >
      Mon Profil
    </Link>
    <Link
      to="/user/mes-animaux"
      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
    >
      Mes animaux
    </Link>
    <Link
      to="/user/mes-annonces"
      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
    >
      Mes Annonces
    </Link>
    <Link
      to="/user/mes-commandes"
      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
    >
      Mes Commandes
    </Link>
    <button
      onClick={onLogout}
      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center"
      aria-label="Se déconnecter"
    >
      <IoMdLogOut className="mr-2" />
      Déconnexion
    </button>
  </motion.div>
);

const MobileMenu = ({ user, onLogout, onClose, cartCount }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="md:hidden flex flex-col space-y-2 py-4 px-4 bg-white shadow-lg rounded-b-xl"
  >
    <Link
      to="/UserPage"
      onClick={onClose}
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
    >
      <IoMdHome className="mr-2" />
      Accueil
    </Link>
    <Link
      to="/shop"
      onClick={onClose}
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
    >
      <IoMdPricetags className="mr-2" />
      Shop
    </Link>
    <Link
      to="/annonce"
      onClick={onClose}
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
    >
      <IoMdPaw className="mr-2" />
      Annonce
    </Link>
    <Link
      to="/wishlist"
      onClick={onClose} // Added onClick to close menu
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors flex items-center"
    >
      <IoMdHeartEmpty className="mr-2" />
      Wishlist
    </Link>
    <Link
      to="/user/panier"
      onClick={onClose}
      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors relative flex items-center"
    >
      <IoMdCart className="mr-2" />
      Panier
      {cartCount > 0 && (
        <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>
    <div className="pt-4 mt-2 border-t border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-lg">
        <div>
          <p className="font-semibold text-gray-800">{user?.name || "Invité"}</p>
          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>
      </div>
      {/* You can also include a profile dropdown for mobile if needed, or link directly to profile page */}
      <Link
        to="/user/profil"
        onClick={onClose}
        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center mt-2"
      >
        <IoMdPerson className="mr-2" />
        Mon Profil
      </Link>
      {user && ( // Only show logout if user is logged in
        <button
          onClick={() => {
            onLogout();
            onClose(); // Close menu after logout
          }}
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center"
          aria-label="Se déconnecter"
        >
          <IoMdLogOut className="mr-2" />
          Déconnexion
        </button>
      )}
    </div>
  </motion.div>
);

const indicatorVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "100%", opacity: 1, transition: { duration: 0.3 } },
};

const NavBarUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const { cartCount } = useCart(); // Use cartCount from your CartContext
  console.log("Current cart count:", cartCount); // Add this line
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed.user || parsed); // Handle cases where 'user' might be nested or direct
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("userData"); // Clean up corrupted data
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token"); // Assuming you store a token
    setUser(null); // Clear user state
    navigate("/login");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-b-2xl shadow-lg"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-2xl font-bold text-white flex items-center gap-2 group"
              aria-label="AdoptiPet Home"
            >
              <span className="flex items-center">
                <span className="transform transition-transform group-hover:rotate-12 duration-300">🐾</span>
                <span className="ml-2">AdoptiPet</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {["Accueil", "Shop", "Annonce"].map((item) => {
              const path = item === "Accueil" ? "/UserPage" : `/${item.toLowerCase()}`;
              const active = isActive(path);
              return (
                <div key={item} className="relative">
                  <Link
                    to={path}
                    className={`text-white ${
                      active ? "font-medium" : "font-normal"
                    } px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex flex-col items-center`}
                  >
                    <span>{item}</span>
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-yellow-400 rounded-full"
                        variants={indicatorVariants}
                        initial="initial"
                        animate="animate"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
          <div
            ref={searchRef}
            className={`hidden md:flex items-center flex-1 max-w-sm mx-6 transition-all duration-300 ${
              searchFocused ? "scale-105" : ""
            }`}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className={`w-full py-2 px-4 pr-10 rounded-full border transition-all duration-300
                  ${
                    searchFocused
                      ? "border-yellow-400 shadow-md shadow-yellow-300/20 bg-white ring-2 ring-yellow-400/30 text-gray-800"
                      : "border-white/30 bg-white/20 text-white placeholder-white/80"
                  }
                  focus:outline-none`}
                aria-label="Search"
              />
              <button
                type="submit"
                className={`absolute right-3 top-2.5 transition-all duration-300 ${
                  searchFocused ? "text-indigo-600" : "text-white"
                }`}
              >
                <IoMdSearch className="text-xl" />
              </button>
            </form>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/wishlist"
              className="p-2 rounded-full hover:bg-white/10 text-white hover:scale-110 transition-all relative group"
              aria-label="Wishlist"
            >
              <IoMdHeartEmpty size={24} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                Wishlist
              </span>
            </Link>
            <Link
              to="/user/panier"
              className="p-2 rounded-full hover:bg-white/10 text-white hover:scale-110 transition-all relative group"
              aria-label={`Panier avec ${cartCount} articles`}
            >
              <IoMdCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                Panier
              </span>
            </Link>
            <div className="relative flex items-center space-x-2" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center rounded-full focus:outline-none group transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={profileMenuOpen}
              >
                <div className="w-9 h-9 rounded-full bg-[#AFD5AA] flex items-center justify-center text-[#6c63FF] group-hover:bg-[#6c63FF] transition-colors duration-200">
                  <IoMdPerson className="w-5 h-5" />
                </div>
                <span className="hidden ml-2 text-sm font-medium text-white md:block">
                  {user?.name || "Utilisateur"}
                </span>
                <IoIosArrowDown
                  className={`hidden ml-1 text-white w-4 h-4 md:block transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {profileMenuOpen && (
                  <ProfileDropdown user={user} onLogout={handleLogout} />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/recherche"
              className="p-2 rounded-full hover:bg-white/10 text-white"
              aria-label="Rechercher"
            >
              <IoMdSearch size={22} />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-white/10 text-white"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              user={user}
              onLogout={handleLogout}
              onClose={() => setMenuOpen(false)}
              cartCount={cartCount}
            />
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBarUser;