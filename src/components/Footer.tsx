import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = '543794406509';
    const message = encodeURIComponent('Hola! Me gustaría consultar sobre el stock de algunos productos.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LC Imports</h3>
            <p className="text-gray-300 text-sm">
              Tu tienda online de confianza. Productos de calidad con los mejores precios.
            </p>
            <div className="flex space-x-4">
              {/* Aquí irán los iconos de redes sociales */}
              
              <a 
                href="https://www.instagram.com/lc_imports_ctes/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/#productos" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-300">+54 379 440-6509</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-300">info@lcimports.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-300">Argentina, Corrientes</span>
              </div>
            </div>
          </div>

          {/* WhatsApp para consultas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">¿Consultas sobre Stock?</h3>
            <p className="text-gray-300 text-sm">
              Contáctanos por WhatsApp para consultar disponibilidad de productos.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <MessageCircle size={20} />
              <span>Consultar Stock</span>
            </button>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} LC Imports. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desarrollado por <a 
                href="https://nicolasmendez.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 transition-colors font-medium"
              >
                Nicolas Mendez
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
