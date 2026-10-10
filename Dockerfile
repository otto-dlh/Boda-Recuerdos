# ==========================================
# Etapa 1: Compilación de Assets (Tailwind CSS)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias e instalar (incluyendo devDependencies para Tailwind)
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar Tailwind CSS
COPY . .
RUN npm run build:css

# ==========================================
# Etapa 2: Imagen Final de Producción
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Etiqueta para aislar e identificar el proyecto sin afectar otros contenedores
LABEL maintainer="otto-dlh"
LABEL app="boda-recuerdos"

# Instalar dependencias solo de producción
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el código fuente y el CSS compilado desde la etapa anterior
COPY --from=builder /app/src ./src
COPY index.html server.js generate-thumbnails.js ./

# Crear carpetas base de fotos (serán montadas con volúmenes desde el host)
RUN mkdir -p /app/save /app/boda /app/aniversario

EXPOSE 3000

# Al arrancar, procesa miniaturas (sharp) y levanta Express
CMD ["npm", "start"]
