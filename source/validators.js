const { rx, errors } = require('./constants.js');
const getRangeValidator = (mainRx, cadenceRx) => val => {
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
    fieldCorrelationValidators = [{
        validator: ({dom, dow}) =>  !(dow!=='?' && dom!=='?') && !(dow==='?'&&dom==='?'),
        message: errors.domdowExclusivity
    }];
module.exports = {
    validators: {
        second: rx059,
        minute: rx059,
        hour: rx023,
        month: rxmonth,
        year: rxYear,
        dayOfMonth: rxDom,
        dayOfWeek: rxDow
    },
    fieldCorrelationValidators
};
