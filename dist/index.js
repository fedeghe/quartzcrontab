/*
validations
https://www.freeformatter.com/cron-expression-generator-quartz.html


https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-06.html
https://www.npmjs.com/package/cron-time-generator

s   [0,59]
i   [0,59]
h   [0,23]
dom [1,31]*
m   [1,12]*
dow [1(SUN), 7(SAT)]*
y   [2xxx,]*
*/

const defaults = {
    s : '0', // seconds   *   0,1,2,3,4,59   3-45   3-35/5
    i : '0', // minutes   *   0,1,2,3,4,59   3-45   3-35/5
    h : '0', // seconds   *   0,1,2,3,4,23   3-23   3-23/5
    dom : '*', // day of month   *   ?   3/4  12 12,13,15
    dow : '?', // day of week
    m : '*', // month
    y : '*', // year (1970-2099) ...how 1970 :D ??????
}

const rx = {
    asterx: /^\*$/,
    zeroFiftynine: /^([0-5]{1}[0-9]{1}|[0-9]{1})$/,
    zeroTwentythree: /^([01]\d|2[0-3]|\d)$/,
    oneThirtyone: /^(?:[012]\d|3[0,1]|[1-9]{1})$/,
    weekday: /^(?:[1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)$/,     /* this belowis exactly oneThirtyone */
    weekdayAfterX: /^(?:[1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)\/(?:[012]\d|3[0,1]|[1-9]{1})$/,
    LW: /^LW?$/,

    //even this uses oneThirtyone
    Lx: /^(L-[012]\d|3[0,1]|[1-9]{1})$/,

    xL31: /^([012]\d|3[0,1]|[1-9]{1})L$/,
    xLweekday: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)L$/,

    nthWeekDay: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)\#[1-5]{1}$/,
    // dow/dow related
    quest: /^(\?)$/,
    /**
     * ?
     * *
     * x/y : x weekday, y [1-31]
     * x
     * x,y,z
     * x-y/z
     * L
     * LW
     * L-x : x [1-31]
     * xL: x [1-31]
     * */
    dom: /^(\?)|(\*)|()$/,
    
    
    /**
     * ?
     * x weekday
     * x-y weekday
     * x-y/z weekday
     * xL weekday
     * x#y   y-th[1,5] weekday x [1,7]
     */
    dow: /^(\?)|$/,
    
    month: /^(^0?[1-9]$)|(^1[0-2]$)|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/,
    year: /^(20[2-9][0-9])$/,

    // match a valid cadence ()
    wildCadence: /^\d*$/,

    /**
     * splits number-number/number (second and third optionals)
     */
    splitter: /^([\d,\w]*)(-([\d\w]*)(\/([\d\w]*))?)?$/
    // note: to support ranges like MON,SUN or MON-SUN 
    //      we need a less trivial splitter
}
const getRangeValidator = ({mainRx, cadenceRx}) => val => {
    const v = `${val}`;
    if (v.match(rx.asterx))return true
    const s = v.match(rx.splitter);
    if (!s) return null
    const starts = s[1].split(/,/),
        to = s[3],
        cadence = s[5];
    return (
        starts.length &&
        starts.every(start => start.match(mainRx)) &&
        (
            !to || (
                to.match(mainRx) && (
                    !cadence ||
                    !!cadence.match(cadenceRx)
                )
            )
        )
    )
}
const getValidator = rxs => v => rxs.find(r => {
    if(typeof r === 'function') return r(v)
    return `${v}`.match(r)
})

const rx059 = getRangeValidator({
    mainRx: rx.zeroFiftynine,
    cadenceRx: rx.zeroFiftynine
})
const rx023 = getRangeValidator({
    mainRx: rx.zeroTwentythree,
    cadenceRx: rx.zeroTwentythree
})
const rx131 = getRangeValidator({
    mainRx: rx.oneThirtyone,
    cadenceRx: rx.oneThirtyone
})
const rxmonth = getRangeValidator({
    mainRx: rx.month,
    cadenceRx: rx.month
})
const rxYear = getRangeValidator({
    mainRx: rx.year,
    cadenceRx: rx.wildCadence
})
const rxWeekday = getRangeValidator({
    mainRx: rx.weekday,
    cadenceRx: rx.weekday
})
const rxDom = getValidator([
    rx.oneThirtyone,
    rx.quest,
    rx.asterx,
    rx.weekdayAfterX,
    rx131,
    rx.LW,
    rx.Lx,
    rx.xL31,
])

