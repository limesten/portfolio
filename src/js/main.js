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

// Data store for section content
let sectionData = {
    experience: null,
    projects: null,
    skills: null
};

// Load JSON data
async function loadSectionData() {
    try {
        const [experienceData, projectsData, skillsData] = await Promise.all([
            fetch('./data/experience.json').then(res => res.json()),
            fetch('./data/projects.json').then(res => res.json()),
            fetch('./data/skills.json').then(res => res.json())
        ]);

        sectionData.experience = experienceData;
        sectionData.projects = projectsData;
        sectionData.skills = skillsData;
    } catch (error) {
        console.error('Error loading section data:', error);
    }
}

// Load data when the page loads
loadSectionData();

// Preview section update
function updatePreview(section, itemId) {
    const previewSection = document.querySelector('.Preview .p-2');
    if (!previewSection || !sectionData[section]) return;

    const item = sectionData[section].items.find(i => i.id === itemId);
    if (!item) return;

    let content = '';

    switch(section) {
        case 'experience':
            content = `
                <div class="font-mono">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
                        <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                        <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
                    </div>
                    <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">${item.period}</div>
                    <p class="mb-4">${item.description}</p>
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Key Achievements:</div>
                        <ul class="list-disc list-inside space-y-1">
                            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Technologies:</div>
                        <div class="flex flex-wrap gap-2">
                            ${item.technologies.map(tech => 
                                `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'projects':
            content = `
                <div class="font-mono">
                    <div class="text-cat-peach-light dark:text-cat-peach-dark text-xl mb-4">${item.title}</div>
                    <p class="mb-4">${item.description}</p>
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Highlights:</div>
                        <ul class="list-disc list-inside space-y-1">
                            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Technologies:</div>
                        <div class="flex flex-wrap gap-2">
                            ${item.technologies.map(tech => 
                                `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <a href="${item.github}" target="_blank" class="text-cat-green-light dark:text-cat-green-dark hover:underline">GitHub</a>
                        <a href="${item.live}" target="_blank" class="text-cat-green-light dark:text-cat-green-dark hover:underline">Live Demo</a>
                    </div>
                </div>
            `;
            break;

        case 'skills':
            content = `
                <div class="font-mono">
                    <div class="flex items-center gap-2 mb-4">
                        <img src="./images/${item.icon}" alt="${item.name}" class="w-6 h-6" />
                        <span class="text-cat-peach-light dark:text-cat-peach-dark text-xl">${item.name}</span>
                        <span class="text-cat-green-light dark:text-cat-green-dark">(${item.level})</span>
                    </div>
                    <p class="mb-4">${item.description}</p>
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Key Skills:</div>
                        <ul class="list-disc list-inside space-y-1">
                            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="text-cat-green-light dark:text-cat-green-dark">
                        Years of Experience: ${item.years}
                    </div>
                </div>
            `;
            break;
    }

    previewSection.innerHTML = content;
}

// List item selection functionality
function handleItemSelection(items, item, section) {
    // Remove selected class from ALL items in ALL sections
    document.querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]').forEach(i => {
        if (i.classList.contains('selected')) {
            i.classList.remove('selected');
        }
    });
    
    // Add selected class to clicked item
    item.classList.add('selected');
    
    // Update counter for current section
    const currentSection = item.closest('.font-mono');
    const counter = currentSection.querySelector('.list-index .text-cat-peach-light');
    if (counter) {
        counter.textContent = item.dataset.index;
    }
    
    // Update preview section
    updatePreview(section, parseInt(item.dataset.index));
    
    // Reset counters in other sections to 1
    document.querySelectorAll('.font-mono').forEach(section => {
        if (section !== currentSection) {
            const sectionCounter = section.querySelector('.list-index .text-cat-peach-light');
            if (sectionCounter) {
                sectionCounter.textContent = '1';
            }
        }
    });
}

// Add click event listeners
document.querySelectorAll('.Experience [data-index]').forEach(item => {
    item.addEventListener('click', () => {
        handleItemSelection(
            document.querySelectorAll('.Experience [data-index]'),
            item,
            'experience'
        );
    });
});

document.querySelectorAll('.Projects [data-index]').forEach(item => {
    item.addEventListener('click', () => {
        handleItemSelection(
            document.querySelectorAll('.Projects [data-index]'),
            item,
            'projects'
        );
    });
});

document.querySelectorAll('[class*="Skills"] [data-index]').forEach(item => {
    item.addEventListener('click', () => {
        handleItemSelection(
            document.querySelectorAll('[class*="Skills"] [data-index]'),
            item,
            'skills'
        );
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeSection = document.activeElement.closest('.Experience, .Projects, [class*="Skills"]');
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