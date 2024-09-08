import { isReady } from '../../utils/CrestUtils';

export default class WeatherFactory {
    constructor() {
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

            this.mRainDensity = null;
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
            // console.log(this.db);
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

        data.weather.mRain = await this.mRain(data);
        data.weather.mTrackTemperature = await this.mTrackTemperature(data);
        data.weather.mAmbientTemperature = await this.mAmbientTemperature(data);
        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mRain(data) {
        let mRain = null;

        // get initial mRainDensity to nearest 0.2
        if (this.mRainDensity === null) {
            mRain = null;
        }

        // switching between dry/moist
        if (data.weather.mRainDensity === 0) {
            mRain = 'Dry';
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity < this.mRainDensity) {
            mRain = 'Improving To Dry';
        }

        if (data.weather.mRainDensity > 0 && data.weather.mRainDensity < 0.2 && data.weather.mRainDensity >= this.mRainDensity) {
            mRain = 'Worsening To Moist';
        }

        // switching between moist/damp
        if (data.weather.mRainDensity === 0.2) {
            mRain = 'Moist';
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity < this.mRainDensity) {
            mRain = 'Improving To Moist';
        }

        if (data.weather.mRainDensity > 0.2 && data.weather.mRainDensity < 0.4 && data.weather.mRainDensity >= this.mRainDensity) {
            mRain = 'Worsening To Damp';
        }

        // switching between damp/wet
        if (data.weather.mRainDensity === 0.4) {
            mRain = 'Damp';
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity < this.mRainDensity) {
            mRain = 'Improving To Damp';
        }

        if (data.weather.mRainDensity > 0.4 && data.weather.mRainDensity < 0.6 && data.weather.mRainDensity >= this.mRainDensity) {
            mRain = 'Worsening To Wet';
        }

        // switching between wet/soaked
        if (data.weather.mRainDensity === 0.6) {
            mRain = 'Wet';
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity < this.mRainDensity) {
            mRain = 'Improving To Wet';
        }

        if (data.weather.mRainDensity > 0.6 && data.weather.mRainDensity < 0.8 && data.weather.mRainDensity >= this.mRainDensity) {
            mRain = 'Worsening To Soaked';
        }

        // soaked
        if (data.weather.mRainDensity >= 0.8) {
            mRain = 'Soaked';
        }

        // update stored var for change comparison
        this.mRainDensity = data.weather.mRainDensity;

        return mRain;
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

