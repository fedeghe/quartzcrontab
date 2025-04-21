const ct = require('./dist')
const c = new ct();

[
    '0,1,5 0 * ? JAN,FEB 7#3 2026,2028,2032',
    '0 0 0 3W 1 ? *'
].forEach(exp => {
    console.log(c.validate(exp))
})