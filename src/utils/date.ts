export function timestampToDate(ts: number): Date{
    return new Date(ts);
}

export function displayDate(date:Date):string{
    return `${getRealDay(date)}-${getRealMonth(date)}-${date.getUTCFullYear()} at ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}


/**
 * Get the readable number (with 0) for months
 * @param date
 * @returns {string|number}
 */
function getRealMonth(date:Date)
{
    const month = date.getMonth() + 1;
    let result = month.toString();
    if(month < 10){
        result = '0' + month;
    }
    return result;
}

/**
 * Get the readable number (with 0) for days
 * @param date
 * @returns {string|number}
 */
function getRealDay(date:Date)
{
    const day = date.getDate();
    let result = day.toString();
    if(day < 10){
        result = '0' + day;
    }
    return result;
}
