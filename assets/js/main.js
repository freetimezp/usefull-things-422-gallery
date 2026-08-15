gsap.config({
    nullTargetWarn: false,
});

// ========================================
// ELEMENTS
// ========================================

const slider = document.querySelector(".slider");

const slides = [...document.querySelectorAll(".slide")];
const miniSlides = [...document.querySelectorAll(".mini-slide")];

// ========================================
// STATE
// ========================================

let currentIndex = 0;
let miniIndex = 0;

let isAnimating = false;

// ========================================
// CUSTOM EASE
// ========================================

const ease = "cubic-bezier(0.87, 0, 0.13, 1)";

// ========================================
// HELPERS
// ========================================

function wrap(index, length) {
    return (index + length) % length;
}

// ========================================
// SLIDE ANIMATION
// ========================================

function animateSlide(elements, current, target, direction, callback) {
    const currentEl = elements[current];
    const nextEl = elements[target];

    if (!currentEl || !nextEl) {
        return;
    }

    const currentImage = currentEl.querySelector(".image-inner");

    const nextImage = nextEl.querySelector(".image-inner");

    // ------------------------------------
    // INITIAL STATE
    // ------------------------------------

    gsap.set(nextEl, {
        opacity: 1,
        zIndex: 2,
    });

    gsap.set(currentEl, {
        zIndex: 1,
    });

    if (direction === "next") {
        gsap.set(nextEl, {
            x: "25%",
            scale: 1.1,
            clipPath: "inset(0 0 0 75%)",
        });
    } else {
        gsap.set(nextEl, {
            x: "-25%",
            scale: 1.1,
            clipPath: "inset(0 75% 0 0)",
        });
    }

    // ====================================
    // TIMELINE
    // ====================================

    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: ease,
        },

        onComplete() {
            gsap.set(currentEl, {
                opacity: 0,
            });

            gsap.set([currentEl, nextEl], {
                clearProps: "x,clipPath,zIndex,scale",
            });

            gsap.set(nextEl, {
                opacity: 1,
                zIndex: 1,
            });

            if (callback) {
                callback();
            }
        },
    });

    // ====================================
    // NEXT
    // ====================================

    if (direction === "next") {
        tl.to(
            currentEl,
            {
                x: "-50%",
                scale: 1.1,
            },
            0,
        );

        tl.to(
            nextEl,
            {
                x: "0%",
                scale: 1,
                clipPath: "inset(0 0% 0 0%)",
            },
            0,
        );
    }

    // ====================================
    // PREVIOUS
    // ====================================
    else {
        tl.to(
            currentEl,
            {
                x: "50%",
                scale: 1.1,
            },
            0,
        );

        tl.to(
            nextEl,
            {
                x: "0%",
                scale: 1,
                clipPath: "inset(0 0% 0 0%)",
            },
            0,
        );
    }
}

// ========================================
// NAVIGATION
// ========================================

function navigate(direction) {
    if (isAnimating) {
        return;
    }

    isAnimating = true;

    const delta = direction === "next" ? 1 : -1;

    const targetIndex = wrap(currentIndex + delta, slides.length);

    const targetMini = targetIndex;

    animateSlide(slides, currentIndex, targetIndex, direction, () => {
        currentIndex = targetIndex;

        isAnimating = false;
    });

    animateSlide(miniSlides, miniIndex, targetMini, direction, () => {
        miniIndex = targetMini;
    });
}

// ========================================
// NEXT / PREVIOUS
// ========================================

function next() {
    navigate("next");
}

function previous() {
    navigate("prev");
}

// ========================================
// CLICK NAVIGATION
// ========================================

slider.addEventListener("click", (event) => {
    /*
        Don't navigate when clicking
        directly on the minimap.
    */

    if (event.target.closest(".minimap")) {
        return;
    }

    const mouseX = event.clientX;

    const middle = window.innerWidth * 0.5;

    if (mouseX < middle) {
        previous();
    } else {
        next();
    }
});

// ========================================
// KEYBOARD
// ========================================

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        previous();
    }

    if (event.key === "ArrowRight") {
        next();
    }
});

// ========================================
// IMAGE LOADING
// ========================================

function init() {
    gsap.set(slides, {
        opacity: 0,
        zIndex: 0,
    });

    gsap.set(miniSlides, {
        opacity: 0,
        zIndex: 0,
    });

    gsap.set(slides[0], {
        opacity: 1,
        zIndex: 1,
    });

    gsap.set(miniSlides[0], {
        opacity: 1,
        zIndex: 1,
    });

    currentIndex = 0;
    miniIndex = 0;
}

const images = [...document.querySelectorAll(".slide img")];

let loaded = 0;

images.forEach((img) => {
    if (img.complete) {
        loaded++;
    } else {
        img.addEventListener("load", () => {
            loaded++;

            if (loaded === images.length) {
                init();
            }
        });
    }
});

if (loaded === images.length) {
    init();
}
