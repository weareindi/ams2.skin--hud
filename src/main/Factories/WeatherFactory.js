import { isReady } from '../../utils/CrestUtils';
import { throttle, debounce } from 'throttle-debounce';

export default class WeatherFactory {
    constructor() {
        this.mRainDensityLabelTimer = performance.now();
        this.mRainDensityStateLevelTimer = performance.now();
        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.reset();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async reset() {
        try {
            // console.log('WeatherFactory reset');
            this.mRainDensityLabelLevel = null;
            this.mRainDensityStateLevel = null;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async getData(data, mParticipantIndex) {
        try {
            return await this.prepareData(data, mParticipantIndex);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async prepareData(data, mParticipantIndex) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        data.weather.mRainDensityLabel = await this.mRainDensityLabel(data);
        data.weather.mRainState = await this.mRainState(data);
        data.weather.mTrackTemperature = await this.mTrackTemperature(data);
        data.weather.mAmbientTemperature = await this.mAmbientTemperature(data);
        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mRainDensityLabel(data) {
        let label = null;

        // if global density is reset, reset local var too
        if (this.mRainDensityLabelLevel === null) {
            label = null;
        }

        // dry
        if (data.weather.mRainDensity === 0) {
            label = 'Clear';
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity < this.mRainDensityLabelLevel) {
            label = 'Starting to clear';
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity >= this.mRainDensityLabelLevel) {
            label = 'Starting to light rain';
        }

        // moist
        if (data.weather.mRainDensity === 0.2) {
            label = 'Light rain';
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity < this.mRainDensityLabelLevel) {
            label = 'Improving to light rain';
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity >= this.mRainDensityLabelLevel) {
            label = 'Worsening to rain';
        }

        // damp
        if (data.weather.mRainDensity === 0.4) {
            label = 'Rain';
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity < this.mRainDensityLabelLevel) {
            label = 'Improving to rain';
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity >= this.mRainDensityLabelLevel) {
            label = 'Worsening to storm';
        }

        // storm
        if (data.weather.mRainDensity === 0.6) {
            label = 'Storm';
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity < this.mRainDensityLabelLevel) {
            label = 'Improving to storm';
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity >= this.mRainDensityLabelLevel) {
            label = 'Worsening to thunderstorm';
        }

        // thunderstorm
        if (data.weather.mRainDensity >= 0.8) {
            label = 'Thunderstorm';
        }


        // update stored var for change every second
        // this prevents an issue where the denisty hasnt dropped enough and causes a flickering of states
        if (this.mRainDensityLabelTimer + 2700 < performance.now()) {
            // update timer
            this.mRainDensityLabelTimer = performance.now();

            // update global
            this.mRainDensityLabelLevel = data.weather.mRainDensity;
        }

        return label;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mRainState(data) {
        let state = 0;

        // 0: clear
        // 1: green
        // 2: green/flash
        // 3: yellow
        // 4: yellow/flash
        // 5: red
        // 6: red/flash

        // if global density is reset, reset local var too
        if (this.mRainDensityStateLevel === null) {
            state = 0;
        }

        // clear
        if (data.weather.mRainDensity === 0) {
            state = 0;
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity < this.mRainDensityStateLevel) {
            state = 2;
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity >= this.mRainDensityStateLevel) {
            state = 4;
        }

        // light rain
        if (data.weather.mRainDensity === 0.2) {
            state = 3;
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity < this.mRainDensityStateLevel) {
            state = 4;
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity >= this.mRainDensityStateLevel) {
            state = 4;
        }

        // rain
        if (data.weather.mRainDensity === 0.4) {
            state = 3;
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity < this.mRainDensityStateLevel) {
            state = 6;
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity >= this.mRainDensityStateLevel) {
            state = 6;
        }

        // storm
        if (data.weather.mRainDensity === 0.6) {
            state = 5;
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity < this.mRainDensityStateLevel) {
            state = 6;
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity >= this.mRainDensityStateLevel) {
            state = 6;
        }

        // thunderstorm
        if (data.weather.mRainDensity >= 0.8) {
            state = 5;
        }


        // update stored var for change every second
        // this prevents an issue where the denisty hasnt dropped enough and causes a flickering of states
        if (this.mRainDensityStateLevelTimer + 2700 < performance.now()) {
            // update timer
            this.mRainDensityStateLevelTimer = performance.now();

            // update global
            this.mRainDensityStateLevel = data.weather.mRainDensity;
        }

        return state;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTrackTemperature(data) {
        return Math.round(data.weather.mTrackTemperature);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAmbientTemperature(data) {
        return Math.round(data.weather.mAmbientTemperature);
    }
}

