
const Crontabist  = require('../dist/index.js');

describe('Crontabist.next', () => {

    let c
    beforeEach(() => {
        c = new Crontabist()
    })
    
    it('throws when invalid date is passed', () => {
        expect(
            () => c.next({
                date: new Date('18:19:20 56-37-2025')
            })
        ).toThrow('Invalid Date')
    })
})
