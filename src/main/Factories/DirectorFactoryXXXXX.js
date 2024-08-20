import { getActiveParticipant, getParticipantInPostion, getParticipantsSortedByPosition, isReady } from '../../utils/CrestUtils';
import { random, weightedArray } from '../../utils/DataUtils';
import { globalShortcut } from 'electron/main';

export default class DirectorFactory {
    constructor() {
        this.view = null;

        this.init();
    }

    /**
     * 
     */
    async init() {
        try {
            await this.reset();
            await this.registerBinds();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async reset() {
        try {
            
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async registerBinds() {
        globalShortcut.register('ctrl+Num0', () => {
            console.log('auto mode');
            this.view = 'auto';
        });

        globalShortcut.register('ctrl+Num1', () => {
            console.log('blank mode');
            this.view = 'blank';
        });

        globalShortcut.register('ctrl+Num2', () => {
            console.log('solo mode');
            this.view = 'ausoloto';
        });

        globalShortcut.register('ctrl+Num3', () => {
            console.log('leaderboard mode');
            this.view = 'leaderboard';
        });

        globalShortcut.register('ctrl+Num4', () => {
            console.log('standings mode');
            this.view = 'standings';
        });

        globalShortcut.register('ctrl+Num5', () => {
            console.log('battle mode');
            this.view = 'battle';
        });
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getData(data) {
        try {
            // console.log(this.db);
            return await this.prepareData(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async prepareData(data) {        
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        data.director = this.view;

        return data;
    }
}