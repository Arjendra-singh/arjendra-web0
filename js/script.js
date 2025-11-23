document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio: Script loaded');

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

    // --- Sidebar Toggle Logic ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    function toggleSidebar() {
        if (sidebar) {
            sidebar.classList.toggle('open');
            console.log('Portfolio: Toggled sidebar');
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('open');
            console.log('Portfolio: Closed sidebar');
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            toggleSidebar();
        });
    } else {
        console.error('Portfolio: Mobile toggle button not found!');
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking a link (on mobile)
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

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
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.innerText = 'Message sent successfully! We will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                    console.log('Portfolio: Message sent successfully');
                } else {
                    formStatus.innerText = result.error || 'Failed to send message. Please try again.';
                    formStatus.classList.add('error');
                    console.error('Portfolio: Failed to send message', result.error);
                }
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

    document.querySelectorAll('.section-title, .card, .project-card, .skill-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
