// Modern Portfolio JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkIcon = document.getElementById('dark-icon');
const lightIcon = document.getElementById('light-icon');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const currentYearSpan = document.getElementById('current-year');

// State
let isMenuOpen = false;
let activeSection = 'home';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Set current year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize skill animations
    initializeSkillAnimations();
    
    // Initialize intersection observer
    initializeIntersectionObserver();
}

// Dark Mode
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    }
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    darkIcon.style.display = 'none';
    lightIcon.style.display = 'block';
}

function disableDarkMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    darkIcon.style.display = 'block';
    lightIcon.style.display = 'none';
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            scrollToSection(targetSection);
            closeMobileMenu();
        });
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('active', isMenuOpen);
    
    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('active');
    
    // Reset hamburger menu
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Update navbar appearance
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Update active navigation link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = ['home', 'about', 'projects', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (activeSection !== sectionId) {
                    activeSection = sectionId;
                    
                    // Update navigation links
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
                break;
            }
        }
    }
}

// Contact Form
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Add input listeners for real-time validation
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim()
    };
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate form
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(data);
        
        // Show success message
        showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        // Show error message
        showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        setFormLoading(false);
    }
}

function validateContactForm(data) {
    let isValid = true;
    
    // Validate name
    if (!data.name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!data.email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!data.message) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (data.message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(fieldName, 'Name is required');
            }
            break;
        case 'email':
            if (!value) {
                showFieldError(fieldName, 'Email is required');
            } else if (!isValidEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'message':
            if (!value) {
                showFieldError(fieldName, 'Message is required');
            } else if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
            }
            break;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.style.borderColor = 'var(--destructive)';
    }
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.style.borderColor = '';
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

function setFormLoading(loading) {
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitText.textContent = 'Sending...';
        if (submitIcon) {
            submitIcon.style.display = 'none';
        }
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitText.textContent = 'Send Message';
        if (submitIcon) {
            submitIcon.style.display = 'inline';
        }
    }
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

async function simulateFormSubmission(data) {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

// Skill Animations
function initializeSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBar = (bar) => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    };
    
    // Animate skill bars when they come into view
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                setTimeout(() => {
                    animateSkillBar(skillBar);
                }, 200);
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Utility Functions
function downloadResume() {
    // Replace with actual resume file path
    const resumeUrl = 'Vidhya_Rathod_Resume.pdf';
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Vidhya_Rathod_Resume.pdf';
    link.target = '_blank';
    
    // Simulate click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate subscription
    alert(`Thank you for subscribing with ${email}!`);
    emailInput.value = '';
}

// Handle profile image error
document.addEventListener('DOMContentLoaded', function() {
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            // Create a placeholder with initials
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: var(--primary-gradient);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary-foreground);
                font-size: 3rem;
                font-weight: bold;
                font-family: 'Playfair Display', serif;
            `;
            placeholder.textContent = 'AJ';
            
            this.parentNode.replaceChild(placeholder, this);
        });
    }
});

// Handle project images
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder for project images
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: var(--muted);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--muted-foreground);
                font-size: 1.5rem;
                font-weight: 600;
            `;
            placeholder.innerHTML = '<i data-lucide="image"></i>';
            
            this.parentNode.replaceChild(placeholder, this);
            
            // Reinitialize Lucide icons for the new icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    // Add smooth scroll polyfill if needed
    const smoothScrollPolyfill = document.createElement('script');
    smoothScrollPolyfill.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(smoothScrollPolyfill);
    
    smoothScrollPolyfill.onload = function() {
        window.__forceSmoothScrollPolyfill__ = true;
        window.smoothscroll.polyfill();
    };
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Quick navigation with number keys
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                scrollToSection('home');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('about');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('projects');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('contact');
                break;
        }
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps