import React, { useState } from 'react';
import { ShoppingCart, Package, Star, Eye } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { StockIndicator, StockIndicatorCompact } from './StockIndicator';
import { ProductModal } from './ProductModal';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal
    
    if (product.stock === 'sin-stock') {
      alert('Sin stock: Este producto no está disponible actualmente');
      return;
    }
    
    addItem(product, 1);
    alert(`¡Producto agregado! ${product.name} se agregó al carrito`);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
        onClick={handleCardClick}
      >
        <div className="relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay con ícono de ver */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white bg-opacity-90 rounded-full p-3">
                <Eye className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>
          
          <div className="absolute top-2 right-2">
            <StockIndicator stock={product.stock} />
          </div>
        </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-500 ml-1">(4.0)</span>
          </div>
          
          <StockIndicatorCompact stock={product.stock} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 'sin-stock'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              product.stock === 'sin-stock'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <ShoppingCart size={16} />
            <span>{product.stock === 'sin-stock' ? 'Sin stock' : 'Agregar'}</span>
          </button>
        </div>
        </div>
      </div>

      {/* Modal del Producto */}
      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};
