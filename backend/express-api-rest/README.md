# Sistema de Gestión de Entrenamientos de Natación - Backend

API backend para el Sistema de Gestión de Entrenamientos de Natación, desarrollado con Express.js y MySQL.

## Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión de entrenadores con autenticación JWT
- **Gestión de Atletas**: Operaciones CRUD para perfiles de atletas
- **Registro de Entrenamientos**: Seguimiento detallado de sesiones de entrenamiento que incluye:
  - Datos básicos de la sesión (fecha, tipo, duración, condiciones climáticas)
  - Métricas del atleta (tiempos, estilos de nado, repeticiones, series, intervalos de descanso, conteo de brazadas)
  - Datos fisiológicos (frecuencia cardíaca, peso)
  - Factores de rendimiento (técnica de respiración, estado físico, reportes de dolor)
  - Equipamiento utilizado
- **Factores Externos**: Seguimiento de lesiones, fatiga, nutrición, sueño, etc.
- **Análisis y Estadísticas**: 
  - Evolución del rendimiento a lo largo del tiempo
  - Alertas de rendimiento atípico
  - Visualización de datos fisiológicos
  - Análisis de carga de entrenamiento
  - Análisis de consistencia
  - Impacto de factores externos
  - Análisis de eficiencia por series

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sistema-gestion-entrenamientos-natacion.git
   ```

2. Instalar dependencias:
   ```bash
   cd sistema-gestion-entrenamientos-natacion/backend/express-api-rest
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en el directorio raíz del backend con las siguientes variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=app_natacion_beiker
   JWT_SECRET=tu_clave_secreta_jwt
   NODE_ENV=development
   ```

4. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE app_natacion_beiker;
   ```

5. Ejecutar migraciones (si aplica):
   ```bash
   npx sequelize-cli db:migrate
   ```

6. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   O para producción:
   ```bash
   npm start
   ```

## Estructura del Proyecto

```
backend/
├── config/           # Configuraciones de la aplicación
├── controllers/      # Controladores de las rutas
├── middleware/       # Middlewares personalizados
├── migrations/       # Migraciones de la base de datos
├── models/           # Modelos de Sequelize
├── routes/           # Definición de rutas
├── services/         # Lógica de negocio
├── utils/            # Utilidades y helpers
├── .env.example      # Ejemplo de archivo de variables de entorno
├── app.js            # Punto de entrada de la aplicación
└── package.json      # Dependencias y scripts
```

## Documentación de la API

La documentación detallada de los endpoints está disponible en `/api-docs` cuando el servidor está en ejecución (requiere Swagger configurado).

## Variables de Entorno

| Variable       | Descripción                                | Valor por defecto  |
|----------------|--------------------------------------------|--------------------|
| PORT           | Puerto del servidor                        | 5000              |
| DB_HOST       | Host de la base de datos                  | localhost         |
| DB_USER       | Usuario de la base de datos               | root              |
| DB_PASSWORD   | Contraseña de la base de datos            | (vacío)           |
| DB_NAME       | Nombre de la base de datos                | app_natacion_beiker |
| JWT_SECRET    | Clave secreta para JWT                    | (cadena aleatoria) |
| NODE_ENV      | Entorno de ejecución (development/production) | development      |

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta las pruebas unitarias
- `npm run lint`: Ejecuta el linter
- `npm run migrate`: Ejecuta las migraciones pendientes


## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Endpoints de la API

### Autenticación
- `POST /api/auth/registro` - Registrar un nuevo entrenador
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/yo` - Obtener información del usuario actual

### Atletas
- `GET /api/atletas` - Obtener todos los atletas
- `GET /api/atletas/:id` - Obtener un atleta específico
- `POST /api/atletas` - Crear un nuevo atleta
- `PUT /api/atletas/:id` - Actualizar información de un atleta
- `DELETE /api/atletas/:id` - Eliminar un atleta

### Entrenamientos
- `GET /api/entrenamientos` - Obtener todos los entrenamientos (con filtros opcionales)
  - Parámetros de consulta:
    - `atletaId`: Filtrar por ID de atleta
    - `fechaInicio`: Fecha de inicio (formato YYYY-MM-DD)
    - `fechaFin`: Fecha de fin (formato YYYY-MM-DD)
    - `tipo`: Tipo de entrenamiento
- `GET /api/entrenamientos/:id` - Obtener un entrenamiento con todos sus detalles
- `POST /api/entrenamientos` - Crear un nuevo entrenamiento
- `PUT /api/entrenamientos/:id` - Actualizar un entrenamiento existente
- `DELETE /api/entrenamientos/:id` - Eliminar un entrenamiento

### Métricas y Análisis
- `GET /api/analiticas/rendimiento` - Obtener métricas de rendimiento
  - Parámetros:
    - `atletaId`: ID del atleta (opcional)
    - `rango`: Rango de tiempo (7d, 30d, 90d, personalizado)
- `GET /api/analiticas/carga` - Obtener análisis de carga de entrenamiento
- `GET /api/alertas` - Obtener alertas de rendimiento atípico

### Factores Externos
- `GET /api/factores` - Obtener factores externos registrados
- `POST /api/factores` - Registrar un nuevo factor externo
- `PUT /api/factores/:id` - Actualizar un factor existente
- `DELETE /api/factores/:id` - Eliminar un factor

### Equipamiento
- `GET /api/equipamiento` - Listar todo el equipamiento disponible
- `POST /api/equipamiento` - Registrar nuevo equipamiento
- `PUT /api/equipamiento/:id` - Actualizar información de equipamiento
- `DELETE /api/equipamiento/:id` - Eliminar equipamiento

### Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado:

| Código | Descripción |
|--------|-------------|
| 200 | OK - La solicitud se completó con éxito |
| 201 | Creado - Recurso creado exitosamente |
| 400 | Solicitud incorrecta - Verificar los datos enviados |
| 401 | No autorizado - Se requiere autenticación |
| 403 | Prohibido - No tienes permisos para realizar esta acción |
| 404 | No encontrado - El recurso solicitado no existe |
| 500 | Error del servidor - Error interno del servidor |

### Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Incluye el token en el encabezado de la solicitud:
```
Authorization: Bearer tu_token_jwt_aquí
```

### Formato de Fechas

Todas las fechas deben enviarse en formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`

