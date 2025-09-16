import React from 'react';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';

export const Hero: React.FC = () => {

  return (
    <>
      <div 
        className="text-white relative min-h-screen flex flex-col justify-center"
        style={{
          backgroundImage: "url('/lcimports.background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay gradient para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        
        {/* Efecto de desvanecimiento en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a LC Imports
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Descubre productos de calidad con los mejores precios
            </p>
            <a
              href="#productos"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag size={20} />
              <span>Ver Productos</span>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Envío Rápido
              </h3>
              <p className="text-gray-600">
                Recibe tus productos en tiempo récord con nuestro servicio de envío express
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Productos Garantizados
              </h3>
              <p className="text-gray-600">
                Todos nuestros productos cuentan con garantía de calidad y satisfacción
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Atención Premium
              </h3>
              <p className="text-gray-600">
                Nuestro equipo está disponible para brindarte la mejor experiencia de compra
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
