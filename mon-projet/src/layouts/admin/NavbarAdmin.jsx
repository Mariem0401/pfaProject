import React, { useState, useRef, useEffect } from 'react';
import { 
  FiBell,
  FiMail,
  FiSearch,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiHeart
} from 'react-icons/fi';

const NavbarAdmin = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  // Récupérer les infos de l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  // Fermer le menu profil quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 rounded-b-2xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left section - Hamburger and Logo */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-600 hover:text-[#6c63FF] focus:outline-none transition-colors duration-200"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            {/* Logo ou titre */}
            <div className="hidden md:flex items-center">
              <FiHeart className="w-6 h-6 text-[#6c63FF] mr-2" />
              <h1 className="text-xl font-bold text-gray-800">
                <span className="text-[#6c63FF]">Adopti</span>Pet
              </h1>
            </div>
          </div>

          {/* Middle section - Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c63FF] focus:border-[#6c63FF] sm:text-sm transition-all duration-200"
                placeholder="Rechercher un animal..."
              />
            </div>
          </div>

          {/* Right section - Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Button (mobile) */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden text-gray-600 hover:text-[#6c63FF] p-2 rounded-full focus:outline-none transition-colors duration-200"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-[#6c63FF] rounded-full focus:outline-none transition-colors duration-200">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6c63FF] rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2 text-gray-600 hover:text-[#6c63FF] rounded-full focus:outline-none transition-colors duration-200">
              <FiMail className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6c63FF] rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={profileRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center max-w-xs rounded-full focus:outline-none group"
              >
                <div className="w-9 h-9 rounded-full bg-[#AFD5AA] flex items-center justify-center text-[#6c63FF] group-hover:bg-[#6c63FF] transition-colors duration-200">
                  <FiUser className="w-5 h-5" />
                </div>
                <span className="hidden ml-2 text-sm font-medium text-gray-700 md:block">
                  {user?.name || "Utilisateur"}
                </span>
                <FiChevronDown className={`hidden ml-1 text-gray-500 w-4 h-4 md:block transition-transform duration-200 ${profileMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-[#AFD5AA]">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#AFD5AA] transition-colors duration-200"
                  >
                    <FiUser className="mr-3 w-4 h-4 text-[#6c63FF]" />
                    Mon profil
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#AFD5AA] transition-colors duration-200"
                  >
                    <FiSettings className="mr-3 w-4 h-4 text-[#6c63FF]" />
                    Paramètres
                  </a>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userData");
                      window.location.href = "/login";
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#AFD5AA] border-t border-gray-100 transition-colors duration-200"
                  >
                    <FiLogOut className="mr-3 w-4 h-4 text-[#6c63FF]" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search (appears when searchOpen is true) */}
      {searchOpen && (
        <div className="px-4 pb-4 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c63FF] focus:border-[#6c63FF] sm:text-sm"
              placeholder="Rechercher un animal..."
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarAdmin;
