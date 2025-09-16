import type { APIRoute } from 'astro';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No se proporcionó ningún archivo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'El archivo debe ser una imagen' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'El archivo es demasiado grande. Máximo 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `product_${timestamp}_${randomString}.${fileExtension}`;
    
    const filePath = join(uploadsDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await writeFile(filePath, buffer);

    // Retornar la URL de la imagen
    const imageUrl = `/uploads/${fileName}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      imageUrl,
      fileName 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
