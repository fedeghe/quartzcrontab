
const Crontabist  = require('../dist/index.js');

describe('Crontabist.next', () => {

    let c
    beforeEach(() => {
        c = new Crontabist()
    })
    it('basic', () => {
        const d = new Date('18:19:20 12-31-2025'),
            r = c.next({
                date: d
            });
        expect(r.getFullYear()).toBe(2025)
    })
    it('throws when invalid date is passed', () => {
        expect(
            () => c.next({
                date: new Date('18:19:20 56-37-2025')
            })
        ).toThrow('Invalid Date')
    })
})
