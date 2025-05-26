/*
quartzcron (v.0.1.0)
*/
const {
        monthEnds,
        labels,
        rx,
        errors,
        bounds
    } = require('./constants.js'),
    {daysLabels2Numbers} = require('./utils.js');



/**
 * Check if a input year is leap of not
 */
const isLeap = y => !(y % 4) && (!!(y % 100) || !(y % 400));

/**
 * given year and month returns the length of that month
 * if wd is passed then it returns the date of the last weekday (mon-fri)
 */
const lastMonthDay = (y, m, wd) => {
    let ret, day;
    if(m === 1){
        ret = isLeap(y) ? 29 : monthEnds[m];
    } else {
        ret = monthEnds[m];
    }
    if (wd) {
        const da = new Date(Date.UTC(y,m,ret,0,0));
        day = da.getUTCDay();
        
        /* istanbul ignore else */
        if (day==6){return ret-1;}// sat ? 
        
        /* istanbul ignore else */
        if (day==0){return ret-2;}// sun ? 
    }
    return ret;
};

/**
 * returns the date of the n-th day before the end of the month
 */
const nDaysBeforeEndOfMonth = (n, y, m) => {
    const end = lastMonthDay(y, m),
        pot = end - n;
    if (pot < 1) throw new Error(errors.notEnoughDays);
    return pot;
};

/**
 * returns the n-th weekday present in that month of that year 
 */
const nDayOfMonth = (n, wd, y, m) => {
    if (wd < 0 || wd > 6) throw new Error(errors.nonWeekday);
    if (n < 0 || n > 5) throw new Error(errors.monthsOutOfBounds);
    const end = lastMonthDay(y, m),
        da = new Date(Date.UTC(y,m,1,0,0)),
        first = da.getUTCDay(),// 0-6
        distance = (first-1+7)%7,
        firstTarget = (wd + 7 - distance) % 7,
        nthTarget = (n-1)*7 + firstTarget;
    if (nthTarget > end) throw new Error(errors.monthOutOfBounds);
    return nthTarget;     
};

const getRangeSolver = ({
    labelTransformer = v => v,
    bounds,
    rx
}) => v => {

    let vstr = `${v}`, spl, mat;
    if(v ==='?') return null;
    if(vstr.startsWith('*')){
        vstr = vstr.replace('*', `${bounds.min}-${bounds.max}`);
    }
    vstr = labelTransformer(vstr);
    // one
    if (vstr.match(/^\d*$/)) {
        return [parseInt(vstr, 10)];
    }

    // commasep mixed
    spl = vstr.split(/,/);
    mat = spl.map(s => s.match(/^((\d*)|(\d*)\/(\d*))$/)).filter(Boolean);
    if(spl.length === mat.length) {

        return mat.reduce((acc, r) => {
            let p = parseInt(r[2], 10);
            if(r[2]) {
                /* istanbul ignore else */
                if (p <= bounds.max)acc.push(p);
            } else {
                let cursor = parseInt(r[3], 10);
                const every = parseInt(r[4], 10);
                while(cursor <= bounds.max){
                    acc.push(cursor);
                    cursor += every;
                }
            }
            return acc;
        }, []).sort(( a, b ) => a > b ? 1 : -1);
        
    }   
    // range
    const range = vstr.match(rx);
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
            // eslint-disable-next-line no-unused-vars
            ret = Array.from({length: max-min+1}, (_, i) => i+min);
        }
        return ret;
    }
    return null;
};



