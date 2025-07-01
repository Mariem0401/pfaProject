import React from "react";
import NavBarUser from "./NavBarUser";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      {/* NavBar */}
      <NavBarUser />
      
      {/* Main content area */}
      <main className="flex-1 p-6 bg-white/90 rounded-2xl shadow-lg mx-4 my-6 transition-all duration-300 border border-orange-100">
        {children}
      </main>
      
      {/* Optionnel : Pied de page */}
     
    </div>
  );
};

export default UserLayout;