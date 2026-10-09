
const viewport = document.querySelector(".slider-viewport");
const track = document.querySelector(".slider-track");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dotsContainer = document.querySelector(".slider-dots");

const originalSlides = Array.from(track.children);
const totalSlides = originalSlides.length;

let currentIndex = 1;
let isAnimating = false;

// Clone the first and last slides for infinite looping
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");

track.appendChild(firstClone);
track.insertBefore(lastClone, originalSlides[0]);

const allSlides = Array.from(track.children);

// Create navigation dots dynamically
const dots = originalSlides.map((slide, index) => {
    const dot = document.createElement("button");

    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    dot.setAttribute("aria-current", "false");

    dot.addEventListener("click", () => {
        if (isAnimating) return;

        currentIndex = index + 1;
        updateSlider();
    });

    dotsContainer.appendChild(dot);
    return dot;
});

// Move the track to the selected slide
function updateSlider(animate = true) {
    track.style.transition = animate
        ? "transform 0.5s ease-in-out"
        : "none";

    const slideWidth = viewport.clientWidth;

    track.style.transform =
        `translateX(-${currentIndex * slideWidth}px)`;

    const activeIndex =
        (currentIndex - 1 + totalSlides) % totalSlides;

    dots.forEach((dot, index) => {
        const isActive = index === activeIndex;

        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current",
            isActive ? "true" : "false");
    });
}

// Next and Previous controls
nextButton.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;
    currentIndex++;
    updateSlider();
});

prevButton.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;
    currentIndex--;
    updateSlider();
});

// Reset position after reaching a cloned slide
track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;

    if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        updateSlider(false);
    } else if (currentIndex === 0) {
        currentIndex = totalSlides;
        updateSlider(false);
    }

    isAnimating = false;
});

// Keep the slider aligned when the viewport changes
window.addEventListener("resize", () => {
    updateSlider(false);
});

// Initialize the slider
updateSlider(false);