const getSpecialSolver = solvers => (y, m, val) => {
    const d = new Date(Date.UTC(y, m-1, 1, 0, 0)),
        lastDate = lastMonthDay(y, m-1),
        // eslint-disable-next-line no-unused-vars
        allDays = Array.from({length: lastDate}, (_,i) => i+1);
    for(var i = 0, l = solvers.length, r; i < l; i++){
        r = solvers[i]({y, m, val, d, allDays, lastDate});
        if(r.length) return r;
    }
    return [];
};
/* DOM
*
?
[1-31]/[1-31]
[1-31]-[1-31]
[1-31]-[1-31]/[1-31]
L
LW
L-[1-31]
[1-31]W
*/
const dom_solvers = [
    // *
    ({val, allDays}) =>
        val.match(/^(\*)$/)
        ? allDays
        : [],

    // [1-31] / [1-31]
    ({val, lastDate}) => {
        const mat = val.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)\/(([1-9]|1[0-9]|2[0-9]|3[01]|\*))$/);
        let res = [];
        
        if (mat) {
            let start = parseInt(mat[1], 10),
                step = parseInt(mat[2], 10);
            while(start <= lastDate){
                res.push(start);
                start += step;
            }
        }
        return res;
    },

    // [1-31] - [1-31]
    ({val, lastDate}) => {
        const mat = val.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)\-(([1-9]|1[0-9]|2[0-9]|3[01]|\*))$/);
        let res = [];
        
        if (mat) {
            let start = parseInt(mat[1], 10),
                end = parseInt(mat[2], 10);
            while(start <= end && start<=lastDate){
                res.push(start);
                start += 1;
            }
        }
        return res;
    },
    // [1-31]
    ({val, lastDate}) => {
        const mat = val.match(/^([1-9]|1[0-9]|2[0-9]|3[01])$/);
        if (mat) {
            var ret =  parseInt(mat[1], 10);
            if(ret <= lastDate) return [ret];
        }
        return [];
    },

    // [1-31] , ... , [1-31]/[1-31]
    ({val, lastDate}) => {
        // let vals = val.split(/,/);
        // if(
        //     vals.every(v=>{
        //         return v.match(/^([1-9]|1[0-9]|2[0-9]|3[01])$/);
        //     })
        // ) return vals.filter(v => v <=lastDate).map(v => parseInt(v,10));
        // else return [];

        const spl = val.split(/,/),
            mat = spl.map(s => s.match(/^(([1-9]|1[0-9]|2[0-9]|3[01])|([1-9]|1[0-9]|2[0-9]|3[01])\/([1-9]|1[0-9]|2[0-9]|3[01]))$/)).filter(Boolean);
        if(spl.length === mat.length) {
            return mat.reduce((acc, r) => {
                let v2 = parseInt(r[2], 10);
                if(typeof r[2] !== 'undefined') {
                    if(v2 <= lastDate) acc.push(v2);
                } else {
                    let cursor = parseInt(r[3], 10);
                    const every = parseInt(r[4], 10);
                    while(cursor <= lastDate){
                        acc.push(cursor);
                        cursor += every;
                    }
                }
                return acc;
            }, []).sort(( a, b ) => a > b ? 1 : -1);
        }
        return [];
    },

    // [1-31] - [1-31] / [1-31]
    ({val, lastDate}) => {
        const vals = val.match(rx.ranged['md-md/md']),
            res = [];
        if(vals){
            const add = Math.min(parseInt(vals[3],10), lastDate);
            let tmp = Math.min(parseInt(vals[1],10),lastDate),
                lim = Math.min(parseInt(vals[2],10), lastDate);
            while(tmp <= lim) {
                res.push(tmp);
                tmp+=add;
            }
        }
        return res;
    },

    // L
    ({val, lastDate}) => val.match(rx.dumb.L) ? [lastDate]: [],

    // LW
    ({val, lastDate, d}) => {
        if(val.match(rx.dumb.LW)){
            d.setUTCDate(lastDate);
            let res = d.getUTCDay(),
                min = 0;
            while(`${(res - min + 7)%7 }`.match(rx.dumb['0OR6'])){
                min++;
            }
            return [lastDate-min];
        }
        return [];
    },
    //nW
    // [1-31]W
    // /^([1-9]|1[0-9]|2[0-9]|3[01])W$/
    ({val, lastDate, d}) => {
        let mat = val.match(rx.ranged.mdW);
        if(mat){
            let v = parseInt(mat[1], 10),
                res;
            d.setUTCDate(v);
            res = d.getUTCDay(); // [0-6]
            if (v===1) {
                // if sat or sun return next mon
                if(res === 6) return [3];
                if(res === 0) return [2];
                return [1];
            }
            //same on the other side
            if (v===lastDate) {
                if(res === 6) return [lastDate-1];
                if(res === 0) return [lastDate-2];
                return [lastDate];
            }
            if(res === 0)return [v+1];
            if(res === 6)return [v-1];
            return [v];
        }
        return [];
    },
    
    // L-[1-31]
    ({val, lastDate}) => {
        const vals = val.match(rx.ranged['L-md']);
        if(vals){
            const last = lastDate-parseInt(vals[1]);
            return last> 0 ? [last] : [];
        }
        return [];
    },
];
const solve_dom = getSpecialSolver(dom_solvers);