## Esquema de la Base de Datos

El sistema utiliza los siguientes modelos principales:

### Usuario (Entrenador)
- `id`: Identificador único
- `nombre`: Nombre del entrenador
- `email`: Correo electrónico (único)
- `password`: Contraseña hasheada
- `rol`: Rol del usuario (admin/entrenador)
- `fechaCreacion`: Fecha de creación del registro
- `ultimoAcceso`: Último inicio de sesión

### Atleta
- `id`: Identificador único
- `nombre`: Nombre del atleta
- `apellido`: Apellido del atleta
- `fechaNacimiento`: Fecha de nacimiento
- `genero`: Género (M/F/Otro)
- `categoria`: Categoría competitiva
- `telefono`: Número de teléfono
- `email`: Correo electrónico
- `fotoPerfil`: URL de la foto de perfil
- `estado`: Estado actual (activo/inactivo/lesionado)
- `entrenadorId`: ID del entrenador responsable

### Entrenamiento
- `id`: Identificador único
- `fecha`: Fecha del entrenamiento
- `tipo`: Tipo de entrenamiento (ej: resistencia, velocidad, etc.)
- `duracion`: Duración en minutos
- `ubicacion`: Lugar del entrenamiento
- `clima`: Condiciones climáticas
- `temperaturaAgua`: Temperatura del agua en °C
- `temperaturaAire`: Temperatura ambiente en °C
- `observaciones`: Notas adicionales
- `atletaId`: ID del atleta
- `entrenadorId`: ID del entrenador

### DetalleEntrenamiento
- `id`: Identificador único
- `entrenamientoId`: ID del entrenamiento relacionado
- `estilo`: Estilo de nado (libre, espalda, braza, mariposa, combinado)
- `distancia`: Distancia en metros
- `tiempo`: Tiempo en segundos
- `repeticiones`: Número de repeticiones
- `series`: Número de series
- `descanso`: Tiempo de descanso entre series en segundos
- `frecuenciaCardiaca`: Frecuencia cardíaca promedio
- `escalas`: Escalas de intensidad
- `tecnicaRespiración`: Técnica de respiración utilizada
- `estadoFisico`: Estado físico general
- `dolor`: Reporte de dolores o molestias

### FactorExterno
- `id`: Identificador único
- `tipo`: Tipo de factor (lesión, enfermedad, estrés, etc.)
- `descripcion`: Descripción detallada
- `fechaInicio`: Fecha de inicio
- `fechaFin`: Fecha de finalización (opcional)
- `gravedad`: Nivel de gravedad (leve, moderado, grave)
- `atletaId`: ID del atleta relacionado

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para la interacción con la base de datos
- **MySQL**: Sistema de gestión de bases de datos relacional
- **JWT**: Autenticación mediante JSON Web Tokens
- **Bcrypt**: Encriptación de contraseñas
- **CORS**: Soporte para Cross-Origin Resource Sharing
- **Dotenv**: Manejo de variables de entorno

### Desarrollo
- **ESLint**: Linter para mantener la calidad del código
- **Prettier**: Formateador de código
- **Nodemon**: Reinicio automático del servidor en desarrollo

## Estructura del Código

```
src/
├── config/           # Configuraciones de la aplicación
│   ├── database.js   # Configuración de la base de datos
│   └── auth.js      # Configuración de autenticación
│
├── controllers/     # Lógica de controladores
│   ├── auth.js      # Autenticación
│   ├── atletas.js   # Gestión de atletas
│   └── ...
│
├── middlewares/     # Middlewares personalizados
│   ├── auth.js      # Autenticación y autorización
│   └── validators/  # Validación de datos
│
├── models/         # Modelos de Sequelize
│   ├── index.js     # Inicialización de modelos
│   ├── usuario.js   # Modelo de Usuario
│   └── ...
│
├── routes/         # Definición de rutas
│   ├── api/        # Rutas de la API
│   └── index.js   # Rutas principales
│
├── services/      # Lógica de negocio
│   ├── auth.js    # Servicios de autenticación
│   └── ...
│
├── utils/         # Utilidades
│   ├── logger.js  # Utilidades de registro
│   └── ...
│
├── app.js        # Configuración de Express
└── server.js     # Punto de entrada de la aplicación
```


## Contribución

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) para más detalles.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
