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
        m : '*', // month
        dow : '?', // day of week
        y : '*', // year (1970-2099) ...how 1970 :D ??????
    },
    rx = {
        asterx: /^\*$/,
        zeroFiftynine: /^([0-5]{1}[0-9]{1}|[0-9]{1})$/,
        zeroTwentythree: /^([01]\d|2[0-3]|\d)$/,
        oneThirtyone: /^(?:[012]\d|3[0,1]|[1-9]{1})$/,
        oneThirtyoneW: /^(?:[012]\d|3[0,1]|[1-9]{1})W$/,
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
        // year: /^(20[2-9][0-9])$/,
        year: /^(19[7-9]\d)|(20\d\d)$/,

        // match a valid cadence ()
        wildCadence: /^\d*$/,

        /**
         * splits number-number/number (second and third optionals)
         */
        splitter: /^([\d,\w]*)(-([\d\w]*)(\/([\d\w]*))?)?$/
        /**
         * to support ranges like MON,SUN or MON-SUN 
         * the quite relaxed \w* was used here
         * which is too relaxed,
         * 
         * validation on function parameters covers that edge
         */
    
    },
    getRangeValidator = ({mainRx, cadenceRx}) => val => {
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
        message: 'either dom either dow must contain "?"'
    }],
    now = new Date(),
    yearNow = now.getFullYear(),
    removeSpaces = s => `${s}`.replace(/\s/mg, '');

module.exports = {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces
};