/* DOW
*
?
[1-7|*]/[1-7]
[1-7] OR [SUN-SAt]
1,2,4 OR SUN,MON,WED
1-7 OR SUN-SAT
2-6/2 OR MON-FRI/2
aL
wd#n
*/
const dow_solvers = [
    // *
    ({val, allDays}) =>
        // val.match(/^(\*)$/)
        val.match(rx.dumb.astrx)
        ? allDays
        : [],

    // [1-7]|* / [1-7]
    // a/b : every b days starting on first a
    // here *  is like sunday (1) 
    
    ({val, d, lastDate}) => {
        // const mat = val.match(/^([1-7]|\*)\/([1-7])$/);
        const mat = val.match(rx.ranged['wdOR*/wd']);
        let res = [];
        
        if (mat) {
            
            const fromFirstWd = mat[1]==='*' ? 1 : parseInt(mat[1], 10),
                step = parseInt(mat[2]);
            // now find first day wd
            let firstDayWd = d.getUTCDay() + 1,// [0-6] -> [1,7] 
                toAddDate = 1;
            while(firstDayWd !== fromFirstWd){
                firstDayWd = 1 + firstDayWd%7;
                toAddDate++;
            }
            while(toAddDate <= lastDate){
                res.push(toAddDate);
                toAddDate+=step;
            }
        }
        return res;
    },
    
    // one or more [1-7] OR [SUN-SAT] comma separated
    ({val, d, lastDate}) => {
        let vals = daysLabels2Numbers(val).split(rx.dumb.comma);
        const firstDayWd = d.getUTCDay()+1,// [0-6] -> [1-7]
            res = [],
            max = 7;

        let mat = vals.map(
            s => s.match(rx.ranged['wdORwd/wd'])
        ).filter(Boolean);

        // collect all weekdays, counting explicit ones
        // together with those coming from cadence
        // MON/2 => 2,4,6
        // TUE => 3
        if(mat.length === vals.length){    
            vals =  mat.reduce((acc, r) => {
                let v2 = parseInt(r[2], 10);
                if(typeof r[2] !== 'undefined') {
                    //not needed ..the rx grants it
                    //if(v2 <= max) 
                    acc.push(v2);
                } else {
                    
                    let cursor = parseInt(r[3], 10);
                    const every = parseInt(r[4], 10);
                    while(cursor <= max){
                        acc.push(cursor);
                        cursor = every + cursor;
                    }
                }
                return acc;
            }, []).map(v => v.toString());
        }

        // now for 2,3,4,6 in [1-7] scan the month to collect right dates
        if(
            // vals.every(v => v.match(/^([1-7])$/))
            vals.every(v => v.match(rx.ranged.wd))
        ) {
            let cursor = firstDayWd, 
                toAddDate = 1;
            while(toAddDate <= lastDate) {
                if(vals.includes(`${cursor}`)) res.push(toAddDate);
                cursor = 1 + cursor%7;
                toAddDate+= 1;
            }
        }
        return res;
    },
    
    // [1-7]-[1-7] OR [SUN-SAT]-[SUN-SAT]
    ({val, d, lastDate}) => {
        const mat = daysLabels2Numbers(val)
            .match(rx.ranged['wd-wd']);
            // .match(/^(([1-7])-([1-7]))$/);
        let res = [];
        
        if (mat) {
            let cursor = parseInt(mat[2], 10),
                firstDayWd = d.getUTCDay()+1,
                rangeFilled = false,
                toAddDate = 1;
            const to = parseInt(mat[3], 10),
                range = [cursor];
            
            while(!rangeFilled) {
                cursor = 1 + cursor%7;
                range.push(cursor);
                rangeFilled = cursor === to;
            }
            while(toAddDate <= lastDate) {
                if(range.includes(firstDayWd)) res.push(toAddDate);
                firstDayWd = 1 + firstDayWd%7;
                toAddDate+= 1;
            }
        }
        return res;
    },
    
    // [1-7]-[1-7]/[1-7] OR [SUN-SAT]-[SUN-SAT]/[1-7]
    // a-b/c every c days between as and bs
    ({val, d, lastDate}) => {
        const mat = daysLabels2Numbers(val)
                .match(rx.ranged['wd-wd/wd']),
                // .match(/^(([1-7])-([1-7])\/([1-7]))$/),
            res = [];
            
        let firstDayWd = d.getUTCDay()+1,// [0-6] -> [1,7]
            toAddDate = 1;

        if (mat) {
            const to = parseInt(mat[3], 10),
                cadence = parseInt(mat[4], 10);
            let rangeFilled = false,
                cursor = parseInt(mat[2], 10),
                range = [cursor];
            while(!rangeFilled) {
                cursor = (1 + cursor)%7;
                range.push(cursor);
                rangeFilled = cursor === to;
            }
            // eslint-disable-next-line no-unused-vars
            range = range.filter((_,i) => {
                return i === 0 || i % cadence === 0;
            });
            while(toAddDate <= lastDate) {
                if(range.includes(firstDayWd)) res.push(toAddDate);
                firstDayWd = 1 + firstDayWd%7;
                toAddDate+= 1;
            }
        }
        return res;
    },

    // [1-7]L
    // aL the last a of the month
    ({val, d, lastDate}) => {
        const mat = val.match(rx.ranged.wdL);
        // const mat = val.match(/^([1-7])L$/);
        let res = [],
            trg = lastDate;
        d.setUTCDate(lastDate);
        // d.setUTCHours(0);
        // d.setUTCMinutes(0);
        // d.setUTCSeconds(0);
        // d.setUTCHours(0);
        
        let cursorDay = d.getUTCDay() + 1; // [0-6] -> [1,7]
        
        if (mat) {
            let trgWd = parseInt(mat[1], 10);
            while(cursorDay !== trgWd){
                cursorDay = cursorDay-1>0 ? cursorDay-1 : 7;
                trg--;
            }
            return [trg];
        }
        return res;
    },

    // [1-7]#[1-5]
    // a#b the b-th a weekday of the month
    ({val, d, lastDate}) => {
        const mat = val.match(rx.ranged['wd#wdn']),
        // const mat = val.match(/^([1-7])#([1-5])$/),
            res = [];
        d.setUTCDate(1);
        let cursorDate = 1;
            cursorDay = d.getUTCDay() + 1; // [0-6] -> [1,7]
        if (mat) {
            const wd = parseInt(mat[1], 10),
                n = parseInt(mat[2], 10);
            while (cursorDay !== wd) {
                cursorDay = cursorDay+1 > 7
                    ? 1
                    : cursorDay+1;
                cursorDate++;
            }
            let ret = cursorDate+(n-1)*7;
            return ret <= lastDate ? [ret] : [];
        }
        return res;
    },
];
const solve_dow = getSpecialSolver(dow_solvers);

