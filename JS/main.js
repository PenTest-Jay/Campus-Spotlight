/**
 * CAMPUS SPOTLIGHT - OPTIMIZED MASTER SCRIPT
 */

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    organizeEvents();   // Sorts events by date
    initReveal();       // Handles scroll animations
    setupNav();         // Manages button clicks/links
    initCalendar();     // Updates the calendar UI
    initSlideshows();   // Runs image sliders
    initCounter();      // Updates the "Total Events" count
    setupLogin();       // Handles the staff login form
    initGalleryModal(); // Runs the Lightbox gallery
    initMasterFilter();       // Enables search/filter functionality
    setupContactForm();     // Validates the contact form
    showError();

    console.log("✅ System Active: Optimized & Running");
}

/* --- EVENT ORGANIZATION --- 
Atuo updates the event cards to ensure they are always displayed in chronological order based on their data-date attribute. This allows for dynamic content management without needing to manually reorder HTML.
*/

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

/* --- 2. REVEAL ANIMATION --- 
Add the "active" class to elements with the "reveal", "nav-card", or "cat-card" classes when they enter the viewport on scroll. This creates a smooth fade-in effect as users navigate the page.
*/

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

    runReveal(); // run immediately
    window.addEventListener("scroll", runReveal, { passive: true });
}

/* --- 3. NAVIGATION --- 
Navigates to different pages based on button clicks. Uses event delegation to handle all relevant clicks in one listener, improving performance and maintainability. Also includes a special case for calendar buttons that show an alert instead of navigating.
*/

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

/* --- 4. CALENDAR 
calculates the current month and year, updates the calendar header and caption accordingly, and highlights the current date in the calendar table. It uses a simple array of month names for display and checks each calendar cell for a matching date to apply the highlight class.
--- */

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

/* --- 5. SLIDESHOWS ---
slideshows for both upcoming and past events. It cycles through images every 5 seconds, showing one image at a time by toggling the "active" class. The function is reusable for multiple slideshow containers on the page.
*/

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

/* --- 6. COUNTER 
counts the number of event cards on the page and updates the "Total Events" display. It looks for elements with the "event-card" class and updates the text content of the element with id "eventNumber" accordingly.
--- */

function initCounter() {
    const display = document.getElementById("eventNumber");
    if (!display) return;

    const count = document.querySelectorAll(".event-card").length;
    display.textContent = count;
}

/* --- 7. LOGIN 
login form handling for staff access. It listens for the form submission, prevents the default behavior, and checks if both email and password fields are filled. If they are, it redirects to the staff dashboard; otherwise, it shows an alert prompting for credentials.
--- */

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

/* --- 8. GALLERY MODAL
gallery modal functionality for the gallery page. It opens a modal when an album card is clicked, displaying the first image and allowing users to navigate through the images using next/prev buttons or keyboard arrows. The modal can be closed by clicking outside the image or pressing the Escape key.
--- */

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


/* --- 9. MASTER SEARCH, FILTER, SORT & COUNT --- */

function initMasterFilter() {
    // 1. Grab all the UI elements
    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("category");
    const sortSelect = document.getElementById("sort");
    const container = document.querySelector(".events-grid");
    const countDisplay = document.getElementById("eventNumber");

    // Safety Check: If the container doesn't exist on this page, stop the script
    if (!container) return;

    const runAllFilters = () => {
        // 2. Get current values from the inputs
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedCat = categorySelect ? categorySelect.value : "";
        const selectedSort = sortSelect ? sortSelect.value : "date";
        
        // 3. Convert cards to an Array so we can sort them
        let cards = Array.from(container.querySelectorAll(".event-card"));

        // 4. FILTERING LOGIC
        cards.forEach(card => {
            const content = card.innerText.toLowerCase();
            const cardCat = card.dataset.category || "";

            const matchesSearch = content.includes(query);
            const matchesCat = selectedCat === "" || cardCat === selectedCat;

            // Apply visibility
            if (matchesSearch && matchesCat) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        // 5. UPDATE COUNTER (Recount visible cards)
        if (countDisplay) {
            const visibleCount = cards.filter(card => card.style.display !== "none").length;
            countDisplay.textContent = visibleCount;
        }

        // 6. SORTING LOGIC
        cards.sort((a, b) => {
            if (selectedSort === "date") {
                // Sorting by date (Newest first)
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            } else if (selectedSort === "popularity") {
                // Sorting by popularity (Highest first)
                const popA = parseInt(a.dataset.popularity || 0);
                const popB = parseInt(b.dataset.popularity || 0);
                return popB - popA;
            }
        });

        // 7. RE-RENDER: Update the order in the HTML
        cards.forEach(card => container.appendChild(card));
    };

    // 8. LISTENERS: Trigger the filter whenever a user changes a tab
    searchInput?.addEventListener("input", runAllFilters);
    categorySelect?.addEventListener("change", runAllFilters);
    sortSelect?.addEventListener("change", runAllFilters);

    // 9. INITIAL RUN: Run once on page load to set initial count/sort
    runAllFilters();
}

// CRITICAL: Call the function when the document is ready
document.addEventListener("DOMContentLoaded", initMasterFilter);

/* --- CONTACT FORM VALIDATION --- */

function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("userName");
        const nameValue = nameInput.value.trim();

        // REGEX: Allows letters (a-z) and spaces only. 
        // ^ means start, $ means end. [a-zA-Z\s] means letters and spaces.
        const namePattern = /^[a-zA-Z\s]+$/;

        // 1. Check if empty
        if (nameValue === "") {
            showError(nameInput, "Name is required.");
            return;
        }

        // 2. Check for numbers (The specific fix you asked for)
        if (!namePattern.test(nameValue)) {
            showError(nameInput, "Names cannot contain numbers or special characters.");
            return;
        }

        // If validation passes
        localStorage.setItem("visitorName", nameValue);
        window.location.href = "thank-you.html";
    });
}

// Helper function to show errors professionally
function showError(inputElement, message) {
    inputElement.classList.add("is-invalid"); // Bootstrap error class
    alert(message); // Simple alert, or you can update a <div> on screen
    inputElement.focus();
}
