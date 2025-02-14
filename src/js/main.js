// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
let isMenuOpen = false;

menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    
    // Animate hamburger to X
    const spans = menuBtn.querySelectorAll('span');
    if (isMenuOpen) {
        spans[0].classList.add('rotate-45', 'translate-y-2');
        spans[1].classList.add('opacity-0');
        spans[2].classList.add('-rotate-45', '-translate-y-2');
        menuOverlay.classList.remove('translate-x-full');
    } else {
        spans[0].classList.remove('rotate-45', 'translate-y-2');
        spans[1].classList.remove('opacity-0');
        spans[2].classList.remove('-rotate-45', '-translate-y-2');
        menuOverlay.classList.add('translate-x-full');
    }
});

// Theme functionality
const themeToggle = document.getElementById('themeToggle');

// Check for saved theme preference or default to dark
if (!('theme' in localStorage)) {
    localStorage.theme = 'dark';
}

if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    // Toggle theme
    document.documentElement.classList.toggle('dark');
    
    // Save preference
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

// List item selection functionality
const experienceSection = document.querySelector('.Experience');
const experienceItems = document.querySelectorAll('[data-index]');

experienceItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove selected class from all items
        experienceItems.forEach(i => i.classList.remove('selected'));
        // Add selected class to clicked item
        item.classList.add('selected');
        // Update counter
        const counter = item.closest('.font-mono').querySelector('.text-right .text-cat-peach-light');
        if (counter) {
            counter.textContent = item.dataset.index;
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const selectedItem = document.querySelector('.selected');
    if (!selectedItem) return;

    const currentIndex = parseInt(selectedItem.dataset.index);
    let nextIndex;

    switch(e.key) {
        case 'ArrowUp':
        case 'k':
            nextIndex = Math.max(1, currentIndex - 1);
            break;
        case 'ArrowDown':
        case 'j':
            nextIndex = Math.min(experienceItems.length, currentIndex + 1);
            break;
        default:
            return;
    }

    const nextItem = document.querySelector(`[data-index="${nextIndex}"]`);
    if (nextItem) {
        nextItem.click();
        nextItem.scrollIntoView({ block: 'nearest' });
    }
}); 