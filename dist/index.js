
const {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces
} = require('./utils');

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
            s: removeSpaces(s ?? this.elements.s),
            i: removeSpaces(i ?? this.elements.i),
            h: removeSpaces(h ?? this.elements.h),
            dom: removeSpaces(dom ?? this.elements.dom),
            m: removeSpaces(m ?? this.elements.m),
            dow: removeSpaces(dow ?? this.elements.dow),
            y: removeSpaces(y ?? this.elements.y),
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
        return this.over({ s: `${s}` })
    }
    atSecondAdd(s) {
        var current = this.elements.s.split(',')
        return this.over({ s: [...current, s].map(c=>`${c}`).join(',') })
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
        return this.over({ i: `${i}` })
    }
    atMinuteAdd(i) {
        var current = this.elements.i.split(',')
        return this.over({ i: [...current, i].map(c=>`${c}`).join(',') })
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
        return this.over({ h: `${h}` })
    }
    atHourAdd(h) {
        var current = this.elements.h.split(',')
        return this.over({ h: [...current, h].map(c=>`${c}`).join(',') })
    }
    betweenHours(from, to, every) {
        return this.over({ h: `${from}-${to}${every ? `/${every}`: ''}` })
    }

    /* dom/dow */
    everyDay(){
        return this.over({ dom: '*'})
    }
    everyWeekDayStartingFromYMonthDay(wd, start){
        return this.over({ dom: `${start}/${wd}`, dow: '?'})
    }
    everyWeekDay(d) {
        return this.over({ dom: '?', dow: `${d}` })
    }   
    everyWeekDayAdd(d) {
        var current = this.elements.dow === defaults.dow
            ? []
            : this.elements.dow.split(',')
        return this.over({ dom: '?', dow: [...current, d].map(c=>`${c}`).join(',') })
    }
    atMonthDay(dom) {
        return this.over({ dom, dow: '?' })
    }
    atMonthDayAdd(dom) {
        var current = this.elements.dom === defaults.dom
            ? []
            : this.elements.dom.split(',')
        return this.over({ dom: [...current, dom].map(c=>`${c}`).join(','), dow: '?' })
    }
    betweenMonthDays(from, to, every) {
        return this.over({ dom: `${from}-${to}${every ? `/${every}`: ''}`, dow: '?' })
    }
    onLastMonthDay(){
        return this.over({ dom: 'L', dow: '?' })
    }
    onLastMonthWeekDay(){
        return this.over({ dom: 'LW', dow: '?' })
    }
    onLastXMonthWeekDay(x){
        return this.over({ dom: '?', dow: `${x}L` })
    }
    onXDayBeforeTheEndOfTheMonth(x){
        return this.over({ dom:`L-${x}`, dow: '?' })
    }
    onClosestWorkingDayToTheXMonthDay(x) {
        return this.over({ dom:`${x}W`, dow: '?' })
    }
    onNWeekDayOfTheMonth(n,wd) {
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
        return this.over({ m: `${m}` })
    }
    atMonthAdd(m) {
        var current = this.elements.m === defaults.m
            ? []
            : this.elements.m.split(',')
        return this.over({ m: [...current, m].map(c=>`${c}`).join(',') })
    }
    betweenMonths(from, to, every) {
        return this.over({ m: `${from}-${to}${every ? `/${every}` : ''}` })
    }

    /* year */
    everyYear() {
        return this.over({ y: '*'})
    }
    everyXYears({freq, start = yearNow}) {
        return this.over({ y: `${start}/${freq}` })
    }
    atYear(y) {
        return this.over({ y: `${y}` })
    }
    atYearAdd(y) {
        var current = this.elements.y === defaults.y
            ? []
            : this.elements.y.split(',')
        return this.over({ y: [...current, y].map(c=>`${c}`).join(',') })
    }
    betweenYears(from, to, every) {
        return this.over({ y: `${from}-${to}${every ? `/${every}` : ''}` })
    }
    
    /***********/

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