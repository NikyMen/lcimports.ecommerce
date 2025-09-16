import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, User, Phone } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { CartItem } from './CartItem';
import type { WhatsAppMessage } from '../../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart, getTotalItems } = useCartStore();
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppSubmit = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const whatsappData: WhatsAppMessage = {
        products: items,
        total,
        customerInfo: customerInfo.name || customerInfo.phone ? customerInfo : undefined
      };

      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Abrir WhatsApp con el mensaje
        window.open(result.whatsappUrl, '_blank');
        setShowWhatsAppForm(false);
        setCustomerInfo({ name: '', phone: '' });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      alert('Error al procesar la consulta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickWhatsApp = async () => {
    if (items.length === 0) return;

    try {
      const whatsappData: WhatsAppMessage = {
        products: items,
        total
      };

      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Abrir WhatsApp directamente con el mensaje
        window.open(result.whatsappUrl, '_blank');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al generar enlace de WhatsApp:', error);
      alert('Error al generar el enlace de WhatsApp');
    }
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Carrito ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mb-4">
                  Agrega algunos productos para comenzar
                </p>
                <button
                  onClick={onClose}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-primary-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleQuickWhatsApp}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Consultar Stock por WhatsApp</span>
              </button>

              {/* Advanced WhatsApp Button */}
              <button
                onClick={() => setShowWhatsAppForm(true)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <User size={16} />
                <span>Con datos personales</span>
              </button>

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Consulta de Stock
                </h3>
                <button
                  onClick={() => setShowWhatsAppForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Opcional: Agrega tu información para una mejor atención
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowWhatsAppForm(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleWhatsAppSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle size={16} />
                        <span>Enviar por WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
