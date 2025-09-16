import React, { useState, useEffect } from 'react';
import { Plus, Package, BarChart3, Users, Settings, LogOut, Tags, Car } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { AdminLogin } from './AdminLogin';
import { CategoryManager } from './CategoryManager';
import { VehicleForm } from './VehicleForm';
import { VehicleList } from './VehicleList';
import type { Product, Vehicle } from '../../types';

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'vehicles' | 'categories'>('products');

  useEffect(() => {
    // Verificar si ya está autenticado
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    // Siempre desactivar loading después de 1 segundo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      console.log('Productos cargados:', data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos: ' + error.message);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
      console.log('Vehículos cargados:', data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      alert('Error al cargar vehículos: ' + error.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
      console.log('Categorías cargadas:', data.categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      alert('Error al cargar categorías: ' + error.message);
    }
  };

  const handleCategoriesChange = async (newCategories: string[]) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: newCategories }),
      });

      if (response.ok) {
        setCategories(newCategories);
        alert('¡Categorías actualizadas!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar categorías:', error);
      alert('Error al actualizar las categorías');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setProducts([]);
    setCategories([]);
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await loadProducts();
        setShowProductForm(false);
        alert('¡Producto creado! El producto se agregó correctamente');
      } else {
        const error = await response.json();
        alert(`Error al crear producto: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto: Ocurrió un error inesperado');
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await loadProducts();
        setShowProductForm(false);
        setEditingProduct(null);
        alert('¡Producto actualizado!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadProducts();
        alert('¡Producto eliminado!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  // Funciones para vehículos
  const handleCreateVehicle = async (vehicleData: any) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        await loadVehicles();
        setShowVehicleForm(false);
        alert('¡Vehículo creado! El vehículo se agregó correctamente');
      } else {
        const error = await response.json();
        alert(`Error al crear vehículo: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      alert('Error al crear vehículo: Ocurrió un error inesperado');
    }
  };

  const handleUpdateVehicle = async (vehicleData: any) => {
    if (!editingVehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        await loadVehicles();
        setShowVehicleForm(false);
        setEditingVehicle(null);
        alert('¡Vehículo actualizado!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      alert('Error al actualizar el vehículo');
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadVehicles();
        alert('¡Vehículo eliminado!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      alert('Error al eliminar el vehículo');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseVehicleForm = () => {
    setShowVehicleForm(false);
    setEditingVehicle(null);
  };

  const handleCloseView = () => {
    setViewingProduct(null);
  };

  // Estadísticas básicas
  const stats = {
    totalProducts: products.length,
    totalVehicles: vehicles.length,
    totalCategories: categories.length,
    totalStock: products.length, // Simplificado
    lowStock: 0,
    totalValue: products.reduce((sum, product) => sum + product.price, 0) + vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
          <button 
            onClick={() => {
              setLoading(false);
              console.log('Loading desactivado manualmente');
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Saltar Carga
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tu tienda online LC Imports
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  loadProducts();
                  loadVehicles();
                  loadCategories();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Package size={20} />
                <span>Cargar Datos</span>
              </button>
              {activeTab === 'products' && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Nuevo Producto</span>
                </button>
              )}
              {activeTab === 'vehicles' && (
                <button
                  onClick={() => setShowVehicleForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Nuevo Vehículo</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Productos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Vehículos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalVehicles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tags className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Categorías
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalCategories}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Stock Bajo
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.lowStock}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Valor Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${stats.totalValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package size={20} />
                <span>Productos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vehicles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Car size={20} />
                <span>Vehículos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Tags size={20} />
                <span>Categorías</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-yellow-700">Productos: {products.length}</p>
          <p className="text-yellow-700">Vehículos: {vehicles.length}</p>
          <p className="text-yellow-700">Categorías: {categories.length}</p>
          <p className="text-yellow-700">Pestaña activa: {activeTab}</p>
          <p className="text-yellow-700">Loading: {loading ? 'true' : 'false'}</p>
          <p className="text-yellow-700">Autenticado: {isAuthenticated ? 'true' : 'false'}</p>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' ? (
          products.length > 0 ? (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay productos cargados</p>
              <button
                onClick={() => {
                  loadProducts();
                  loadVehicles();
                  loadCategories();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cargar Productos
              </button>
            </div>
          )
        ) : activeTab === 'vehicles' ? (
          vehicles.length > 0 ? (
            <VehicleList
              vehicles={vehicles}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              onView={() => {}} // TODO: Implementar vista de vehículo
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay vehículos cargados</p>
              <button
                onClick={() => {
                  loadProducts();
                  loadVehicles();
                  loadCategories();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cargar Vehículos
              </button>
            </div>
          )
        ) : (
          <CategoryManager
            categories={categories}
            onCategoriesChange={handleCategoriesChange}
          />
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleCloseForm}
          categories={categories}
        />
      )}

      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={editingVehicle || undefined}
          onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle}
          onCancel={handleCloseVehicleForm}
        />
      )}

      {/* Product View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewingProduct.name}
                </h2>
                <button
                  onClick={handleCloseView}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingProduct.category}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <p className="mt-1 text-sm text-gray-900">${viewingProduct.price}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingProduct.stock}</p>
                </div>
                
                {viewingProduct.image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen</label>
                    <img 
                      src={viewingProduct.image} 
                      alt={viewingProduct.name}
                      className="mt-2 h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseView}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setViewingProduct(null);
                    handleEditProduct(viewingProduct);
                  }}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};