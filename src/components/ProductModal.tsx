import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Star, Heart, Share2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { StockIndicator } from './StockIndicator';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  // Usar las imágenes del producto o la imagen principal como fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  const handleAddToCart = () => {
    if (product.stock === 'sin-stock') {
      alert('Sin stock: Este producto no está disponible actualmente');
      return;
    }
    
    addItem(product, 1);
    alert(`¡Producto agregado! ${product.name} se agregó al carrito`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galería de Imágenes */}
            <div className="space-y-4">
              {/* Imagen Principal */}
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {productImages[currentImageIndex] ? (
                    <img
                      src={productImages[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Controles de navegación */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </>
                )}

                {/* Indicador de imagen actual */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Producto */}
            <div className="space-y-6">
              {/* Categoría y Stock */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {product.category}
                </span>
                <StockIndicator stock={product.stock} />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">(4.0) - 128 reseñas</span>
              </div>

              {/* Precio */}
              <div className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Características */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Características</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    Producto de alta calidad
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    Garantía incluida
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    Envío rápido disponible
                  </li>
                </ul>
              </div>

              {/* Acciones */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 'sin-stock'}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    product.stock === 'sin-stock'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <ShoppingCart size={20} />
                  <span>
                    {product.stock === 'sin-stock' ? 'Sin Stock' : 'Agregar al Carrito'}
                  </span>
                </button>

                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart size={18} />
                    <span>Favoritos</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={18} />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Información del Producto</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Categoría:</span> {product.category}</p>
                  <p><span className="font-medium">Disponibilidad:</span> 
                    <span className={`ml-2 ${
                      product.stock === 'sin-stock' ? 'text-red-600' :
                      product.stock === 'stock-bajo' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {product.stock === 'sin-stock' ? 'Sin stock' :
                       product.stock === 'stock-bajo' ? 'Stock bajo' : 'En stock'}
                    </span>
                  </p>
                  <p><span className="font-medium">Creado:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
