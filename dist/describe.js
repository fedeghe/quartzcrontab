/*
quartzcron (v.0.0.39)
*/
const C = require('./constants.js');

const langUtils = require('./langUtils.js')



const doubleDigitize = d => {
    return d < 10 ? `0${d}` : d;
}

const digIt = ({
    o,
    key,
    pre, 
    post,
    atSingle,
    atMultiple,
    between,
    every, 
    everys

}) => {
    const target = o[key];
    let mat, spl;
    // every x-th second                                /^\d+$/
    mat = target.match(/^(\d+)$/)
    
    if (mat) {
        return [
            ...pre,
            // atSingle(fn(mat[1]), mainStr),
            atSingle(mat),
            ...post
        ].join('');
    }

    // on every second from 5-th to 10th                /^\d+-\d*$/
    mat = target.match(/^(\d+)-(\d+)$/)
    if (mat) {
        return [
            ...pre,
            every(),
            ' ',
            // between(fn(mat[1]), fn(mat[2])),
            between(mat),
            ...post
        ].join('');
    }

    // at second 1, 3 and 30
    spl = target.split(',')
    mat = spl.every(i => i.match(/^\d+$/))
    if (mat) {
        return [
            ...pre,
            // atMultiple(spl.map(fn), mainStrs),
            atMultiple(spl),
            ...post
        ].join('');
    }

    // every 3 seconds between 5-th and 10th second     /^\d+-\d\/\d+$/
    mat = target.match(/^(\d+)-(\d+)\/(\d+)$/)
    if (mat) {
        return [
            ...pre,
            everys(mat),
            ' ',
            // between(fn(mat[1]), fn(mat[2])),
            between(mat),
            ...post
        ].join('');
    }
}

