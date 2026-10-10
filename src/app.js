const folderLabels = {
    'save': 'Save the Date',
    'boda': 'Boda',
    'aniversario': 'Aniversario'
};

let apiBase = '';
let nodeEnv = 'development';
let currentPhotos = [];
let currentPhotoIndex = 0;
let imageObserver;
let currentFolder = 'save';
let favorites = [];
let showingOnlyFavorites = false;

// ===== Sistema de Favoritos con localStorage =====
function loadFavorites() {
    const saved = localStorage.getItem('albumFavorites');
    favorites = saved ? JSON.parse(saved) : [];
    updateFavoritesCount();
}

function saveFavorites() {
    localStorage.setItem('albumFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function toggleFavorite() {
    const currentPhotoPath = currentPhotos[currentPhotoIndex];
    const isFavorited = favorites.includes(currentPhotoPath);

    if (isFavorited) {
        favorites = favorites.filter(photo => photo !== currentPhotoPath);
    } else {
        favorites.push(currentPhotoPath);
    }

    saveFavorites();
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const btn = document.querySelector('.modal-favorite');
    const icon = document.getElementById('favoriteIcon');
    const currentPhotoPath = currentPhotos[currentPhotoIndex];
    const isFavorited = favorites.includes(currentPhotoPath);

    if (isFavorited) {
        btn.classList.add('active');
        icon.textContent = 'favorite';
    } else {
        btn.classList.remove('active');
        icon.textContent = 'favorite_border';
    }
}

function updateFavoritesCount() {
    const countEl = document.getElementById('favoritesCount');
    countEl.textContent = favorites.length;
}

function toggleFavoritesFilter() {
    showingOnlyFavorites = !showingOnlyFavorites;
    const btn = document.getElementById('favoritesBtn');

    if (showingOnlyFavorites) {
        btn.classList.add('text-primary', 'border-b-2', 'border-primary');
        btn.classList.remove('text-text-muted', 'dark:text-gray-400');
        displayFavoritesGallery();
    } else {
        btn.classList.remove('text-primary', 'border-b-2', 'border-primary');
        btn.classList.add('text-text-muted', 'dark:text-gray-400');
        loadGallery(currentFolder);
    }
}

function displayFavoritesGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    currentPhotos = [];

    if (favorites.length === 0) {
        gallery.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay fotos favoritas</p>';
        return;
    }

    // Actualizar título
    document.querySelector('main h2').textContent = '❤️ Mis Favoritos';

    favorites.forEach((photoPath, index) => {
        const item = document.createElement('div');
        item.className = 'masonry-item';

        const img = document.createElement('img');
        img.alt = 'Foto favorita';
        img.className = 'w-full h-auto object-cover lazy-image';
        img.loading = 'lazy';
        img.src = photoPath; // Las favoritas se cargan directamente
        img.classList.add('loaded');
        img.style.opacity = '1';
        img.onclick = () => openModal(photoPath, index);

        const frame = document.createElement('div');
        frame.className = 'photo-frame';
        frame.appendChild(img);

        item.appendChild(frame);
        gallery.appendChild(item);

        currentPhotos.push(photoPath);
    });
}

// ===== Lazy Loading con Intersection Observer =====
function setupLazyLoading() {
    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
}

function observeImage(img) {
    if (imageObserver) {
        imageObserver.observe(img);
    }
}

// ===== Funciones del Modal =====
function openModal(imageSrc, photoIndex = 0) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    currentPhotoIndex = photoIndex;
    updatePhotoCounter();
    updateFavoriteButton();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextPhoto() {
    if (currentPhotos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    updateModal();
}

function prevPhoto() {
    if (currentPhotos.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateModal();
}

function updateModal() {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = currentPhotos[currentPhotoIndex];
    updatePhotoCounter();
    updateFavoriteButton();
}

function updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    counter.textContent = `${currentPhotoIndex + 1}/${currentPhotos.length}`;
}

function downloadPhoto() {
    const imageSrc = currentPhotos[currentPhotoIndex];
    const link = document.createElement('a');
    link.href = imageSrc;

    const urlParts = imageSrc.split('/');
    const fileName = urlParts[urlParts.length - 1] || `foto-${currentPhotoIndex + 1}.jpg`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    setupLazyLoading();

    const modal = document.getElementById('photoModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'ArrowLeft') {
            prevPhoto();
        }
    });
});

// ===== Configuración y Carga de Galería =====
async function initConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        apiBase = config.apiBase;
        nodeEnv = config.env;
        console.log(`📝 Ambiente: ${nodeEnv}`);
        loadGallery('save');
    } catch (error) {
        console.log('Usando configuración por defecto (desarrollo)');
        loadGallery('save');
    }
}

async function loadGallery(folder) {
    if (showingOnlyFavorites) {
        showingOnlyFavorites = false;
        document.getElementById('favoritesBtn').classList.remove('text-primary', 'border-b-2', 'border-primary');
        document.getElementById('favoritesBtn').classList.add('text-text-muted', 'dark:text-gray-400');
    }

    currentFolder = folder;

    // Actualizar nav activo
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.folder) {
            link.classList.remove('text-primary', 'border-b-2', 'border-primary');
            link.classList.add('text-text-muted', 'dark:text-gray-400');
        }
    });
    document.querySelector(`[data-folder="${folder}"]`).classList.add('text-primary', 'border-b-2', 'border-primary');
    document.querySelector(`[data-folder="${folder}"]`).classList.remove('text-text-muted', 'dark:text-gray-400');

    // Actualizar título
    document.querySelector('main h2').textContent = folderLabels[folder];

    // Limpiar galería
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    currentPhotos = [];

    try {
        const url = `${apiBase}/api/photos/${folder}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const files = await response.json();

        if (files.length === 0) {
            gallery.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay fotos en esta carpeta</p>';
            return;
        }

        // Crear items de galería
        files.forEach((item, index) => {
            const file = typeof item === 'string' ? item : item.file;
            const thumb = typeof item === 'string' ? null : item.thumb;

            const fullImagePath = nodeEnv === 'development'
                ? `http://localhost:3000/${folder}/${file}`
                : `/${folder}/${file}`;

            // Usar thumbnail si existe, si no la original
            const thumbPath = thumb
                ? (nodeEnv === 'development'
                    ? `http://localhost:3000/${folder}/${thumb}`
                    : `/${folder}/${thumb}`)
                : fullImagePath;

            currentPhotos.push(fullImagePath);

            const item_el = document.createElement('div');
            item_el.className = 'masonry-item';

            const img = document.createElement('img');
            img.alt = file;
            img.className = 'w-full h-auto object-cover lazy-image';
            img.loading = 'lazy';
            img.dataset.src = thumbPath;
            img.style.backgroundColor = '#f0f0f0';
            img.onclick = () => openModal(fullImagePath, index);

            const frame = document.createElement('div');
            frame.className = 'photo-frame';
            frame.appendChild(img);

            item_el.appendChild(frame);
            gallery.appendChild(item_el);

            observeImage(img);
        });

    } catch (error) {
        gallery.innerHTML = '<p class="col-span-full text-center text-gray-500">Error cargando fotos</p>';
        console.error('Error:', error);
    }
}

// ===== Menú Móvil =====
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.add('hidden');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initConfig);
