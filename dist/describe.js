/*
quartzcron (v.0.0.42)
*/
const C = require('./constants.js');

const langUtils = require('./langUtils.js');

const utils = require('./utils.js');



const doubleDigitize = d => {
    return d < 10 ? `0${d}` : d;
};

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
    mat = target.match(/^(\d+)$/);
    
    if (mat) {
        return [
            ...pre,
            // atSingle(fn(mat[1]), mainStr),
            atSingle(mat),
            ...post
        ].join('');
    }

    // on every second from 5-th to 10th                /^\d+-\d*$/
    mat = target.match(/^(\d+)-(\d+)$/);
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
    spl = target.split(',');
    mat = spl.every(i => i.match(/^\d+$/));
    if (mat) {
        return [
            ...pre,
            // atMultiple(spl.map(fn), mainStrs),
            atMultiple(spl),
            ...post
        ].join('');
    }

    // every 3 seconds between 5-th and 10th second     /^\d+-\d\/\d+$/
    mat = target.match(/^(\d+)-(\d+)\/(\d+)$/);
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
};

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
                    return lu.everyX(lu.second);
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
                    });
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
                    });
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
                    ].join(', ');
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
                    });
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
                    ].join(', ');
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
                    ].join(', ');
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
                    ].join(', ');
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
        let mat, spl;
        if(!dom.match(/^[*?]$/)){
            // [1-31]
            mat = dom.match(C.rx.oneThirtyone);
            if (mat) {
                return [
                    lu.inMonthDay(mat[0]),
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join(', ');
            }

            // [1-31] / [1-31]
            mat = dom.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)\/([1-9]|1[0-9]|2[0-9]|3[01]|\*)$/);
            if (mat) {
                return [
                    lu.everyStartingFrom(mat[1], mat[2], lu.day),
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join(', ');
            }

            // [1-31] - [1-31]
            mat = dom.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)-([1-9]|1[0-9]|2[0-9]|3[01]|\*)$/);
            if (mat) {
                return [
                    lu.betweenMonthDays(mat[1], mat[2], lu.day),
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join(', ');
            }

            // [1-31] - [1-31] / [1-31]
            mat = dom.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)-([1-9]|1[0-9]|2[0-9]|3[01]|\*)\/([1-9]|1[0-9]|2[0-9]|3[01]|\*)$/);
            if (mat) {
                return [
                    lu.everyX(mat[3], lu.days),
                    ' ',
                    lu.betweenMonthDays(mat[1], mat[2], lu.day),
                    ', ',
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join('');
            }

            // [1-31], ....
            spl = dom.split(',');
            mat = spl.every(s => s.match(C.rx.oneThirtyone));
            if (mat) {
                return [
                    lu.multipleThe(dom, lu.day),
                    ', ',
                    mEvery && lu.everyX(lu.month)
                ].filter(Boolean).join('');
            }


            // L
            mat = dom.match(/^L$/);
            if (mat) {
                return [
                    lu.onThe(lu.last, lu.day),
                    lu.ofTheX(lu.month)
                ].join(' ');
            }

            // LW
            mat = dom.match(/^LW$/);
            if (mat) {
                return [
                    lu.onThe(lu.last, lu.weekday),
                    lu.ofTheX(lu.month)
                ].join(' ');
            }
            // [1-31]W
            mat = dom.match(/^([1-9]|1[0-9]|2[0-9]|3[01]|\*)W$/);
            if (mat) {
                return [
                    lu.nearestToThe(lu.weekday, mat[1]),
                    lu.ofTheX(lu.month)
                ].join(' ');
            }
            // L-n
            mat = dom.match(/^L-([1-9]|1[0-9]|2[0-9]|3[01])$/);
            if (mat) {
                const n = parseInt(mat[1], 10),
                    L = n > 1 ? lu.days : lu. day;
                return  [
                    lu.nX(mat[1], L),
                    lu.beforeTheEndOfThe(lu.month)
                ]. join(' ');
            }
        }
        if(!dow.match(/^[*?]$/)){
            const numDow = utils.daysLabels2Numbers(dow);
            
            // weekend
            mat = numDow.match(/^(7,1|1,7)$/);
            if(mat){
                return lu.everyX(lu.weekend);
            }

            // weekday
            mat = numDow.match(/^(2,3,4,5,6|2-6)$/);
            if(mat){
                return lu.everyX(lu.weekday);
            }

            // [1-7]|* / [1-7]
            // a/b : every b days starting on first a
            mat = numDow.match(/^([1-7]|\*)\/([1-7])$/);
            if (mat) {
                const fromFirstWd = mat[1]==='*' ? 1 : parseInt(mat[1], 10),
                    step = parseInt(mat[2]);
                // if start + step > 7
                // then the whole thing is actually like just start
                if(fromFirstWd + step > 7){
                    return lu.everyX(lu.weekdaysNames[fromFirstWd-1]);
                }
                return [
                    step > 1
                        ? lu.everyX(step, lu.days)
                        : lu.everyX(lu.day),
                    lu.ofTheX(lu.week),
                    lu.startingOn(lu.weekdaysNames[fromFirstWd-1])
                ].join(' ');
            }

            // one or more [1-7] OR [SUN-SAT] comma separated
            // mixed also ? 
            spl = numDow.split(/,/);
            mat = spl.map(s => s.match(/^(([1-7])|([1-7])\/([1-7]))$/)).filter(Boolean);
            if(spl.length === mat.length) {
                const max = 7;
                let collect = mat.reduce((acc, m) => {

                    let v2 = parseInt(m[2], 10);
                    if(typeof m[2] !== 'undefined') {
                        if(v2 <= max) acc.push(v2)
                    } else {
                        
                        let cursor = parseInt(m[3], 10);
                        const every = parseInt(m[4], 10);
                        while(cursor <= max){
                            acc.push(cursor);
                            cursor = every + cursor;
                        }
                    }
                    return acc;
                }, []).sort((a,b) => a > b ? 1 : -1);
                return lu.multipleDays(
                    collect.map(c => lu.weekdaysNames[c -1])
                )
            }

            // [1-7]-[1-7] OR [SUN-SAT]-[SUN-SAT]
            mat = numDow.match(/^(([1-7])-([1-7]))$/)
            if(mat) {
                const start = parseInt(mat[2], 10),
                    end = parseInt(mat[3], 10);
                return lu.betweenXY(
                     lu.weekdaysNames[start -1],
                     lu.weekdaysNames[end -1]
                );
            }

            // [1-7]-[1-7]/[1-7] OR [SUN-SAT]-[SUN-SAT]/[1-7]
            // a-b/c every c days between as and bs
            mat = numDow.match(/^(([1-7])-([1-7])\/([1-7]))$/)
            if(mat) {
                const start = parseInt(mat[2], 10),
                    end = parseInt(mat[3], 10),
                    cadence = parseInt(mat[4], 10);
                return [
                    lu.everyX(cadence, cadence > 1 ? lu.days: lu.day),
                    lu.betweenXY(
                        lu.weekdaysNames[start -1],
                        lu.weekdaysNames[end -1]
                    ),
                ].join(' ')
            }

            // [1-7]L
            // aL the last a of the month
            mat = numDow.match(/^([1-7])L$/)
            if(mat) {
                return lu.onLast(
                    lu.weekdaysNames[parseInt(mat[1], 10) -1],
                    lu.ofTheX(lu.month)
                )
            }

            // [1-7]#[1-5]
            // a#b the b-th a weekday of the month
            mat = numDow.match(/^([1-7])#([1-5])$/)
            if (mat) {
                
                return [
                    lu.onTheNth(parseInt(mat[2], 10), lu.weekdaysNames[parseInt(mat[1], 10) -1]),
                    lu.ofTheX(lu.month)
                ].join(' ')
            }

            return '';
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
            ].join(' ');
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
                });
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
                });
                
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
                ].join(', ');
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
        .join(', ');
};

module.exports = {
    describe
}