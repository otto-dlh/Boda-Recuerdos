# 🎉 Álbum Digital - Otto & Susy

Álbum digital interactivo con navegación entre tres carpetas de fotos: Save the Date, Boda y Aniversario.

## 📋 Estructura del Proyecto

```
.
├── index.html              # Página principal
├── server.js              # Servidor Express
├── package.json           # Dependencias
├── README.md              # Este archivo
├── save/                  # Fotos de Save the Date
├── boda/                  # Fotos de la Boda
└── aniversario/          # Fotos de Aniversario
```

## 🚀 Instalación y Ejecución

### Opción 1: Desarrollo Local (Recomendado para desarrollo)

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Accede a: `http://localhost:3000`

En modo desarrollo, las imágenes se cargan desde las carpetas locales.

### Opción 2: Docker CLI (Para producción/distribución)

**Construir la imagen desde el repositorio:**
```bash
docker build -t boda-recuerdos https://github.com/otto-dlh/Boda-Recuerdos.git
```

**O construir localmente y ejecutar:**
```bash
# 1. Clonar el repositorio (o estar en la carpeta del proyecto)
cd d:\Mis Proyectos\Boda&Recuerdos

# 2. Crear imagen manualmente (sin Dockerfile, usando node base)
docker run -d \
  --name album \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npm start"
```

**En Windows PowerShell:**
```powershell
docker run -d `
  --name album `
  -p 3000:3000 `
  -v ${PWD}:/app `
  -w /app `
  node:18-alpine `
  sh -c "npm install && npm start"
```

Accede a: `http://localhost:3000`

**Comandos útiles:**
```bash
# Ver logs
docker logs -f album

# Detener contenedor
docker stop album

# Eliminar contenedor
docker rm album
```

### Opción 3: Producción Local (Sin Docker)

```bash
# Instalar dependencias
npm install

# Ejecutar en modo producción
npm start
```

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

Accede a: `http://localhost:3000`

## 📁 Agregar Fotos

1. Coloca tus fotos en las carpetas correspondientes:
   - `./save/` - Fotos para Save the Date
   - `./boda/` - Fotos de la Boda
   - `./aniversario/` - Fotos de Aniversario

2. Las fotos se cargarán automáticamente al navegar entre las secciones

## ⚙️ Funcionalidades

- ✅ Navegación entre tres carpetas
- ✅ Carga dinámica de fotos
- ✅ Galería en masonry (columnas responsivas)
- ✅ Diseño moderno con Tailwind CSS
- ✅ Tema claro/oscuro
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Docker ready

## 🔧 Variables de Entorno

- `NODE_ENV` - Ambiente de ejecución:
  - `development` - Lee imágenes de carpetas locales (para desarrollo)
  - `production` - Lee imágenes de rutas del Docker/servidor (para producción)

## 📝 Notas

- Los archivos de imagen soportados: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Las fotos se ordenan alfabéticamente
- El servidor sirve archivos estáticos desde las carpetas de fotos

## 🎨 Personalización

Edita `index.html` para:
- Cambiar colores (variables en `tailwind.config`)
- Actualizar títulos y descripción
- Agregar más secciones

## 📞 Soporte

Para problemas con Docker, asegúrate de:
1. Tener Docker Desktop instalado
2. Las carpetas `save/`, `boda/` y `aniversario/` existan
3. Los puertos no estén en uso
