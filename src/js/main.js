// Theme functionality
const themeToggle = document.getElementById('themeToggle');

// Add global variables to track active section and selected item
let activeSectionName = 'home'; // Default to home
let activeItemId = null;

// Function to get the current theme
function getCurrentTheme() {
    return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
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
        const skill = sectionData.skills.items.find(
            (item) => item.id === parseInt(skillId),
        );
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
        const experienceContainer = document.querySelector(
            '.Experience .scrollbar-custom .space-y-1',
        );
        if (experienceContainer) {
            // Clear existing content
            experienceContainer.innerHTML = '';

            // Add items from JSON
            sectionData.experience.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item truncate';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                    <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(
                        document.querySelectorAll('.Experience [data-index]'),
                        button,
                        'experience',
                    );
                });

                experienceContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector(
                '.Experience .list-index p span:last-child',
            );
            if (counter) {
                counter.textContent = sectionData.experience.items.length;
            }
        }
    }

    // Populate Projects section
    if (sectionData.projects && sectionData.projects.items) {
        const projectsContainer = document.querySelector(
            '.Projects .scrollbar-custom .space-y-1',
        );
        if (projectsContainer) {
            // Clear existing content
            projectsContainer.innerHTML = '';

            // Add items from JSON
            sectionData.projects.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item truncate';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <span class="text-cat-fg-light dark:text-cat-fg-dark">${item.title}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(
                        document.querySelectorAll('.Projects [data-index]'),
                        button,
                        'projects',
                    );
                });

                projectsContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector(
                '.Projects .list-index p span:last-child',
            );
            if (counter) {
                counter.textContent = sectionData.projects.items.length;
            }
        }
    }

    // Populate Skills section
    if (sectionData.skills && sectionData.skills.items) {
        const skillsContainer = document.querySelector(
            '.Skills .scrollbar-custom .space-y-1',
        );
        if (skillsContainer) {
            // Clear existing content
            skillsContainer.innerHTML = '';

            // Add items from JSON
            sectionData.skills.items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className =
                    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item truncate';
                button.setAttribute('data-index', item.id);
                button.setAttribute('tabindex', '0'); // Make focusable

                button.innerHTML = `
                    <img src="./images/${getThemeIcon(item.icon)}" alt="${item.name}" class="w-5 h-5" />
                    <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.name}</span>
                `;

                button.addEventListener('click', () => {
                    handleItemSelection(
                        document.querySelectorAll(
                            '[class*="Skills"] [data-index]',
                        ),
                        button,
                        'skills',
                    );
                });

                skillsContainer.appendChild(button);
            });

            // Update counter
            const counter = document.querySelector(
                '.Skills .list-index p span:last-child',
            );
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
        const experienceCounter = document.querySelector(
            '.Experience .list-index p span:first-child',
        );
        if (experienceCounter) {
            experienceCounter.textContent = '1';
        }
    }

    if (sectionData.projects && sectionData.projects.items.length > 0) {
        // Update the counter for the Projects section
        const projectsCounter = document.querySelector(
            '.Projects .list-index p span:first-child',
        );
        if (projectsCounter) {
            projectsCounter.textContent = '1';
        }
    }

    if (sectionData.skills && sectionData.skills.items.length > 0) {
        // Update the counter for the Skills section
        const skillsCounter = document.querySelector(
            '.Skills .list-index p span:first-child',
        );
        if (skillsCounter) {
            skillsCounter.textContent = '1';
        }
    }
}

// Load data when the page loads
loadSectionData();

const BIRTH_DATE = '1995-04-08';

