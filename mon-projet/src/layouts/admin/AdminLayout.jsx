import React, { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
import NavbarAdmin from './NavbarAdmin';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative h-screen flex flex-col" style={{ backgroundColor: '#f9fafb' }}>
      {/* Navbar pleine largeur */}
      <div className="w-full fixed top-0 z-50">
        <NavbarAdmin toggleSidebar={toggleSidebar} />
      </div>

      {/* Contenu principal avec sidebar */}
      <div className="flex flex-1 pt-16 h-full">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-40`}
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
            borderRight: '1px solid #f3f4f6'
          }}
        >
          <SidebarAdmin />
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Contenu principal */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
          }`}
          style={{
            minHeight: 'calc(100vh - 4rem)',
            backgroundColor: '#f2edf3', // Violet clair
          }}
        >
          <div 
            className="p-4 md:p-6"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              margin: '16px',
              border: '1px solid #f3f4f6'
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Style global pour harmoniser les couleurs */}
      <style jsx global>{`
        :root {
          --color-primary: #f97316; /* Orange vif */
          --color-primary-light: #ffedd5;
          --color-secondary: #8b5cf6; /* Violet moyen */
          --color-secondary-light: #f2edf3; /* Violet clair */
          --color-background: #f9fafb;
        }
        
        /* Boutons et éléments interactifs */
        .btn-primary {
          background-color: var(--color-primary);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #ea580c;
        }
        
        /* Liens et hover */
        a:hover {
          color: var(--color-primary);
        }
        
        /* Cartes et contenus */
        .card {
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;