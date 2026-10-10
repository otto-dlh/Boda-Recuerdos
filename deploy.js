require('dotenv').config();
const SftpClient = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const config = {
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
};

const REMOTE_PATH = process.env.SFTP_REMOTE_PATH; // Ej: /var/www/boda-recuerdos
const LOCAL_PATH = __dirname;

// Carpetas y archivos a excluir (imágenes, node_modules, git, etc.)
const EXCLUDE_LIST = [
    'node_modules',
    '.git',
    '.vscode',
    '.idea',
    'save',        // Fotos originales
    'boda',        // Fotos originales
    'aniversario', // Fotos originales
    '.env',        // No subir credenciales
    'deploy.js',   // No subir este script
    '.gitignore',
    'README.md',
    'package-lock.json'
];

async function deploy() {
    if (!config.host || !config.username || !config.password || !REMOTE_PATH) {
        console.error('❌ Error: Faltan variables de entorno para SFTP en .env');
        console.error('Asegúrate de tener: SFTP_HOST, SFTP_USER, SFTP_PASSWORD, SFTP_REMOTE_PATH');
        return;
    }

    const sftp = new SftpClient();

    try {
        console.log(`🔌 Conectando a ${config.host}...`);
        await sftp.connect(config);
        console.log('✅ Conectado.');

        // Debug: Mostrar directorio actual
        const currentPath = await sftp.cwd();
        console.log(`📍 Directorio actual remoto: ${currentPath}`);

        console.log(`📂 Subiendo archivos a ${REMOTE_PATH}...`);

        // Crear directorio remoto si no existe
        const remoteDirExists = await sftp.exists(REMOTE_PATH);
        if (!remoteDirExists) {
            console.log(`Creating remote directory ${REMOTE_PATH}`);
            await sftp.mkdir(REMOTE_PATH, true);
        }

        // Función recursiva para subir directorio
        async function uploadDir(localDir, remoteDir) {
            const items = fs.readdirSync(localDir);

            for (const item of items) {
                // Saltar excluidos
                if (EXCLUDE_LIST.includes(item) || item.startsWith('.')) continue;

                const localItemPath = path.join(localDir, item);
                const remoteItemPath = `${remoteDir}/${item}`;
                const stats = fs.statSync(localItemPath);

                if (stats.isDirectory()) {
                    // Si es directorio, crear remoto y recursar
                    const exists = await sftp.exists(remoteItemPath);
                    if (!exists) {
                        await sftp.mkdir(remoteItemPath);
                        console.log(`   📁 Creado directorio: ${item}`);
                    }
                    await uploadDir(localItemPath, remoteItemPath);
                } else {
                    // Si es archivo, subir
                    console.log(`   ⬆️  Subiendo: ${item}`);
                    await sftp.put(localItemPath, remoteItemPath);
                }
            }
        }

        await uploadDir(LOCAL_PATH, REMOTE_PATH);

        console.log('\n✨ ¡Despliegue completado con éxito!');

    } catch (err) {
        console.error('❌ Error en despliegue:', err.message);
    } finally {
        await sftp.end();
    }
}

deploy();
