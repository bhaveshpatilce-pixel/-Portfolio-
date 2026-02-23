document.addEventListener('DOMContentLoaded', () => {
    // --- Select Elements ---
    const header = document.querySelector('header');
    const scrollTopBtn = document.getElementById('scrollTop');
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const feedbackList = document.getElementById('feedback-list');
    const navLinks = document.querySelectorAll('.nav-links a');
    const fadeElements = document.querySelectorAll('.fade-in');

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(15, 23, 42, 0.8)';
        }

        // Show/Hide Scroll to Top Button
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // --- Scroll to Top ---
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Fade-in on Scroll (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // --- Nav Link Highlighting ---
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Form Validation & Local Storage ---
    const loadFeedback = () => {
        const feedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
        feedbackList.innerHTML = '';
        feedback.forEach(item => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <p><strong>${item.name}</strong> (${item.email})</p>
                <p>${item.message}</p>
            `;
            feedbackList.prepend(div);
        });
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        nameError.textContent = '';
        emailError.textContent = '';

        // Validate Name
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            isValid = false;
        }

        // Validate Email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email';
            isValid = false;
        }

        if (isValid) {
            const newFeedback = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value,
                date: new Date().toLocaleString()
            };

            // Save to LocalStorage
            const feedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
            feedback.push(newFeedback);
            localStorage.setItem('userFeedback', JSON.stringify(feedback));

            // UI feedback
            alert('Success! Your message has been sent and stored.');
            contactForm.reset();
            loadFeedback();
        }
    });

    // Initial Load
    loadFeedback();
});
