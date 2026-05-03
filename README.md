# Sistema de Automatización de Carrito de Compras

Este proyecto es una solución full-stack para la gestión de un carrito de compras, incluyendo autenticación robusta, catálogo de productos, dashboard de estadísticas y generación de reportes en PDF.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React, Recharts (gráficos), Lucide React (iconos), Tailwind CSS.
- **Backend:** Node.js, Express, Zod (validación).
- **Base de Datos:** PostgreSQL 16+.
- **Seguridad:** JWT (Access & Refresh Tokens), Bcrypt.
- **Reportes:** PDFKit.

## 📁 Estructura del Proyecto

```text
Carrito-Compras/
├── backend/            # API RESTful en Node.js
│   ├── src/
│   │   ├── config/     # Configuración de DB y variables
│   │   ├── controllers/# Lógica de negocio
│   │   ├── middlewares/# Auth, RBAC y Errores
│   │   ├── routes/     # Definición de Endpoints
│   │   └── services/   # Generación de PDF y servicios externos
├── frontend/           # Aplicación React (Vite)
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── context/    # Estado global (Auth)
│   │   ├── pages/      # Vistas principales
│   └── tailwind.config.js
└── database/           # Scripts SQL (schema.sql)
```

## 🛠️ Instalación y Configuración

### 1. Base de Datos
- Asegúrate de tener PostgreSQL 16 instalado.
- Crea una base de datos llamada `carrito_compras`.
- Ejecuta el script `database/schema.sql` para crear las tablas y roles iniciales.

### 2. Backend
1. Navega a `backend/`.
2. Instala dependencias: `npm install`.
3. Crea un archivo `.env` basado en el siguiente template:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=carrito_compras
   JWT_ACCESS_SECRET=tu_secreto_access
   JWT_REFRESH_SECRET=tu_secreto_refresh
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   CORS_ORIGIN=http://localhost:3000
   ```
4. Inicia el servidor: `npm run dev` (requiere nodemon).

### 3. Frontend
1. Navega a `frontend/`.
2. Instala dependencias: `npm install`.
3. Inicia la aplicación: `npm run dev`.
4. La aplicación estará disponible en `http://localhost:3000`.

## 🔐 Roles y Acceso

- **Admin:** Acceso total, gestión de usuarios, catálogo y reportes.
- **Vendedor:** Gestión de inventario, visualización de dashboard y reportes.
- **Cliente:** Navegación por catálogo, gestión de carrito y realización de pedidos.

## 📄 Generación de Reportes
El sistema permite descargar reportes operacionales en formato PDF filtrando por rango de fechas, accesibles desde el módulo de "Reportes" para usuarios con rol Admin o Vendedor.
