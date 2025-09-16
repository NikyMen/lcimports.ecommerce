import React from 'react';
import { Edit, Trash2, Eye, Car } from 'lucide-react';
import { StockIndicator } from '../StockIndicator';
import type { Vehicle } from '../../types';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onView: (vehicle: Vehicle) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onView
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'autos': return 'Autos';
      case 'motos': return 'Motos';
      case 'otros': return 'Otros';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'autos': return 'bg-blue-100 text-blue-800';
      case 'motos': return 'bg-red-100 text-red-800';
      case 'otros': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vehículos</h3>
        <p className="text-gray-500">Comienza agregando tu primer vehículo</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Vehículos ({vehicles.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Año/Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {vehicle.image ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={vehicle.image}
                          alt={vehicle.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Car className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {vehicle.description}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                    {getCategoryLabel(vehicle.category)}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {vehicle.year && vehicle.brand ? (
                    <div>
                      <div>{vehicle.year}</div>
                      <div className="text-gray-500">{vehicle.brand}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">${vehicle.price.toFixed(2)}</div>
                  {vehicle.condition && (
                    <div className="text-xs text-gray-500 capitalize">
                      {vehicle.condition}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockIndicator stock={vehicle.stock} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(vehicle)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
