/*
quartzcron (v.0.1.0)
*/
const labels = {
        days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    },
    /* eslint-disable no-unused-vars */
    SEVEN = Array.from({length:7}, (_, i)=>i+1),
    THIRTYONE = Array.from({length:31}, (_, i)=>i+1),
    THIRTY = Array.from({length:30}, (_, i)=>i+1),
    TWENTYNINE = Array.from({length:29}, (_, i)=>i+1),
    TWENTYEIGTH = Array.from({length:28}, (_, i)=>i+1),
    /* eslint-enable no-unused-vars */
    NUMBERS = {
        ZERO : 0,
        ONE : 1,
        SEVEN : 7,
        TWELVE : 12,
        TWENTYTHREE : 23,
        TWENTYEIGTH : 28,
        TWENTYNINE : 29,
        THIRTY : 30,
        THIRTYONE : 31,
        FIFTYNINE : 59,
        YEARSTART : 1970,
        YEAREND : 2099,
    },
    monthEnds = [
        NUMBERS.THIRTYONE,
        NUMBERS.TWENTYEIGTH, // *
        NUMBERS.THIRTYONE,
        NUMBERS.THIRTY,
        NUMBERS.THIRTYONE,
        NUMBERS.THIRTY,
        NUMBERS.THIRTYONE,
        NUMBERS.THIRTYONE,
        NUMBERS.THIRTY,
        NUMBERS.THIRTYONE,
        NUMBERS.THIRTY,
        NUMBERS.THIRTYONE,
    ],
    bounds = {
        seconds: { min: NUMBERS.ZERO, max: NUMBERS.FIFTYNINE },
        minutes: { min: NUMBERS.ZERO, max: NUMBERS.FIFTYNINE },
        hour: { min: NUMBERS.ZERO, max: NUMBERS.TWENTYTHREE },
        week: { min: NUMBERS.ONE, max: NUMBERS.SEVEN },
        month: { min: NUMBERS.ONE, max: NUMBERS.TWELVE },
        year: { min: NUMBERS.YEARSTART, max: NUMBERS.YEAREND },
    },
    errors = {
        malformed: {
            seconds: 'Seconds are not well formatted',
            minutes: 'Minutes are not well formatted',
            hours: 'Hours are not well formatted',
            months: 'Months are not well formatted',
            years: 'Years are not well formatted',
            dom: 'Dom has unexpected value',
            dow: 'Dow has unexpected value'
        },
        invalidDate: 'Invalid Date',
        staticValidationParamMissing: 'static validation needs an expression to validate',
        domdowExclusivity: 'either dom either dow must contain "?"',
        constructorErr: 'wrong params for constructor',
        updateExpErr: 'invalid resulting expression',
        nonWeekday: 'given weekday does not exist [0-6]',
        notEnoughDays: 'not enough days',
        monthsOutOfBounds: 'not enough days in any month',
        monthOutOfBounds: 'not enough days in this month',
        noLangFile: 'no language file loaded'
    },
    rx = {
        loose: {
            n: /^(\d+)$/,
            'n-n': /^(\d+)-(\d+)$/,
            'n-n/n': /^(\d+)-(\d+)\/(\d+)$/,
            'nORn/n': /^((\d+)|(\d+)\/(\d+))$/,
            'n-n/nOPZ': /^(\d+|\w{3})(-(\d+|\w{3}))?(\/(\d+))?$/,
        },
        ranged:{
            'md/md': /^([1-9]|1[0-9]|2[0-9]|3[01])\/([1-9]|1[0-9]|2[0-9]|3[01])$/,
            'md-md': /^([1-9]|1[0-9]|2[0-9]|3[01])-([1-9]|1[0-9]|2[0-9]|3[01])$/,
            'md-md/md': /^([1-9]|1[0-9]|2[0-9]|3[01])-([1-9]|1[0-9]|2[0-9]|3[01])\/([1-9]|1[0-9]|2[0-9]|3[01])$/,
            'md': /^([1-9]|1[0-9]|2[0-9]|3[01])$/,
            'mdW': /^([1-9]|1[0-9]|2[0-9]|3[01])W$/,
            'L-md': /^L-([1-9]|1[0-9]|2[0-9]|3[01])$/,
            'mdORmd/md': /^(([1-9]|1[0-9]|2[0-9]|3[01])|([1-9]|1[0-9]|2[0-9]|3[01])\/([1-9]|1[0-9]|2[0-9]|3[01]))$/,
            'wdOR*/wd': /^([1-7]|\*)\/([1-7])$/,
            'wdORwd/wd': /^(([1-7])|([1-7])\/([1-7]))$/,
            'wd-wd': /^(([1-7])-([1-7]))$/,
            'wd-wd/wd': /^(([1-7])-([1-7])\/([1-7]))$/,
            'wd#wdn': /^([1-7])#([1-5])$/,
            wdL: /^([1-7])L$/,
            wd: /^([1-7])$/,
            fullWd: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)L$/i,
            nthFullWd: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)\#[1-5]{1}$/i,
            'maybelabelled-wd': /^(?:[1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)$/i,
            '0-59': /^([0-5]{1}[0-9]{1}|[0-9]{1})$/,
            '0-23': /^([01]\d|2[0-3]|\d)$/,
            '1-31': /^([1-9]|1[0-9]|2[0-9]|3[01])$/,
            '1-31W': /^([1-9]|1[0-9]|2[0-9]|3[01])W$/,
            '1-31L': /^([1-9]|1[0-9]|2[0-9]|3[01])L$/,
        },
        dumb: {
            L: /^L$/,
            LW: /^LW$/,
            'LW?': /^LW?$/,
            astrx: /^\*$/,
            astrxn: /^\*(\/\d*)?$/,
            astrxQuest: /^[*?]$/,
            weekend: /^(7,1|1,7)$/,
            weekday: /^(2,3,4,5,6|2-6)$/,
            comma: /,/,
            quest: /^\?$/,
            spaceSplit: /\s/,
            '0OR6': /^[06]$/
        },
        splitter: /^([\d,\w]*)(-([\d\w]*))?(\/([\d\w]*))?$/,
        month: /^(^0?[1-9]$)|(^1[0-2]$)|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/i,
        year: /^(19[7-9]\d)|(20\d\d)$/,
        yearCadence: /^(([0-9])|(\d\d)|(1[0-2]\d))$/, // [1-129]
        wildCadence: /^\d*$/,
        /* splits number-number/number (second and third optionals) */
        next: {
            hasMonths: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/,
            hasWeekdays: /SUN|MON|TUE|WED|THU|FRI|SAT/
        },
        ranges: {
            zero59cadence: /^((\d)|([1-5][0-9]))(\/((\d)|([1-5][0-9])))$/,
            one7cadence: /^(([1-7]?))(\/([1-7]?))$/,
            one12cadence: /^(([1-9][0-2]?))(\/([1-9][0-2]?))$/,
            wildRangeCadence: /^([\d,]+)-([\d,]+)(\/(\d*))?$/,
            wildStartCadence: /^(\*|(\d*))(\/(\d*))$/          
        }
    },
    defaults = {
        s : '0', // seconds   *   0,1,2,3,4,59   3-45   3-35/5
        i : '0', // minutes   *   0,1,2,3,4,59   3-45   3-35/5
        h : '0', // seconds   *   0,1,2,3,4,23   3-23   3-23/5
        dom : '*', // day of month   *   ?   3/4  12 12,13,15
        m : '*', // month
        dow : '?', // day of week
        y : '*', // year (1970-2099) ...how 1970 :D ??????
    };


module.exports = {
    labels,
    monthEnds,
    errors,
    defaults,
    rx,
    bounds,
    NUMBERS,
    SEVEN,
    THIRTYONE,
    THIRTY,
    TWENTYNINE,
    TWENTYEIGTH
};