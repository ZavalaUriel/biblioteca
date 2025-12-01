# 📚 Biblioteca Digital - Frontend

Sistema de gestión bibliotecaria con interfaz moderna y elegante con tema espacial oscuro.

## ✨ Características

- 🎨 **Diseño Espacial Oscuro**: Interfaz elegante con animaciones suaves
- 🔐 **Autenticación JWT**: Sistema de login seguro con roles (Admin, Bibliotecario, Alumno)
- 📖 **Gestión de Libros**: CRUD completo con búsqueda y filtros
- 👥 **Gestión de Usuarios**: Control de usuarios con diferentes roles
- 🎭 **Animaciones**: Transiciones fluidas con Framer Motion
- 📱 **Responsive**: Adaptable a diferentes dispositivos
- 🚀 **Performance**: Optimizado con React + Vite + TypeScript

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Navegación
- **Axios** - HTTP client
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd biblioteca-front
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y configurar la URL del backend:
```env
VITE_API_URL=http://localhost:8080/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## 🎯 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🔑 Roles y Permisos

### Admin
- ✅ Ver todos los libros
- ✅ Crear, editar y eliminar libros
- ✅ Ver todos los usuarios
- ✅ Crear, editar y eliminar usuarios

### Bibliotecario
- ✅ Ver todos los libros
- ✅ Crear, editar y eliminar libros
- ✅ Ver usuarios
- ✅ Crear y editar usuarios

### Alumno
- ✅ Ver todos los libros
- ✅ Buscar libros
- ❌ No puede gestionar usuarios

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── books/          # Componentes de libros
│   ├── common/         # Componentes reutilizables
│   ├── layout/         # Layout y navegación
│   └── users/          # Componentes de usuarios
├── pages/              # Páginas de la aplicación
├── services/           # Servicios API
├── store/              # Redux store y slices
│   └── slices/         # Redux slices
├── styles/             # Estilos globales
├── types/              # TypeScript types
└── utils/              # Utilidades
```

## 🎨 Tema y Estilos

El proyecto utiliza un tema espacial oscuro con:
- Colores principales: Púrpura (#6366f1), Cyan (#06b6d4)
- Fondo oscuro con efecto de estrellas animadas
- Bordes con efecto glow
- Animaciones suaves y transiciones
- Cards con efecto glass morphism

## 🔗 Endpoints del Backend

El frontend consume los siguientes endpoints:

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Libros
- `GET /libro` - Obtener todos los libros
- `GET /libro/:id` - Obtener un libro específico
- `POST /libro/create` - Crear libro (Admin/Bibliotecario)
- `PUT /libro/update/:id` - Actualizar libro (Admin/Bibliotecario)
- `DELETE /libro/delete/:id` - Eliminar libro (Admin/Bibliotecario)

### Usuarios
- `GET /admin/usuario` - Obtener usuarios (Admin/Bibliotecario)
- `POST /admin/usuario/create` - Crear usuario (Admin/Bibliotecario)
- `PUT /admin/usuario/update/:id` - Actualizar usuario (Admin/Bibliotecario)
- `DELETE /admin/usuario/delete/:id` - Eliminar usuario (Admin/Bibliotecario)

## 🚀 Despliegue

Para desplegar en producción:

1. Construir la aplicación:
```bash
npm run build
```

2. Los archivos estáticos estarán en `dist/`

3. Desplegar en tu servicio preferido (Vercel, Netlify, etc.)

## 📝 Notas

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- El token JWT se guarda en localStorage
- Las imágenes de portadas y PDFs se manejan en Base64

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un sistema de gestión bibliotecaria educativo.

---

Desarrollado con ❤️ y ☕
