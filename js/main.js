// ---------- Año del footer ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Placeholders: muestra el nombre del archivo que falta ----------
document.querySelectorAll(".photo img").forEach((img) => {
  const frame = img.closest(".photo");
  frame.dataset.file = img.getAttribute("src");
  const markMissing = () => frame.classList.add("is-missing");
  if (img.complete && img.naturalWidth === 0) markMissing();
  img.addEventListener("error", markMissing);
  img.addEventListener("load", () => frame.classList.remove("is-missing"));
});

// ---------- Navegación ----------
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  });
});

// ---------- Animación al hacer scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Video ----------
const videoFrame = document.querySelector(".video__frame");
videoFrame.querySelector(".video__play").addEventListener("click", () => {
  const src = videoFrame.dataset.src;
  if (!src) {
    alert("Agrega el enlace de tu video en el atributo data-src de .video__frame (index.html).");
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.src = src + (src.includes("?") ? "&" : "?") + "autoplay=1";
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  videoFrame.innerHTML = "";
  videoFrame.appendChild(iframe);
});

// ---------- Lightbox ----------
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");
const galleryPhotos = [
  ...document.querySelectorAll(
    ".grid .photo, .travel__strip .photo, .wedding__gallery .photo, .street__gallery .photo, .bts__grid .photo"
  ),
];
let current = 0;

const visiblePhotos = () => galleryPhotos.filter((p) => !p.classList.contains("is-missing"));

function openLightbox(photo) {
  const list = visiblePhotos();
  current = list.indexOf(photo);
  if (current < 0) return;
  showCurrent(list);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function showCurrent(list = visiblePhotos()) {
  const img = list[current].querySelector("img");
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
}

function step(dir) {
  const list = visiblePhotos();
  current = (current + dir + list.length) % list.length;
  showCurrent(list);
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryPhotos.forEach((photo) => {
  photo.classList.add("zoomable");
  photo.addEventListener("click", () => openLightbox(photo));
});

lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
lightbox.querySelector(".lightbox__next").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
