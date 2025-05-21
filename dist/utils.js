/*
quartzcron (v.0.0.44)
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
const { defaults, rx, labels } = require('./constants.js');

const argumentize = o => {
        const ty = typeof o;
        switch(ty) {
            case 'string': return exp2elements(o);
            case 'object': return {...defaults, ...o};
            default:;
        }
        return {...defaults};
    },

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
    defaults,
    yearNow,
    removeSpaces,
    daysLabels2Numbers,
    exp2elements,
    argumentize
};
