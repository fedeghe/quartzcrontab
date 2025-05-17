/*
quartzcron (v.0.0.39)
*/


const thize = (n, {oneSt, twoNd, threeRd, nTh}) => {
        const s = `${n}`;
        if(s.endsWith('1')) return oneSt;
        if(s.endsWith('2')) return twoNd;
        if(s.endsWith('3')) return threeRd;
        return nTh;
    },
    getDual = (snt1, snt2) => (x, lb) => lb
        ? snt2.replace(/%ph2/, lb).replace(/%ph1/, x)
        : snt1.replace(/%ph1/, x),
    getMult = (snt1, snt2) => (s, lb) => {
        const last = s.pop();
        return lb
            ? snt2.replace(/%ph1/, lb).replace(/%ph2/, s.join(', ')).replace(/%ph3/, last)
            : snt1.replace(/%ph1/, s.join(', ')).replace(/%ph2/, last);
    };

const getLangUtils = l => ({
    everyX: getDual(l.snt.every, l.snt.everyL),
    atX:  getDual(l.snt.at, l.snt.atL),
    inX:  getDual(l.snt.in, l.snt.inL),
    ofTheX: getDual(l.snt.ofThe, l.snt.ofTheL),
    betweenXY: (x, y, lb) => lb
        ? l.snt.betweenL.replace(/%ph1/, x).replace(/%ph2/, y).replace(/%ph3/, lb)
        : l.snt.between.replace(/%ph1/, x).replace(/%ph2/, y),
    atMultipX: getMult(l.snt.multipleAt, l.snt.multipleAtL),
    inMultipX: getMult(l.snt.multipleIn, l.snt.multipleInL),
    inMonthDay: x => {
        const v = parseInt(x, 10)
        return l.snt.monthDay
            .replace(/%ph1/, v)
            .replace(/%ph2/, thize(v, l.snt))
    },
    bwtweenMonthDays: (x, y) => {
        const v1 = parseInt(x, 10),
            v2 = parseInt(y, 10);
        return l.snt.betweenMonthDays
            .replace(/%ph1/, v1)
            .replace(/%ph2/, thize(v1, l.snt))
            .replace(/%ph3/, v2)
            .replace(/%ph4/, thize(v2, l.snt))
    },
    ...l,
})

module.exports = {
    getLangUtils
};
