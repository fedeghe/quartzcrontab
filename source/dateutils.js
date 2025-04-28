const C = require('./constants.js')

const {
    monthEnds,
    labels,
} = C

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

const getRangeSolver = ({
    labelTransformer = v => v,
    bounds,
    minMaxCadenceGetter,
    rx1, rx2
}) => {

    return v => {
        let vstr = `${v}`;
        if(vstr.startsWith('*')){
            vstr = vstr.replace('*', `${bounds.min}-${bounds.max}`);
        }
        vstr = labelTransformer(vstr)
        // one
        if (vstr.match(/^\d*$/)) {
            return [parseInt(vstr, 10)]
        }
        // commasep
        if (vstr.match(/^([\d,]+)\d$/)) {
            return vstr.split(/,/).map(val=>parseInt(val,10)).sort(
                ( a, b ) => a > b ? 1 : -1
            );
        }
        // startwithCadence
        const cadenceStart = vstr.match(rx1)
        if(cadenceStart){
            const {
                    min,
                    max,
                    cadence
                } = minMaxCadenceGetter(cadenceStart),
                ret = [];
            for(let i = min; i<=max; i+=cadence){
                ret.push(i);
            }
            return ret
        }
        // range
        const range = vstr.match(rx2)
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
}
const solve_0_59_Range = getRangeSolver({
        bounds: C.bounds.seconds,
        minMaxCadenceGetter: cs => ({
            min: parseInt(cs[1],10),
            max : C.bounds.seconds.max,
            cadence: parseInt(cs[5],10),
        }),
        rx1: C.rx.ranges.zero59cadence,
        rx2: C.rx.ranges.wildRangeCadence
    }),
    solve_hours_ranges = getRangeSolver({
        bounds: C.bounds.hour,
        minMaxCadenceGetter: cs => ({
            min: parseInt(cs[1],10),
            max: C.bounds.hour.max,
            cadence: parseInt(cs[4],10)
        }),
        rx1: C.rx.ranges.wildStartCadence,
        rx2: C.rx.ranges.wildRangeCadence
    }),
    solve_week_ranges = getRangeSolver({
        bounds: C.bounds.week,
        minMaxCadenceGetter: cs => ({
            min: parseInt(cs[1],10),
            max: C.bounds.week.max,
            cadence: parseInt(cs[4],10)
        }),
        labelTransformer: vstr => vstr.match(C.rx.next.hasWeekdays)
            ? labels.days.reduce(
                (acc, day, i) => acc.replace(day, i+1),
                vstr
            )
            : vstr,
        rx1: C.rx.ranges.one7cadence,
        rx2: C.rx.ranges.wildRangeCadence
    }),
    solve_month_ranges = getRangeSolver({
        bounds: C.bounds.month,
        minMaxCadenceGetter: cs => ({
            min: parseInt(cs[1],10),
            max: C.bounds.month.max,
            cadence: parseInt(cs[4],10)
        }),
        labelTransformer: vstr => vstr.match(C.rx.next.hasMonths)
            ? labels.months.reduce(
                (acc, day, i) => acc.replace(day, i+1),
                vstr
            )
            : vstr,
        rx1: C.rx.ranges.one12cadence,
        rx2: C.rx.ranges.wildRangeCadence
    }),
    solve_year_ranges = getRangeSolver({
        bounds: C.bounds.year,
        minMaxCadenceGetter: cs => ({
            min: parseInt(cs[1],10),
            max: C.bounds.year.max,
            cadence: parseInt(cs[4],10)
        }),
        rx1: C.rx.ranges.wildStartCadence,
        rx2: C.rx.ranges.wildRangeCadence
    });

/**
 solve_hours_ranges 
 solve_minutes_ranges < solve_0_59_Range
 solve_seconds_ranges < solve_0_59_Range
 */

//most likely not needed, TODO : double check
const solveNumericRange = v => {
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
    solveNumericRange,
    solve_0_59_Range,
    solve_year_ranges,
    solve_month_ranges,
    solve_week_ranges,
    solve_hours_ranges,
};