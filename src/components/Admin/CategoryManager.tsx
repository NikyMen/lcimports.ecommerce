import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onCategoriesChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      onCategoriesChange(updatedCategories);
      setNewCategory('');
      setCategoryDescription('');
      setIsModalOpen(false);
    }
  };

  const handleEditCategory = (oldName: string) => {
    setEditingCategory(oldName);
    setNewCategory(oldName);
    setCategoryDescription('');
  };

  const handleSaveEdit = () => {
    if (newCategory.trim() && editingCategory) {
      const updatedCategories = categories.map(cat => 
        cat === editingCategory ? newCategory.trim() : cat
      );
      onCategoriesChange(updatedCategories);
      setEditingCategory(null);
      setNewCategory('');
      setCategoryDescription('');
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
      const updatedCategories = categories.filter(cat => cat !== categoryName);
      onCategoriesChange(updatedCategories);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory('');
    setCategoryDescription('');
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNewCategory('');
    setCategoryDescription('');
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-primary-600" />
          Gestión de Categorías
        </h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Lista de categorías */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay categorías creadas</p>
            <p className="text-sm">Haz clic en "Nueva Categoría" para comenzar</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    {category.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-500">
                    {category.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Editar categoría"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Eliminar categoría"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para agregar/editar categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Electrónicos, Ropa, Hogar..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe brevemente esta categoría..."
                />
              </div>

              {/* Vista previa del slug */}
              {newCategory && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Slug:</span> {newCategory.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                </div>
              )}

              {/* Validación */}
              {newCategory && categories.includes(newCategory.trim()) && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">
                    Esta categoría ya existe
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingCategory ? handleSaveEdit : handleAddCategory}
                disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} />
                <span>{editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
