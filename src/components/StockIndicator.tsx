import React from 'react';

interface StockIndicatorProps {
  stock: 'sin-stock' | 'stock-bajo' | 'en-stock';
  className?: string;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ stock, className = '' }) => {
  const getStockStatus = (stock: 'sin-stock' | 'stock-bajo' | 'en-stock') => {
    switch (stock) {
      case 'sin-stock':
        return {
          color: 'bg-red-500',
          text: 'Sin Stock',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'stock-bajo':
        return {
          color: 'bg-yellow-500',
          text: 'Stock Bajo',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'en-stock':
        return {
          color: 'bg-green-500',
          text: 'En Stock',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Desconocido',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const status = getStockStatus(stock);

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Indicador circular */}
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${status.color} animate-pulse`}></div>
        <div className={`absolute inset-0 w-3 h-3 rounded-full ${status.color} opacity-30 animate-ping`}></div>
      </div>
      
      {/* Texto del estado */}
      <span className={`text-xs font-medium ${status.textColor}`}>
        {status.text}
      </span>
      
      {/* Cantidad (opcional, solo si hay stock) */}
      {stock !== 'sin-stock' && (
        <span className={`text-xs ${status.textColor} opacity-75`}>
          {stock === 'en-stock' ? '(Disponible)' : '(Últimas unidades)'}
        </span>
      )}
    </div>
  );
};

// Versión compacta para usar en listas o espacios pequeños
export const StockIndicatorCompact: React.FC<StockIndicatorProps> = ({ stock, className = '' }) => {
  const getStockStatus = (stock: 'sin-stock' | 'stock-bajo' | 'en-stock') => {
    switch (stock) {
      case 'sin-stock':
        return 'bg-red-500';
      case 'stock-bajo':
        return 'bg-yellow-500';
      case 'en-stock':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const status = getStockStatus(stock);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${status} animate-pulse`}></div>
        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${status} opacity-30 animate-ping`}></div>
      </div>
    </div>
  );
};
