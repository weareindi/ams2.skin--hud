import { ref, watch } from 'vue';

export default class SvgCollection {
    install(app) {
        this.app = app;
        this.init();
    }

    /**
     * Let's get it on
     */
    async init() {
        try {
            await this.registerRefs();
            await this.populateItems();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async registerRefs() {
        this.app.provide('svgcollection', ref(null));
        return;
    }

    /**
     * 
     * @returns 
     */
    async populateItems() {
        // prepare items object
        const items = [];
        
        // get files in svg directory
        const files = import.meta.glob('@renderer/assets/svg/**.svg', {
            query: '?raw',
            import: 'default',
        });

        // loop through found files
        for (const path in files) {
            const file = await files[path]();

            // get basename
            const basename = path.split('/').pop();
            
            // get filename
            const filename = basename.replace('.svg', '');
            
            // split filename into parts
            const filename_parts = filename.split('--');

            // not enough filename_parts
            if (filename_parts <= 1) {
                continue;
            }

            // set default dimensions
            let dimensions = [0, 0];

            // if two part array, assume dimensions at index 1
            if (filename_parts.length === 2) {
                // get dimensions
                dimensions = filename_parts[1].split('x');
            }

            // if three part array, assume dimensions at index 2
            if (filename_parts.length === 3) {
                // get dimensions
                dimensions = filename_parts[2].split('x');
            }

            // create id
            let id = filename_parts[0];
            if (filename_parts.length === 3) {
                id += `--${filename_parts[1]}`;
            }

            // calculate dynamic values
            items.push({
                id: id,
                path: path,
                basename: basename,
                filename: filename,
                width: dimensions[0],
                height: dimensions[1],
                offsetX: `-${100 / dimensions[0]}%`,
                offsetY: `-${100 / dimensions[1]}%`,
                impheight: `${(dimensions[1] / dimensions[0]) * 100}%`,
                file: file
            });
        }

        return this.app._context.provides.svgcollection.value = items;
    }
}
