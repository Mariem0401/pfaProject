import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaPaw, 
  FaComments, 
  FaShoppingBag, 
  FaUserCog,
  FaChevronRight
} from "react-icons/fa";

const SideBarUser = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { path: "/user/dashboard", icon: <FaHome />, label: "Tableau de bord" },
    { path: "/user/mes-animaux", icon: <FaPaw />, label: "Mes animaux" },
    { path: "/user/messages", icon: <FaComments />, label: "Messages" },
    { path: "/user/boutique", icon: <FaShoppingBag />, label: "Boutique" },
    { path: "/user/parametres", icon: <FaUserCog />, label: "Paramètres" }
  ];

  return (
    <aside className={`bg-gradient-to-b from-purple-800 to-purple-900 text-white ${expanded ? 'w-64' : 'w-20'} h-screen fixed left-0 top-0 pt-16 transition-all duration-300 z-20`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-1/2 bg-purple-700 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
      >
        <FaChevronRight className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="p-4 h-full flex flex-col">
        <h2 className={`text-xl font-bold mb-8 pl-2 ${!expanded ? 'hidden' : ''}`}>Menu Utilisateur</h2>
        <ul className="space-y-2 flex-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-purple-700' : 'hover:bg-purple-700/50'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`ml-3 ${!expanded ? 'hidden' : ''}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className={`p-3 mt-auto ${!expanded ? 'hidden' : ''}`}>
          <div className="text-xs text-purple-200">
            Version 1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBarUser;