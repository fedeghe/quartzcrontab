/*
Quartz cron string creator (v.0.0.10)
*/
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

const C = require('./constants.js')

const { defaults, rx, labels } = C

const getRangeValidator = ({mainRx, cadenceRx}) => val => {
        const v = `${val}`;
        if (v.match(rx.asterx)) return true
        const s = v.match(rx.splitter);
        if (!s) return false
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
    },
    getValidator = rxs => v => rxs.find(r => {
        if(typeof r === 'function') return r(v)
        return `${v}`.match(r)
    }),
    rx059 = getRangeValidator({
        mainRx: rx.zeroFiftynine,
        cadenceRx: rx.zeroFiftynine
    }),
    rx023 = getRangeValidator({
        mainRx: rx.zeroTwentythree,
        cadenceRx: rx.zeroTwentythree
    }),
    rx131 = getRangeValidator({
        mainRx: rx.oneThirtyone,
        cadenceRx: rx.oneThirtyone
    }),
    rxmonth = getRangeValidator({
        mainRx: rx.month,
        cadenceRx: rx.month
    }),
    rxYear = getRangeValidator({
        mainRx: rx.year,
        cadenceRx: rx.wildCadence
    }),
    rxWeekday = getRangeValidator({
        mainRx: rx.weekday,
        cadenceRx: rx.weekday
    }),
    rxDom = getValidator([
        rx.oneThirtyone,
        rx.quest,
        rx.asterx,
        rx.weekdayAfterX,
        rx131,
        rx.LW,
        rx.Lx,
        rx.xL31,
        rx.oneThirtyoneW
    ]),
    rxDow = getValidator([
        rx.quest,
        rxWeekday,
        rx.xLweekday,
        rx.nthWeekDay
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
        validator: ({dom, dow}) =>  !(dow!=='?' && dom!=='?'),
        message: C.errors.domdowExclusivity
    }],
    daysLabels2Numbers = v => {
        return labels.days.reduce((acc, label, i) => {
            return acc.replace(label,i+1)
        }, v)
    }
    now = new Date(),
    yearNow = now.getFullYear(),
    removeSpaces = s => `${s}`.replace(/\s/mg, '');

module.exports = {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces,
    daysLabels2Numbers
};