const rxDow = getValidator([
    rx.quest,
    rxWeekday,
    rx.xLweekday,
    rx.nthWeekDay
])
const rawValidators = {
    second: rx059,
    minute: rx059,
    hour: rx023,
    month: rxmonth,
    year: rxYear,
    dom: rxDom,
    dow: rxDow
}
  


const validators = {

    // [0-59]
    // second : s => s
    //     .split(/-|\/|\,/)
    //     .every(
    //         spl => spl.match(rx.zeroFiftynine) || spl.match(rx.asterx)
    //     ),
    second: s => rawValidators.second(s),
    minute : i => rawValidators.minute(i),
    hour : h => rawValidators.hour(h),
    month : m => rawValidators.month(m),
    year: y => rawValidators.year(y),
    dayOfMonth: d => rawValidators.dom(d),
    dayOfWeek: d => rawValidators.dow(d)
}

const fieldCorrelationValidators = [{
    validator: ({dom, dow}) =>  !(dow!=='?' && dom!=='?'),
    message: 'either dom either dow must contain "?"'
}]

class CronTabist {
    constructor({
        s = defaults.s,         // seconds
        i = defaults.i,         // minutes
        h = defaults.h,         // seconds
        dom = defaults.dom,     // day of month
        dow = defaults.dow,     // day of week
        m = defaults.m,         // month
        y = defaults.y,         // year
    } = {}) {
        this.months = { min: 0, max: 11 }
        this.elements = { s, i, h, dom, m, dow, y }
    }

    static getRanger(max) {
        return n => {
            let normN = parseInt(n, 10) % max
            while (normN < 0) normN += max
            return normN
        }
    }

    range24 = CronTabist.getRanger(24)
    range12 = CronTabist.getRanger(12)
    range60 = CronTabist.getRanger(60)

    over({ s, i, h, dom, m, dow, y }) {
        this.elements = {
            s: s ?? this.elements.s,
            i: i ?? this.elements.i,
            h: h ?? this.elements.h,
            dom: dom ?? this.elements.dom,
            m: m ?? this.elements.m,
            dow: dow ?? this.elements.dow,
            y: y ?? this.elements.y,
        }
        this.descriptions = {
            s: s ?? this.elements.s,
            i: i ?? this.elements.i,
            h: h ?? this.elements.h,
            dom: dom ?? this.elements.dom,
            m: m ?? this.elements.m,
            dow: dow ?? this.elements.dow,
            y: y ?? this.elements.y,
        }
        return this;
    }
    /* seconds */
    everySecond() {
        return this.over({ s: '*'})
    }
    everyXSeconds({freq, start = 0}) {
        return this.over({ s: `${start}/${freq}` })
    }
    atSecond(s) {
        return this.over({ s })
    }
    atSecondAdd(s) {
        var current = this.elements.s.split(',')
        return this.over({ s: [...current, s].join(',') })
    }
    betweenSeconds(from, to, every) {
        return this.over({ s: `${from}-${to}${every ? `/${every}`: ''}` })
    }

    /* minutes */
    everyMinute() {
        return this.over({ i: '*'})
    }
    everyXMinutes({freq, start = 0}) {
        return this.over({ i: `${start}/${freq}` })
    }
    atMinute(i) {
        return this.over({ i })
    }
    atMinuteAdd(i) {
        var current = this.elements.i.split(',')
        return this.over({ i: [...current, i].join(',') })
    }
    betweenMinutes(from, to, every) {
        return this.over({ i: `${from}-${to}${every ? `/${every}` : ''}` })
    }

    /* hours */
    everyHour() {
        return this.over({ h: '*'})
    }
    everyXHours({freq, start = 0}) {
        return this.over({ h: `${start}/${freq}` })
    }
    atHour(h) {
        return this.over({ h })
    }
    atHourAdd(h) {
        var current = this.elements.h.split(',')
        return this.over({ h: [...current, h].join(',') })
    }
    betweenHours(from, to, every) {
        return this.over({ h: `${from}-${to}${every ? `/${every}`: ''}` })
    }

