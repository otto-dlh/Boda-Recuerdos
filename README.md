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

### Opción 2: Docker Compose (Recomendado)

```bash
# Levantar el contenedor en segundo plano
docker compose up -d --build

# Ver logs
docker compose logs -f

# Detener el contenedor
docker compose down
```

Accede a: `http://localhost:3005` (o el puerto configurado en `HOST_PORT`).

### Opción 3: Despliegue Automático con GitHub Actions

El repositorio cuenta con un flujo en `.github/workflows/deploy.yml` configurado para un **Self-Hosted Runner** en Linux:
- Totalmente aislado mediante `-p boda-recuerdos`.
- No interfiere con ningún otro contenedor o runner del servidor.
- Variables configurables en GitHub (**Settings -> Secrets and variables -> Actions**):
  - `HOST_PORT`: Puerto expuesto en el servidor (por defecto `3005`).
  - `PHOTOS_PATH`: Ruta absoluta en el servidor donde residen las fotos (con carpetas `save`, `boda`, `aniversario`).


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