const solve_0_59_ranges = getRangeSolver({
        bounds: bounds.seconds,
        rx: rx.ranges.wildRangeCadence
    }),
    solve_hours_ranges = getRangeSolver({
        bounds: bounds.hour,
        rx: rx.ranges.wildRangeCadence
    }),
    solve_month_ranges = getRangeSolver({
        bounds: bounds.month,
        labelTransformer: vstr => vstr.match(rx.next.hasMonths)
            ? labels.months.reduce(
                (acc, day, i) => acc.replace(day, i+1),
                vstr
            )
            : vstr,
        rx: rx.ranges.wildRangeCadence
    }),
    solve_year_ranges = getRangeSolver({
        bounds: bounds.year,
        rx: rx.ranges.wildRangeCadence
    }),
    
    // this will be no more needed
    solve_week_ranges = getRangeSolver({
        bounds: bounds.week,
        labelTransformer: vstr => vstr.match(rx.next.hasWeekdays)
            ? labels.days.reduce(
                (acc, day, i) => acc.replace(day, i+1),
                vstr
            )
            : vstr,
        rx: rx.ranges.wildRangeCadence
    });


module.exports = {
    isLeap,
    lastMonthDay,
    nDaysBeforeEndOfMonth,
    nDayOfMonth,
    // solveNumericRange,
    solve_0_59_ranges,
    solve_year_ranges,
    solve_month_ranges,
    solve_week_ranges,
    solve_hours_ranges,
    solve_dom,
    solve_dow
};