const describeTime = ({ s, i, h }, lu) => {
        //one ? 
        const sMatch = s.match(/^(\d+)$/),
            iMatch = i.match(/^(\d+)$/),
            hMatch = h.match(/^(\d+)$/),
            sEvery = s === '*',
            iEvery = i === '*',
            hEvery = h === '*';
        let mat, spl;
        // all one
        if(sMatch && iMatch && hMatch){
            const _s = parseInt(sMatch[0]),
                _i = parseInt(iMatch[0]),
                _h = parseInt(hMatch[0]);
            return lu.atX(`${doubleDigitize(_h)}:${doubleDigitize(_i)}:${doubleDigitize(_s)}`);
        }
        
        
        if (hEvery) {
            if (iEvery) {
                if (sEvery) { 
                    // every second, every minute, every hour
                    return lu.everyX(lu.second)
                } else {
                    return digIt({
                        o: { s, i, h },
                        key: 's',
                        pre: [],
                        post: [ lu.comma, ' ', lu.everyX(lu.minute)],
                        every: () => lu.everyX(lu.second),
                        everys: mat => lu.everyX(mat[3], lu.seconds),

                        atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.second),
                        atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.seconds),
                        between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                    })
                }
            } else {
                if (sEvery) {
                    // every second, ? minutes, every hour
                    return digIt({
                        o: { s, i, h },
                        key: 'i',
                        pre: [ lu.everyX(lu.second), lu.comma, ' ',],
                        post: [],
                        every: () => lu.everyX(lu.minute),
                        everys: mat => lu.everyX(mat[3], lu.minutes),
                        atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.minute),
                        atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.minutes),
                        between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                    })
                } else {
                    // ? second, ? minute, every hour
                    return [
                        digIt({
                            o: { s, i, h },
                            key: 's',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.second),
                            everys: mat => lu.everyX(mat[3], lu.seconds),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.second),
                        atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.seconds),
                        between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        }),
                        digIt({
                            o: { s, i, h },
                            key: 'i',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.minute),
                            everys: mat => lu.everyX(mat[3], lu.minutes),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.minute),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.minutes),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        })
                    ].join(', ')
                }
            }
        } else {
            if (iEvery) {
                if (sEvery) {
                    // every second, every minute, ? hour
                    return digIt({
                        o: { s, i, h },
                        key: 'h',
                        pre: [ lu.everyX(lu.second), ', ',],
                        post: [],
                        every: () => lu.everyX(lu.hour),
                        everys: mat => lu.everyX(mat[3], lu.hours),
                        atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.hour),
                        atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.hours),
                        between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                    })
                } else {
                    // ? second, every minute, ? hour
                    return [
                        digIt({
                            o: { s, i, h },
                            key: 's',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.second),
                            everys: mat => lu.everyX(mat[3], lu.seconds),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.second),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.seconds),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        }),
                        digIt({
                            o: { s, i, h },
                            key: 'h',
                            pre: [ lu.everyX(lu.minute), ', '],
                            post: [],
                            every: () => lu.everyX(lu.hour),
                            everys: mat => lu.everyX(mat[3], lu.hours),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.hour),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.hours),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        })
                    ].join(', ')
                }
            } else {
                if (sEvery) {
                    // every second, ? minute, ?hour
                    return [
                        digIt({
                            o: { s, i, h },
                            key: 'i',
                            pre: [lu.everyX(lu.second), ', '],
                            post: [],
                            every: () => lu.everyX(lu.minute),
                            everys: mat => lu.everyX(mat[3], lu.minutes),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.minute),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.minutes),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        }),
                        digIt({
                            o: { s, i, h },
                            key: 'h',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.hour),
                            everys: mat => lu.everyX(mat[3], lu.hours),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.hour),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.hours),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        })
                    ].join(', ')
                } else {
                    // ? second, ? minute, ? hour
                    return [
                        digIt({
                            o: { s, i, h },
                            key: 's',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.second),
                            everys: mat => lu.everyX(mat[3], lu.seconds),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.second),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.seconds),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        }),
                        digIt({
                            o: { s, i, h },
                            key: 'i',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.minute),
                            everys: mat => lu.everyX(mat[3], lu.minutes),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.minute),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.minutes),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        }),
                        digIt({
                            o: { s, i, h },
                            key: 'h',
                            pre: [],
                            post: [],
                            every: () => lu.everyX(lu.hour),
                            everys: mat => lu.everyX(mat[3], lu.hours),
                            atSingle: mat => lu.atX(doubleDigitize(mat[1]), lu.hour),
                            atMultiple: spl => lu.atMultipX(spl.map(doubleDigitize), lu.hours),
                            between: mat => lu.betweenXY(doubleDigitize(mat[1]), doubleDigitize(mat[2])),
                        })
                    ].join(', ')
                }
            }
        }
    },

    describeDomDowOccurrence = ({h,i,s, dom, dow, m, y}, lu) => {
        const mEvery = m === '*',
            yEvery = y === '*';
        if(
            (dow === '*' && dom==='?')
            ||
            (dom === '*' && dow==='?')
        ) {
            if(h === '*' || i === '*' || s === '*') return '';
            return lu.everyX(lu.day);
        }
        let mat
        if(!dom.match(/^[*?]$/)){
            // [1-31]
            mat = dom.match(C.rx.oneThirtyone);
            if (mat) {
                return [
                    lu.inMonthDay(mat[0]),
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join(', ');
            }

            // [1-31] - [1-31]
            mat = dom.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)-(([1-9]|1[0-9]|2[0-9]|3[01]|\*))$/);
            if (mat) {
                return [
                    lu.bwtweenMonthDays(mat[1], mat[2]),
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join(', ');
                return '';
            }
        }
        if(!dow.match(/^[*?]$/)){
            return 'dow'
        }
        return '';
    },
    describeMonthsYears = ({y, m, dom, dow}, lu) => {
        const yMatch = y.match(/^(\d+)$/),
            mMatch = m.match(/^(\d+)$/),
            yEvery = y === '*',
            mEvery = m === '*';

        // all one
        if (yMatch && mMatch) {
            const _y = parseInt(yMatch[0]),
                _m = parseInt(mMatch[0]);
            return [
                lu.inX(lu.monthsNames[_m-1]),
                _y,
            ].join(' ')
        }
        if (yEvery) { // every year
            if (mEvery) { //every month
                return '';//lu.everyX(lu.month)// nothing!
            } else {
                // ? month, every year
                return digIt({
                    o: { y, m },
                    key: 'm',
                    pre: [],
                    post: [],
                    every: () => lu.everyX(lu.month),
                    everys: mat => lu.everyX(mat[3], lu.months),
                    atSingle: mat => lu.inX(lu.monthsNames[parseInt(mat[1], 10)-1]),
                    atMultiple: spl => lu.inMultipX(spl.map(m => lu.monthsNames[parseInt(m, 10)-1])),
                    between: mat => lu.betweenXY(lu.monthsNames[parseInt(mat[1], 10)-1], lu.monthsNames[parseInt(mat[2], 10)-1]),
                })
            }
        } else {
            if (mEvery) {
                // every month, ? year
                return digIt({
                    o: { y, m },
                    key: 'y',
                    pre: [],
                    post: [],
                    every: () => lu.everyX(lu.year),
                    everys: mat => lu.everyX(mat[3], lu.years),
                    atSingle: mat => lu.inX(mat[1]),
                    atMultiple: spl => lu.inMultipX(spl),
                    between: mat => lu.betweenXY(mat[1], mat[2]),
                })
                
            } else {
                // ? month, ? year
                return [
                    digIt({
                        o: { y, m },
                        key: 'm',
                        pre: [],
                        post: [],
                        every: () => lu.everyX(lu.month),
                        everys: mat => lu.everyX(mat[3], lu.months),
                        atSingle: mat => lu.inX(lu.monthsNames[parseInt(mat[1], 10)-1]),
                        atMultiple: spl => lu.inMultipX(spl.map(m => lu.monthsNames[parseInt(m, 10)-1])),
                        between: mat => lu.betweenXY(lu.monthsNames[parseInt(mat[1], 10)-1], lu.monthsNames[parseInt(mat[2], 10)-1]),
                    }),
                    digIt({
                        o: { y, m },
                        key: 'y',
                        pre: [],
                        post: [],
                        every: () => lu.everyX(lu.year),
                        everys: mat => lu.everyX(mat[3], lu.years),
                        atSingle: mat => mat[1],
                        atMultiple: spl => lu.inMultipX(spl),
                        between: mat => lu.betweenXY(mat[1], mat[2]),
                    })
                ].join(', ')
            }
        }
    };

// elements, langUtils(fns)
const describe = (els, lu) => {
    // console.log({lu})
    return [
        describeTime(els, lu),
        describeDomDowOccurrence(els, lu),
        describeMonthsYears(els, lu)
    ].filter(Boolean)
        .join(', ')
}

module.exports = {
    describe
}