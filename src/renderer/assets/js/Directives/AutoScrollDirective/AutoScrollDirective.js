export default class AutoScrollDirective {
    constructor(surface) {
        this.surface = surface;
        this.delta = performance.now();

        this.init();
    }

    async init() {
        try {
            await this.run();
        } catch (error) {
            console.error(error);
        }
    }

    async run() {
        requestAnimationFrame(async () => {
            await this.run();

            if (this.delta <= performance.now() - 8000 ) {
                this.delta = performance.now();

                if (this.surface.scrollTop === 0) {
                    this.surface.scrollTo({
                        top: this.surface.scrollHeight - this.surface.offsetHeight,
                        behavior: 'smooth',
                    });
                }

                if (this.surface.scrollTop > 0) {
                    this.surface.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                }
            }
        })
    }
}
