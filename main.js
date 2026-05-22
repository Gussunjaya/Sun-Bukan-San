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
    const storedTheme = localStorage.getItem("portfolioTheme");
    if (storedTheme === "light") {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    } else if (storedTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    }

    const toastContainer = createToastContainer();
    initSmoothAnchorLinks();
    initActiveSectionHighlight();
    initHeroTypewriter();
    initPortfolioCounters();
    initContactCopyEmail();
    initScrollProgressBar();
    updateThemeToggleLabel();

    if(themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            document.body.classList.toggle("dark-theme");
            localStorage.setItem("portfolioTheme", document.body.classList.contains("light-theme") ? "light" : "dark");
            updateThemeToggleLabel();
        });
    }

    function updateThemeToggleLabel() {
        if (!themeToggle) return;
        themeToggle.innerText = document.body.classList.contains("light-theme") ? "🌙" : "☀️";
    }

    function createToastContainer() {
        const container = document.createElement("div");
        container.className = "toast-container";
        container.setAttribute("aria-live", "polite");
        document.body.appendChild(container);
        return container;
    }

    function showToast(message, variant = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${variant}`;
        toast.innerText = message;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("visible");
        });

        setTimeout(() => {
            toast.classList.remove("visible");
            toast.addEventListener("transitionend", () => toast.remove(), { once: true });
        }, 2800);
    }

    function initSmoothAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", (e) => {
                const target = document.querySelector(link.getAttribute("href"));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", link.getAttribute("href"));
            });
        });
    }

    function initActiveSectionHighlight() {
        const navLinks = document.querySelectorAll(".nav-links a");
        const sections = document.querySelectorAll("section[id]");
        if (!navLinks.length || !sections.length) return;

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle("active", link.hash === `#${sectionId}`);
                    });
                }
            });
        }, { threshold: 0.52 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    function initHeroTypewriter() {
        const heroSubtitle = document.querySelector(".hero-subtitle");
        if (!heroSubtitle) return;

        const text = heroSubtitle.textContent.trim();
        heroSubtitle.textContent = "";
        let index = 0;
        const typingSpeed = 35;

        const writer = setInterval(() => {
            heroSubtitle.textContent += text[index];
            index += 1;
            if (index >= text.length) {
                clearInterval(writer);
            }
        }, typingSpeed);
    }

    function initPortfolioCounters() {
        const aboutStats = document.querySelector(".about-stats");
        if (!aboutStats) return;

        const metrics = [
            { label: "Projects Delivered", value: 18 },
            { label: "Research Hours", value: 720 },
            { label: "Strategy Wins", value: 12 }
        ];

        metrics.forEach(metric => {
            const statItem = document.createElement("div");
            statItem.className = "stat-item stat-counter";
            statItem.innerHTML = `
                <h3>${metric.label}</h3>
                <p data-target="${metric.value}">0</p>
            `;
            aboutStats.appendChild(statItem);
        });

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        aboutStats.querySelectorAll("[data-target]").forEach(element => {
            counterObserver.observe(element);
        });
    }

    function animateCount(element) {
        const target = Number(element.dataset.target) || 0;
        const duration = 1200;
        const startTime = performance.now();

        const step = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            element.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
            else element.textContent = target;
        };

        requestAnimationFrame(step);
    }

    function initContactCopyEmail() {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (!emailLink || !navigator.clipboard) return;

        emailLink.addEventListener("click", (e) => {
            e.preventDefault();
            const email = emailLink.href.replace("mailto:", "");
            navigator.clipboard.writeText(email)
                .then(() => showToast(`Email copied: ${email}`, "success"))
                .catch(() => showToast("Unable to copy email.", "error"));
        });
    }

    function initScrollProgressBar() {
        const progressBar = document.createElement("div");
        progressBar.className = "scroll-progress";
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = docHeight > 0 ? (scrollTop / docHeight) : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
    }
});
