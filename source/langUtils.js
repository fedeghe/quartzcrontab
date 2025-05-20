

const thize = (n, {oneSt, twoNd, threeRd, nTh}) => {
        const s = `${n}`;
        if(n>=11 && n<=14) return nTh;
        if(s.endsWith('1') ) return oneSt;
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
    nX:  (x, L) =>l.snt.n
        .replace(/%ph1/, x)
        .replace(/%ph2/, L),
    atX:  getDual(l.snt.at, l.snt.atL),
    inX:  getDual(l.snt.in, l.snt.inL),
    ofTheX: getDual(l.snt.ofThe, l.snt.ofTheL),
    betweenXY: (x, y) => l.snt.between.replace(/%ph1/, x).replace(/%ph2/, y),
    atMultipX: getMult(l.snt.multipleAt, l.snt.multipleAtL),
    inMultipX: getMult(l.snt.multipleIn, l.snt.multipleInL),
    inMonthDay: x => {
        const v = parseInt(x, 10);
        return l.snt.monthDay
            .replace(/%ph1/, v)
            .replace(/%ph2/, thize(v, l.snt));
    },
    betweenMonthDays: (x, y, L) => {
        const v1 = parseInt(x, 10),
            v2 = parseInt(y, 10);
        return l.snt.betweenMonthDaysL
            .replace(/%ph1/, v1)
            .replace(/%ph2/, thize(v1, l.snt))
            .replace(/%ph3/, v2)
            .replace(/%ph4/, thize(v2, l.snt))
            .replace(/%ph5/, L);
    },
    everyStartingFrom: (x, y, L) => {
        const eve = parseInt(x, 10),
            sta = parseInt(y, 10);
        return l.snt.everyStartingFromL
            .replace(/%ph1/, eve)
            .replace(/%ph2/, sta+''+thize(sta, l.snt))
            .replace(/%ph3/, L);
    },
    multipleThe: n => {
        const last = n.pop(),
            thSet = n.map(v => v + '' +thize(v, l.snt)).join(`${l.comma} `),
            thLast = last + ''+thize(last, l.snt);
        return l.snt.multipleThe
            .replace(/%ph1/, thSet)
            .replace(/%ph2/, thLast);

    },
    multipleTheL: (n, L) => {
        const last = n.pop(),
            thSet = n.map(v => v + '' +thize(v, l.snt)).join(`${l.comma} `),
            thLast = last + ''+thize(last, l.snt);
        return l.snt.multipleTheL
            .replace(/%ph1/, thSet)
            .replace(/%ph2/, thLast)
            .replace(/%ph3/, L);

    },
    multipleDays: n => {
        const last = n.pop(),
            thSet = n.join(`${l.comma} `);
        return l.snt.multipleWDays
            .replace(/%ph1/, thSet)
            .replace(/%ph2/, last);

    },
    multiple: n => {
        const last = n.pop(),
            thSet = n.join(`${l.comma} `);
        return l.snt.multiple
            .replace(/%ph1/, thSet)
            .replace(/%ph2/, last);

    },
    onThe: (one, two) => l.snt.onTheL
            .replace(/%ph1/, one)
            .replace(/%ph2/, two),
    nearestToThe: (what, n) => l.snt.nearestToThe
        .replace(/%ph1/, what)
        .replace(/%ph2/, n)
        .replace(/%ph3/, thize(n, l.snt)),
    beforeTheEndOfThe: what => l.snt.beforeTheEndOfThe
            .replace(/%ph1/, what),
    startingOn: what => l.snt.startingOn
            .replace(/%ph1/, what),
    startingFrom: what => l.snt.startingFrom
            .replace(/%ph1/, what),
    onLast: (x, y) => l.snt.onLast
            .replace(/%ph1/, x)
            .replace(/%ph2/, y),
    onTheNth: (n, L) => l.snt.onTheNthL
            .replace(/%ph1/, n+thize(n, l.snt))
            .replace(/%ph2/, L),
    thize: n => n+thize(n, l.snt),
    ...l,
});

module.exports = {
    getLangUtils
};
