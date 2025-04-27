const labels = {
    days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    monthss: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
}
const monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];

const errors = {
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
    domdowExclusivity: 'either dom either dow must contain "?"'
}

const defaults = {
    s : '0', // seconds   *   0,1,2,3,4,59   3-45   3-35/5
    i : '0', // minutes   *   0,1,2,3,4,59   3-45   3-35/5
    h : '0', // seconds   *   0,1,2,3,4,23   3-23   3-23/5
    dom : '*', // day of month   *   ?   3/4  12 12,13,15
    m : '*', // month
    dow : '?', // day of week
    y : '*', // year (1970-2099) ...how 1970 :D ??????
}

module.exports = {
    labels,
    monthEnds,
    errors,
    defaults
}