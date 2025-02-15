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
const projectItems = document.querySelectorAll('.Projects [data-index]');

// Function to handle item selection
function handleItemSelection(items, item) {
    // Remove selected class from all items in current section and reset their counters
    items.forEach(i => {
        if (i.classList.contains('selected')) {
            i.classList.remove('selected');
            // Reset counter when removing selection
            const sectionCounter = i.closest('.font-mono').querySelector('.text-right .text-cat-peach-light');
            if (sectionCounter) {
                sectionCounter.textContent = '1';
            }
        }
    });
    
    // Add selected class to clicked item
    item.classList.add('selected');
    // Update counter for current section
    const counter = item.closest('.font-mono').querySelector('.text-right .text-cat-peach-light');
    if (counter) {
        counter.textContent = item.dataset.index;
    }
}

experienceItems.forEach(item => {
    item.addEventListener('click', () => {
        handleItemSelection(experienceItems, item);
    });
});

projectItems.forEach(item => {
    item.addEventListener('click', () => {
        handleItemSelection(projectItems, item);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeSection = document.activeElement.closest('.Experience, .Projects');
    if (!activeSection) return;

    const items = activeSection.querySelectorAll('[data-index]');
    const selectedItem = activeSection.querySelector('.selected');
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
            nextIndex = Math.min(items.length, currentIndex + 1);
            break;
        default:
            return;
    }

    const nextItem = activeSection.querySelector(`[data-index="${nextIndex}"]`);
    if (nextItem) {
        nextItem.click();
        nextItem.scrollIntoView({ block: 'nearest' });
    }
}); 