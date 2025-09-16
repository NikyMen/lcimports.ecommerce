import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const vehicle = await db.vehicles.getById(id);
    
    if (!vehicle) {
      return new Response(JSON.stringify({ error: 'Vehículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(vehicle), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updates = await request.json();
    const vehicle = await db.vehicles.update(id, updates);
    
    if (!vehicle) {
      return new Response(JSON.stringify({ error: 'Vehículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(vehicle), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const vehicle = await db.vehicles.delete(id);
    
    if (!vehicle) {
      return new Response(JSON.stringify({ error: 'Vehículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Vehículo eliminado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
