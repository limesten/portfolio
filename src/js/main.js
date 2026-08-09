// Portfolio site: a sidebar of sections, one Main panel showing the selected
// item. Navigation happens by mouse, by arrow keys / j / k, or - on mobile -
// through a bottom drawer. All three funnel into selectItem().

const main = document.querySelector('[data-content-container="main"]');
const themeToggle = document.getElementById('themeToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerContent = document.getElementById('drawerContent');

const PEACH = ['text-cat-peach-light', 'dark:text-cat-peach-dark'];

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

function currentTheme() {
    return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
}

// Skill icons are separate light/dark image files rather than CSS, so they have
// to be swapped by hand whenever the theme changes.
function updateSkillIcons() {
    sectionBox('skills')
        .querySelectorAll('[data-id]')
        .forEach((button) => {
            const item = findItem('skills', Number(button.dataset.id));
            button.querySelector('img').src = iconUrl(item);
        });
}

// The single place the theme is applied. Note that the two highlight.js
// stylesheets are switched with `disabled` alone - index.html deliberately does
// not give them `media` attributes, or a light system theme would suppress the
// dark code colours even when the site is in dark mode.
function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    localStorage.theme = theme;
    document.getElementById('theme-light').disabled = dark;
    document.getElementById('theme-dark').disabled = !dark;
    updateSkillIcons();
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

// Everything that differs between sections lives here: where its box is in the
// DOM, where its data comes from, how one entry is labelled in a list, and how
// a selected entry fills the Main panel. Key order is visual order, which is
// what keyboard navigation walks.
const SECTIONS = {
    home: {
        selector: '.Home',
    },
    experience: {
        selector: '.Experience',
        dataUrl: './data/experience.json',
        label: (item) => `
            <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
            <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
            <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
        `,
        render: renderExperience,
    },
    projects: {
        selector: '.Projects',
        dataUrl: './data/projects.json',
        label: (item) => `
            <span class="text-cat-fg-light dark:text-cat-fg-dark">${item.title}</span>
        `,
        // The only section whose title is not peach in the sidebar, but is in
        // the mobile drawer.
        drawerLabel: (item) => `
            <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
        `,
        render: renderProject,
    },
    skills: {
        selector: '.Skills',
        dataUrl: './data/skills.json',
        label: (item) => `
            <img src="${iconUrl(item)}" alt="${item.name}" class="w-5 h-5" />
            <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.name}</span>
        `,
        render: renderSkill,
    },
};

const LIST_SECTIONS = ['experience', 'projects', 'skills'];

function sectionBox(name) {
    return document.querySelector(SECTIONS[name].selector).closest('.border');
}

function findItem(name, itemId) {
    return SECTIONS[name].items.find((item) => item.id === itemId);
}

function iconUrl(item) {
    return `./images/${item.icon[currentTheme()]}`;
}

async function loadSections() {
    await Promise.all(
        LIST_SECTIONS.map(async (name) => {
            const response = await fetch(SECTIONS[name].dataUrl);
            SECTIONS[name].items = (await response.json()).items;
        }),
    );
    LIST_SECTIONS.forEach(renderSidebar);
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

const ITEM_BUTTON_CLASS =
    'w-full text-left p-1 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2 hover-item truncate';

function renderSidebar(name) {
    const section = SECTIONS[name];
    const box = sectionBox(name);

    const list = box.querySelector('.space-y-1');
    list.innerHTML = '';
    section.items.forEach((item) => {
        const button = document.createElement('button');
        button.className = ITEM_BUTTON_CLASS;
        button.dataset.id = item.id;
        button.innerHTML = section.label(item);
        button.addEventListener('click', () => selectItem(name, item.id));
        list.appendChild(button);
    });

    // The "1 of 5" readout along the bottom border of the box.
    box.querySelector('.list-index p span:last-child').textContent =
        section.items.length;
}

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

let active = { section: 'home', itemId: null };

// The one entry point for navigation, whichever control triggered it.
function selectItem(name, itemId) {
    active = { section: name, itemId };
    highlightSection(name, itemId);
    updateMainContent(name, itemId);
}

// Exactly one section box is active at a time: peach border, peach title, and
// - for the list sections - a peach counter showing the item's position.
function highlightSection(name, itemId) {
    Object.keys(SECTIONS).forEach((other) => {
        const box = sectionBox(other);
        box.style.borderColor = '';
        box.querySelector('.absolute').classList.remove(...PEACH);
        box.querySelectorAll('[data-id]').forEach((el) =>
            el.classList.remove('selected'),
        );

        const counter = box.querySelector('.list-index p');
        if (counter) {
            counter.classList.remove(...PEACH);
            counter.querySelector('span').textContent = '1';
        }
    });

    const box = sectionBox(name);
    box.style.borderColor = 'var(--cat-peach-active)';
    box.querySelector('.absolute').classList.add(...PEACH);

    if (itemId === null) return;

    itemButton(name, itemId).classList.add('selected');
    const counter = box.querySelector('.list-index p');
    counter.classList.add(...PEACH);
    counter.querySelector('span').textContent =
        SECTIONS[name].items.findIndex((item) => item.id === itemId) + 1;
}

function itemButton(name, itemId) {
    return sectionBox(name).querySelector(`[data-id="${itemId}"]`);
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

function updateMainContent(name, itemId) {
    if (name === 'home') {
        main.innerHTML = renderHome();
        // The <pre> only exists once the markup above is in the document.
        fetch('./images/ascii.txt')
            .then((response) => response.text())
            .then((text) => {
                // A trailing newline would render as an extra blank row.
                document.getElementById('ascii-logo').textContent =
                    text.trimEnd();
            })
            .catch(console.error);
        return;
    }

    const item = findItem(name, itemId);
    main.innerHTML = SECTIONS[name].render(item);
    if (item.code_file) loadCodeExample(item.code_file);
}

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

function renderHome() {
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

    return `
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
}

function renderTagList(heading, values) {
    return `
        <div class="mb-4">
            <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">${heading}</div>
            <div class="flex flex-wrap gap-2">
                ${values
                    .map(
                        (value) =>
                            `<span class="px-2 py-1 bg-cat-fg-light/10 dark:bg-cat-fg-dark/10 rounded">${value}</span>`,
                    )
                    .join('')}
            </div>
        </div>
    `;
}

function renderHighlights(values) {
    return `
        <div class="mb-4">
            <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">Highlights:</div>
            <ul class="list-disc list-inside space-y-1">
                ${values.map((value) => `<li>${value}</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderExperience(item) {
    return `
        <div>
            <div class="flex items-center gap-2 mb-4">
                <span class="text-cat-peach-light dark:text-cat-peach-dark">${item.title}</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">@</span>
                <span class="text-cat-green-light dark:text-cat-green-dark">${item.company}</span>
            </div>
            <div class="text-cat-peach-light dark:text-cat-peach-dark mb-2">${item.period}</div>
            <p class="mb-4">${item.description}</p>
            ${renderHighlights(item.highlights)}
            ${renderTagList('Technologies:', item.technologies)}
        </div>
    `;
}

function renderProject(item) {
    const image = item.image
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
        : '';

    const demo = item.live
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
        : '';

    return `
        <div>
            <div class="text-cat-peach-light dark:text-cat-peach-dark text-xl mb-4">${item.title}</div>
            <p class="mb-8">${item.description}</p>
            ${image}
            ${demo}
            ${renderHighlights(item.highlights)}
            ${renderTagList('Technologies:', item.technologies)}
            <div class="flex gap-4">
                <a href="${item.github}" target="_blank" class="text-cat-green-light dark:text-cat-green-dark hover:underline">GitHub</a>
            </div>
        </div>
    `;
}

function renderSkill(item) {
    const codeExample = item.code_file
        ? `
        <div class="mt-6 code-example">
            <pre><code class="rounded-md" id="codeExample">Loading...</code></pre>
        </div>
    `
        : '';

    return `
        <div>
            <div class="flex items-center gap-2 mb-4">
                <img src="${iconUrl(item)}" alt="${item.name}" class="w-6 h-6" />
                <span class="text-cat-peach-light dark:text-cat-peach-dark text-xl">${item.name}</span>
            </div>
            <p class="mb-4">${item.description}</p>
            ${codeExample}
        </div>
    `;
}

// highlight.js picks the grammar off a `language-*` class. The file extension is
// the language name, except .tsx which hljs registers under typescript.
function loadCodeExample(path) {
    const code = document.getElementById('codeExample');
    const extension = path.split('.').pop();

    fetch(`./data/${path}`)
        .then((response) => response.text())
        .then((text) => {
            code.className = `language-${extension === 'tsx' ? 'typescript' : extension}`;
            code.textContent = text;
            hljs.highlightElement(code);
        })
        .catch(() => {
            code.textContent = 'Error loading code example';
        });
}

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

// Every navigable entry flattened into one list in visual order, so that moving
// past the last item of a section continues into the next one.
function navEntries() {
    return Object.keys(SECTIONS).flatMap((name) =>
        name === 'home'
            ? [{ section: 'home', itemId: null }]
            : (SECTIONS[name].items ?? []).map((item) => ({
                  section: name,
                  itemId: item.id,
              })),
    );
}

document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const step = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }[e.key];
    if (!step) return;

    // Stop the browser scrolling the page out from under the selection.
    e.preventDefault();

    const entries = navEntries();
    const current = entries.findIndex(
        (entry) =>
            entry.section === active.section && entry.itemId === active.itemId,
    );

    // Stop at the ends of the list.
    const next = entries[Math.max(current, 0) + step];
    if (!next) return;

    selectItem(next.section, next.itemId);
    if (next.section !== 'home') {
        itemButton(next.section, next.itemId).scrollIntoView({
            block: 'nearest',
        });
    }
});

// ---------------------------------------------------------------------------
// Mobile navigation
// ---------------------------------------------------------------------------

function setMobileNavActive(activeButton) {
    document.querySelectorAll('.mobile-nav-btn').forEach((button) => {
        const on = button === activeButton;
        button.classList.toggle('bg-cat-fg-light/10', on);
        button.classList.toggle('dark:bg-cat-fg-dark/10', on);
        button.querySelector('span:last-child').classList.toggle('underline', on);
    });
}

function closeDrawer() {
    mobileDrawer.classList.add('translate-y-full');
    setMobileNavActive(null);
}

function renderDrawer(name) {
    const section = SECTIONS[name];
    const label = section.drawerLabel ?? section.label;

    drawerContent.innerHTML = `
        <div class="space-y-2 font-mono">
            ${section.items
                .map(
                    (item) => `
                <button class="w-full text-left p-2 rounded hover:bg-cat-fg-light/10 dark:hover:bg-cat-fg-dark/10 transition-colors flex items-center gap-2 group mr-2" data-id="${item.id}">
                    ${label(item)}
                </button>`,
                )
                .join('')}
        </div>
    `;

    drawerContent.querySelectorAll('[data-id]').forEach((button) => {
        button.addEventListener('click', () => {
            selectItem(name, Number(button.dataset.id));
            closeDrawer();
        });
    });
}

document.querySelectorAll('.mobile-nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const name = button.dataset.section;
        setMobileNavActive(button);

        if (name === 'home') {
            selectItem('home', null);
            mobileDrawer.classList.add('translate-y-full');
            return;
        }

        drawerTitle.textContent = name;
        renderDrawer(name);
        mobileDrawer.classList.remove('translate-y-full');
    });
});

document.getElementById('drawerClose').addEventListener('click', closeDrawer);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

applyTheme(localStorage.theme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', () =>
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'),
);

document
    .querySelector(SECTIONS.home.selector)
    .addEventListener('click', () => selectItem('home', null));

selectItem('home', null);
loadSections();

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
