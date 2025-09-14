import { neon } from '@neondatabase/serverless';
import type { Product, Category } from '../types';

// Configurar conexión a Neon
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ZS9hpQ0FVfJu@ep-spring-cloud-acuovqk7-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

// Función para inicializar la base de datos
export async function initDatabase() {
  try {
    // Crear tabla de categorías
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de productos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insertar categorías por defecto
    await sql`
      INSERT INTO categories (name, slug) 
      VALUES 
        ('Electrónicos', 'electronicos'),
        ('Ropa', 'ropa'),
        ('Hogar', 'hogar'),
        ('Deportes', 'deportes')
      ON CONFLICT (slug) DO NOTHING
    `;

    // Verificar si ya hay productos
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`;
    if (existingProducts[0].count === 0) {
      // Insertar productos de ejemplo solo si no existen
      await sql`
        INSERT INTO products (name, description, category, price, image, stock) 
        VALUES 
          ('iPhone 15 Pro', 'El iPhone más avanzado con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR de 6.1 pulgadas.', 'Electrónicos', 999.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', 15),
          ('Camiseta Premium', 'Camiseta de algodón 100% orgánico, cómoda y duradera. Disponible en múltiples colores.', 'Ropa', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 50),
          ('Laptop Gaming', 'Laptop gaming de alto rendimiento con RTX 4060, 16GB RAM y SSD de 1TB. Perfecta para gaming y trabajo.', 'Electrónicos', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', 8),
          ('Zapatillas Deportivas', 'Zapatillas deportivas con tecnología de amortiguación avanzada. Ideales para correr y entrenar.', 'Deportes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', 30),
          ('Sofá Moderno', 'Sofá de 3 plazas con diseño moderno y materiales de alta calidad. Perfecto para tu sala de estar.', 'Hogar', 599.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', 5),
          ('Auriculares Inalámbricos', 'Auriculares inalámbricos con cancelación de ruido activa y batería de 30 horas de duración.', 'Electrónicos', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 20)
      `;
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

export const db = {
  products: {
    getAll: async () => {
      const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      return rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    },
    
    getById: async (id: string) => {
      const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    },
    
    create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const rows = await sql`
        INSERT INTO products (name, description, category, price, image, stock)
        VALUES (${product.name}, ${product.description}, ${product.category}, ${product.price}, ${product.image}, ${product.stock})
        RETURNING *
      `;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    },
    
    update: async (id: string, updates: Partial<Product>) => {
      const rows = await sql`
        UPDATE products 
        SET name = ${updates.name}, description = ${updates.description}, category = ${updates.category}, 
            price = ${updates.price}, image = ${updates.image}, stock = ${updates.stock}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    },
    
    delete: async (id: string) => {
      const rows = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    },
    
    search: async (query: string) => {
      const rows = await sql`
        SELECT * FROM products 
        WHERE name ILIKE ${'%' + query + '%'} OR description ILIKE ${'%' + query + '%'}
        ORDER BY created_at DESC
      `;
      return rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    },
    
    getByCategory: async (category: string) => {
      const rows = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`;
      return rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: row.category,
        price: parseFloat(row.price),
        image: row.image,
        stock: row.stock,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }
  },
  
  categories: {
    getAll: async () => {
      const rows = await sql`SELECT * FROM categories ORDER BY name`;
      return rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        slug: row.slug
      }));
    },
    
    getById: async (id: string) => {
      const rows = await sql`SELECT * FROM categories WHERE id = ${id}`;
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        slug: row.slug
      };
    },
    
    create: async (category: Omit<Category, 'id'>) => {
      const rows = await sql`
        INSERT INTO categories (name, slug)
        VALUES (${category.name}, ${category.slug})
        RETURNING *
      `;
      const row = rows[0];
      return {
        id: row.id.toString(),
        name: row.name,
        slug: row.slug
      };
    }
  }
};
