# Sistema de Gestión de Entrenamientos de Natación - Frontend

Aplicación de escritorio para el Sistema de Gestión de Entrenamientos de Natación, desarrollada con Tauri, React, TypeScript y Tailwind CSS.

## Características Principales

- **Interfaz de Usuario Moderna**: Diseño responsive con Tailwind CSS y componentes de Radix UI
- **Autenticación de Usuarios**: Inicio de sesión seguro con JWT
- **Gestión de Atletas**: 
  - Listado, creación, edición y visualización detallada de perfiles de atletas
  - Filtrado y búsqueda avanzada
  - Gestión de información personal y deportiva
- **Gestión de Entrenamientos**:
  - Registro completo de sesiones de entrenamiento
  - Métricas detalladas (tiempos, estilos, series, etc.)
  - Seguimiento de factores fisiológicos
  - Registro de equipamiento utilizado
- **Panel de Analíticas**:
  - Visualización de estadísticas de rendimiento
  - Gráficos interactivos con Recharts
  - Análisis de progreso y tendencias
- **Experiencia de Usuario Optimizada**:
  - Notificaciones con Sonner
  - Formularios validados con React Hook Form y Zod
  - Navegación fluida con React Router
  - Gestión de estado con React Query

## Tecnologías Utilizadas

### Core
- **Tauri**: Framework para crear aplicaciones de escritorio multiplataforma
- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Bundler y herramienta de desarrollo

### UI/UX
- **Tailwind CSS**: Framework de CSS utilitario
- **Radix UI**: Componentes de UI accesibles y sin estilos
- **Lucide React**: Iconos SVG
- **React Day Picker**: Selector de fechas
- **Sonner**: Sistema de notificaciones toast

### Estado y Datos
- **React Query**: Gestión de estado del servidor y caché
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Axios**: Cliente HTTP

### Visualización de Datos
- **Recharts**: Biblioteca de gráficos para React
- **TanStack Table**: Tablas de datos avanzadas

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Rust (para compilar Tauri)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sistema-gestion-entrenamientos-natacion.git
   ```

2. Instalar dependencias:
   ```bash
   cd sistema-gestion-entrenamientos-natacion/frontend/tauri-app
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en el directorio raíz del frontend con las siguientes variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm run tauri dev
   ```

5. Construir la aplicación para producción:
   ```bash
   npm run tauri build
   ```

## Estructura del Proyecto

```
frontend/tauri-app/
├── src/                  # Código fuente de React
│   ├── assets/           # Recursos estáticos (imágenes, etc.)
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contextos de React (Auth, etc.)
│   ├── hooks/            # Hooks personalizados
│   ├── lib/              # Utilidades y configuraciones
│   ├── routes/           # Componentes de páginas por ruta
│   │   ├── analytics/    # Páginas de análisis y estadísticas
│   │   ├── athletes/     # Páginas de gestión de atletas
│   │   ├── auth/         # Páginas de autenticación
│   │   ├── dashboard/    # Página principal del dashboard
│   │   └── trainings/    # Páginas de gestión de entrenamientos
│   ├── services/         # Servicios para comunicación con la API
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── App.tsx           # Componente principal y configuración de rutas
│   └── main.tsx          # Punto de entrada de la aplicación
├── src-tauri/            # Código fuente de Tauri (Rust)
├── public/               # Archivos públicos
├── index.html            # Plantilla HTML
└── vite.config.ts        # Configuración de Vite
```

## Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/login` | Página de inicio de sesión |
| `/dashboard` | Panel principal con resumen de datos |
| `/athletes` | Listado de atletas |
| `/athletes/new` | Formulario para crear nuevo atleta |
| `/athletes/:id` | Detalles de un atleta específico |
| `/athletes/:id/edit` | Edición de un atleta |
| `/trainings` | Listado de entrenamientos |
| `/trainings/new` | Formulario para crear nuevo entrenamiento |
| `/trainings/:id` | Detalles de un entrenamiento específico |
| `/trainings/:id/edit` | Edición de un entrenamiento |
| `/analytics` | Panel de análisis y estadísticas |

## Integración con el Backend

La aplicación se comunica con el backend Express.js mediante una API REST. Los servicios principales incluyen:

- **api.ts**: Configuración base de Axios con interceptores para autenticación y manejo de errores
- **athleteService.ts**: Operaciones CRUD para atletas
- **trainingService.ts**: Operaciones CRUD para entrenamientos
- **analyticsService.ts**: Obtención de datos para análisis y estadísticas
- **dashboardService.ts**: Datos para el panel principal

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo de Vite
- `npm run build`: Compila la aplicación para producción
- `npm run preview`: Vista previa de la versión compilada
- `npm run tauri`: Comandos de Tauri
  - `npm run tauri dev`: Inicia la aplicación Tauri en modo desarrollo
  - `npm run tauri build`: Compila la aplicación Tauri para distribución

## Características de Seguridad

- Autenticación mediante JWT
- Interceptores para manejo de tokens expirados
- Validación de datos con Zod
- Manejo centralizado de errores

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue las pautas de contribución del proyecto principal.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.