const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

/* Social Modals Logic */
const modalOverlay = document.querySelector('.social-modal-overlay');
const closeModals = document.querySelectorAll('.close-modal');
const socialActionBtns = document.querySelectorAll('.g-btn, .fb-btn, .apple-arrow-btn');

socialActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.innerHTML = 'Connecting...';
        setTimeout(() => {
            window.location.href = '/connect?method=social';
        }, 1000);
    });
});

function openModal(modal) {
    if (!modal) return;
    modalOverlay.classList.add('active');
    document.querySelectorAll('.social-modal').forEach(m => m.classList.remove('show'));
    modal.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        document.querySelectorAll('.social-modal').forEach(m => m.classList.remove('show'));
    }, 300);
}

document.querySelectorAll('.social-icons a').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Identify based on index since we have G, f, Apple in that order
        if (index === 0) openModal(document.querySelector('.modal-google'));
        if (index === 1) openModal(document.querySelector('.modal-facebook'));
        if (index === 2) openModal(document.querySelector('.modal-apple'));
    });
});

closeModals.forEach(btn => btn.addEventListener('click', closeModal));

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

/* Mobile Menu Logic */
const toggleMenu = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');

toggleMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle Text Icon
    if (navLinks.classList.contains('active')) {
        toggleMenu.innerHTML = '&times;'; // X
    } else {
        toggleMenu.innerHTML = '&#9776;'; // Hamburger
    }
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleMenu.innerHTML = '&#9776;';
    });
});

// Connect Button Logic
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggleMenu.innerHTML = '&#9776;';
    }
});