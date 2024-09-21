export default class MagneticParentDirective {
    constructor(container, surface) {
        this.container = container;
        this.surface = surface;
        this.tickTime = performance.now();
        this.containerBounds = null;
        this.parentBounds = null;
        this.surfaceBounds = null;

        this.init();
    }

    async init() {
        try {
            await this.setParentDimensions();
            await this.registerBounds();
            await this.changeSurfaceType();
            await this.doTick();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    reset() {
        this.surface.parentNode.removeAttribute('style');
        this.surface.removeAttribute('style');

        this.init();
    }

    /**
     *
     */
    async setParentDimensions() {
        this.surface.parentNode.style.width = `${this.surface.parentNode.offsetWidth}px`;
        this.surface.parentNode.style.height = `${this.surface.parentNode.offsetHeight}px`;
    }

    /**
     *
     */
    async registerBounds() {
        this.containerBounds = this.container.getBoundingClientRect();
        this.parentBounds = this.surface.parentNode.getBoundingClientRect();
        this.surfaceBounds = this.surface.getBoundingClientRect();
    }

    /**
     *
     */
    async changeSurfaceType() {
        // apply size and position
        this.surface.style.width = `${this.surface.offsetWidth}px`;
        this.surface.style.height = `${this.surface.offsetHeight}px`;
        this.surface.style.top = `${this.surfaceBounds.y - this.containerBounds.y}px`;
        this.surface.style.left = `${this.surfaceBounds.x - this.containerBounds.x}px`;
        this.surface.style.position = 'absolute';
    }

    /**
     *
     */
    async doTick() {
        requestAnimationFrame(async () => {
            await this.doTick();

            // skip if not met 1 sec threshold
            if (this.tickTime + 1000 >= performance.now()) {
                return;
            }

            // update ticktime for next iteration comparison
            this.tickTime = performance.now();

            // do the job
            await this.attractToParent();
        })
    }

    /**
     *
     */
    async attractToParent() {
        const parentBounds = this.surface.parentNode.getBoundingClientRect();
        const xDiff = parentBounds.x - this.surfaceBounds.x;
        const yDiff = parentBounds.y - this.surfaceBounds.y;
        this.surface.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
    }
}
