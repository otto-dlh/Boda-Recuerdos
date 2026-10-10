const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FOLDERS = ['save', 'boda', 'aniversario'];
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 75;
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function generateThumbnails() {
    for (const folder of FOLDERS) {
        const srcDir = path.join(__dirname, folder);
        const thumbDir = path.join(__dirname, folder, 'thumbs');

        if (!fs.existsSync(srcDir)) {
            console.log(`⏭️  Carpeta "${folder}" no existe, saltando...`);
            continue;
        }

        // Crear carpeta de thumbnails
        if (!fs.existsSync(thumbDir)) {
            fs.mkdirSync(thumbDir, { recursive: true });
        }

        const files = fs.readdirSync(srcDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext) && !fs.statSync(path.join(srcDir, file)).isDirectory();
        });

        console.log(`\n📁 Procesando "${folder}" (${files.length} imágenes)...`);

        for (const file of files) {
            const inputPath = path.join(srcDir, file);
            const outputName = path.parse(file).name + '.webp';
            const outputPath = path.join(thumbDir, outputName);

            // Saltar si el thumbnail ya existe y es más reciente
            if (fs.existsSync(outputPath)) {
                const srcStat = fs.statSync(inputPath);
                const thumbStat = fs.statSync(outputPath);
                if (thumbStat.mtimeMs >= srcStat.mtimeMs) {
                    console.log(`  ✅ ${file} → ya existe`);
                    continue;
                }
            }

            try {
                await sharp(inputPath)
                    .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
                    .webp({ quality: THUMB_QUALITY })
                    .toFile(outputPath);

                const origSize = (fs.statSync(inputPath).size / 1024).toFixed(0);
                const thumbSize = (fs.statSync(outputPath).size / 1024).toFixed(0);
                console.log(`  🖼️  ${file} (${origSize}KB) → ${outputName} (${thumbSize}KB)`);
            } catch (err) {
                console.error(`  ❌ Error con ${file}: ${err.message}`);
            }
        }
    }

    console.log('\n✨ ¡Thumbnails generados exitosamente!');
}

generateThumbnails();
