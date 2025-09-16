import type { APIRoute } from 'astro';
import { db } from '../../lib/database';

export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    
    if (category) {
      const vehicles = await db.vehicles.getByCategory(category);
      return new Response(JSON.stringify(vehicles), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const vehicles = await db.vehicles.getAll();
    return new Response(JSON.stringify(vehicles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const vehicleData = await request.json();
    
    const vehicle = await db.vehicles.create(vehicleData);
    
    return new Response(JSON.stringify(vehicle), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
