
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
            date: new Date('00:00:01 1-15-2023 GMT')
        })
        // console.log({next})
        expect(
            next.map(s=>s.toGMTString())
        ).toMatchObject([
            "Wed, 31 Jan 2024 01:00:00 GMT",
            "Sat, 31 Jan 2026 01:00:00 GMT",
        ])
    })
    it('case 3 - weekdays', () => {
        c.atYear('2024,2026');
        c.atMonth(1);
        c.everyWeekDay('2,3,4,5,6')
        c.atHour(1)
        const next = c.next({
            n:10,
            date: new Date('00:00:01 1-15-2023 GMT')
        })
        expect(
            next.map(s=>s.toUTCString())
        ).toMatchObject([
            "Mon, 01 Jan 2024 01:00:00 GMT",
            "Tue, 02 Jan 2024 01:00:00 GMT",
            "Wed, 03 Jan 2024 01:00:00 GMT",
            "Thu, 04 Jan 2024 01:00:00 GMT",
            "Fri, 05 Jan 2024 01:00:00 GMT",
            "Mon, 08 Jan 2024 01:00:00 GMT",
            "Tue, 09 Jan 2024 01:00:00 GMT",
            "Wed, 10 Jan 2024 01:00:00 GMT",
            "Thu, 11 Jan 2024 01:00:00 GMT",
            "Fri, 12 Jan 2024 01:00:00 GMT",
        ])
    })
    describe('more case to return the expected', () => {
        it('1 - return the expected', () => {
            c.atYear('2025');
            c.everyWeekDay('3,5')
            c.atHour('2,4')   
            c.atMonth('6,8')   
            const next = c.next({
                n:20,
                date: new Date('03:00:00 6-5-2025 GMT')
            })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                // 1h too late for that
                // "Thu, 05 Jun 2025 02:00:00 GMT",
                "Thu, 05 Jun 2025 04:00:00 GMT",
                "Tue, 10 Jun 2025 02:00:00 GMT",
                "Tue, 10 Jun 2025 04:00:00 GMT",
                "Thu, 12 Jun 2025 02:00:00 GMT",
                "Thu, 12 Jun 2025 04:00:00 GMT",
                "Tue, 17 Jun 2025 02:00:00 GMT",
                "Tue, 17 Jun 2025 04:00:00 GMT",
                "Thu, 19 Jun 2025 02:00:00 GMT",
                "Thu, 19 Jun 2025 04:00:00 GMT",
                "Tue, 24 Jun 2025 02:00:00 GMT",
                "Tue, 24 Jun 2025 04:00:00 GMT",
                "Thu, 26 Jun 2025 02:00:00 GMT",
                "Thu, 26 Jun 2025 04:00:00 GMT",
                // no july
                "Tue, 05 Aug 2025 02:00:00 GMT",
                "Tue, 05 Aug 2025 04:00:00 GMT",
                "Thu, 07 Aug 2025 02:00:00 GMT",
                "Thu, 07 Aug 2025 04:00:00 GMT",
                "Tue, 12 Aug 2025 02:00:00 GMT",
                "Tue, 12 Aug 2025 04:00:00 GMT",
                "Thu, 14 Aug 2025 02:00:00 GMT",
            ])
        })
    })


    it('throws when invalid date is passed', () => {
        expect(
            () => c.next({
                date: new Date('18:19:20 56-37-2025')
            })
        ).toThrow('Invalid Date')
    })
})
