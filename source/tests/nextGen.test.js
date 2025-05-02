
const Crontabist  = require('../dist/index.js');

describe('Crontabist.next', () => {
    let c
    beforeEach(() => {
        c = new Crontabist()
    })

    it('case 1- too late', () => {
        c.atYear(2024);
        c.betweenMonths(1, 3);
        c.everyWeekDay('1');
        c.atHour('1,5')
        expect(
            c.next({
                n:10,
                date: new Date('18:00:00 1-2-2025')
            })
        ).toMatchObject([])
    })
    it('case 2 - dow', () => {
        c.atYear(2024);
        // c.betweenMonths(2, 3);
        c.atMonth(2);
        c.everyWeekDay('2');
        c.atHour('1,5')
        expect(
            c.next({
                n:10,
                date: new Date('18:00:00 1-2-2024')
            }).map(s=>s.toString())
        ).toMatchObject([
            "Mon Feb 05 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 05 2024 06:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 12 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 12 2024 06:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 19 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 19 2024 06:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 26 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Feb 26 2024 06:00:00 GMT+0100 (Central European Standard Time)",
        ])
    })

    it('case 2 - dom', () => {
        c.atYear('2024,2026');
        c.atMonth(1);
        c.onLastMonthDay()
        c.atHour(1)
        const next = c.next({
            n:10,
            date: new Date('00:00:01 1-15-2023')
        })
        // console.log({next})
        expect(
            next.map(s=>s.toString())
        ).toMatchObject([
            "Wed Jan 31 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Sat Jan 31 2026 02:00:00 GMT+0100 (Central European Standard Time)",
        ])
    })
    it('case 3 - weekdays', () => {
        c.atYear('2024,2026');
        c.atMonth(1);
        c.everyWeekDay('2,3,4,5,6')
        c.atHour(1)
        const next = c.next({
            n:10,
            date: new Date('00:00:01 1-15-2023')
        })
        // console.log({next})
        expect(
            next.map(s=>s.toString())
        ).toMatchObject([
            "Mon Jan 01 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Tue Jan 02 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Wed Jan 03 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Thu Jan 04 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Fri Jan 05 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Mon Jan 08 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Tue Jan 09 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Wed Jan 10 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Thu Jan 11 2024 02:00:00 GMT+0100 (Central European Standard Time)",
            "Fri Jan 12 2024 02:00:00 GMT+0100 (Central European Standard Time)",
        ])
    })


    it('throws when invalid date is passed', () => {
        expect(
            () => c.next({
                date: new Date('18:19:20 56-37-2025')
            })
        ).toThrow('Invalid Date')
    })
})
