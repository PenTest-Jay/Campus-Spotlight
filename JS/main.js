/**
 * CAMPUS SPOTLIGHT - MASTER CONTROL SCRIPT
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. DATA SETUP: Sort events before showing them
    organizeEvents();

    // 2. UI SYSTEMS: Initialize visual features
    initReveal();
    setupNav();
    initCalendar();
    initSlideshows();
    initCounter();
    setupLogin();

    console.log("✅ System Active: Events Sorted and UI Initialized");
});

/* --- 1. EVENT ORGANIZATION (SORTING) --- */

function organizeEvents() {
    const container = document.querySelector(".events-grid");
    if (!container) return;

    // Grab all cards and convert to array for sorting
    const cards = Array.from(container.querySelectorAll(".event-card"));

    cards.sort((a, b) => {
        // Ensure your HTML has data-date="YYYY-MM-DD"
        const dateA = new Date(a.getAttribute("data-date"));
        const dateB = new Date(b.getAttribute("data-date"));
        return dateA - dateB; // Earliest date first
    });

    // Clear and re-append in the new order
    container.innerHTML = "";
    cards.forEach(card => container.appendChild(card));
}

/* --- 2. VISUAL EFFECTS --- */
function initReveal() {
    const runReveal = () => {
        const elements = document.querySelectorAll(".reveal, .nav-card, .cat-card");
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", runReveal, { passive: true });
    setTimeout(runReveal, 100);
}
        });
    };
    window.addEventListener("scroll", runReveal, { passive: true });
    setTimeout(runReveal, 100);
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

        let path = "";
        if (target.hasAttribute("data-link")) {
            path = target.getAttribute("data-link").trim();
        } else if (target.classList.contains("btn-details")) {
            path = "event-details.html";
        } else if (target.hasAttribute("data-register")) {
            path = "registration.html";
        }

        if (path) window.location.href = path;
    });
}

/* --- 4. CALENDAR MODULE --- */

function initCalendar() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const header = document.querySelector(".calendar-header h2");
    if (header) header.textContent = `${monthNames[month]} ${year}`;

    const caption = document.querySelector(".event-table caption");
    if (caption) caption.textContent = `${monthNames[month]} ${year} Events Calendar`;

    document.querySelectorAll(".event-table td").forEach(cell => {
        const match = cell.innerText.trim().match(/^\d+/);
        if (match && parseInt(match[0], 10) === day) {
            cell.setAttribute("aria-current", "date");
            cell.classList.add("today-highlight");
            cell.style.backgroundColor = "rgba(255, 215, 0, 0.2)";
            cell.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}

/* --- 5. MEDIA & UI --- */

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

function initCounter() {
    const count = document.querySelectorAll(".event-card").length;
    const display = document.getElementById("eventNumber");
    if (display) display.textContent = count;
}

/* --- 6. FORMS --- */

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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select all the elements we need
    const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let currentAlbumImages = [];
    let currentIndex = 0;

    // 2. Open Album Logic
    const albumCards = document.querySelectorAll('.album-card');

    albumCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get all images from the 'hidden-images' div inside the clicked card
            const hiddenImgs = card.querySelectorAll('.hidden-images img');
            const summary = card.getAttribute('data-summary');
            const albumTitle = card.querySelector('h2').innerText;

            // Map the image sources into an array
            currentAlbumImages = Array.from(hiddenImgs).map(img => img.src);
            currentIndex = 0;

            if (currentAlbumImages.length > 0) {
                modal.style.display = "block";
                updateModal(albumTitle, summary);
            }
        });
    });

    // 3. Update Modal Content
    function updateModal(title, summary) {
        modalImg.src = currentAlbumImages[currentIndex];
        captionText.innerHTML = `<strong>${title}</strong><br>${summary}<br>
                                 <small>Photo ${currentIndex + 1} of ${currentAlbumImages.length}</small>`;
    }

    // 4. Navigation Logic
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents clicking the arrow from closing the modal
        currentIndex = (currentIndex + 1) % currentAlbumImages.length;
        updateModal("", ""); // Keep existing text or pass empty
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
        updateModal("", "");
    });

    // 5. Close Modal Logic
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // Close when clicking outside the image
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Keyboard support (Escape to close, Arrows to navigate)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "block") {
            if (e.key === "Escape") modal.style.display = "none";
            if (e.key === "ArrowRight") nextBtn.click();
            if (e.key === "ArrowLeft") prevBtn.click();
        }
    });
});
