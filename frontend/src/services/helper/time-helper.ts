import { number } from "prop-types";

export function dateDiffFriendlyStrings(ds1: string, ds2: string): string | null {
    let d1 = stringToDate(ds1);
    let d2 = stringToDate(ds2);
    if (!d1 || !d2) {
        return null;
    }
    return dateDiffFriendly(d1, d2);
}

export function dateDiffFriendlyFromPresent(d: Date): string {
    var ukTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
    return dateDiffFriendly(d, new Date(ukTime));
}

export function dateDiffFriendlyFromPresentString(ds: string): string | null {
    let d = stringToDate(ds);
    if (!d) {
        return null;
    }
    return dateDiffFriendlyFromPresent(d);
}

export function dateDiffFriendly(d1: Date, d2: Date): string {
    // get total seconds between the times
    const date1 = d1.getTime();
    const date2 = d2.getTime();

    var delta = Math.abs(date1 - date2) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required

    var result: string[] = [];

    if (days > 0) {
        result.push(days + " day" + plural(days));
    }
    if (hours > 0) {
        result.push(hours + " hour" + plural(hours));
    }
    if (minutes > 0) {
        result.push(minutes + " minute" + plural(minutes));
    }
    if (seconds > 0) {
        result.push(seconds + " second" + plural(seconds));
    }

    if (result.length > 2) {
        result = [result[0], result[1]];
    }

    const resultStr = result.join(", ");
    if (resultStr.length === 0) {
        return "0 seconds";
    }
    return resultStr;
}

export function stringToDate(apiDate: string): Date | null { // FORMAT: yyyy-MM-ddTHH:mm:ss
    let dateTimeParts = apiDate.split("T");
    if (dateTimeParts.length !== 2) {
        return null;
    }
    let dateParts = dateTimeParts[0].split("-");
    let timeParts = dateTimeParts[1].split(":");
    if (dateParts.length !== 3 || timeParts.length !== 3) {
        return null;
    }
    let year = Number(dateParts[0]);
    let month = Number(dateParts[1]);
    let day = Number(dateParts[2]);
    let hour = Number(timeParts[0]);
    let minute = Number(timeParts[1]);
    let second = Number(timeParts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
        return null;
    }

    return new Date(year, month - 1, day, hour, minute, second);
}

function plural(n: number): string {
    return n === 1 ? "" : "s";
}