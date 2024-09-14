/**
 * Covert milliseconds to readable time
 * @param {*} n The number in milliseconds
 * @param {*} r Are we rounding to nearest second?
 * @returns
 */
export function millisecondsToTime(n, r = false) {
    // convert to total milliseconds
    const totalmilliseconds = Math.abs(n) * 1000;

    // milliseconds
    let milliseconds = Math.round((totalmilliseconds % 1000));
    let millisecondsZeroFill = ``;
    if (milliseconds < 100) {
        millisecondsZeroFill = `0`;
    }
    if (milliseconds < 10) {
        millisecondsZeroFill = `00`;
    }

    // ensure milliseconds display is 3 digits long
    // let millisecondsDisplay = ('000' + milliseconds).slice(-3);

    // seconds
    let seconds = Math.floor((totalmilliseconds / 1000) % 60);
    let secondsZeroFill = (seconds < 10) ? `0` : ``;
    // let secondsDisplay = (seconds < 10) ? "0" + seconds : seconds;

    // minutes
    let minutes = Math.floor((totalmilliseconds / (1000 * 60)) % 60);
    let minutesZeroFill = (minutes < 10) ? `0` : ``;
    // let minutesDisplay = (minutes < 10) ? "0" + minutes : minutes;

    // hours
    let hours = Math.floor((totalmilliseconds / (1000 * 60 * 60)) % 24);
    let hoursZeroFill = (hours < 10) ? `0` : ``;
    // let hoursDisplay = (hours < 10) ? "0" + hours : hours;

    if (r) {
        if (hours === 0) {
            return `${minutesZeroFill}${minutes}:${secondsZeroFill}${seconds}`;
        }

        return `${hoursZeroFill}${hours}:${minutesZeroFill}${minutes}:${secondsZeroFill}${seconds}`;
    }

    // return time without hours
    if (hours === 0) {
        return `${minutesZeroFill}${minutes}:${secondsZeroFill}${seconds}.${millisecondsZeroFill}${milliseconds}`;
    }

    return `${hoursZeroFill}${hours}:${minutesZeroFill}${minutes}:${secondsZeroFill}${seconds}.${millisecondsZeroFill}${milliseconds}`;
}

