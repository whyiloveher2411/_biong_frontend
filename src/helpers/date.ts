import moment from "moment";
import { __ } from "./i18n";

export function dateFormat(date: string | Date, format = 'LL'): string {

    return moment(date).format(format);

    // if (date instanceof Date) {
    //     return date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2));
    // }
    // return date;
}


function parseDays(value: number) {

    let year: number, months: number, week: number;
    //  days: number;

    year = value >= 365 ? Math.floor(value / 365) : 0;
    value = year ? value - (year * 365) : value;

    months = value >= 30 ? Math.floor((value % 365) / 30) : 0;
    value = months ? value - (months * 30) : value;

    week = value >= 7 ? Math.floor((value % 365) / 7) : 0;
    value = week ? value - (week * 7) : value;

    // days = value < 7 ? Math.floor((value % 365) % 7) : 0;

    let result: string[] = [];

    if (year) {
        result.push(year + ' ' + (year > 1 ? __('years') : __('year')));
    }

    if (months) {
        result.push(months + ' ' + (months > 1 ? __('months') : __('month')));
    }

    return result.join(' · ');
}

export function dateDiff(startDate: string, endDate: string = (new Date()).toString()) {
    let days = moment(endDate).diff(startDate, 'days');

    return parseDays(days);
}

export function dateTimeFormat(date: string | Date): string {
    // if (date instanceof Date) {

    return moment(date).format('YYYY-MM-DD HH:mm:ss');
    // return date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2)) + ' ' + (('0' + date.getHours()).slice(-2)) + ':' + (('0' + date.getMinutes()).slice(-2)) + ':' + (('0' + date.getSeconds()).slice(-2));
    // }
    // return date;
}

export function dateTimefromNow(date: string | Date): string {
    return moment(date).fromNow();
}

export function compareDate<T extends Date | string>(dateStart: T, dateEnd: T): boolean {

    if (dateStart instanceof String && dateEnd instanceof String) {
        return dateStart === dateEnd;
    }

    if (dateStart instanceof Date && dateEnd instanceof Date) {
        return dateStart.getTime() === dateEnd.getTime()
    }

    return true;
}

export function convertHMS(value: number | string, isText = false, showMinute = true, showSeconds = true, separator = ', '  ): string | null {
    const sec = parseInt(value + '', 10); // convert value to number if it's string
    if (sec) {
        let hours: number | string = Math.floor(sec / 3600); // get hours
        let minutes: number | string = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds: number | string = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02

        if (isText) {

            const hourTxt = hours > 1 ? __('giờ') : __('giờ');
            const minuteTxt = minutes > 1 ? __('phút') : __('phút');
            const secondsTxt = seconds > 1 ? __('giây') : __('giây');

            const arrayTime: string[] = [];

            if (hours !== 0) arrayTime.push(hours + ' ' + hourTxt);
            if (showMinute && minutes !== 0) arrayTime.push(minutes + ' ' + minuteTxt);
            if (showSeconds && seconds !== 0) arrayTime.push(seconds + ' ' + secondsTxt);

            if( arrayTime.length > 0 ){
                return arrayTime.join(separator);
            }

            return null;
        }

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds; // Return is HH : MM : SS
    }

    return null;
}