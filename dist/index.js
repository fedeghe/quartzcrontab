/*
quartzcron (v.0.0.40)
*/

const {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces,
    exp2elements
} = require('./utils');

const {
    solve_0_59_ranges,
    solve_hours_ranges,
    solve_week_ranges,
    solve_month_ranges,
    solve_year_ranges,
    solve_dom,
    solve_dow,
} = require('./dateutils');

const nextGen = require('./nextGen');

const C = require('./constants');

class Quartzcron {
    constructor(o) {
        let els = null;
        if(typeof o === 'string'){
            els = exp2elements(o);
        }
        if(typeof o === 'object'){
            els = {...defaults, ...o}
        }
        if(els === null) {
            els = {...defaults};
        }
        this.months = { min: 0, max: 11 };
        this.elements = els;
        const validity = this.validate();
        if(!validity.valid) throw new Error(C.errors.constructorErr)
    };

    static solvers = {
        solve_0_59_ranges,
        solve_hours_ranges,
        solve_week_ranges,
        solve_month_ranges,
        solve_year_ranges,
        solve_dom,
        solve_dow,
    };

    static getRanger(max) {
        return n => {
            let normN = parseInt(n, 10) % max;
            while (normN < 0) normN += max;
            return normN;
        }
    }

    range24 = Quartzcron.getRanger(24);
    range12 = Quartzcron.getRanger(12);
    range60 = Quartzcron.getRanger(60);

    updateExp(o) {
        let els = null;
        if(typeof o === 'string'){
            els = exp2elements(o);
        }
        if(typeof o === 'object'){
            els = {...defaults, ...o}
        }
        if(els === null) {
            els = {...defaults};
        }
        this.elements = els;
        const validity = this.validate();
        if(!validity.valid) throw new Error(C.errors.updateExpErr)
    }

    over({ s, i, h, dom, m, dow, y }) {
        this.elements = {
            s: removeSpaces(s ?? this.elements.s),
            i: removeSpaces(i ?? this.elements.i),
            h: removeSpaces(h ?? this.elements.h),
            dom: removeSpaces(dom ?? this.elements.dom),
            m: removeSpaces(m ?? this.elements.m),
            dow: removeSpaces(dow ?? this.elements.dow),
            y: removeSpaces(y ?? this.elements.y),
        };
        return this;
    }
    /* seconds */
    everySecond() {
        return this.over({ s: '*'});
    }
    everyNSeconds(freq, start = 0) {
        return this.over({ s: `${start}/${freq}` });
    }
    atSecond(s) {
        return this.over({ s: `${s}` });
    }
    atSecondAdd(s) {
        var current = this.elements.s.split(',');
        return this.over({ s: [...current, s].map(c=>`${c}`).join(',') })
    }
    betweenSeconds(from, to, every) {
        return this.over({ s: `${from}-${to}${every ? `/${every}`: ''}` })
    }

    /* minutes */
    everyMinute() {
        return this.over({ i: '*'});
    }
    everyNMinutes(freq, start = 0) {
        return this.over({ i: `${start}/${freq}` });
    }
    atMinute(i) {
        return this.over({ i: `${i}` });
    }
    atMinuteAdd(i) {
        var current = this.elements.i.split(',');
        return this.over({ i: [...current, i].map(c=>`${c}`).join(',') })
    }
    betweenMinutes(from, to, every) {
        return this.over({ i: `${from}-${to}${every ? `/${every}` : ''}` })
    }

    /* hours */
    everyHour() {
        return this.over({ h: '*'});
    }
    everyNHours(freq, start = 0) {
        return this.over({ h: `${start}/${freq}` });
    }
    atHour(h) {
        return this.over({ h: `${h}` });
    }
    atHourAdd(h) {
        var current = this.elements.h.split(',');
        return this.over({ h: [...current, h].map(c=>`${c}`).join(',') })
    }
    betweenHours(from, to, every) {
        return this.over({ h: `${from}-${to}${every ? `/${every}`: ''}` })
    }

