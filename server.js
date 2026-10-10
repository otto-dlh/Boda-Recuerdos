const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Detectar ambiente automáticamente (por defecto development)
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Servir archivos estáticos
app.use(express.static(__dirname));

// Middleware para servir carpetas como directorios estáticos
app.use('/save', express.static(path.join(__dirname, 'save'), { maxAge: '7d' }));
app.use('/boda', express.static(path.join(__dirname, 'boda'), { maxAge: '7d' }));
app.use('/aniversario', express.static(path.join(__dirname, 'aniversario'), { maxAge: '7d' }));

// API para configuración del cliente
app.get('/api/config', (req, res) => {
    res.json({
        env: NODE_ENV,
        isDevelopment: isDevelopment,
        apiBase: isDevelopment ? '' : ''
    });
});

// API para obtener lista de fotos
app.get('/api/photos/:folder', (req, res) => {
    const folder = req.params.folder;
    const folderPath = path.join(__dirname, folder);

    // Validar que la carpeta sea una de las permitidas
    if (!['save', 'boda', 'aniversario'].includes(folder)) {
        return res.status(400).json({ error: 'Carpeta no válida' });
    }

    // Verificar que la carpeta existe
    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: 'Carpeta no encontrada' });
    }

    // Leer archivos
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo carpeta' });
        }

        // Filtrar solo archivos de imagen (excluir carpeta thumbs)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            const filePath = path.join(folderPath, file);
            return imageExtensions.includes(ext) && !fs.statSync(filePath).isDirectory();
        }).sort();

        // Verificar qué thumbnails existen
        const thumbsDir = path.join(folderPath, 'thumbs');
        const thumbsExist = fs.existsSync(thumbsDir);

        const result = imageFiles.map(file => {
            const baseName = path.parse(file).name;
            const thumbFile = baseName + '.webp';
            const hasThumb = thumbsExist && fs.existsSync(path.join(thumbsDir, thumbFile));
            return {
                file,
                thumb: hasThumb ? `thumbs/${thumbFile}` : null
            };
        });

        res.json(result);
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎉 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Ambiente: ${NODE_ENV}`);
    console.log(`📁 Carpetas disponibles:`);
    console.log(`   - /save`);
    console.log(`   - /boda`);
    console.log(`   - /aniversario`);
});
