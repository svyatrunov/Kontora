// KONTORA Detailing JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    setupFormValidation();
    setupDateValidation();
    setupSmoothScrolling();
    setupAnimations();
    console.log('KONTORA website initialized');
}

// Smooth scrolling functions
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form validation and submission
function setupFormValidation() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Отправляем...';
    submitButton.disabled = true;
    
    try {
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success notification
        showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время для подтверждения записи.', 'success');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        // Show error notification
        showNotification('Не удалось отправить заявку. Попробуйте еще раз.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(data) {
    // Required field validation
    const requiredFields = ['name', 'phone', 'service', 'date', 'time'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Пожалуйста, заполните поле: ${getFieldLabel(field)}`, 'error');
            return false;
        }
    }
    
    // Phone validation (Russian format)
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Введите корректный номер телефона', 'error');
        return false;
    }
    
    // Email validation (if provided)
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showNotification('Введите корректный email адрес', 'error');
        return false;
    }
    
    // Date validation
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Выберите дату не ранее сегодняшнего дня', 'error');
        return false;
    }
    
    // Time validation for today
    if (selectedDate.toDateString() === new Date().toDateString()) {
        const [hours] = data.time.split(':').map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, 0, 0, 0);
        
        if (selectedTime <= new Date(now.getTime() + 60 * 60 * 1000)) {
            showNotification('Выберите время не ранее чем через час от текущего времени', 'error');
            return false;
        }
    }
    
    return true;
}

function getFieldLabel(field) {
    const labels = {
        name: 'Имя',
        phone: 'Телефон',
        service: 'Услуга',
        date: 'Дата',
        time: 'Время'
    };
    return labels[field] || field;
}

// Date validation setup
function setupDateValidation() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    // Set minimum date to today
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', todayString);
    
    // Update time options when date changes
    dateInput.addEventListener('change', updateTimeOptions);
}

function updateTimeOptions() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (!dateInput || !timeSelect) return;
    
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // Get all time options
    const timeOptions = timeSelect.querySelectorAll('option');
    
    timeOptions.forEach(option => {
        if (option.value === '') return; // Skip placeholder option
        
        if (isToday) {
            const [hours] = option.value.split(':').map(Number);
            const optionTime = new Date();
            optionTime.setHours(hours, 0, 0, 0);
            
            // Disable if less than 1 hour from now
            const oneHourFromNow = new Date(today.getTime() + 60 * 60 * 1000);
            option.disabled = optionTime <= oneHourFromNow;
        } else {
            option.disabled = false;
        }
    });
    
    // Reset selection if current selection is now disabled
    if (timeSelect.selectedOptions[0] && timeSelect.selectedOptions[0].disabled) {
        timeSelect.value = '';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    if (!notification || !messageElement) return;
    
    messageElement.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Lightbox functionality
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightbox || !lightboxImage) return;
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation setup
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.service-card, .portfolio-item, .advantage-card');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Parallax effect for hero background
function setupParallax() {
    const heroBackground = document.querySelector('.hero-bg');
    if (!heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize parallax
window.addEventListener('load', setupParallax);

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 11 digits (Russian format)
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // Format as +7 (XXX) XXX-XX-XX
    if (value.length > 0) {
        if (value[0] === '8') {
            value = '7' + value.slice(1);
        }
        
        if (value.length >= 1) {
            value = '+7' + (value.length > 1 ? ' (' + value.slice(1) : '');
        }
        if (value.length >= 8) {
            value = value.slice(0, 7) + ') ' + value.slice(7);
        }
        if (value.length >= 13) {
            value = value.slice(0, 13) + '-' + value.slice(13);
        }
        if (value.length >= 16) {
            value = value.slice(0, 16) + '-' + value.slice(16);
        }
    }
    
    input.value = value;
}

// Add phone formatting to phone input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Yandex Metrica
    if (typeof ym !== 'undefined') {
        ym(window.YANDEX_METRICA_ID, 'reachGoal', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                event_category: 'engagement',
                event_label: 'booking_form'
            });
        });
    }
    
    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                event_category: 'contact',
                event_label: this.href
            });
        });
    });
    
    // Track service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            trackEvent('service_interest', {
                event_category: 'engagement',
                event_label: serviceName,
                service_position: index + 1
            });
        });
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Track errors (in production, you might want to send to error tracking service)
    trackEvent('js_error', {
        error_message: e.message,
        error_filename: e.filename,
        error_line: e.lineno
    });
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}