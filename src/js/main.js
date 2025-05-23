// Theme functionality
const themeToggle = document.getElementById('themeToggle');

// Add global variables to track active section and selected item
let activeSectionName = 'home'; // Default to home
let activeItemId = null;

// Function to get the current theme
function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Function to get the correct icon based on current theme
function getThemeIcon(iconObj) {
    const theme = getCurrentTheme();
    return iconObj[theme];
}

// Function to update all skill icons based on current theme
function updateSkillIcons() {
    if (!sectionData.skills) return;

    document.querySelectorAll('[class*="Skills"] img').forEach((img) => {
        const skillId = img.closest('button').dataset.index;
        const skill = sectionData.skills.items.find((item) => item.id === parseInt(skillId));
        if (skill) {
            img.src = `./images/${getThemeIcon(skill.icon)}`;
        }
    });
}

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
        // Switch highlight.js theme
        document.getElementById('theme-light').disabled = false;
        document.getElementById('theme-dark').disabled = true;
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        // Switch highlight.js theme
        document.getElementById('theme-light').disabled = true;
        document.getElementById('theme-dark').disabled = false;
    }

    // Update skill icons when theme changes
    updateSkillIcons();
});

// Data store for section content
let sectionData = {
    experience: null,
    projects: null,
    skills: null,
};

// Load JSON data
async function loadSectionData() {
    try {
        const [experienceData, projectsData, skillsData] = await Promise.all([
            fetch('./data/experience.json').then((res) => res.json()),
            fetch('./data/projects.json').then((res) => res.json()),
            fetch('./data/skills.json').then((res) => res.json()),
        ]);

        sectionData.experience = experienceData;
        sectionData.projects = projectsData;
        sectionData.skills = skillsData;

        // Now populate the sidebar sections with the loaded data
        populateSidebarSections();
    } catch (error) {
        console.error('Error loading section data:', error);
    }
}