// Age in whole years, so it never goes stale
function getAge() {
    const birth = new Date(BIRTH_DATE);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Function to display home content
function displayHomeContent() {
    const mainSection = document.querySelector(
        '[data-content-container="main"]',
    );
    const infoRows = [
        ['Name', 'Emil Malmsten'],
        ['Location', 'Gothenburg, Sweden'],
        ['Age', `${getAge()}`],
        ['Role', 'Software Engineer @ CodeIT'],
        ['Focus', 'Backend'],
        ['Coding since', '2017'],
    ]
        .map(
            ([label, value]) => `
                <div class="flex gap-2">
                    <span class="text-cat-peach-light dark:text-cat-peach-dark">${label}:</span>
                    <span>${value}</span>
                </div>`,
        )
        .join('');

    // Catppuccin palette swatches (Latte / Mocha), like neofetch's colour row.
    // Class names are written out in full because Tailwind scans source files
    // as plain text - an interpolated `bg-[${x}]` would never be generated.
    const swatches = [
        'bg-[#d20f39] dark:bg-[#f38ba8]', // red
        'bg-[#fe640b] dark:bg-[#fab387]', // peach
        'bg-[#df8e1d] dark:bg-[#f9e2af]', // yellow
        'bg-[#40a02b] dark:bg-[#a6e3a1]', // green
        'bg-[#179299] dark:bg-[#94e2d5]', // teal
        'bg-[#1e66f5] dark:bg-[#89b4fa]', // blue
        'bg-[#8839ef] dark:bg-[#cba6f7]', // mauve
        'bg-[#4c4f69] dark:bg-[#cdd6f4]', // text
    ]
        .map((c) => `<div class="w-7 h-5 ${c}"></div>`)
        .join('');

    mainSection.innerHTML = `
        <div class="flex items-center gap-2 mb-4">
            <span class="text-cat-peach-light dark:text-cat-peach-dark">$</span>
            <span class="text-cat-green-light dark:text-cat-green-dark">whoami</span>
        </div>
        <!-- ASCII art + info, side by side from md up, stacked on mobile -->
        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 mb-6">
            <div class="ascii-art shrink-0 flex justify-center md:justify-start">
                <pre id="ascii-logo" class="text-cat-green-light dark:text-cat-green-dark text-[0.75rem] sm:text-[1rem] lg:text-[1.19rem] leading-[1.108]"></pre>
            </div>
            <div class="flex-1 min-w-0">
                <div class="space-y-1">
                    ${infoRows}
                </div>
                <div class="flex mt-4">
                    ${swatches}
                </div>
            </div>
        </div>
        <!-- Content section -->
        <div class="mt-2 md:mt-4">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-cat-peach-light dark:text-cat-peach-dark">$</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">cat</span>
                <span class="text-cat-peach-light dark:text-cat-peach-dark">about.txt</span>
            </div>
            <div>
                I got started learning how to <span class="text-cat-green-light dark:text-cat-green-dark">code</span> in 2017 by myself using various online tutorials. As many people do, I started with the classic <span class="text-cat-peach-light dark:text-cat-peach-dark">web stack</span> of HTML, CSS and JavaScript.
                <br>
                <br>
                The reason that I wanted to learn how to code was basically that I thought it was something that could suit me well as someone who has always been into computers and doing stuff like hosting <span class="text-cat-peach-light dark:text-cat-peach-dark">Minecraft</span> servers in highschool.
                But I had never really experienced the <span class="text-cat-green-light dark:text-cat-green-dark">programming</span> side of it.
                <br> 
                <br>     
                <span class="text-cat-peach-light dark:text-cat-peach-dark">Click</span> on a section on the left to learn more about my <span class="text-cat-green-light dark:text-cat-green-dark">work</span> and past <span class="text-cat-peach-light dark:text-cat-peach-dark">experiences</span>.
                <br>
            </div>
        </div>
    `;

    // Load ASCII art
    fetch('./images/ascii.txt')
        .then((response) => response.text())
        .then((text) => {
            const asciiLogo = document.getElementById('ascii-logo');
            if (asciiLogo) {
                // trailing newline would render as an extra blank row
                asciiLogo.textContent = text.trimEnd();
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
                homeTitle.classList.add(
                    'text-cat-peach-light',
                    'dark:text-cat-peach-dark',
                );
            }
        }
        // Focus the home section by default
        homeContainer.focus();
    }

    // The event listeners for the dynamically created elements are now added in populateSidebarSections()
    // We'll still make focusable any elements that might exist at this point
    document
        .querySelectorAll(
            '.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]',
        )
        .forEach((item) => {
            item.setAttribute('tabindex', '0');
        });
});