    /* dom/dow */
    everyDay(){
        return this.over({ dom: '*', dow:'?'});
    }
    everyNDays(n, start = 1){
        return this.over({ dom: `${start}/${n}`, dow: '?'});
    }
    everyWeekEnd() {
        return this.over({ dom: '?', dow: '7-1' });
    }   
    everyWeekDay() {
        return this.over({ dom: '?', dow: '2-6' });
    }
    atWeekDay(d){
        return this.over({ dom: '?', dow: d });
    }
    atWeekDayAdd(d) {
        var current = this.elements.dow === defaults.dow
            ? []
            : this.elements.dow.split(',');
        return this.over({ dom: '?', dow: [...current, d].map(c=>`${c}`).join(',') })
    }
    betweenWeekDays(from, to, every) {
        return this.over({ dom: '?', dow: `${from}-${to}${every ? `/${every}`: ''}`})
    }
    atMonthDay(dom) {
        return this.over({ dom, dow: '?' });
    }
    atMonthDayAdd(dom) {
        var current = this.elements.dom === defaults.dom
            ? []
            : this.elements.dom.split(',');
        return this.over({ dom: [...current, dom].map(c=>`${c}`).join(','), dow: '?' })
    }
    betweenMonthDays(from, to, every) {
        return this.over({ dom: `${from}-${to}${every ? `/${every}`: ''}`, dow: '?' })
    }
    onLastMonthDay(){
        return this.over({ dom: 'L', dow: '?' });
    }
    onLastMonthWeekDay(){
        return this.over({ dom: 'LW', dow: '?' });
    }
    onLastMonthNWeekDay(x){
        return this.over({ dom: '?', dow: `${x}L` });
    }
    onNDayBeforeTheEndOfTheMonth(x){
        return this.over({ dom:`L-${x}`, dow: '?' });
    }
    onClosestWorkingDayToTheNMonthDay(x) {
        return this.over({ dom:`${x}W`, dow: '?' });
    }
    onNWeekDayOfTheMonth(n,wd) {
        return this.over({ dom:'?', dow: `${wd}#${n}` });
    }

    /* month */
    everyMonth() {
        return this.over({ m: '*'})
    }
    everyNMonths(freq, start = 0) {
        return this.over({ m: `${start}/${freq}` })
    }
    atMonth(m) {
        return this.over({ m: `${m}` })
    }
    atMonthAdd(m) {
        var current = this.elements.m === defaults.m
            ? []
            : this.elements.m.split(',');
        return this.over({ m: [...current, m].map(c=>`${c}`).join(',') })
    }
    betweenMonths(from, to, every) {
        return this.over({ m: `${from}-${to}${every ? `/${every}` : ''}` })
    }

    /* year */
    everyYear() {
        return this.over({ y: '*'})
    }
    everyNYears(freq, start = yearNow) {
        return this.over({ y: `${start}/${freq}` })
    }
    atYear(y) {
        return this.over({ y: `${y}` })
    }
    atYearAdd(y) {
        var current = this.elements.y === defaults.y
            ? []
            : this.elements.y.split(',');
        return this.over({ y: [...current, y].map(c=>`${c}`).join(',') })
    }
    betweenYears(from, to, every) {
        return this.over({ y: `${from}-${to}${every ? `/${every}` : ''}` })
    }
    
    /***********/
    // TODO
    describe() {
        return [
            this.describeTime(),
            this.describeDomDowOccurrence(),
            this.describeYears()
        ].join(' of ')
    }
    describeTime() { return 'every second' }
    describeDomDowOccurrence() { return 'every day' }
    describeYears() { return 'every year' }
    /***********/

    next({n = 1, date = null} = {}){
        const base = date || new Date(),
            elements = this.elements;
        if (base == 'Invalid Date') {
            throw new Error(C.errors.invalidDate);
        }
        const y = base.getUTCFullYear(),
            allgen = nextGen.generateDates(
                base,
                solve_year_ranges(elements.y).filter(ye => ye >= y), // remove past years
                solve_month_ranges(elements.m),
                elements.dom,
                elements.dow,
                solve_hours_ranges(elements.h),
                solve_0_59_ranges(elements.i),
                solve_0_59_ranges(elements.s),
            );

        return Array.from(
            { length: n },
            () => allgen.next().value
        ).filter(Boolean)
    }

    validate(exp){ return Quartzcron.validate(exp || this.out())}

    static validate(exp){
        const errors = [],
            local = exp ? `${exp}`.split(/\s/) : false,
            elements = local && {
                s : local[0],
                i : local[1],
                h : local[2],
                dom : local[3],
                m : local[4],
                dow : local[5],
                y : local[6],
            };
        if(!local)return {
            valid: local,
            errors:[C.errors.staticValidationParamMissing]
        };

        fieldCorrelationValidators.forEach(({
            validator, message
        }) => {
            if(!validator(elements)){
                errors.push(message);
            }
        });
        
        if (!validators.second(elements.s)) {
            errors.push(C.errors.malformed.seconds);
        }
        if (!validators.minute(elements.i)) {
            errors.push(C.errors.malformed.minutes);
        }
        if (!validators.hour(elements.h)) {
            errors.push(C.errors.malformed.hours);
        }
        if (!validators.month(elements.m)) {
            errors.push(C.errors.malformed.months);
        }
        if (elements.y && !validators.year(elements.y)) {
            errors.push(C.errors.malformed.years);
        }
        if (!validators.dayOfMonth(elements.dom)) {
            errors.push(C.errors.malformed.dom);
        }
        if (!validators.dayOfWeek(elements.dow)) {
            errors.push(C.errors.malformed.dow);
        }
        return {
            valid: errors.length === 0,
            errors
        };
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
            .join(' ');
    }
    toString = this.out;
}

module.exports =  Quartzcron;