    /* dom/dow */
    everyDay(){
        return this.over({ dom: '*'})
    }
    everyXDayStartingFromYDay(x, y){
        return this.over({ dom: `${y}/${x}`, dow: '?'})
    }
    everyDayOfWeek(d) {
        return this.over({ dom: '?', dow: d })
    }   
    everyDayOfWeekAdd(d) {
        var current = this.elements.dow === defaults.dow
            ? []
            : this.elements.dow.split(',')
        return this.over({ dom: '?', dow: [...current, d].join(',') })
    }
    atDayOfMonth(dom) {
        return this.over({ dom, dow: '?' })
    }
    atDayOfMonthAdd(dom) {
        var current = this.elements.dom === defaults.dom
            ? []
            : this.elements.dom.split(',')
        return this.over({ dom: [...current, dom].join(','), dow: '?' })
    }
    betweenDaysOfMonth(from, to, every) {
        return this.over({ dom: `${from}-${to}${every ? `/${every}`: ''}`, dow: '?' })
    }
    onLastDayOfMonth(){
        return this.over({ dom: 'L', dow: '?' })
    }
    onLastWeekDayOfMonth(){
        return this.over({ dom: 'LW', dow: '?' })
    }
    onLastXWeekDayOfMonth(x){
        return this.over({ dom: '?', dow: `${x}L` })
    }
    onLastXDayBeforeTheEndOfTheMonth(x){
        return this.over({ dom:`L-${x}`, dow: '?' })
    }
    onClosestWorkingDayToTheXofTheMonth(x) {
        return this.over({ dom:`${x}W`, dow: '?' })
    }
    onTheNthWeekDayOfTheMonth(n,wd) {
        return this.over({ dom:'?', dow: `${wd}#${n}` })
    }

    /* month */
    everyMonth() {
        return this.over({ m: '*'})
    }
    everyXMonths({freq, start = 0}) {
        return this.over({ m: `${start}/${freq}` })
    }
    atMonth(m) {
        return this.over({ m })
    }
    atMonthAdd(m) {
        var current = this.elements.m === defaults.m
            ? []
            : this.elements.m.split(',')
        return this.over({ m: [...current, m].join(',') })
    }
    betweenMonths(from, to, every) {
        return this.over({ m: `${from}-${to}${every ? `/${every}` : ''}` })
    }

    /* year */
    everyYear() {
        return this.over({ y: '*'})
    }
    everyXYears({freq, start = 0}) {
        return this.over({ y: `${start}/${freq}` })
    }
    atYear(y) {
        return this.over({ y })
    }
    atYearAdd(y) {
        var current = this.elements.y === defaults.y
            ? []
            : this.elements.y.split(',')
        return this.over({ y: [...current, y].join(',') })
    }
    betweenYears(from, to, every) {
        return this.over({ y: `${from}-${to}${every ? `/${every}` : ''}` })
    }
    describe() {
        return [
            this.describeTime(),
            this.describeDomDowOccurrence(),
            this.describeYears()
        ].join(' of ')
    }
    describeTime() {
        return 'every second'
    }
    describeDomDowOccurrence() {
        return 'every day'
    }
    describeYears() {
        return 'every year'
    }

    validate(){
        const errors = [];

        // fieldCorrelationValidators
        fieldCorrelationValidators.forEach(({
            validator, message
        }) => {
            if(!validator(this.elements)){
                errors.push(message);
            }
        })

        
        if (!validators.second(this.elements.s)) {
            errors.push('Seconds are not well formatted');
        }
        if (!validators.minute(this.elements.i)) {
            errors.push('Minutes are not well formatted');
        }
        if (!validators.hour(this.elements.h)) {
            errors.push('Hours are not well formatted');
        }
        if (!validators.month(this.elements.m)) {
            errors.push('Months are not well formatted');
        }
        if (!validators.year(this.elements.y)) {
            errors.push('Year are not well formatted');
        }

        if (!validators.dayOfMonth(this.elements.dom)) {
            errors.push('Dom has unexpected value');
        }
        if (!validators.dayOfWeek(this.elements.dow)) {
            errors.push('Dow has unexpected value');
        }

        return {
            valid: errors.length === 0,
            errors
        }
    }

    out() {
        return [
            this.elements.s,
            this.elements.i,
            this.elements.h,
            this.elements.dom,
            this.elements.m,
            this.elements.dow,
            this.elements.y,
        ]
            .filter(e => e !== undefined && e !== null)
            .join(' ')
    }

}

module.exports =  CronTabist;