// Main section update
function updateMainContent(section, itemId) {
    const mainSection = document.querySelector(
        '[data-content-container="main"]',
    );
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
                                        `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`,
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
                                        `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${tech}</span>`,
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
                    ${
                        item.code_file
                            ? `
                        <div class="mt-6 code-example">
                            <pre><code class="rounded-md" id="codeExample">Loading...</code></pre>
                        </div>
                    `
                            : ''
                    }
                </div>
            `;

            // After setting the content, fetch and display the code if there's a code file
            if (item.code_file) {
                fetch(`./data/${item.code_file}`)
                    .then((response) => response.text())
                    .then((code) => {
                        const codeElement =
                            document.getElementById('codeExample');
                        if (codeElement) {
                            codeElement.textContent = code;
                            // Detect language from file extension
                            const fileExtension = item.code_file
                                .split('.')
                                .pop();
                            const language =
                                fileExtension === 'tsx'
                                    ? 'typescript'
                                    : fileExtension;
                            codeElement.className = `language-${language}`;
                            // Apply syntax highlighting
                            hljs.highlightElement(codeElement);
                            // Force theme update
                            const isDark =
                                document.documentElement.classList.contains(
                                    'dark',
                                );
                            document.getElementById('theme-light').disabled =
                                isDark;
                            document.getElementById('theme-dark').disabled =
                                !isDark;
                        }
                    })
                    .catch((error) => {
                        console.error('Error loading code example:', error);
                        const codeElement =
                            document.getElementById('codeExample');
                        if (codeElement) {
                            codeElement.textContent =
                                'Error loading code example';
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
    activeItemId = section === 'home' ? null : parseInt(item.dataset.index);

    // Remove selected class and border color from ALL sections and items
    document.querySelectorAll('.border').forEach((i) => {
        i.style.borderColor = '';
        // Reset all section titles to default color
        const title = i.querySelector('.absolute');
        if (title) {
            title.classList.remove(
                'text-cat-peach-light',
                'dark:text-cat-peach-dark',
            );
        }
        // Reset all counter colors to default foreground color
        const counter = i.querySelector('.list-index');
        if (counter) {
            counter
                .querySelector('p')
                .classList.remove(
                    'text-cat-peach-light',
                    'dark:text-cat-peach-dark',
                );
            const currentCounter = counter.querySelector('span:first-child');
            if (currentCounter) {
                currentCounter.textContent = '1';
            }
        }
    });
    document
        .querySelectorAll(
            '.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]',
        )
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
                homeTitle.classList.add(
                    'text-cat-peach-light',
                    'dark:text-cat-peach-dark',
                );
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
                sectionTitle.classList.add(
                    'text-cat-peach-light',
                    'dark:text-cat-peach-dark',
                );
            }
            // Change counter color to peach ONLY for selected section
            const counter = sectionContainer.querySelector('.list-index');
            if (counter) {
                counter
                    .querySelector('p')
                    .classList.add(
                        'text-cat-peach-light',
                        'dark:text-cat-peach-dark',
                    );
                const currentCounter =
                    counter.querySelector('span:first-child');
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
    return (
        elementRect.top >= containerRect.top - buffer &&
        elementRect.bottom <= containerRect.bottom + buffer
    );
}

// Every keyboard-navigable entry, flattened into one list in visual order:
// Home first, then each item of Experience, Projects and Skills. Navigating
// past the last item of a section therefore continues into the next section.
function getNavEntries() {
    const entries = [
        { section: 'home', itemId: null, el: document.querySelector('.Home') },
    ];

    ['experience', 'projects', 'skills'].forEach((section) => {
        const sectionClass =
            section.charAt(0).toUpperCase() + section.slice(1);
        const container = document.querySelector(`.${sectionClass}`);
        if (!container) return;

        container.querySelectorAll('[data-index]').forEach((el) => {
            entries.push({
                section,
                itemId: parseInt(el.dataset.index),
                el,
            });
        });
    });

    return entries;
}

// Scroll an item into view inside its own scrollable section, starting a little
// before it reaches the edge (20px buffer)
function scrollItemIntoView(item, movingDown) {
    const container = item.closest('.scrollbar-custom');
    if (!container || isElementInView(item, container, 20)) return;

    const itemHeight = item.offsetHeight;
    const containerHeight = container.clientHeight;

    // For "up" navigation, align to top with room for context above
    if (!movingDown) {
        container.scrollTop = item.offsetTop - Math.floor(containerHeight / 4);
        return;
    }

    // For "down" navigation, ensure item is fully visible with context below
    const itemBottom = item.offsetTop + itemHeight;
    if (itemBottom > container.scrollTop + containerHeight) {
        container.scrollTop =
            item.offsetTop -
            containerHeight +
            itemHeight +
            Math.floor(containerHeight / 4);
    }
}

// Keyboard navigation - up/down arrows or k/j walk the flat entry list
document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const movingUp = e.key === 'ArrowUp' || e.key === 'k';
    const movingDown = e.key === 'ArrowDown' || e.key === 'j';
    if (!movingUp && !movingDown) return;

    // Prevent default arrow key behavior to avoid any browser-induced scrolling
    e.preventDefault();

    const entries = getNavEntries();

    // Find where we are now, falling back to Home
    let currentIndex = entries.findIndex(
        (entry) =>
            entry.section === activeSectionName && entry.itemId === activeItemId,
    );
    if (currentIndex === -1) currentIndex = 0;

    // Stop at the ends of the list
    const next = entries[currentIndex + (movingDown ? 1 : -1)];
    if (!next || !next.el) return;

    next.el.click();
    next.el.focus();

    if (next.section !== 'home') {
        scrollItemIntoView(next.el, movingDown);
    }
});

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
            const homeContainer = document
                .querySelector('.Home')
                .closest('.border');
            if (homeContainer) {
                homeContainer.style.borderColor = 'var(--cat-peach-active)';
                const homeTitle = homeContainer.querySelector('.absolute');
                if (homeTitle) {
                    homeTitle.classList.add(
                        'text-cat-peach-light',
                        'dark:text-cat-peach-dark',
                    );
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
                .querySelector(
                    `.${section.charAt(0).toUpperCase() + section.slice(1)}`,
                )
                .closest('.border');
            if (sectionContainer) {
                sectionContainer.style.borderColor = 'var(--cat-peach-active)';
                const sectionTitle =
                    sectionContainer.querySelector('.absolute');
                if (sectionTitle) {
                    sectionTitle.classList.add(
                        'text-cat-peach-light',
                        'dark:text-cat-peach-dark',
                    );
                }
            }
        }

        // Remove selected state from all items
        document
            .querySelectorAll(
                '.Experience [data-index], .Projects [data-index], [class*="Skills"] [data-index]',
            )
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
            const sectionElement = document.querySelector(
                `.${section.charAt(0).toUpperCase() + section.slice(1)}`,
            );
            const targetItem = sectionElement.querySelector(
                `[data-index="${itemIndex}"]`,
            );
            if (targetItem) {
                handleItemSelection(
                    document.querySelectorAll(
                        `.${section.charAt(0).toUpperCase() + section.slice(1)} [data-index]`,
                    ),
                    targetItem,
                    section,
                );
            }
            // Close drawer after selection
            mobileDrawer.classList.add('translate-y-full');
            // Remove active states from mobile nav buttons
            document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
                btn.classList.remove('active');
                btn.classList.remove(
                    'bg-cat-fg-light/10',
                    'dark:bg-cat-fg-dark/10',
                );
                btn.querySelector('span:last-child').classList.remove(
                    'underline',
                );
            });
        });
    });
}

// Show/hide content based on section selection
function showSection(sectionName) {
    // Hide all sections first
    document
        .querySelectorAll('[class*=" Home"], [class^="Home"]')
        .forEach((el) => {
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


// Idle pixel art pug in the bottom right corner of the Main panel.
//
// PUG_REST is transcribed pixel for pixel from the source art, padded with one
// blank row on top. The other frames are that same sprite with two effects
// layered on, so no pixel is ever hand redrawn:
//
//   body lift  - one row low in the belly is duplicated, so the head, ear, eye,
//                torso and tail all rise a pixel together while the legs stay put
//   chest rise - the back outline over the shoulders lifts one more pixel
//
// The two run on offset timing: the chest leads going in and relaxes first
// coming out, so the body reads as one thing moving rather than an edge sliding.
const PUG_PALETTE = {
    o: '#4f1f0b', // outline and pupil
    b: '#fedbb3', // body
    d: '#754b32', // ear and muzzle
    w: '#ffffff', // eye white
    t: '#e85050', // tongue
};

// At rest, fully exhaled
const PUG_REST = [
    '................................',
    '.......ooooooo..................',
    '.....oobbbbbbboo................',
    '....obbbbbbbbbbboo.........ooo..',
    '..oobbbbbbbbbooobboooo....obbbo.',
    '.odobbbbbbbbodddobbobboooobbobbo',
    'odobbbbbbbbboddddobbobbbbbobbobo',
    'odoobbbboobboddddobbbbbbbbboobbo',
    'odobbbbbbbbbodddddobbbbbbbbbobo.',
    '.owbbbbwwwwbboddddobbbbbbbbbbo..',
    '.oowbbwwoowwbbodddobbbbbbbbbbo..',
    '.oowbbwoooowbbbooobbbbbbbbbbbbo.',
    '.oowbbwoooowbbbbbbbbbbbbbbbbbbo.',
    '.owooowwoowwbbbbbbbbbbbbbbbbbbo.',
    '.oddoddwwwwbbbbbbbbbbbbbbbbbbbo.',
    '.oddoddddobbbbbbbobbbbbbbbbbbbo.',
    '.odotoddddobbbbbbbbbbbbbbbbbbbo.',
    '..ootoddddobbbbobbbbbbbobbbbbbo.',
    '...oddoddobbbbobbbbbbbbobbbbbo..',
    '....oooooooobbbbbbbbbbbobbbbbo..',
    '........obbbbbbbbbbbbbbbobbbo...',
    '.........oobbbobbbbbbbbbbobbo...',
    '.........oboooobobbbbboooobo....',
    '.........obo..oboooooobo.obo....',
    '..........o....o......o...o.....',
];

// Chest starting to fill, body has not lifted yet
const PUG_CHEST = [
    '................................',
    '.......ooooooo..................',
    '.....oobbbbbbboo................',
    '....obbbbbbbbbbboooooo.....ooo..',
    '..oobbbbbbbbbooobbbbbbooooobbbo.',
    '.odobbbbbbbbodddobbobbbbbbbbobbo',
    'odobbbbbbbbboddddobbobbbbbobbobo',
    'odoobbbboobboddddobbbbbbbbboobbo',
    'odobbbbbbbbbodddddobbbbbbbbbobo.',
    '.owbbbbwwwwbboddddobbbbbbbbbbo..',
    '.oowbbwwoowwbbodddobbbbbbbbbbo..',
    '.oowbbwoooowbbbooobbbbbbbbbbbbo.',
    '.oowbbwoooowbbbbbbbbbbbbbbbbbbo.',
    '.owooowwoowwbbbbbbbbbbbbbbbbbbo.',
    '.oddoddwwwwbbbbbbbbbbbbbbbbbbbo.',
    '.oddoddddobbbbbbbobbbbbbbbbbbbo.',
    '.odotoddddobbbbbbbbbbbbbbbbbbbo.',
    '..ootoddddobbbbobbbbbbbobbbbbbo.',
    '...oddoddobbbbobbbbbbbbobbbbbo..',
    '....oooooooobbbbbbbbbbbobbbbbo..',
    '........obbbbbbbbbbbbbbbobbbo...',
    '.........oobbbobbbbbbbbbbobbo...',
    '.........oboooobobbbbboooobo....',
    '.........obo..oboooooobo.obo....',
    '..........o....o......o...o.....',
];

// Full inhale, body lifted and chest up
const PUG_FULL = [
    '.......ooooooo..................',
    '.....oobbbbbbboo................',
    '....obbbbbbbbbbboooooo.....ooo..',
    '..oobbbbbbbbbooobbbbbbooooobbbo.',
    '.odobbbbbbbbodddobbobbbbbbbbobbo',
    'odobbbbbbbbboddddobbobbbbbobbobo',
    'odoobbbboobboddddobbbbbbbbboobbo',
    'odobbbbbbbbbodddddobbbbbbbbbobo.',
    '.owbbbbwwwwbboddddobbbbbbbbbbo..',
    '.oowbbwwoowwbbodddobbbbbbbbbbo..',
    '.oowbbwoooowbbbooobbbbbbbbbbbbo.',
    '.oowbbwoooowbbbbbbbbbbbbbbbbbbo.',
    '.owooowwoowwbbbbbbbbbbbbbbbbbbo.',
    '.oddoddwwwwbbbbbbbbbbbbbbbbbbbo.',
    '.oddoddddobbbbbbbobbbbbbbbbbbbo.',
    '.odotoddddobbbbbbbbbbbbbbbbbbbo.',
    '..ootoddddobbbbobbbbbbbobbbbbbo.',
    '...oddoddobbbbobbbbbbbbobbbbbo..',
    '....oooooooobbbbbbbbbbbobbbbbo..',
    '........obbbbbbbbbbbbbbbobbbo...',
    '........obbbbbbbbbbbbbbbobbbo...',
    '.........oobbbobbbbbbbbbbobbo...',
    '.........oboooobobbbbboooobo....',
    '.........obo..oboooooobo.obo....',
    '..........o....o......o...o.....',
];

// Chest relaxed but the body has not dropped back yet
const PUG_SETTLE = [
    '.......ooooooo..................',
    '.....oobbbbbbboo................',
    '....obbbbbbbbbbboo.........ooo..',
    '..oobbbbbbbbbooobboooo....obbbo.',
    '.odobbbbbbbbodddobbobboooobbobbo',
    'odobbbbbbbbboddddobbobbbbbobbobo',
    'odoobbbboobboddddobbbbbbbbboobbo',
    'odobbbbbbbbbodddddobbbbbbbbbobo.',
    '.owbbbbwwwwbboddddobbbbbbbbbbo..',
    '.oowbbwwoowwbbodddobbbbbbbbbbo..',
    '.oowbbwoooowbbbooobbbbbbbbbbbbo.',
    '.oowbbwoooowbbbbbbbbbbbbbbbbbbo.',
    '.owooowwoowwbbbbbbbbbbbbbbbbbbo.',
    '.oddoddwwwwbbbbbbbbbbbbbbbbbbbo.',
    '.oddoddddobbbbbbbobbbbbbbbbbbbo.',
    '.odotoddddobbbbbbbbbbbbbbbbbbbo.',
    '..ootoddddobbbbobbbbbbbobbbbbbo.',
    '...oddoddobbbbobbbbbbbbobbbbbo..',
    '....oooooooobbbbbbbbbbbobbbbbo..',
    '........obbbbbbbbbbbbbbbobbbo...',
    '........obbbbbbbbbbbbbbbobbbo...',
    '.........oobbbobbbbbbbbbbobbo...',
    '.........oboooobobbbbboooobo....',
    '.........obo..oboooooobo.obo....',
    '..........o....o......o...o.....',
];


const PUG_SCALE = 5;

// [frame, milliseconds]. Breathing is not evenly paced - the inhale is quicker
// than the exhale, and there is a long pause before the next breath.
const PUG_BREATH = [
    [PUG_CHEST, 200],
    [PUG_FULL, 260],
    [PUG_FULL, 420],
    [PUG_SETTLE, 300],
    [PUG_REST, 260],
    [PUG_REST, 900],
];

function drawPug(ctx, frame) {
    ctx.clearRect(0, 0, frame[0].length * PUG_SCALE, frame.length * PUG_SCALE);
    frame.forEach((row, y) => {
        [...row].forEach((cell, x) => {
            const color = PUG_PALETTE[cell];
            if (!color) return;
            ctx.fillStyle = color;
            ctx.fillRect(x * PUG_SCALE, y * PUG_SCALE, PUG_SCALE, PUG_SCALE);
        });
    });
}

function startPixelPug() {
    const canvas = document.getElementById('pixel-pug');
    if (!canvas) return;

    const cols = PUG_REST[0].length;
    const rows = PUG_REST.length;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cols * PUG_SCALE * dpr;
    canvas.height = rows * PUG_SCALE * dpr;
    canvas.style.width = `${cols * PUG_SCALE}px`;
    canvas.style.height = `${rows * PUG_SCALE}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        drawPug(ctx, PUG_REST);
        return;
    }

    let step = 0;
    const tick = () => {
        const [frame, ms] = PUG_BREATH[step];
        drawPug(ctx, frame);
        step = (step + 1) % PUG_BREATH.length;
        setTimeout(tick, ms);
    };
    tick();
}

startPixelPug();
