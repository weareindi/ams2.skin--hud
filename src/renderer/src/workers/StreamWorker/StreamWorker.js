class StreamWorker {
    constructor() {
        this.StreamWorker = self;
        this.init();

    }

    /**
     * Let't get this party started
     */
    async init() {
        try {
            await this.registerListener();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listener for messages from main thread
     */
    async registerListener() {
        return this.StreamWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }
        };
    }
}

new StreamWorker;
