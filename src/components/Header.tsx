import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Package, Settings } from 'lucide-react';
import { CartButton } from './Cart/CartButton';
import { CartSidebar } from './Cart/CartSidebar';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt="LC Imports Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-900">LC Imports</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Inicio
              </a>
              <a
                href="/#productos"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Productos
              </a>
              <a
                href="/vehiculos"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Vehículos
              </a>
              <a
                href="/nosotros"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Nosotros
              </a>
              <a
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
              >
                <Settings size={16} />
                <span>Admin</span>
              </a>
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <CartButton onClick={toggleCart} />
              
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inicio
                </a>
                <a
                  href="/#productos"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Productos
                </a>
                <a
                  href="/vehiculos"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vehículos
                </a>
                <a
                  href="/nosotros"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nosotros
                </a>
                <a
                  href="/admin"
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={16} />
                  <span>Panel de Administración</span>
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
