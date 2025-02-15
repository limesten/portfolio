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

// Function to display home content
function displayHomeContent() {
    const mainSection = document.querySelector('.Preview .p-2');
    mainSection.innerHTML = `
        <div class="font-mono">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-cat-peach-light dark:text-cat-peach-dark">$</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">whoami</span>
            </div>
            <div class="mb-4">
                Hello! I'm <span class="text-cat-green-light dark:text-cat-green-dark">John Developer</span>, a passionate
                <span class="text-cat-peach-light dark:text-cat-peach-dark">Full Stack Developer</span> from Sweden.
            </div>
            <div class="flex items-center gap-2 mb-4">
                <span class="text-cat-peach-light dark:text-cat-peach-dark">$</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">cat</span>
                <span class="text-cat-peach-light dark:text-cat-peach-dark">about.txt</span>
            </div>
            <div>
                I specialize in building modern web applications with a focus on clean code and user experience.
                Currently working on exciting projects involving React, Node.js, and cloud technologies.
            </div>
        </div>
    `;
}

// Show home content by default when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayHomeContent();
    // Add selected state to home section container
    const homeContainer = document.querySelector('.Home').closest('.border');
    if (homeContainer) {
        homeContainer.style.borderColor = 'var(--cat-orange)';
        // Set initial orange color for Home title
        const homeTitle = homeContainer.querySelector('.absolute');
        if (homeTitle) {
            homeTitle.style.color = 'var(--cat-orange)';
        }
    }
});

// Main section update
function updateMainContent(section, itemId) {
    const mainSection = document.querySelector('.Preview .p-2');
    if (!mainSection) return;
    
    if (section === 'home') {
        displayHomeContent();
        return;
    }

    if (!sectionData[section]) return;

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

    mainSection.innerHTML = content;
}

// List item selection functionality
function handleItemSelection(items, item, section) {
    // Remove selected class and border color from ALL sections and items
    document.querySelectorAll('.border').forEach(i => {
        i.style.borderColor = '';
        // Reset all section titles to default color
        const title = i.querySelector('.absolute');
        if (title) {
            title.style.color = '';
        }
        // Reset all counter colors to default foreground color
        const counter = i.querySelector('.list-index');
        if (counter) {
            counter.querySelector('p').classList.remove('text-cat-peach-light', 'dark:text-cat-peach-dark');
            const currentCounter = counter.querySelector('span:first-child');
            if (currentCounter) {
                currentCounter.textContent = '1';
            }
        }
    });
    document.querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]').forEach(i => {
        if (i.classList.contains('selected')) {
            i.classList.remove('selected');
        }
    });
    
    if (section === 'home') {
        // Add border color to home section container
        const homeContainer = item.closest('.border');
        if (homeContainer) {
            homeContainer.style.borderColor = 'var(--cat-orange)';
            // Change the Home title color to orange
            const homeTitle = homeContainer.querySelector('.absolute');
            if (homeTitle) {
                homeTitle.style.color = 'var(--cat-orange)';
            }
        }
        // Update main section for home
        updateMainContent('home');
    } else {
        // Add selected class to clicked item
        item.classList.add('selected');
        
        // Update counter for current section
        const currentSection = item.closest('.font-mono');
        const sectionContainer = currentSection.closest('.border');
        if (sectionContainer) {
            // Add orange border to section container
            sectionContainer.style.borderColor = 'var(--cat-orange)';
            // Change section title to orange
            const sectionTitle = sectionContainer.querySelector('.absolute');
            if (sectionTitle) {
                sectionTitle.style.color = 'var(--cat-orange)';
            }
            // Change counter color to peach ONLY for selected section
            const counter = sectionContainer.querySelector('.list-index');
            if (counter) {
                counter.querySelector('p').classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
                const currentCounter = counter.querySelector('span:first-child');
                if (currentCounter) {
                    currentCounter.textContent = item.dataset.index;
                }
            }
        }
        
        // Update main section
        updateMainContent(section, parseInt(item.dataset.index));
        
        // Reset counters in other sections to 1
        document.querySelectorAll('.font-mono').forEach(section => {
            if (section !== currentSection) {
                const counter = section.querySelector('.list-index');
                if (counter) {
                    counter.querySelector('p').classList.remove('text-cat-peach-light', 'dark:text-cat-peach-dark');
                    const currentCounter = counter.querySelector('span:first-child');
                    if (currentCounter) {
                        currentCounter.textContent = '1';
                    }
                }
            }
        });
    }
}

