export class WebFontService {
    constructor(fontlist) {
        if (typeof fontlist !== 'object' || fontlist === null) {
            return console.error('Not an array');
        }

        (async () => {
            const loadFonts = [];
            for (const fontName in fontlist) {
                if (Object.hasOwnProperty.call(fontlist, fontName)) {
                    const url = fontlist[fontName];
                    loadFonts.push(this.loadFont(fontName, url));
                }
            }
            const loadedFonts = await Promise.all(loadFonts);
        })();
    }

    loadFont(fontName, url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet preload';
            link.as = 'style';
            link.href = url;
            link.preload = true;
            link.addEventListener('load', () => {
                document.documentElement.classList.add(`font--${fontName}`);
                return resolve(link);
            });
            link.addEventListener('error', (error) => {
                return reject(error);
            });
            document.head.appendChild(link);
        });
    }
}
