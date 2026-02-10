/**
 * Theme Toggle Component
 * Handles switching between dark and light themes
 */

export class ThemeToggle {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.button = null;
        this.init();
    }

    /**
     * Get initial theme from localStorage or system preference
     * @returns {string} 'dark' or 'light'
     */
    getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        // Default to dark
        return 'dark';
    }

    /**
     * Initialize theme toggle
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.listenToSystemChanges();
    }

    /**
     * Create toggle button and add to DOM
     */
    createToggleButton() {
        this.button = document.createElement('button');
        this.button.className = 'theme-toggle';
        this.button.setAttribute('aria-label', 'Toggle theme');
        this.button.title = this.currentTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему';

        this.updateButtonIcon();

        this.button.addEventListener('click', () => this.toggle());

        document.body.appendChild(this.button);
    }

    /**
     * Update button icon based on current theme
     */
    updateButtonIcon() {
        if (!this.button) return;

        // Dark theme shows sun (to switch to light)
        // Light theme shows moon (to switch to dark)
        this.button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        this.button.title = this.currentTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему';
    }

    /**
     * Toggle between themes
     */
    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateButtonIcon();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: this.currentTheme }
        }));
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'dark' or 'light'
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    /**
     * Save theme to localStorage
     */
    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    /**
     * Listen to system theme changes
     */
    listenToSystemChanges() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.updateButtonIcon();
            }
        });
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('dark' or 'light')
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Set theme programmatically
     * @param {string} theme - 'dark' or 'light'
     */
    setTheme(theme) {
        if (theme !== 'dark' && theme !== 'light') {
            console.warn(`Invalid theme: ${theme}. Use 'dark' or 'light'.`);
            return;
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme();
        this.updateButtonIcon();
    }
}
