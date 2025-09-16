import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Upload, X, Image as ImageIcon, Car } from 'lucide-react';
import type { Vehicle } from '../../types';

const vehicleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.enum(['motos', 'autos', 'otros']),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  stock: z.enum(['sin-stock', 'stock-bajo', 'en-stock'], {
    errorMap: () => ({ message: 'Debe seleccionar un estado de stock' })
  }),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  year: z.number().optional(),
  mileage: z.number().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const [imagePreview, setImagePreview] = useState(vehicle?.image || '');
  const [imagesPreview, setImagesPreview] = useState<string[]>(vehicle?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: vehicle?.name || '',
      description: vehicle?.description || '',
      category: vehicle?.category || 'autos',
      price: vehicle?.price || 0,
      stock: vehicle?.stock || 'en-stock',
      image: vehicle?.image || '',
      images: vehicle?.images || [],
      year: vehicle?.year || undefined,
      mileage: vehicle?.mileage || undefined,
    }
  });

  const watchedImage = watch('image');

  React.useEffect(() => {
    if (watchedImage) {
      setImagePreview(watchedImage);
    }
  }, [watchedImage]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImagePreview(result.imageUrl);
        setValue('image', result.imageUrl);
      } else {
        setUploadError(result.error || 'Error al subir la imagen');
      }
    } catch (error) {
      setUploadError('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadError('');

    try {
      const uploadPromises = Array.from(files).slice(0, 4).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          return result.imageUrl;
        } else {
          throw new Error(result.error || 'Error al subir la imagen');
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImagesPreview(uploadedImages);
      setValue('images', uploadedImages);
      
      if (!imagePreview && uploadedImages.length > 0) {
        setImagePreview(uploadedImages[0]);
        setValue('image', uploadedImages[0]);
      }
    } catch (error) {
      setUploadError('Error al subir las imágenes');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleMultipleFileUpload(files);
    }
  };

  const handleFormSubmit = (data: VehicleFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Car className="h-6 w-6 mr-2 text-primary-600" />
              {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Vehículo *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Honda CBR 600"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="autos">Autos</option>
                  <option value="motos">Motos</option>
                  <option value="otros">Otros Vehículos</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe el vehículo"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Campos básicos simplificados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  {...register('year', { valueAsNumber: true })}
                  type="number"
                  min="1900"
                  max="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje
                </label>
                <input
                  {...register('mileage', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="50000"
                />
              </div>
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Stock *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      {...register('stock')}
                      type="radio"
                      value="sin-stock"
                      className="text-red-500 focus:ring-red-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Sin Stock</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      {...register('stock')}
                      type="radio"
                      value="stock-bajo"
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Stock Bajo</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      {...register('stock')}
                      type="radio"
                      value="en-stock"
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">En Stock</span>
                    </div>
                  </label>
                </div>
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>

            {/* Sección de imágenes (similar al ProductForm) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {!imagePreview ? (
                  <div className="space-y-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF hasta 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="mx-auto h-32 w-32 object-cover rounded-md border"
                      onError={() => setImagePreview('')}
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setValue('image', '');
                        }}
                        className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
              </div>
              
              <input
                {...register('image')}
                type="hidden"
              />
            </div>

            {/* Sección de múltiples imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes Adicionales (hasta 4)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  ref={multipleFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFileChange}
                  className="hidden"
                />
                
                {imagesPreview.length === 0 ? (
                  <div className="space-y-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <button
                        type="button"
                        onClick={() => multipleFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? 'Subiendo...' : 'Subir Imágenes'}
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Puedes seleccionar múltiples imágenes (hasta 4)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagesPreview.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border"
                            onError={() => {
                              const newImages = imagesPreview.filter((_, i) => i !== index);
                              setImagesPreview(newImages);
                              setValue('images', newImages);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = imagesPreview.filter((_, i) => i !== index);
                              setImagesPreview(newImages);
                              setValue('images', newImages);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {imagesPreview.length < 4 && (
                      <button
                        type="button"
                        onClick={() => multipleFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar más
                      </button>
                    )}
                  </div>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
              </div>
              
              <input
                {...register('images')}
                type="hidden"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>{vehicle ? 'Actualizar' : 'Crear'} Vehículo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
