/* =========================================
   ORIGEN
   JAVASCRIPT PRINCIPAL
========================================= */

const pathOptions = document.querySelectorAll(".path-option");
const pathsBackground = document.querySelector(".paths-background");
const previewNumber = document.querySelector("#path-preview-number");
const previewTitle = document.querySelector("#path-preview-title");
const previewDescription = document.querySelector("#path-preview-description");
const progressBar = document.querySelector(".scroll-progress span");

function updatePath(option) {
    if (!option) return;

    pathOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");

    const pathName = option.dataset.path;
    const image = option.dataset.image;
    const title = option.dataset.title;
    const description = option.dataset.description;
    const index = Array.from(pathOptions).indexOf(option) + 1;
    const formattedIndex = String(index).padStart(2, "0");

    previewNumber.textContent = `${formattedIndex} / FAMILIA`;
    previewTitle.textContent = title;
    previewDescription.textContent = description;

    if (image) {
        pathsBackground.style.setProperty("--active-path-image", `url("${image}")`);
        pathsBackground.classList.add("visible");
    }

    document.body.dataset.activePath = pathName;
}

pathOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) {
            updatePath(option);
        }
    });

    option.addEventListener("click", () => updatePath(option));
    option.addEventListener("focus", () => updatePath(option));
});

updatePath(document.querySelector(".path-option.active"));



/* =========================================
   GALERÍAS — CARRUSEL REUTILIZABLE
========================================= */

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    const prev = gallery.querySelector(".gallery-prev");
    const next = gallery.querySelector(".gallery-next");
    const dots = gallery.querySelector(".gallery-dots");

    if (!track || slides.length === 0) return;

    let current = 0;

    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `gallery-dot${index === 0 ? " is-active" : ""}`;
        dot.setAttribute("aria-label", `Ir a imagen ${index + 1}`);
        dot.addEventListener("click", () => goTo(index));
        dots.appendChild(dot);
    });

    function render() {
        track.style.transform = `translateX(-${current * 100}%)`;

        dots.querySelectorAll(".gallery-dot").forEach((dot, index) => {
            dot.classList.toggle("is-active", index === current);
        });

        slides.forEach((slide, index) => {
            slide.classList.toggle("is-active", index === current);
        });
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        render();
    }

    prev.addEventListener("click", () => goTo(current - 1));
    next.addEventListener("click", () => goTo(current + 1));

    let startX = 0;

    gallery.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener("touchend", (event) => {
        const endX = event.changedTouches[0].clientX;
        const distance = endX - startX;

        if (Math.abs(distance) < 45) return;

        if (distance < 0) {
            goTo(current + 1);
        } else {
            goTo(current - 1);
        }
    }, { passive: true });

    render();
});


/* =========================================
   FAMILIAS — DESPLEGAR EXPERIENCIAS
========================================= */

const familyToggles = document.querySelectorAll(".family-toggle");

familyToggles.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".family-card");
        const isOpen = card.classList.toggle("is-open");

        button.setAttribute("aria-expanded", String(isOpen));
        button.innerHTML = isOpen
            ? `OCULTAR EXPERIENCIAS <b>↑</b>`
            : `${card.dataset.family === "huasteca" ? "CONSTRUIR EXPERIENCIA" : "VER EXPERIENCIAS"} <b>↘</b>`;
    });
});


/* =========================================
   EXPERIENCIAS — PREPARACIÓN PARA RUTAS
========================================= */

const experienceLinks = document.querySelectorAll("[data-experience]");

experienceLinks.forEach((link) => {
    link.addEventListener("click", () => {
        link.classList.add("is-loading");
    });
});


/* =========================================
   PROGRESO DE SCROLL
========================================= */

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
        progressBar.style.width = "0%";
        return;
    }

    const progress = (scrollTop / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();


/* =========================================
   MENÚ
========================================= */

const menuButton = document.querySelector(".menu-btn");

menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("menu-open", !expanded);

    console.log(!expanded
        ? "Menú ORIGEN abierto."
        : "Menú ORIGEN cerrado."
    );
});


/* =========================================
   YOUTUBE — VIDEO EMBEBIDO
========================================= */

const youtubeFeature = document.querySelector("[data-youtube-video]");

function createYoutubeEmbed(container, videoId) {
    if (!container || !videoId || videoId === "ORIGEN_VIDEO_ID") return;

    const frame = container.querySelector(".youtube-frame");
    if (!frame) return;

    frame.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
            title="Video ORIGEN"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;
}

// Cuando exista el ID real del video, basta con cambiar ORIGEN_VIDEO_ID.
// El resto del reproductor se genera automáticamente.
createYoutubeEmbed(youtubeFeature, youtubeFeature?.dataset.youtubeVideo);


/* =========================================
   GALERÍAS — GATE DE CONTENIDO
========================================= */

const galleryGate = document.querySelector("#social-gate");
const galleryGateClose = galleryGate?.querySelector(".social-gate-close");
const galleryGateComplete = galleryGate?.querySelector("[data-gate-complete]");
let activeGallery = null;

function openGalleryGate(gallery) {
    activeGallery = gallery;
    galleryGate?.classList.add("is-open");
    galleryGate?.setAttribute("aria-hidden", "false");
}

function closeGalleryGate() {
    galleryGate?.classList.remove("is-open");
    galleryGate?.setAttribute("aria-hidden", "true");
    activeGallery = null;
}

document.querySelectorAll("[data-gallery-gate]").forEach((button) => {
    button.addEventListener("click", () => {
        const gallery = button.closest("[data-gallery]");
        openGalleryGate(gallery);
    });
});

galleryGateClose?.addEventListener("click", closeGalleryGate);

galleryGate?.addEventListener("click", (event) => {
    if (event.target === galleryGate) closeGalleryGate();
});

galleryGateComplete?.addEventListener("click", () => {
    if (!activeGallery) return;

    activeGallery.classList.add("gallery-unlocked");

    const unlockButton = activeGallery.querySelector("[data-gallery-gate]");
    if (unlockButton) unlockButton.classList.add("is-unlocked");

    activeGallery.querySelectorAll(".gallery-slide").forEach((slide) => {
        slide.classList.remove("is-locked");
    });

    closeGalleryGate();
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    gallery.querySelectorAll(".gallery-slide").forEach((slide, index) => {
        if (index > 0) slide.classList.add("is-locked");
    });
});