// Add click event listeners
document.querySelector('.Home').addEventListener('click', () => {
    handleItemSelection(
        null,
        document.querySelector('.Home'),
        'home'
    );
});

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

// Mobile navigation functionality
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerTitle = document.getElementById('drawerTitle');
const drawerContent = document.getElementById('drawerContent');
let activeSection = null;

// Handle mobile navigation button clicks
document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        activeSection = section;
        
        // Add active state to button
        document.querySelectorAll('.mobile-nav-btn').forEach(b => {
            b.classList.remove('active');
            b.classList.remove('bg-cat-fg-light/10', 'dark:bg-cat-fg-dark/10');
            b.querySelector('span:last-child').classList.remove('underline');
        });
        btn.classList.add('active');
        btn.classList.add('bg-cat-fg-light/10', 'dark:bg-cat-fg-dark/10');
        btn.querySelector('span:last-child').classList.add('underline');

        if (section === 'home') {
            displayHomeContent();
            // Add border color and title color to home section container
            const homeContainer = document.querySelector('.Home').closest('.border');
            if (homeContainer) {
                homeContainer.style.borderColor = 'var(--cat-orange)';
                const homeTitle = homeContainer.querySelector('.absolute');
                if (homeTitle) {
                    homeTitle.style.color = 'var(--cat-orange)';
                }
            }
            // Close drawer if it's open
            mobileDrawer.classList.add('translate-y-full');
        } else {
            // For other sections, show drawer and update content
            drawerTitle.textContent = section;
            // Remove the translate-y-full class to show the drawer
            mobileDrawer.classList.remove('translate-y-full');
            // Update drawer content
            updateDrawerContent(section);
            // Add orange highlighting to the selected section
            const sectionContainer = document.querySelector(`.${section.charAt(0).toUpperCase() + section.slice(1)}`).closest('.border');
            if (sectionContainer) {
                sectionContainer.style.borderColor = 'var(--cat-orange)';
                const sectionTitle = sectionContainer.querySelector('.absolute');
                if (sectionTitle) {
                    sectionTitle.style.color = 'var(--cat-orange)';
                }
            }
        }

        // Remove selected state from all items
        document.querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]').forEach(i => {
            if (i.classList.contains('selected')) {
                i.classList.remove('selected');
            }
        });
    });
});

// Close drawer
drawerClose.addEventListener('click', () => {
    mobileDrawer.classList.add('translate-y-full');
    // Remove active states
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('bg-cat-fg-light/10', 'dark:bg-cat-fg-dark/10');
        btn.querySelector('span:last-child').classList.remove('underline');
    });
});

// Update drawer content
function updateDrawerContent(section) {
    if (!sectionData[section]) return;

    const items = sectionData[section].items;
    let content = '<div class="space-y-2 font-mono">';
    
    items.forEach((item, index) => {
        content += `
            <button class="w-full text-left p-2 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mobile-item" data-index="${index + 1}">
                ${section === 'skills' ? `<img src="./images/${item.icon}" alt="${item.name}" class="w-5 h-5" />` : ''}
                <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title || item.name}</span>
                ${section === 'experience' ? `
                    <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
                ` : ''}
            </button>
        `;
    });
    
    content += '</div>';
    drawerContent.innerHTML = content;

    // Add click handlers for items
    drawerContent.querySelectorAll('.mobile-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemIndex = item.dataset.index;
            // Update selected state in the main section
            const sectionElement = document.querySelector(`.${section.charAt(0).toUpperCase() + section.slice(1)}`);
            const targetItem = sectionElement.querySelector(`[data-index="${itemIndex}"]`);
            if (targetItem) {
                handleItemSelection(
                    document.querySelectorAll(`.${section.charAt(0).toUpperCase() + section.slice(1)} [data-index]`),
                    targetItem,
                    section
                );
            }
            // Close drawer after selection
            mobileDrawer.classList.add('translate-y-full');
            // Remove active states from mobile nav buttons
            document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-cat-fg-light/10', 'dark:bg-cat-fg-dark/10');
                btn.querySelector('span:last-child').classList.remove('underline');
            });
        });
    });
} 