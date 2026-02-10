/**
 * Pain Detail View
 * Full-screen view for displaying detailed pain point information
 */

export class PainDetailView {
    constructor() {
        this.container = null;
        this.currentPoint = null;
        this.isVisible = false;
    }

    /**
     * Show detail view for a pain point
     * @param {Object} pointData - Pain point data
     */
    show(pointData) {
        this.currentPoint = pointData;
        this.isVisible = true;

        // Create container if needed
        this.ensureContainer();

        // Render content
        this.renderContent(pointData);

        // Show with animation
        requestAnimationFrame(() => {
            this.container.classList.add('visible');
        });

        console.log(`📄 Showing detail view: ${pointData.title}`);
    }

    /**
     * Ensure container exists
     */
    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'pain-detail-view';
            this.container.id = 'pain-detail-view';

            document.body.appendChild(this.container);
        }
    }

    /**
     * Render content
     * @param {Object} pointData - Pain point data
     */
    renderContent(pointData) {
        this.container.innerHTML = `
            <div class="pain-detail-header">
                <button class="pain-detail-back" id="pain-detail-back">
                    ← Назад
                </button>
                <h1 class="pain-detail-title">${pointData.title}</h1>
            </div>

            <div class="pain-detail-content">
                ${pointData.content}
            </div>
        `;

        // Add back button handler
        const backBtn = this.container.querySelector('#pain-detail-back');
        backBtn.addEventListener('click', () => this.hide());

        // Close on Escape key
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    /**
     * Hide detail view
     */
    hide() {
        if (!this.isVisible) return;

        this.container.classList.remove('visible');

        // Wait for animation to complete
        setTimeout(() => {
            this.isVisible = false;
            this.currentPoint = null;

            // Remove escape key listener
            if (this.handleEscapeKey) {
                document.removeEventListener('keydown', this.handleEscapeKey);
                this.handleEscapeKey = null;
            }
        }, 300); // Match CSS transition duration

        console.log('📄 Hiding detail view');
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

        this.currentPoint = null;
        this.isVisible = false;
    }
}
