// ================================================
// FORZA FITNESS - JAVASCRIPT FUNCTIONALITY
// ================================================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Stats counter animation
const statsSection = document.querySelector('.about');
let statsAnimated = false;

const animateCounter = (element, target, duration = 2000) => {
    let startTime = null;
    const startValue = 0;
    
    const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const currentValue = Math.floor(progress * target);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };
    
    requestAnimationFrame(animate);
};

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
        }
    });
}, observerOptions);

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Testimonials slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('slider-dots');
let currentTestimonial = 0;

// Create dots
testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentTestimonial = index;
    if (currentTestimonial < 0) currentTestimonial = testimonialCards.length - 1;
    if (currentTestimonial >= testimonialCards.length) currentTestimonial = 0;
    
    testimonialCards[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    showTestimonial(currentTestimonial - 1);
});

nextBtn.addEventListener('click', () => {
    showTestimonial(currentTestimonial + 1);
});

// Auto-advance testimonials
let testimonialInterval = setInterval(() => {
    showTestimonial(currentTestimonial + 1);
}, 5000);

// Pause auto-advance on hover
const testimonialSlider = document.getElementById('testimonials-slider');
testimonialSlider.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

testimonialSlider.addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
});

// Initialize first testimonial
showTestimonial(0);

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let currentImageIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const currentItem = galleryItems[currentImageIndex];
    const placeholder = currentItem.querySelector('.image-placeholder').cloneNode(true);
    placeholder.querySelector('.gallery-overlay').remove();
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(placeholder);
}

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = galleryItems.length - 1;
    updateLightboxImage();
});

lightboxNext.addEventListener('click', () => {
    currentImageIndex++;
    if (currentImageIndex >= galleryItems.length) currentImageIndex = 0;
    updateLightboxImage();
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        }
        if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    }
});

// Close lightbox when clicking outside content
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', { name, email, phone, message });
    
    // Show success modal
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset form
    contactForm.reset();
});

modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Button ripple effect
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (scrolled < window.innerHeight) {
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
        }
    }
});

// Animate elements on page load
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// Smooth scroll to top button (optional enhancement)
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

// Add styles for scroll to top button
const scrollToTopStyle = document.createElement('style');
scrollToTopStyle.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(230, 57, 70, 0.4);
    }
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
    .scroll-to-top:hover {
        background-color: #d62839;
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(230, 57, 70, 0.6);
    }
`;
document.head.appendChild(scrollToTopStyle);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Prevent default form submission behavior on all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add CSS for active nav link
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-link.active {
        color: var(--color-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navLinkStyle);

// Enhanced hover effects for cards
const cards = document.querySelectorAll('.program-card, .trainer-card, .pricing-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Accessibility: Handle keyboard navigation for lightbox
lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle through lightbox controls
        const focusableElements = [lightboxPrev, lightboxNext, lightboxClose];
        const currentIndex = focusableElements.indexOf(document.activeElement);
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
    }
});

// Lazy loading for images (when actual images are added)
const observeImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

observeImages();

// Performance optimization: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-intensive operations
const debouncedScroll = debounce(() => {
    // Any additional scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Console message for developers
console.log('%c🏋️ FORZA Fitness', 'font-size: 24px; font-weight: bold; color: #E63946;');
console.log('%cBuilt with passion in Milano 🇮🇹', 'font-size: 14px; color: #666;');
console.log('%cTransform your body. Elevate your life.', 'font-size: 12px; font-style: italic; color: #999;');
