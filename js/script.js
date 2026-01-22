document.addEventListener('DOMContentLoaded', () => {
    console.log('Consultant Portfolio: Script loaded');

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    console.log(`Portfolio: Restored saved theme (${savedTheme})`);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            console.log(`Portfolio: Switched to ${newTheme} mode`);
        });
    } else {
        console.error('Portfolio: Theme toggle button not found!');
    }

    // --- Mobile Menu Toggle Logic ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Visitor Count Logic (Local Simulation) ---
    const visitorCountElement = document.getElementById('visitor-count');
    if (visitorCountElement) {
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            // Start with a realistic base number for credibility
            count = 1247;
        } else {
            // Increment on new session (simplified)
            // In a real app, this would be server-side.
            // Here we just increment on load for demonstration if not recently visited
            const lastVisit = localStorage.getItem('lastVisit');
            const now = new Date().getTime();

            // Only increment if more than 1 hour has passed
            if (!lastVisit || (now - lastVisit > 3600000)) {
                count = parseInt(count) + 1;
            }
        }

        localStorage.setItem('visitorCount', count);
        localStorage.setItem('lastVisit', new Date().getTime());
        visitorCountElement.innerText = count;
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Portfolio: Submitting contact form...');

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            formStatus.innerText = '';
            formStatus.className = 'form-status';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Convert checkbox to boolean
            const consentCheckbox = contactForm.querySelector('#consent');
            data.consent = consentCheckbox ? consentCheckbox.checked : false;

            try {
                // Mock submission for static site demo
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Simulate success
                formStatus.innerText = 'Inquiry submitted successfully. We will contact you shortly.';
                formStatus.classList.add('success');
                contactForm.reset();
                console.log('Portfolio: Message sent successfully (Mock)');

                /* 
                // Real backend implementation:
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                // ... handle response
                */

            } catch (error) {
                console.error('Portfolio: Error sending message', error);
                formStatus.innerText = 'An error occurred. Please try again later.';
                formStatus.classList.add('error');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Updated selectors for new content structure
    document.querySelectorAll('.section-title, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- Interactive Card Effects ---
    // Performance and accessibility guards
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!prefersReducedMotion && !isTouchDevice) {
        const cards = document.querySelectorAll('.card');

        // Global mouse tracking variables
        let mouseX = 0;
        let mouseY = 0;
        let animationFrameId = null;

        // Track global mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Cancel previous frame if still pending
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Update all cards on next frame
            animationFrameId = requestAnimationFrame(updateCards);
        });

        function updateCards() {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardColor = card.dataset.color || 'blue';

                // Check if mouse is over this card
                const isHovering = mouseX >= rect.left && mouseX <= rect.right &&
                                   mouseY >= rect.top && mouseY <= rect.bottom;

                if (isHovering) {
                    // Calculate position relative to card
                    const x = mouseX - rect.left;
                    const y = mouseY - rect.top;

                    // Update CSS variables for glow position
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    card.style.setProperty('--glow-opacity', '1');
                    card.style.setProperty('--highlight-opacity', '1');

                    // Set glow color based on card data-color
                    switch(cardColor) {
                        case 'blue':
                            card.style.setProperty('--glow-color', 'var(--glow-blue)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(14, 165, 233, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(6, 182, 212, 0.2)');
                            break;
                        case 'cyan':
                            card.style.setProperty('--glow-color', 'var(--glow-cyan)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(8, 145, 178, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(14, 116, 144, 0.2)');
                            break;
                        case 'slate-blue':
                            card.style.setProperty('--glow-color', 'var(--glow-slate-blue)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(30, 64, 175, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(37, 99, 235, 0.2)');
                            break;
                        case 'light-cyan':
                            card.style.setProperty('--glow-color', 'var(--glow-light-cyan)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(6, 182, 212, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(8, 145, 178, 0.2)');
                            break;
                        case 'dark-blue':
                            card.style.setProperty('--glow-color', 'var(--glow-dark-blue)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(37, 99, 235, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(59, 130, 246, 0.2)');
                            break;
                        case 'slate-cyan':
                            card.style.setProperty('--glow-color', 'var(--glow-slate-cyan)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(6, 182, 212, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(8, 145, 178, 0.2)');
                            break;
                        case 'green':
                            card.style.setProperty('--glow-color', 'var(--glow-green)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(22, 163, 74, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(34, 197, 94, 0.2)');
                            break;
                        case 'orange':
                            card.style.setProperty('--glow-color', 'var(--glow-orange)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(234, 88, 12, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(249, 115, 22, 0.2)');
                            break;
                        case 'red':
                            card.style.setProperty('--glow-color', 'var(--glow-red)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(220, 38, 38, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(239, 68, 68, 0.2)');
                            break;
                        case 'aqua':
                            card.style.setProperty('--glow-color', 'var(--glow-aqua)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(13, 148, 136, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(20, 184, 166, 0.2)');
                            break;
                        default:
                            card.style.setProperty('--glow-color', 'var(--glow-blue)');
                            card.style.setProperty('--glow-color-secondary', 'rgba(14, 165, 233, 0.3)');
                            card.style.setProperty('--glow-color-tertiary', 'rgba(6, 182, 212, 0.2)');
                    }

                    // Calculate 3D transforms
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Distance from center (0-1)
                    const distanceX = (x - centerX) / centerX; // -1 to 1
                    const distanceY = (y - centerY) / centerY; // -1 to 1

                    // Rotation: up to 12deg based on distance
                    const rotateX = distanceY * -12; // Invert Y for natural tilt
                    const rotateY = distanceX * 12;

                    // Lift: translateY from 0 to -14px based on distance from center
                    const distanceFromCenter = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    const lift = Math.min(distanceFromCenter * -14, 0); // Negative for lift

                    // Apply transforms with preserve-3d
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${lift}px)`;
                } else {
                    // Reset when not hovering
                    card.style.setProperty('--glow-opacity', '0');
                    card.style.setProperty('--highlight-opacity', '0');
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                }
            });
        }

        // Initial update
        updateCards();
    }

    // --- Floating Elements Scroll Animation ---
    // Performance and accessibility guards
    if (!prefersReducedMotion && !isTouchDevice) {
        const floatingElements = document.querySelectorAll('.floating-element');

        let scrollY = window.scrollY;
        let ticking = false;

        function updateFloatingElements() {
            const mainContent = document.querySelector('.main-content');
            if (!mainContent) return;

            const mainRect = mainContent.getBoundingClientRect();
            const mainTop = mainRect.top + window.scrollY;
            const mainBottom = mainTop + mainRect.height;

            // Only animate when main content is in viewport
            if (scrollY >= mainTop - window.innerHeight && scrollY <= mainBottom) {
                const relativeScrollY = scrollY - mainTop;

                floatingElements.forEach(element => {
                    const speed = parseFloat(element.dataset.speed) || 0.5;
                    const yPos = -(relativeScrollY * speed);
                    // Add some horizontal movement for more dynamic effect
                    const xPos = Math.sin(relativeScrollY * 0.001 + element.offsetTop) * 10;
                    element.style.transform = `translate(${xPos}px, ${yPos}px)`;
                });
            }
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateFloatingElements);
                ticking = true;
            }
        }

        // Throttled scroll listener
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            requestTick();
        });

        // Add mouse interaction for extra engagement
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            floatingElements.forEach((element, index) => {
                const depth = (index + 1) * 0.1;
                const xOffset = (mouseX - 0.5) * depth * 20;
                const yOffset = (mouseY - 0.5) * depth * 20;

                const currentTransform = element.style.transform || '';
                const baseTransform = currentTransform.split('translate')[0] || '';
                element.style.transform = `${baseTransform} translate(${xOffset}px, ${yOffset}px)`;
            });
        });

        // Initial position
        updateFloatingElements();
    }
});
