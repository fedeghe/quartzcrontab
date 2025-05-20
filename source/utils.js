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
const { defaults, rx, labels, errors } = require('./constants.js');

const argumentize = o => {
        const ty = typeof o;
        switch(ty) {
            case 'string': return exp2elements(o);
            case 'object': return {...defaults, ...o};
            default:;
        }
        return {...defaults};
    },
    getRangeValidator = (mainRx, cadenceRx) => val => {
        const v = `${val}`;
        if (v.match(rx.dumb.astrxn)) return true;
        const s = v.match(rx.splitter);
        if (!s) return false;
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
        );
    },
    getValidator = rxs => v => rxs.find(r => {
        if(typeof r === 'function') return r(v);
        return `${v}`.match(r);
    }),
    rx059 = getRangeValidator(rx.ranged['0-59'], rx.ranged['0-59'] ),
    rx023 = getRangeValidator(rx.ranged['0-23'], rx.ranged['0-23'] ),
    rx131 = getRangeValidator(rx.ranged['1-31'], rx.ranged['1-31'] ),
    rxmonth = getRangeValidator(rx.month, rx.month ),
    rxYear = getRangeValidator(rx.year, rx.wildCadence ),
    rxWeekday = getRangeValidator(rx.ranged['maybelabelled-wd'], rx.ranged['maybelabelled-wd'] ),
    rxDom = getValidator([
        rx131,
        rx.ranged['1-31'],
        rx.dumb.quest,
        rx.dumb.astrxn,
        rx.dumb['LW?'],
        rx.ranged['L-md'],
        rx.ranged['1-31L'],
        rx.ranged['1-31W']
    ]),
    rxDow = getValidator([
        rx.dumb.quest,
        rxWeekday,
        rx.ranged.fullWd,
        rx.ranged.nthFullWd
    ]),
    validators = {
        second: rx059,
        minute: rx059,
        hour: rx023,
        month: rxmonth,
        year: rxYear,
        dayOfMonth: rxDom,
        dayOfWeek: rxDow
    },
    fieldCorrelationValidators = [{
        validator: ({dom, dow}) =>  !(dow!=='?' && dom!=='?') && !(dow==='?'&&dom==='?'),
        message: errors.domdowExclusivity
    }],
    daysLabels2Numbers = v => 
        labels.days.reduce(
            (acc, label, i) => acc.replace(label, i + 1), v
        ),
    now = new Date(),
    yearNow = now.getFullYear(),
    removeSpaces = s => `${s}`.replace(/\s/mg, ''),
    exp2elements = exp => {
        const e = exp.split(rx.dumb.spaceSplit);
        return {
            s: e[0], i: e[1], h: e[2],
            dom: e[3], m: e[4], dow: e[5], y: e[6]
        };
    };

module.exports = {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces,
    daysLabels2Numbers,
    exp2elements,
    argumentize
};
