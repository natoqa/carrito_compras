-- Datos iniciales enriquecidos para Sistema de Carrito de Compras Pro
-- IMPORTANTE: Ejecutar después de schema.sql

-- 1. Limpiar datos existentes (opcional)
TRUNCATE order_items, orders, products, categories, coupons, refresh_tokens, users CASCADE;

-- 2. Insertar Categorías Modernas
INSERT INTO categories (id, name, description) VALUES 
(1, 'Audio Pro', 'Audífonos, parlantes y equipos de sonido de alta fidelidad'),
(2, 'Computación', 'Laptops, monitores y accesorios de última generación'),
(3, 'Lifestyle', 'Ropa premium, accesorios y artículos de uso diario'),
(4, 'Hogar Inteligente', 'Automatización, seguridad y electrodomésticos IoT');

-- 3. Insertar Productos Premium (USA Standard Catalog)
INSERT INTO products (name, description, price, stock, category_id, image_url, min_stock_alert) VALUES 
-- Audio Pro
('Sony WH-1000XM5', 'Audífonos con cancelación de ruido líder en la industria.', 399.99, 25, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 5),
('Apple AirPods Max', 'El equilibrio perfecto entre audio de alta fidelidad y la magia de los AirPods.', 549.00, 15, 1, 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=800', 3),
('Bose QuietComfort II', 'Los mejores audífonos in-ear con cancelación de ruido del mundo.', 299.00, 40, 1, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 10),

-- Computación
('MacBook Pro M3 14"', 'Poder asombroso. Pantalla brillante. Pro en todo.', 1599.00, 10, 2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 2),
('Monitor LG UltraFine 5K', 'Pantalla IPS de 27 pulgadas con resolución 5120 x 2880.', 1299.99, 8, 2, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 2),
('Teclado Keychron Q1', 'Teclado mecánico QMK totalmente personalizable.', 169.00, 30, 2, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800', 5),

-- Lifestyle
('Nike Air Terra', 'Zapatillas de trail running con amortiguación premium.', 145.00, 50, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 10),
('Mochila Peak Design 30L', 'La mochila de viaje definitiva, diseñada por fotógrafos.', 299.95, 20, 3, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 5),
('Reloj Garmin Epix Pro', 'Smartwatch de alto rendimiento con pantalla AMOLED.', 899.99, 12, 3, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 3),

-- Hogar Inteligente
('Philips Hue Starter Kit', 'Iluminación inteligente para todo tu hogar.', 199.99, 35, 4, 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800', 8),
('Dyson V15 Detect', 'La aspiradora inalámbrica más potente e inteligente.', 749.00, 18, 4, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', 4),
('Nest Learning Thermostat', 'Ahorra energía con el termostato que aprende de ti.', 249.00, 25, 4, 'https://images.unsplash.com/photo-1567924675637-283a6742993e?w=800', 6);

-- 4. Insertar Cupones Estratégicos
INSERT INTO coupons (code, discount_percentage, expires_at) VALUES 
('LAUNCH2024', 20, '2026-12-31 23:59:59'),
('PREMIUM50', 50, '2026-12-31 23:59:59'),
('HOLIDAY15', 15, '2026-12-31 23:59:59');

-- 5. Insertar Roles (Si no existen por el TRUNCATE CASCADE)
INSERT INTO roles (id, name, description) VALUES 
(1, 'Admin', 'Administrador con acceso total'),
(2, 'Vendedor', 'Cajero o vendedor con acceso a ventas e inventario'),
(3, 'Cliente', 'Usuario final que realiza compras')
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Usuarios de Prueba (Password: admin123)
-- Hash: $2b$10$oMiM6Cj2nqrs38eRbZWK1eLIPyVAOsRp.2WRdFRHuF/ErcaO8MLIS
INSERT INTO users (username, email, password_hash, role_id) VALUES 
('Alex Rivera', 'admin@shopauto.com', '$2b$10$oMiM6Cj2nqrs38eRbZWK1eLIPyVAOsRp.2WRdFRHuF/ErcaO8MLIS', 1),
('Jordan Smith', 'vendedor@shopauto.com', '$2b$10$oMiM6Cj2nqrs38eRbZWK1eLIPyVAOsRp.2WRdFRHuF/ErcaO8MLIS', 2),
('Emma Watson', 'cliente@gmail.com', '$2b$10$oMiM6Cj2nqrs38eRbZWK1eLIPyVAOsRp.2WRdFRHuF/ErcaO8MLIS', 3);
