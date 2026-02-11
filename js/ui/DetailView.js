/**
 * Universal Detail View
 * Reusable full-screen detail view component for all layers
 */

export class DetailView {
    constructor() {
        this.container = null;
        this.currentData = null;
    }

    /**
     * Show detail view with data
     * @param {Object} data - View data
     * @param {string} data.title - Main title
     * @param {string} [data.subtitle] - Optional subtitle
     * @param {string} data.content - HTML content
     * @param {Function} [data.onClose] - Callback when closed
     */
    show(data) {
        this.currentData = data;
        this.ensureContainer();
        this.render();

        // Show with animation
        requestAnimationFrame(() => {
            this.container.classList.add('visible');
        });
    }

    /**
     * Hide detail view
     */
    hide() {
        if (this.container) {
            this.container.classList.remove('visible');

            if (this.currentData?.onClose) {
                this.currentData.onClose();
            }

            this.currentData = null;
        }
    }

    /**
     * Ensure container exists
     */
    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'detail-view';
            this.container.id = 'detail-view';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Render detail view content
     */
    render() {
        if (!this.currentData) return;

        const { title, subtitle, content } = this.currentData;

        this.container.innerHTML = `
            <div class="detail-header">
                <button class="detail-back" id="detail-back">
                    ← Назад
                </button>
                <h1 class="detail-title">${title}</h1>
                ${subtitle ? `<p class="detail-subtitle">${subtitle}</p>` : ''}
            </div>
            <div class="detail-content">
                ${content}
            </div>
        `;

        // Add back button handler
        const backBtn = this.container.querySelector('#detail-back');
        backBtn.addEventListener('click', () => this.hide());

        // Close on Escape key
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.handleEscapeKey) {
            document.removeEventListener('keydown', this.handleEscapeKey);
        }

        if (this.container) {
            this.container.remove();
            this.container = null;
        }

        this.currentData = null;
    }
}
