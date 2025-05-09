/*
quartzcron (v.0.0.38)
*/
const labels = {
        days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    },
    SEVEN = Array.from({length:7}, (_, i)=>i+1),
    THIRTYONE = Array.from({length:31}, (_, i)=>i+1),
    THIRTY = Array.from({length:30}, (_, i)=>i+1),
    TWENTYNINE = Array.from({length:29}, (_, i)=>i+1),
    TWENTYEIGTH = Array.from({length:28}, (_, i)=>i+1),

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
    },
    rx = {
        asterx: /^\*(\/\d*)?$/,
        zeroFiftynine: /^([0-5]{1}[0-9]{1}|[0-9]{1})$/,
        zeroTwentythree: /^([01]\d|2[0-3]|\d)$/,
        oneThirtyone: /^(?:[012]\d|3[0,1]|[1-9]{1})$/,
        oneThirtyoneW: /^(?:[012]\d|3[0,1]|[1-9]{1})W$/,
        weekday: /^(?:[1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)$/i,     /* this belowis exactly oneThirtyone */
        weekdayAfterX: /^(?:[1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)\/(?:[012]\d|3[0,1]|[1-9]{1})$/i,
        LW: /^LW?$/,

        //even this uses oneThirtyone
        Lx: /^(L-([012]\d|3[0,1]|[1-9]{1}))$/,

        xL31: /^([012]\d|3[0,1]|[1-9]{1})L$/,
        xLweekday: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)L$/i,

        nthWeekDay: /^([1-7]{1}|SUN|MON|TUE|WED|THU|FRI|SAT)\#[1-5]{1}$/i,
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
        
        month: /^(^0?[1-9]$)|(^1[0-2]$)|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/i,
        // year: /^(20[2-9][0-9])$/,
        year: /^(19[7-9]\d)|(20\d\d)$/,

        // match a valid cadence ()
        wildCadence: /^\d*$/,

        /**
         * splits number-number/number (second and third optionals)
         */
        splitter: /^([\d,\w]*)(-([\d\w]*))?(\/([\d\w]*))?$/,

        next: {
            hasMonths: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/,
            hasWeekdays: /SUN|MON|TUE|WED|THU|FRI|SAT/
        },
        ranges: {
            zero59cadence: /^(\*|(\d)|([1-5][0-9]))(\/((\d)|([1-5][0-9])))$/,
            one7cadence: /^(\*|([1-7]?))(\/([1-7]?))$/,
            one12cadence: /^(\*|([1-9][0-2]?))(\/([1-9][0-2]?))$/,

            // TODO: those two must be replaced with something range specific
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