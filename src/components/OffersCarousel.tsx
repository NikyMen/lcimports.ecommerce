import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  originalPrice?: number;
  offerPrice?: number;
  link?: string;
}

export const OffersCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [offers] = useState<Offer[]>([
    {
      id: '1',
      title: '¡Descuento Especial!',
      description: 'Productos seleccionados con hasta 30% de descuento',
      discount: '30% OFF',
      image: '/lcimports.background.png',
      originalPrice: 100,
      offerPrice: 70,
      link: '/#productos'
    },
    {
      id: '2',
      title: 'Oferta Flash',
      description: 'Accesorios y complementos con precios increíbles',
      discount: '50% OFF',
      image: '/lcimports.background.png',
      originalPrice: 200,
      offerPrice: 100,
      link: '/#productos'
    },
    {
      id: '3',
      title: 'Gran Liquidación',
      description: 'Últimas unidades con descuentos especiales',
      discount: '40% OFF',
      image: '/lcimports.background.png',
      originalPrice: 150,
      offerPrice: 90,
      link: '/#productos'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Ofertas Especiales!
          </h2>
          <p className="text-lg text-gray-600">
            No te pierdas estas increíbles promociones
          </p>
        </div>

        <div className="relative">
          {/* Carrusel Container */}
          <div className="overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {offers.map((offer) => (
                <div key={offer.id} className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 md:p-12 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                      {/* Contenido de la oferta */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                          <Tag className="h-6 w-6 mr-2" />
                          <span className="text-lg font-semibold">{offer.discount}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                          {offer.title}
                        </h3>
                        <p className="text-lg mb-6 text-red-100">
                          {offer.description}
                        </p>
                        
                        {offer.originalPrice && offer.offerPrice && (
                          <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                            <span className="text-2xl line-through opacity-75">
                              ${offer.originalPrice}
                            </span>
                            <span className="text-3xl font-bold">
                              ${offer.offerPrice}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => offer.link && (window.location.href = offer.link)}
                          className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Ver Ofertas
                        </button>
                      </div>

                      {/* Imagen de la oferta */}
                      <div className="flex-shrink-0">
                        <div className="w-64 h-48 bg-white rounded-lg overflow-hidden shadow-lg">
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-red-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
