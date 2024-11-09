import { isReady } from '../../utils/CrestUtils';

export default class UnfilteredInputFactory {
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
            this.mUnfilteredSteeringMaxValue = 0;
            this.mUnfilteredSteeringMaxValueTimer = performance.now();

            this.mUnfilteredThrottleMaxValue = 0;
            this.mUnfilteredThrottleMaxValueTimer = performance.now();

            this.mUnfilteredBrakeMaxValue = 0;
            this.mUnfilteredBrakeMaxValueTimer = performance.now();

            this.mUnfilteredClutchMaxValue = 0;
            this.mUnfilteredClutchMaxValueTimer = performance.now();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async getData(data) {
        try {
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

        data.unfilteredInput.mUnfilteredSteeringState = await this.mUnfilteredSteeringState(data);

        data.unfilteredInput.mUnfilteredThrottleMax = await this.mUnfilteredThrottleMax(data);
        data.unfilteredInput.mUnfilteredThrottleState = await this.mUnfilteredThrottleState(data);

        data.unfilteredInput.mUnfilteredBrakeMax = await this.mUnfilteredBrakeMax(data);
        data.unfilteredInput.mUnfilteredBrakeState = await this.mUnfilteredBrakeState(data);

        data.unfilteredInput.mUnfilteredClutchMax = await this.mUnfilteredClutchMax(data);
        data.unfilteredInput.mUnfilteredClutchState = await this.mUnfilteredClutchState(data);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredSteeringState(data) {
        if (data.gameStates.mSessionState !== 5) {
            return 0;
        }

        // before lights out and steering is not near center
        if (data.timings.mCurrentTime < 0 && Math.abs(data.unfilteredInput.mUnfilteredSteering) > 0.1) {
            return 6;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredThrottleMax(data) {
        if (this.mUnfilteredThrottleMaxValueTimer + 5400 < performance.now()) {
            this.mUnfilteredThrottleMaxValue = 0;
        }

        if (data.unfilteredInput.mUnfilteredThrottle > this.mUnfilteredThrottleMaxValue) {
            this.mUnfilteredThrottleMaxValue = data.unfilteredInput.mUnfilteredThrottle;
            this.mUnfilteredThrottleMaxValueTimer = performance.now();
        }

        return this.mUnfilteredThrottleMaxValue;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredThrottleState(data) {
        if (Math.round(data.unfilteredInput.mUnfilteredThrottle * 100) >= 100) {
            return 1;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredBrakeMax(data) {
        if (this.mUnfilteredBrakeMaxValueTimer + 5400 < performance.now()) {
            this.mUnfilteredBrakeMaxValue = 0;
        }

        if (data.unfilteredInput.mUnfilteredBrake > this.mUnfilteredBrakeMaxValue) {
            this.mUnfilteredBrakeMaxValue = data.unfilteredInput.mUnfilteredBrake;
            this.mUnfilteredBrakeMaxValueTimer = performance.now();
        }

        return this.mUnfilteredBrakeMaxValue;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredBrakeState(data) {
        if (Math.round(data.unfilteredInput.mUnfilteredBrake * 100) >= 100) {
            return 1;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredClutchMax(data) {
        if (this.mUnfilteredClutchMaxValueTimer + 5400 < performance.now()) {
            this.mUnfilteredClutchMaxValue = 0;
        }

        if (data.unfilteredInput.mUnfilteredClutch > this.mUnfilteredClutchMaxValue) {
            this.mUnfilteredClutchMaxValue = data.unfilteredInput.mUnfilteredClutch;
            this.mUnfilteredClutchMaxValueTimer = performance.now();
        }

        return this.mUnfilteredClutchMaxValue;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mUnfilteredClutchState(data) {
        if (Math.round(data.unfilteredInput.mUnfilteredClutch * 100) >= 100) {
            return 1;
        }

        return 0;
    }
}