const ct = require('./dist'),
    d = new Date('18:19:20 3-12-2025');
ct.next(d, {
    s: 21,
    i: 20,
    h: 19,
    dow: '?',
    m: 3,
    dom:11,
    y: 2025
})