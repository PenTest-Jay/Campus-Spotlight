/**
 * CAMPUS SPOTLIGHT - OPTIMIZED MASTER SCRIPT
 */

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    organizeEvents();
    initReveal();
    setupNav();
    initCalendar();
    initSlideshows();
    initCounter();
    setupLogin();
    initGalleryModal();

    console.log("System Active: Running");
}

/* --- 1. EVENT ORGANIZATION --- */

function organizeEvents() {
    const container = document.querySelector(".events-grid");
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".event-card"));

    cards.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return dateA - dateB;
    });

    container.innerHTML = "";
    cards.forEach(card => container.appendChild(card));
}

/* --- 2. REVEAL ANIMATION --- */

function initReveal() {
    const elements = document.querySelectorAll(".reveal, .nav-card, .cat-card");
    if (!elements.length) return;

    const runReveal = () => {
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };

    runReveal(); // 🔥 FIX: run immediately
    window.addEventListener("scroll", runReveal, { passive: true });
}

/* --- 3. NAVIGATION --- */

function setupNav() {
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-link], .btn-details, [data-register], [data-calendar]");
        if (!target) return;

        if (target.hasAttribute("data-calendar")) {
            alert("Event added to calendar!");
            return;
        }

        const path =
            target.dataset.link?.trim() ||
            (target.classList.contains("btn-details") && "event-details.html") ||
            (target.hasAttribute("data-register") && "registration.html");

        if (path) window.location.href = path;
    });
}

/* --- 4. CALENDAR --- */

function initCalendar() {
    const header = document.querySelector(".calendar-header h2");
    const caption = document.querySelector(".event-table caption");

    if (!header && !caption) return;

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const label = `${monthNames[month]} ${year}`;

    if (header) header.textContent = label;
    if (caption) caption.textContent = `${label} Events Calendar`;

    document.querySelectorAll(".event-table td").forEach(cell => {
        const match = cell.innerText.trim().match(/^\d+/);
        if (match && parseInt(match[0]) === day) {
            cell.classList.add("today-highlight");
            cell.setAttribute("aria-current", "date");
        }
    });
}

/* --- 5. SLIDESHOWS --- */

function initSlideshows() {
    const cycle = (selector) => {
        const container = document.querySelector(selector);
        if (!container) return;

        const slides = container.querySelectorAll("img");
        if (slides.length <= 1) return;

        let i = 0;

        setInterval(() => {
            slides[i].classList.remove("active");
            i = (i + 1) % slides.length;
            slides[i].classList.add("active");
        }, 5000);
    };

    cycle(".upcoming-slideshow");
    cycle(".past-slideshow");
}

/* --- 6. COUNTER --- */

function initCounter() {
    const display = document.getElementById("eventNumber");
    if (!display) return;

    const count = document.querySelectorAll(".event-card").length;
    display.textContent = count;
}

/* --- 7. LOGIN --- */

function setupLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = document.getElementById("email")?.value;
        const pass = document.getElementById("password")?.value;

        if (user && pass) {
            window.location.href = "./staff-dashboard.html";
        } else {
            alert("Credentials required");
        }
    });
}

/* --- 8. GALLERY MODAL --- */

function initGalleryModal() {
    const modal = document.getElementById("galleryModal");
    if (!modal) return; // only run on gallery page

    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let images = [];
    let index = 0;

    const albumCards = document.querySelectorAll(".album-card");

    albumCards.forEach(card => {
        card.addEventListener("click", () => {
            const hiddenImgs = card.querySelectorAll(".hidden-images img");
            const title = card.querySelector("h2").innerText;
            const summary = card.dataset.summary || "";

            images = Array.from(hiddenImgs).map(img => img.src);
            index = 0;

            if (images.length) {
                modal.style.display = "block";
                updateModal(title, summary);
            }
        });
    });

    function updateModal(title = "", summary = "") {
        modalImg.src = images[index];
        captionText.innerHTML = `
            <strong>${title}</strong><br>${summary}<br>
            <small>Photo ${index + 1} of ${images.length}</small>
        `;
    }

    nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        index = (index + 1) % images.length;
        updateModal();
    });

    prevBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        index = (index - 1 + images.length) % images.length;
        updateModal();
    });

    closeBtn?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    document.addEventListener("keydown", (e) => {
        if (modal.style.display !== "block") return;

        if (e.key === "Escape") modal.style.display = "none";
        if (e.key === "ArrowRight") nextBtn?.click();
        if (e.key === "ArrowLeft") prevBtn?.click();
    });
}
