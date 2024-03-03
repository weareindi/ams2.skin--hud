/**
 * 
 * @param {*} n 
 */
export function millisecondsToTime(n) {
    // convert to total milliseconds
    const totalmilliseconds = Math.abs(n) * 1000;

    // milliseconds
    let milliseconds = Math.round((totalmilliseconds % 1000));

    // ensure milliseconds display is 3 digits long
    let millisecondsDisplay = ('000' + milliseconds).slice(-3);    

    // seconds
    let seconds = Math.floor((totalmilliseconds / 1000) % 60);
    let secondsDisplay = (seconds < 10) ? "0" + seconds : seconds;

    // minutes
    let minutes = Math.floor((totalmilliseconds / (1000 * 60)) % 60);
    let minutesDisplay = (minutes < 10) ? "0" + minutes : minutes;

    // hours
    let hours = Math.floor((totalmilliseconds / (1000 * 60 * 60)) % 24);
    let hoursDisplay = (hours < 10) ? "0" + hours : hours;
    
    // return time without hours
    if (hours === 0) {
        return `${minutesDisplay}:${secondsDisplay}.${millisecondsDisplay}`;
    }

    // if we got here, we've got hours
    return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}.${millisecondsDisplay}`;
}

