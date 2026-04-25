// src/components/Navbar.jsx
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    // Aquí puedes agregar lógica de cierre de sesión (limpiar tokens, etc.)
    navigate('/login');
  };

  return (
    <nav className="relative bg-white border-b border-gray-200">
      <div className="flex justify-between items-center py-3 px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <div className="text-lg sm:text-xl font-bold flex items-center gap-1">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight text-gray-800 shrink-0">
            <span>Téchn<span className="text-teal-600 italic">ē</span> Meraki</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-8 text-sm text-gray-700">
          <Link to="/dashboard" className="font-medium text-gray-700 hover:text-black transition-colors">
            Menu
          </Link>
          <Link to="/inventario" className="font-medium text-gray-700 hover:text-black transition-colors">
            Inventario
          </Link>
          <Link to="/empleados" className="font-medium text-gray-700 hover:text-black transition-colors">
            Empleados
          </Link>
          <Link to="/promociones" className="font-medium text-gray-700 hover:text-black transition-colors">
            Promociones
          </Link>
        </div>

        {/* Right side: Cerrar sesión + mobile menu icon */}
        <div className="flex items-center gap-3">
          {/* Botón de cerrar sesión (escritorio) */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50 py-3 flex flex-col items-start px-6 space-y-2 pb-4">
          <Link
            to="/dashboard"
            className="w-full text-left py-2 text-gray-700 hover:text-black transition-colors text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/inventario"
            className="w-full text-left py-2 text-gray-700 hover:text-black transition-colors text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Inventario
          </Link>
          <Link
            to="/empleados"
            className="w-full text-left py-2 text-gray-700 hover:text-black transition-colors text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Empleados
          </Link>
          <Link
            to="/promociones"
            className="w-full text-left py-2 text-gray-700 hover:text-black transition-colors text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Promociones
          </Link>
          {/* Cerrar sesión en móvil */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors text-base font-medium flex items-center gap-2"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;