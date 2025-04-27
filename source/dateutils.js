const monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];

/**
 * Check if a input year is leap of not
 * @param {number} y - integer year to be checked
 * @returns {Boolean} 
 */
const isLeap = y => !(y % 4) && (!!(y % 100) || !(y % 400));

/**
 * 
 * @param {Number} y 
 * @param {Number} m 
 * @param {*} wd 
 * @returns 
 */
const lastMonthDay = (y, m, wd) => {
    let ret, day;
    if(m === 1){
        ret = isLeap(y) ? 29 : monthEnds[m];
    } else {
        ret = monthEnds[m];
    }
    if (wd) {
        const da = new Date();
        da.setFullYear(y);
        da.setMonth(m);
        da.setDate(ret);
        day = da.getDay();
        
        /* istanbul ignore else */
        if (day==6){return ret-1;}// sat ? 
        
        /* istanbul ignore else */
        if (day==0){return ret-2;}// sun ? 
    }
    return ret;
};
const nDaysBeforeEndOfMonth = (n, y, m) => {
    const end = lastMonthDay(y, m),
        pot = end - n;
    if (pot < 1) throw new Error('not enough days');
    return pot;
};
const nDayOfMonth = (n, wd, y, m) => {
    if(wd<0 || wd>6) throw new Error('given weekday does not exist [0-6]');
    if(n<0 || n>5) throw new Error('not enough days in any month');
    const end = lastMonthDay(y, m),
        da = new Date();
    da.setFullYear(y);
    da.setMonth(m);
    da.setDate(1);
    const first = da.getDay(),// 0-6
        distance = (first-1+7)%7,
        firstTarget = (wd + 7 - distance) % 7,
        nthTarget = (n-1)*7 + firstTarget;
    if(nthTarget > end) throw new Error('not enough days in this month');
    return nthTarget; 
    
};
const solveRange = v => {
    // one
    if (`${v}`.match(/^\d*$/)) {
        return [parseInt(v, 10)]
    }
    // commasep
    if (`${v}`.match(/^([\d,]+)\d$/)) {
        return v.split(/,/).map(v=>parseInt(v,10)).sort(
            ( a, b ) => a > b ? 1 : -1
        );
    }
    // range
    const range = `${v}`.match(/^([\d,]+)-([\d,]+)(\/(\d*))?$/)
    if (range) {
        
        const min = parseInt(range[1],10),
            max = parseInt(range[2],10),
            cadence = parseInt(range[4],10);
        let ret = [];
        if(cadence){
            for(let i = min; i<=max; i+=cadence){
                ret.push(i);
            }
        } else {
            ret = Array.from({length: max-min+1}, (_, i) => i+min);
        }
        return ret
    }
    return null
}
module.exports = {
    isLeap,
    lastMonthDay,
    nDaysBeforeEndOfMonth,
    nDayOfMonth,
    solveRange
};