// Theme functionality
const themeToggle = document.getElementById('themeToggle');

// Check for saved theme preference or default to dark
if (!('theme' in localStorage)) {
    localStorage.theme = 'dark';
}

if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
} else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    // Toggle theme
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
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
    const mainSection = document.querySelector('[data-content-container="main"]');
    mainSection.innerHTML = `
        <!-- ASCII art section -->
        <div class="ascii-art Home whitespace-pre text-center overflow-x-auto scrollbar-custom py-2 md:py-4">
            <pre id="ascii-logo" class="inline-block text-cat-fg-light dark:text-cat-fg-dark"></pre>
        </div>
        <!-- Content section -->
        <div class="mt-2 md:mt-4">
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

    // Load ASCII art
    fetch('./images/ascii.txt')
        .then(response => response.text())
        .then(text => {
            const asciiLogo = document.getElementById('ascii-logo');
            if (asciiLogo) {
                asciiLogo.textContent = text;
                // Show the ASCII art container and ensure it has the correct scaling classes
                const asciiContainer = document.querySelector('.ascii-art.Home');
                if (asciiContainer) {
                    asciiContainer.classList.remove('hidden');
                    // Add the scaling classes
                    asciiContainer.style.fontFamily = "'Fira Mono', monospace";
                    asciiContainer.style.lineHeight = "1.2";
                    asciiContainer.style.fontSize = "min(1.4vw, 0.7rem)";
                    asciiContainer.style.transformOrigin = "center";
                    asciiContainer.style.width = "100%";
                    asciiContainer.style.display = "flex";
                    asciiContainer.style.justifyContent = "center";
                    asciiContainer.style.alignItems = "center";
                    asciiContainer.style.overflow = "hidden";

                    // Add responsive padding based on screen size
                    if (window.innerWidth <= 640) {
                        asciiContainer.style.fontSize = "min(1.2vw, 0.4rem)";
                        asciiContainer.style.padding = "0 0.75rem";
                    } else if (window.innerWidth <= 768) {
                        asciiContainer.style.fontSize = "min(1.1vw, 0.45rem)";
                        asciiContainer.style.padding = "0 1.5rem";
                    } else if (window.innerWidth <= 1024) {
                        asciiContainer.style.fontSize = "min(1.2vw, 0.5rem)";
                        asciiContainer.style.padding = "0 1.5rem";
                    } else if (window.innerWidth <= 1749) {
                        asciiContainer.style.fontSize = "min(1.4vw, 0.7rem)";
                        asciiContainer.style.padding = "0 0.5rem";
                    } else {
                        asciiContainer.style.fontSize = "min(1.6vw, 1rem)";
                        asciiContainer.style.padding = "0 1rem";
                    }

                    // Also style the ascii-logo element
                    asciiLogo.style.display = "block";
                    asciiLogo.style.whiteSpace = "pre";
                    asciiLogo.style.maxWidth = "100%";
                    asciiLogo.style.transformOrigin = "center";
                    asciiLogo.style.fontSize = "inherit";
                    asciiLogo.style.textAlign = "center";
                    asciiLogo.style.padding = "0 2px";
                }
            }
        })
        .catch(error => console.error('Error loading ASCII art:', error));
}

// Show home content by default when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayHomeContent();
    // Add selected state to home section container
    const homeContainer = document.querySelector('.Home');
    if (homeContainer) {
        homeContainer.setAttribute('tabindex', '0'); // Make home section focusable
        const homeBorder = homeContainer.closest('.border');
        if (homeBorder) {
            homeBorder.style.borderColor = 'var(--cat-peach-active)';
            // Set initial peach color for Home title
            const homeTitle = homeBorder.querySelector('.absolute');
            if (homeTitle) {
                homeTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
            }
        }
        // Focus the home section by default
        homeContainer.focus();
    }
    
    // Make all section items focusable
    document.querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]').forEach(item => {
        item.setAttribute('tabindex', '0');
    });
});

// Main section update
function updateMainContent(section, itemId) {
    const mainSection = document.querySelector('[data-content-container="main"]');
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
                <div>
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
                <div>
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
                <div>
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
            title.classList.remove('text-cat-peach-light', 'dark:text-cat-peach-dark');
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
            homeContainer.style.borderColor = 'var(--cat-peach-active)';
            // Change the Home title color to peach
            const homeTitle = homeContainer.querySelector('.absolute');
            if (homeTitle) {
                homeTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
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
            // Add peach border to section container
            sectionContainer.style.borderColor = 'var(--cat-peach-active)';
            // Change section title to peach
            const sectionTitle = sectionContainer.querySelector('.absolute');
            if (sectionTitle) {
                sectionTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
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
    // First check if we're in the Home section
    const homeSection = document.activeElement.closest('.Home');
    if (homeSection) {
        // Only handle right/l navigation from Home
        if (e.key === 'ArrowRight' || e.key === 'l') {
            const experienceSection = document.querySelector('.Experience');
            const firstItem = experienceSection.querySelector('[data-index="1"]');
            if (firstItem) {
                firstItem.click();
                firstItem.focus();
                firstItem.scrollIntoView({ block: 'nearest' });
            }
        }
        return;
    }

    // Handle other sections
    const activeSection = document.activeElement.closest('.Experience, .Projects, [class*="Skills"]');
    if (!activeSection) return;

    const items = activeSection.querySelectorAll('[data-index]');
    const selectedItem = activeSection.querySelector('.selected');
    if (!selectedItem) return;

    const currentIndex = parseInt(selectedItem.dataset.index);
    let nextIndex;

    // Define the section order including Home
    const sections = ['Home', 'Experience', 'Projects', 'Skills'];
    const currentSectionIndex = sections.findIndex(section => activeSection.classList.contains(section));

    switch(e.key) {
        case 'ArrowUp':
        case 'k':
            nextIndex = Math.max(1, currentIndex - 1);
            const nextUpItem = activeSection.querySelector(`[data-index="${nextIndex}"]`);
            if (nextUpItem) {
                nextUpItem.click();
                nextUpItem.focus();
                nextUpItem.scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'ArrowDown':
        case 'j':
            nextIndex = Math.min(items.length, currentIndex + 1);
            const nextDownItem = activeSection.querySelector(`[data-index="${nextIndex}"]`);
            if (nextDownItem) {
                nextDownItem.click();
                nextDownItem.focus();
                nextDownItem.scrollIntoView({ block: 'nearest' });
            }
            break;
        case 'ArrowLeft':
        case 'h':
            if (currentSectionIndex > 1) { // > 1 because index 1 is Experience
                const prevSection = document.querySelector(`.${sections[currentSectionIndex - 1]}`);
                const firstItem = prevSection.querySelector('[data-index="1"]');
                if (firstItem) {
                    firstItem.click();
                    firstItem.focus();
                    firstItem.scrollIntoView({ block: 'nearest' });
                }
            } else if (currentSectionIndex === 1) { // We're in Experience section
                const homeContainer = document.querySelector('.Home');
                if (homeContainer) {
                    // Remove selected state from Experience items
                    document.querySelectorAll('.Experience [data-index]').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // Reset Experience counter color and value
                    const experienceCounter = document.querySelector('.Experience .list-index p');
                    if (experienceCounter) {
                        experienceCounter.classList.remove('text-cat-peach-light', 'dark:text-cat-peach-dark');
                        const currentCounter = experienceCounter.querySelector('span:first-child');
                        if (currentCounter) {
                            currentCounter.textContent = '1';
                        }
                    }
                    
                    homeContainer.setAttribute('tabindex', '0');
                    homeContainer.focus();
                    // Simulate click on home section
                    displayHomeContent();
                    // Update home section styling
                    const homeBorder = homeContainer.closest('.border');
                    if (homeBorder) {
                        // Reset all section borders and titles
                        document.querySelectorAll('.border').forEach(b => {
                            b.style.borderColor = '';
                            const title = b.querySelector('.absolute');
                            if (title) {
                                title.classList.remove('text-cat-peach-light', 'dark:text-cat-peach-dark');
                            }
                        });
                        // Set home section styling
                        homeBorder.style.borderColor = 'var(--cat-peach-active)';
                        const homeTitle = homeBorder.querySelector('.absolute');
                        if (homeTitle) {
                            homeTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
                        }
                    }
                }
            }
            break;
        case 'ArrowRight':
        case 'l':
            if (currentSectionIndex < sections.length - 1) {
                const nextSection = document.querySelector(`.${sections[currentSectionIndex + 1]}`);
                const firstItem = nextSection.querySelector('[data-index="1"]');
                if (firstItem) {
                    firstItem.click();
                    firstItem.focus();
                    firstItem.scrollIntoView({ block: 'nearest' });
                }
            }
            break;
        default:
            return;
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
                homeContainer.style.borderColor = 'var(--cat-peach-active)';
                const homeTitle = homeContainer.querySelector('.absolute');
                if (homeTitle) {
                    homeTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
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
            // Add peach highlighting to the selected section
            const sectionContainer = document.querySelector(`.${section.charAt(0).toUpperCase() + section.slice(1)}`).closest('.border');
            if (sectionContainer) {
                sectionContainer.style.borderColor = 'var(--cat-peach-active)';
                const sectionTitle = sectionContainer.querySelector('.absolute');
                if (sectionTitle) {
                    sectionTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
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

// Show/hide content based on section selection
function showSection(sectionName) {
    // Hide all sections first
    document.querySelectorAll('[class*=" Home"], [class^="Home"]').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show selected section
    document.querySelectorAll('.' + sectionName).forEach(el => {
        el.classList.remove('hidden');
    });
}

// Add click event listeners to section buttons
document.querySelectorAll('.section-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const sectionName = e.target.closest('button').dataset.section;
        showSection(sectionName);
    });
});

// Show Home section by default
showSection('Home');

// Add window resize listener to update ASCII art scaling
window.addEventListener('resize', () => {
    const asciiContainer = document.querySelector('.ascii-art.Home');
    if (asciiContainer) {
        if (window.innerWidth <= 640) {
            asciiContainer.style.fontSize = "min(1.2vw, 0.4rem)";
            asciiContainer.style.padding = "0 0.75rem";
        } else if (window.innerWidth <= 768) {
            asciiContainer.style.fontSize = "min(1.1vw, 0.45rem)";
            asciiContainer.style.padding = "0 1.5rem";
        } else if (window.innerWidth <= 1024) {
            asciiContainer.style.fontSize = "min(1.2vw, 0.5rem)";
            asciiContainer.style.padding = "0 1.5rem";
        } else if (window.innerWidth <= 1749) {
            asciiContainer.style.fontSize = "min(1.4vw, 0.7rem)";
            asciiContainer.style.padding = "0 0.5rem";
        } else {
            asciiContainer.style.fontSize = "min(1.6vw, 1rem)";
            asciiContainer.style.padding = "0 1rem";
        }
    }
}); 