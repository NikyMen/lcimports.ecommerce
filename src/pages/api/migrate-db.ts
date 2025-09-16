import type { APIRoute } from 'astro';
import { initDatabase } from '../../lib/database';

export const POST: APIRoute = async () => {
  try {
    await initDatabase();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Base de datos migrada correctamente' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error migrating database:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al migrar la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
