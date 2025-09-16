import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // En una implementación real, esto vendría de una base de datos
    // Por ahora, retornamos categorías por defecto
    const defaultCategories = [
      'Electrónicos',
      'Ropa y Accesorios',
      'Hogar y Jardín',
      'Deportes',
      'Libros',
      'Juguetes'
    ];

    return new Response(JSON.stringify({ categories: defaultCategories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { categories } = await request.json();
    
    if (!Array.isArray(categories)) {
      return new Response(JSON.stringify({ error: 'Las categorías deben ser un array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // En una implementación real, aquí guardarías en la base de datos
    // Por ahora, solo validamos y retornamos éxito
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Categorías actualizadas correctamente',
      categories 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating categories:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};