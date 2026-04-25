document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor Logic (Awwwards Style)
    const cursor = document.querySelector(".custom-cursor");
    const cursorFollower = document.querySelector(".custom-cursor-follower");
    const hoverElements = document.querySelectorAll(".hover-link, .hover-expand, button, a");

    // Only enable custom cursor if fine pointer is detected (disables on mobile)
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = window.innerWidth / 2;
        let followerY = window.innerHeight / 2;
        
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Cursor dot follows instantly
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Easing applied to follower for smooth delay
        const updateFollower = () => {
            // LERP formula
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Expand cursor on hoverable elements
        hoverElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });
        });
    }

    // 2. Intersection Observer for Scroll Reveals
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once animated in
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-up").forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Parallax Effect & Dynamic Navbar
    const parallaxElements = document.querySelectorAll(".parallax");
    const navbar = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallaxAndNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateParallaxAndNav() {
        // Navbar auto-hide logic
        if (lastScrollY > 80) {
            if (lastScrollY > window.oldScrollY) {
                navbar.style.transform = "translateY(-100%)";
            } else {
                navbar.style.transform = "translateY(0)";
            }
        } else {
            navbar.style.transform = "translateY(0)";
        }
        window.oldScrollY = lastScrollY;

        // Subtle Parallax calculation
        parallaxElements.forEach(el => {
            const speed = el.getAttribute("data-speed") || 0.1;
            // Only calc if element is somewhat in viewport (optimization)
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(rect.top * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }

    // 4. Modal Logic
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalClose = document.querySelector(".modal-close");
    const projectItems = document.querySelectorAll(".project-item");

    projectItems.forEach(item => {
        item.addEventListener("click", () => {
            const title = item.querySelector("h3").innerText;
            const desc = item.querySelector("p").innerText;
            if(modalTitle) modalTitle.innerText = title;
            if(modalDesc) modalDesc.innerText = desc;
            if(modal) modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent scroll
        });
    });

    const closeModal = () => {
        if(modal) modal.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    if(modalClose) {
        modalClose.addEventListener("click", closeModal);
    }
    if(modal) {
        modal.addEventListener("click", (e) => {
            if(e.target === modal) closeModal();
        });
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById("theme-toggle");
    if(themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            document.body.classList.toggle("dark-theme");
            if(document.body.classList.contains("light-theme")) {
                themeToggle.innerText = "🌙";
            } else {
                themeToggle.innerText = "☀️";
            }
        });
    }
});
