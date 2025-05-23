const {
        defaults,
        yearNow,
        removeSpaces,
        argumentize,
        daysLabels2Numbers
    } = require('./utils'),
    {
        validators,
        fieldCorrelationValidators
    } = require('./validators'),
    {
        solve_0_59_ranges,
        solve_hours_ranges,
        solve_week_ranges,
        solve_month_ranges,
        solve_year_ranges,
        solve_dom,
        solve_dow,
    } = require('./dateutils.js'),
    langUtils = require('./langUtils.js'),
    describer = require('./describe'),
    nextGen = require('./nextGen'),
    C = require('./constants'),
    en = require('./langs/en.js');

class Quartzcron {
    constructor(o) {
        this.months = { min: 0, max: 11 };
        this.lang = en;
        this.elements = argumentize(o);
        this.langUtils = langUtils.getLangUtils(this.lang);
        const validity = this.validate();
        if(!validity.valid) throw new Error(C.errors.constructorErr);
    };
    // static lang = 'en';
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
        };
    }

    range24 = Quartzcron.getRanger(24);
    range12 = Quartzcron.getRanger(12);
    range60 = Quartzcron.getRanger(60);

    updateExp(o) {
        this.elements = argumentize(o);
        const validity = this.validate();
        if(!validity.valid) throw new Error(C.errors.updateExpErr);
        return this;
    }

    over(ov) {
        this.elements = Object.entries(this.elements).reduce((acc, [k, v]) => {
            acc[k] = removeSpaces(ov[k] ?? v);
            return acc;
        }, {});
        return this;
    }
    overAdd(ov) {
        const $ = this,
            mod = Object.entries(ov).reduce((acc, [k, v]) => {
                const current = $.elements[k].split(',').filter(Boolean);
                acc[k] = removeSpaces([...current, v].join(','));
                return acc;
            }, {});
        this.elements = {...this.elements, ...mod};
        return this;
    }
    /* seconds */
    everySecond() {
        return this.over({ s: '*'});
    }
    everyNSeconds(freq, start = 0) {
        return this.over({ s: `${start}/${freq}` });
    }
    everyNSecondsAdd(freq, start = 0) {
        return this.overAdd({ s: `${start}/${freq}` });
    }
    atSecond(s, cad) {
        return this.over({ s: cad ? `${s}/${cad}` : `${s}` });
    }
    atSecondAdd(s, cad) {
        return this.overAdd({ s: cad ? `${s}/${cad}` : `${s}`});
    }
    betweenSeconds(from, to, every) {
        return this.over({ s: `${from}-${to}${every ? `/${every}`: ''}` });
    }
    betweenSecondsAdd(from, to, every) {
        return this.overAdd({ s: `${from}-${to}${every ? `/${every}`: ''}` });
    }

    /* minutes */
    everyMinute() {
        return this.over({ i: '*'});
    }
    everyNMinutes(freq, start = 0) {
        return this.over({ i: `${start}/${freq}` });
    }
    everyNMinutesAdd(freq, start = 0) {
        return this.overAdd({ i: `${start}/${freq}` });
    }
    atMinute(i, cad) {
        return this.over({ i: cad ? `${i}/${cad}` : `${i}` });
    }
    atMinuteAdd(i, cad) {
        return this.overAdd({i: cad ? `${i}/${cad}` : `${i}`});
    }
    betweenMinutes(from, to, every) {
        return this.over({ i: `${from}-${to}${every ? `/${every}` : ''}` });
    }
    betweenMinutesAdd(from, to, every) {
        return this.overAdd({ i: `${from}-${to}${every ? `/${every}` : ''}` });
    }

    /* hours */
    everyHour() {
        return this.over({ h: '*'});
    }
    everyNHours(freq, start = 0) {
        return this.over({ h: `${start}/${freq}` });
    }
    everyNHoursAdd(freq, start = 0) {
        return this.overAdd({ h: `${start}/${freq}` });
    }
    atHour(h, cad) {
        return this.over({ h: cad ? `${h}/${cad}` : `${h}` });
    }
    atHourAdd(h, cad) {
        return this.overAdd({ h: cad ? `${h}/${cad}` : `${h}`});
    }
    betweenHours(from, to, every) {
        return this.over({ h: `${from}-${to}${every ? `/${every}`: ''}` });
    }
    betweenHoursAdd(from, to, every) {
        return this.overAdd({ h: `${from}-${to}${every ? `/${every}`: ''}` });
    }

    /* dom/dow */
    everyDay(){
        return this.over({ dom: '*', dow:'?'});
    }
    everyNDays(n, start = 1){
        return this.over({ dom: `${start}/${n}`, dow: '?'});
    }
    everyNDaysAdd(n, start = 1){
        return this.overAdd({ dom: `${start}/${n}`, dow: '?'});
    }
    everyWeekEnd() {
        return this.over({ dom: '?', dow: '7,1' });
    }   
    everyWeekDay() {
        return this.over({ dom: '?', dow: '2-6' });
    }
    everyWeek() {
        return this.over({ dom: '?', dow: '*' });
    }
    atWeekDay(d, cad){
        // transform d to n
        const nd = daysLabels2Numbers(d);
        return this.over({ dom: '?', dow: cad ? `${nd}/${cad}` : `${nd}` });
    }
    atWeekDayAdd(d, cad) {
        // transform d to n
        const nd = daysLabels2Numbers(d);
        return this.elements.dow === defaults.dow
            ? this.over({ dom: '?', dow: cad ? `${nd}/${cad}` : `${nd}` })
            : this.overAdd({ dow: cad ? `${nd}/${cad}` : `${nd}` });
    }

    // the relative validator should check it
    betweenWeekDays(from, to, every) {
        if(from>=to) return this;
        return this.over({ dom: '?', dow: `${from}-${to}${every ? `/${every}`: ''}`});
    }
    betweenWeekDaysAdd(from, to, every) {
        if (from>=to) return this;
        return this.over({dom: '?'})
            .overAdd({ dom: '?', dow: `${from}-${to}${every ? `/${every}`: ''}`});
    }
    atMonthDay(dom, cad) {
        return this.over({ dom: cad ? `${dom}/${cad}` : `${dom}`, dow: '?' });
    }
    atMonthDayAdd(dom, cad) {
        return this.elements.dom === defaults.dom
            ? this.over({dom: cad ? `${dom}/${cad}` : `${dom}`, dow: '?'})
            : this.overAdd({dom: cad ? `${dom}/${cad}` : `${dom}`});
    }
    betweenMonthDays(from, to, every) {
        return this.over({ dom: `${from}-${to}${every ? `/${every}`: ''}`, dow: '?' });
    }
    betweenMonthDaysAdd(from, to, every) {
        return this.overAdd({ dom: `${from}-${to}${every ? `/${every}`: ''}`});
    }
    onLastMonthDay(){
        return this.over({ dom: 'L', dow: '?' });
    }
    onFirstMonthWeekDay(){
        return this.over({ dom:`1W`, dow: '?' });
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
        return this.over({ m: '*'});
    }
    everyNMonths(freq, start = 1) {
        return this.over({ m: `${start}/${freq}` });
    }
    everyNMonthsAdd(freq, start = 1) {
        return this.elements.m === defaults.m
            ? this.over({ m: `${start}/${freq}` })
            : this.overAdd({ m: `${start}/${freq}` });
    }
    atMonth(m, cad) {
        return this.over({ m: cad ? `${m}/${cad}` : `${m}` });
    }
    atMonthAdd(m, cad) {
        return this.elements.m === defaults.m
            ? this.over({ m: cad ? `${m}/${cad}` : `${m}`})
            : this.overAdd({ m: cad ? `${m}/${cad}` : `${m}`});
    }
    betweenMonths(from, to, every) {
        return this.over({ m: `${from}-${to}${every ? `/${every}` : ''}` });
    }
    betweenMonthsAdd(from, to, every) {
        return this.elements.m === defaults.m
            ? this.over({ m: `${from}-${to}${every ? `/${every}` : ''}` })
            : this.overAdd({ m: `${from}-${to}${every ? `/${every}` : ''}` });
    }

    /* year */
    everyYear() {
        return this.over({ y: '*'});
    }
    everyNYears(freq, start = yearNow) {
        return this.over({ y: `${start}/${freq}` });
    }
    everyNYearsAdd(freq, start = yearNow) {
        return this.elements.y === defaults.y
            ? this.over({ y: `${start}/${freq}` })
            : this.overAdd({ y: `${start}/${freq}` });
    }
    atYear(y, cad) {
        return this.over({ y: cad ? `${y}/${cad}` : `${y}` });
    }
    atYearAdd(y, cad) {
        return this.elements.y === defaults.y
            ? this.over({ y: cad ? `${y}/${cad}` : `${y}`})
            : this.overAdd({ y: cad ? `${y}/${cad}` : `${y}`});
    }
    betweenYears(from, to, every) {
        return this.over({ y: `${from}-${to}${every ? `/${every}` : ''}` });
    }
    betweenYearsAdd(from, to, every) {
        return this.elements.y === defaults.y
            ? this.over({ y: `${from}-${to}${every ? `/${every}` : ''}` })
            : this.overAdd({ y: `${from}-${to}${every ? `/${every}` : ''}` });
    }
    
    describe() {
        if(this.lang === null){
            throw new Error(C.errors.noLangFile);
        }
        return describer.describe(this.elements, this.langUtils);
    }
    loadLang(l){
        this.lang = l;
        if(l===null)return;
        this.langUtils = langUtils.getLangUtils(l);
        return this;
    }
    
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
        ).filter(Boolean);
    }

    validate(exp){ return Quartzcron.validate(exp || this.out()); }

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
        if (!validators.dayOfMonth(elements.dom)) {
            errors.push(C.errors.malformed.dom);
        }
        if (!validators.month(elements.m)) {
            errors.push(C.errors.malformed.months);
        }
        if (!validators.dayOfWeek(elements.dow)) {
            errors.push(C.errors.malformed.dow);
        }
        if (elements.y && !validators.year(elements.y)) {
            errors.push(C.errors.malformed.years);
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