// Function to populate sidebar sections with data from JSON
function populateSidebarSections() {
    // Populate Experience section
    if (sectionData.experience && sectionData.experience.items) {
        const experienceContainer = document.querySelector('.Experience .scrollbar-custom .space-y-1');
        if (experienceContainer) {
            // Clear existing content
            experienceContainer.innerHTML = '';

            // Add items from JSON
            sectionData.experience.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(document.querySelectorAll('.Experience [data-index]'), button, 'experience');
                });

                experienceContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector('.Experience .list-index p span:last-child');
            if (counter) {
                counter.textContent = sectionData.experience.items.length;
            }
        }
    }

    // Populate Projects section
    if (sectionData.projects && sectionData.projects.items) {
        const projectsContainer = document.querySelector('.Projects .scrollbar-custom .space-y-1');
        if (projectsContainer) {
            // Clear existing content
            projectsContainer.innerHTML = '';

            // Add items from JSON
            sectionData.projects.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <span class="text-cat-fg-light dark:text-cat-fg-dark">${item.title}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(document.querySelectorAll('.Projects [data-index]'), button, 'projects');
                });

                projectsContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector('.Projects .list-index p span:last-child');
            if (counter) {
                counter.textContent = sectionData.projects.items.length;
            }
        }
    }

    // Populate Skills section
    if (sectionData.skills && sectionData.skills.items) {
        const skillsContainer = document.querySelector('.Skills .scrollbar-custom .space-y-1');
        if (skillsContainer) {
            // Clear existing content
            skillsContainer.innerHTML = '';

            // Add items from JSON
            sectionData.skills.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <img src="./images/${getThemeIcon(item.icon)}" alt="${item.name}" class="w-5 h-5" />
                    <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.name}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(document.querySelectorAll('[class*="Skills"] [data-index]'), button, 'skills');
                });

                skillsContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector('.Skills .list-index p span:last-child');
            if (counter) {
                counter.textContent = sectionData.skills.items.length;
            }
        }
    }

    // By default, start with Home selected, but make sure
    // the first item in each section is loaded into the data model
    // This ensures that when a user clicks a section header, content appears
    if (sectionData.experience && sectionData.experience.items.length > 0) {
        // Update the counter for the Experience section
        const experienceCounter = document.querySelector('.Experience .list-index p span:first-child');
        if (experienceCounter) {
            experienceCounter.textContent = '1';
        }
    }

    if (sectionData.projects && sectionData.projects.items.length > 0) {
        // Update the counter for the Projects section
        const projectsCounter = document.querySelector('.Projects .list-index p span:first-child');
        if (projectsCounter) {
            projectsCounter.textContent = '1';
        }
    }

    if (sectionData.skills && sectionData.skills.items.length > 0) {
        // Update the counter for the Skills section
        const skillsCounter = document.querySelector('.Skills .list-index p span:first-child');
        if (skillsCounter) {
            skillsCounter.textContent = '1';
        }
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
                Hello! I'm <span class="text-cat-green-light dark:text-cat-green-dark">Emil Malmsten</span>, a backend-focused
                <span class="text-cat-peach-light dark:text-cat-peach-dark">Software Developer</span> from Gothenburg, Sweden.
            </div>
            <div class="flex items-center gap-2 mb-4">
                <span class="text-cat-peach-light dark:text-cat-peach-dark">$</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">cat</span>
                <span class="text-cat-peach-light dark:text-cat-peach-dark">about.txt</span>
            </div>
            <div>
                I got started learning how to <span class="text-cat-green-light dark:text-cat-green-dark">code</span> in 2017 by myself using various online tutorials. As many people do, I started with the classic <span class="text-cat-peach-light dark:text-cat-peach-dark">web stack</span> of HTML, CSS and JavaScript.
                <br>
                <br>
                The reason that I wanted to learn how to code was basically that I thought it was something that could suit me well as someone who has always been into computers.
                But I had never experienced the <span class="text-cat-green-light dark:text-cat-green-dark">programming</span> side of it.
                <br> 
                <br>     
                <span class="text-cat-peach-light dark:text-cat-peach-dark">Click</span> on a section on the left to learn more about my <span class="text-cat-green-light dark:text-cat-green-dark">work</span> and past <span class="text-cat-peach-light dark:text-cat-peach-dark">experiences</span>.
                <br>
                You can also navigate through the sections using the <span class="text-cat-peach-light dark:text-cat-peach-dark">arrow keys</span> or <span class="text-cat-green-light dark:text-cat-green-dark">Vim motions</span>.
                <br>
                <br>
                In case you can't read the ASCII art above, dont't worry. Neither can I. It does however look cool.
            </div>
        </div>
    `;

    // Load ASCII art
    fetch('./images/ascii.txt')
        .then((response) => response.text())
        .then((text) => {
            const asciiLogo = document.getElementById('ascii-logo');
            if (asciiLogo) {
                asciiLogo.textContent = text;
                // Show the ASCII art container and ensure it has the correct scaling classes
                const asciiContainer = document.querySelector('.ascii-art.Home');
                if (asciiContainer) {
                    asciiContainer.classList.remove('hidden');
                    // Add the scaling classes
                    asciiContainer.style.fontFamily = "'Fira Mono', monospace";
                    asciiContainer.style.lineHeight = '1.2';
                    asciiContainer.style.fontSize = 'min(1.4vw, 0.7rem)';
                    asciiContainer.style.transformOrigin = 'center';
                    asciiContainer.style.width = '100%';
                    asciiContainer.style.display = 'flex';
                    asciiContainer.style.justifyContent = 'center';
                    asciiContainer.style.alignItems = 'center';
                    asciiContainer.style.overflow = 'hidden';

                    // Add responsive padding based on screen size
                    if (window.innerWidth <= 640) {
                        asciiContainer.style.fontSize = 'min(1.2vw, 0.4rem)';
                        asciiContainer.style.padding = '0 0.75rem';
                    } else if (window.innerWidth <= 768) {
                        asciiContainer.style.fontSize = 'min(1.1vw, 0.45rem)';
                        asciiContainer.style.padding = '0 1.5rem';
                    } else if (window.innerWidth <= 1024) {
                        asciiContainer.style.fontSize = 'min(1.2vw, 0.5rem)';
                        asciiContainer.style.padding = '0 1.5rem';
                    } else if (window.innerWidth <= 1749) {
                        asciiContainer.style.fontSize = 'min(1.4vw, 0.7rem)';
                        asciiContainer.style.padding = '0 0.5rem';
                    } else {
                        asciiContainer.style.fontSize = 'min(1.6vw, 1rem)';
                        asciiContainer.style.padding = '0 1rem';
                    }

                    // Also style the ascii-logo element
                    asciiLogo.style.display = 'block';
                    asciiLogo.style.whiteSpace = 'pre';
                    asciiLogo.style.maxWidth = '100%';
                    asciiLogo.style.transformOrigin = 'center';
                    asciiLogo.style.fontSize = 'inherit';
                    asciiLogo.style.textAlign = 'center';
                    asciiLogo.style.padding = '0 2px';
                }
            }
        })
        .catch((error) => console.error('Error loading ASCII art:', error));
}

// Show home content by default when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayHomeContent();
    // Set initial active section to home
    activeSectionName = 'home';
    activeItemId = null;
    
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

    // The event listeners for the dynamically created elements are now added in populateSidebarSections()
    // We'll still make focusable any elements that might exist at this point
    document
        .querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]')
        .forEach((item) => {
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

    const item = sectionData[section].items.find((i) => i.id === itemId);
    if (!item) return;

    let content = '';

    switch (section) {
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
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Highlights:</div>
                        <ul class="list-disc list-inside space-y-1">
                            ${item.highlights.map((h) => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Technologies:</div>
                        <div class="flex flex-wrap gap-2">
                            ${item.technologies
                                .map(
                                    (tech) =>
                                        `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`
                                )
                                .join('')}
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'projects':
            content = `
                <div>
                    <div class="text-cat-peach-light dark:text-cat-peach-dark text-xl mb-4">${item.title}</div>
                    <p class="mb-8">${item.description}</p>
                    ${
                        item.image
                            ? `
                    <div class="mb-6 flex justify-center">
                        <img 
                            src="./images/${item.image.src}" 
                            alt="${item.image.alt}" 
                            class="max-w-full h-auto rounded-md shadow-md hover:shadow-lg transition-shadow 
                                  w-full sm:w-11/12 md:w-10/12 lg:w-9/12 
                                  px-2 sm:px-0"
                            loading="lazy"
                            width="800"
                            height="auto"
                        />
                    </div>
                    `
                            : ''
                    }
                    
                    <!-- Demo Button -->
                    ${
                        item.live
                            ? `
                    <div class="flex justify-center mb-6">
                        <a href="${item.live}" target="_blank" class="
                            px-6 py-3 
                            border-2 border-cat-peach-light dark:border-cat-peach-dark 
                            text-cat-peach-light dark:text-cat-peach-dark 
                            font-mono font-bold text-lg
                            hover:bg-cat-peach-light/10 dark:hover:bg-cat-peach-dark/10
                            transition-all duration-200
                            flex items-center gap-2
                            focus:outline-none focus:ring-2 focus:ring-cat-peach-light dark:focus:ring-cat-peach-dark
                            rounded
                        ">
                            <span class="text-cat-fg-light dark:text-cat-fg-dark">$</span>
                            <span class="text-cat-green-light dark:text-cat-green-dark">view</span>
                            <span>DEMO</span>
                        </a>
                    </div>
                    `
                            : ''
                    }
                    
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Highlights:</div>
                        <ul class="list-disc list-inside space-y-1">
                            ${item.highlights.map((h) => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="mb-4">
                        <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Technologies:</div>
                        <div class="flex flex-wrap gap-2">
                            ${item.technologies
                                .map(
                                    (tech) =>
                                        `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`
                                )
                                .join('')}
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <a href="${
                            item.github
                        }" target="_blank" class="text-cat-green-light dark:text-cat-green-dark hover:underline">GitHub</a>
                    </div>
                </div>
            `;
            break;

        case 'skills':
            content = `
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <img src="./images/${getThemeIcon(item.icon)}" alt="${item.name}" class="w-6 h-6" />
                        <span class="text-cat-peach-light dark:text-cat-peach-dark text-xl">${item.name}</span>
                    </div>
                    <p class="mb-4">${item.description}</p>
                    ${item.code_file ? `
                        <div class="mt-6 code-example">
                            <pre><code class="rounded-md" id="codeExample">Loading...</code></pre>
                        </div>
                    ` : ''}
                </div>
            `;

            // After setting the content, fetch and display the code if there's a code file
            if (item.code_file) {
                fetch(`./data/${item.code_file}`)
                    .then(response => response.text())
                    .then(code => {
                        const codeElement = document.getElementById('codeExample');
                        if (codeElement) {
                            codeElement.textContent = code;
                            // Detect language from file extension
                            const fileExtension = item.code_file.split('.').pop();
                            const language = fileExtension === 'tsx' ? 'typescript' : fileExtension;
                            codeElement.className = `language-${language}`;
                            // Apply syntax highlighting
                            hljs.highlightElement(codeElement);
                            // Force theme update
                            const isDark = document.documentElement.classList.contains('dark');
                            document.getElementById('theme-light').disabled = isDark;
                            document.getElementById('theme-dark').disabled = !isDark;
                        }
                    })
                    .catch(error => {
                        console.error('Error loading code example:', error);
                        const codeElement = document.getElementById('codeExample');
                        if (codeElement) {
                            codeElement.textContent = 'Error loading code example';
                        }
                    });
            }
            break;
    }

    mainSection.innerHTML = content;
}

// List item selection functionality
function handleItemSelection(items, item, section) {
    // Update our global tracking variables
    activeSectionName = section;
    activeItemId = item && item.dataset ? parseInt(item.dataset.index) : null;
    
    // Remove selected class and border color from ALL sections and items
    document.querySelectorAll('.border').forEach((i) => {
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
    document
        .querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]')
        .forEach((i) => {
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
    // Update the active section variables
    activeSectionName = 'home';
    activeItemId = null;
    
    handleItemSelection(null, document.querySelector('.Home'), 'home');
});

// Improved helper function to check if an element is visible in its scrollable container
// with an optional buffer zone to start scrolling earlier
function isElementInView(element, container, buffer = 0) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Check if the element is fully visible in the container (with buffer)
    return elementRect.top >= containerRect.top - buffer && elementRect.bottom <= containerRect.bottom + buffer;
}

// Completely replace the keyboard navigation event handler
document.addEventListener('keydown', (e) => {
    // Prevent default arrow key behavior to avoid any browser-induced scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    // Define the section order including Home
    const sections = ['Home', 'Experience', 'Projects', 'Skills'];
    
    // Get current active section based on our tracking variable, not focus
    let activeSection, currentSectionIndex;
    
    if (activeSectionName === 'home') {
        activeSection = document.querySelector('.Home');
        currentSectionIndex = 0;
    } else {
        // Convert activeSectionName to proper case for querySelector
        const sectionClass = activeSectionName.charAt(0).toUpperCase() + activeSectionName.slice(1);
        activeSection = document.querySelector(`.${sectionClass}`);
        currentSectionIndex = sections.findIndex(section => section === sectionClass);
    }
    
    if (!activeSection) return;
    
    // For non-home sections, we need to handle item navigation
    if (activeSectionName !== 'home') {
        const items = activeSection.querySelectorAll('[data-index]');
        if (items.length === 0) return;
        
        // Find the currently selected item or default to the first one
        let selectedItem;
        if (activeItemId) {
            selectedItem = activeSection.querySelector(`[data-index="${activeItemId}"]`);
        }
        
        // If no selected item found, default to the first one
        if (!selectedItem && items.length > 0) {
            selectedItem = items[0];
            activeItemId = parseInt(selectedItem.dataset.index);
        }
        
        if (!selectedItem) return;
        
        const currentIndex = parseInt(selectedItem.dataset.index);
        let nextIndex;
        let nextItem = null;
        
        // Get the scrollable container for visibility checks
        const scrollableContainer = activeSection.querySelector('.scrollbar-custom');
        
        // Define buffer for earlier scrolling (20px)
        const scrollBuffer = 20;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'k':
                // Find the next lowest item id
                nextItem = findPrevItem(items, currentIndex);
                if (nextItem) {
                    nextItem.click();
                    nextItem.focus();
                }
                break;
            case 'ArrowDown':
            case 'j':
                // Find the next highest item id
                nextItem = findNextItem(items, currentIndex);
                if (nextItem) {
                    nextItem.click();
                    nextItem.focus();
                }
                break;
            case 'ArrowLeft':
            case 'h':
                if (currentSectionIndex > 0) {
                    // Move to previous section
                    const prevSection = document.querySelector(`.${sections[currentSectionIndex - 1]}`);
                    if (prevSection) {
                        if (currentSectionIndex === 1) {
                            // Moving from Experience to Home
                            const homeContainer = document.querySelector('.Home');
                            if (homeContainer) {
                                homeContainer.click();
                                homeContainer.focus();
                            }
                        } else {
                            // Moving between other sections
                            const firstItem = prevSection.querySelector('[data-index="1"]');
                            if (firstItem) {
                                firstItem.click();
                                firstItem.focus();
                            }
                        }
                    }
                }
                break;
            case 'ArrowRight':
            case 'l':
                if (currentSectionIndex < sections.length - 1) {
                    // Move to next section
                    const nextSection = document.querySelector(`.${sections[currentSectionIndex + 1]}`);
                    if (nextSection) {
                        const firstItem = nextSection.querySelector('[data-index="1"]');
                        if (firstItem) {
                            firstItem.click();
                            firstItem.focus();
                        }
                    }
                }
                break;
        }
        
        // Handle scrolling for the next item
        if (nextItem && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'j' || e.key === 'k')) {
            // Check if scrolling is needed using the enhanced visibility check with buffer
            if (scrollableContainer && !isElementInView(nextItem, scrollableContainer, scrollBuffer)) {
                // Calculate better scroll position
                const itemHeight = nextItem.offsetHeight;
                const containerHeight = scrollableContainer.clientHeight;
                
                // For "up" navigation, align to top with room for context above
                if (e.key === 'ArrowUp' || e.key === 'k') {
                    scrollableContainer.scrollTop = nextItem.offsetTop - Math.floor(containerHeight / 4);
                }
                // For "down" navigation, ensure item is fully visible with context below
                else {
                    const itemBottom = nextItem.offsetTop + itemHeight;
                    const scrollBottom = scrollableContainer.scrollTop + containerHeight;
                    
                    if (itemBottom > scrollBottom) {
                        scrollableContainer.scrollTop =
                            nextItem.offsetTop - containerHeight + itemHeight + Math.floor(containerHeight / 4);
                    }
                }
            }
        }
    } else {
        // Home section only handles right/l navigation
        if (e.key === 'ArrowRight' || e.key === 'l') {
            const experienceSection = document.querySelector('.Experience');
            const firstItem = experienceSection.querySelector('[data-index="1"]');
            if (firstItem) {
                firstItem.click();
                firstItem.focus();
            }
        }
    }
});

// Helper function to find the previous item by index
function findPrevItem(items, currentIndex) {
    let prevItem = null;
    let prevIndex = -1;
    
    for (let i = 0; i < items.length; i++) {
        const index = parseInt(items[i].dataset.index);
        if (index < currentIndex && (prevIndex === -1 || index > prevIndex)) {
            prevIndex = index;
            prevItem = items[i];
        }
    }
    
    return prevItem;
}

// Helper function to find the next item by index
function findNextItem(items, currentIndex) {
    let nextItem = null;
    let nextIndex = Number.MAX_SAFE_INTEGER;
    
    for (let i = 0; i < items.length; i++) {
        const index = parseInt(items[i].dataset.index);
        if (index > currentIndex && index < nextIndex) {
            nextIndex = index;
            nextItem = items[i];
        }
    }
    
    return nextItem;
}

// Mobile navigation functionality
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerTitle = document.getElementById('drawerTitle');
const drawerContent = document.getElementById('drawerContent');
let activeSection = null;

// Handle mobile navigation button clicks
document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        activeSection = section;

        // Add active state to button
        document.querySelectorAll('.mobile-nav-btn').forEach((b) => {
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
            const sectionContainer = document
                .querySelector(`.${section.charAt(0).toUpperCase() + section.slice(1)}`)
                .closest('.border');
            if (sectionContainer) {
                sectionContainer.style.borderColor = 'var(--cat-peach-active)';
                const sectionTitle = sectionContainer.querySelector('.absolute');
                if (sectionTitle) {
                    sectionTitle.classList.add('text-cat-peach-light', 'dark:text-cat-peach-dark');
                }
            }
        }

        // Remove selected state from all items
        document
            .querySelectorAll('.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]')
            .forEach((i) => {
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
    document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
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
            <button class="w-full text-left p-2 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mobile-item mr-2" data-index="${
                item.id
            }">
                ${
                    section === 'skills'
                        ? `<img src="./images/${getThemeIcon(item.icon)}" alt="${item.name}" class="w-5 h-5" />`
                        : ''
                }
                <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title || item.name}</span>
                ${
                    section === 'experience'
                        ? `
                    <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
                `
                        : ''
                }
            </button>
        `;
    });

    content += '</div>';
    drawerContent.innerHTML = content;

    // Add click handlers for items
    drawerContent.querySelectorAll('.mobile-item').forEach((item) => {
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
            document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
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
    document.querySelectorAll('[class*=" Home"], [class^="Home"]').forEach((el) => {
        el.classList.add('hidden');
    });

    // Show selected section
    document.querySelectorAll('.' + sectionName).forEach((el) => {
        el.classList.remove('hidden');
    });
}

// Add click event listeners to section buttons
document.querySelectorAll('.section-button').forEach((button) => {
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
            asciiContainer.style.fontSize = 'min(1.2vw, 0.4rem)';
            asciiContainer.style.padding = '0 0.75rem';
        } else if (window.innerWidth <= 768) {
            asciiContainer.style.fontSize = 'min(1.1vw, 0.45rem)';
            asciiContainer.style.padding = '0 1.5rem';
        } else if (window.innerWidth <= 1024) {
            asciiContainer.style.fontSize = 'min(1.2vw, 0.5rem)';
            asciiContainer.style.padding = '0 1.5rem';
        } else if (window.innerWidth <= 1749) {
            asciiContainer.style.fontSize = 'min(1.4vw, 0.7rem)';
            asciiContainer.style.padding = '0 0.5rem';
        } else {
            asciiContainer.style.fontSize = 'min(1.6vw, 1rem)';
            asciiContainer.style.padding = '0 1rem';
        }
    }
});
