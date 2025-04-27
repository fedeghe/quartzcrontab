const monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];

const isLeap = y => {
    return !(y % 4) && (!!(y % 100) || !(y % 400))
}
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
        // sat ? 
        if (day==6){return ret-1;}
        // sun ? 
        if (day==0){return ret-2;}
    }
    return ret;
}
const nDaysBeforeEndOfMonth = (n, y, m) => {
    const end = lastMonthDay(y, m),
        pot = end - n;
    if (pot < 1) throw new Error('not enough days');
    return pot;
}
const nDayOfMonth = (n, wd,  y, m) => {
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
    
}
module.exports = {
    isLeap,
    lastMonthDay,
    nDaysBeforeEndOfMonth,
    nDayOfMonth
}