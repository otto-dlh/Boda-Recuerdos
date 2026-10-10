# ==========================================
# Etapa 1: Compilación de Assets con pnpm
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Habilitar pnpm mediante Corepack oficial de Node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copiar manifiestos y lockfile de pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar todas las dependencias de manera estricta y segura
RUN pnpm install --frozen-lockfile

# Copiar código fuente y compilar Tailwind CSS
COPY . .
RUN pnpm run build:css

# ==========================================
# Etapa 2: Imagen Final de Producción
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

LABEL maintainer="otto-dlh"
LABEL app="boda-recuerdos"

# Habilitar pnpm
RUN corepack enable

# Copiar manifiestos e instalar exclusivamente dependencias de producción
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copiar archivos compilados y archivos estáticos
COPY --from=builder /app/src ./src
COPY index.html server.js generate-thumbnails.js ./

# Crear carpetas base de fotos (serán montadas como volúmenes desde el host)
RUN mkdir -p /app/save /app/boda /app/aniversario

EXPOSE 3000

# Arranca procesando miniaturas con sharp y ejecutando Express
CMD ["pnpm", "start"]
