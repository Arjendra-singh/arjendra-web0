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
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for glow position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate tilt rotation (subtle effect)
            // Center of the card is (0,0) for calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Max rotation in degrees
            const maxRotation = 5;

            const rotateX = ((y - centerY) / centerY) * -maxRotation; // Invert Y for correct tilt direction
            const rotateY = ((x - centerX) / centerX) * maxRotation;

            // Apply transform
            // perspective is set in CSS
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transform on leave
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            // Optional: fade out glow is handled by CSS transition on opacity
        });
    });
});
