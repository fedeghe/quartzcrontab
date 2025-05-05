
const Quartzcron  = require('../dist/index.js');

describe('Quartzcron.next', () => {
    let c
    beforeEach(() => {
        c = new Quartzcron()
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
        it('use the remotest (cover real date)', () => {
            c.atYear('2099');
            const next = c.next()
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 01 Jan 2099 00:00:00 GMT"
            ])
        })
        it('1 - returns the expected', () => {
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
        it('2 - returns the expected', () => {
            c.atYear('2023');
            c.everyWeekDay('3,5')   // TUE, THU
            c.atMonth('2,4')        // FEB, APR
            const next = c.next({
                n:10,
                date: new Date('03:00:00 2-6-2023 GMT')// today 6th feb 2023
            })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Tue, 07 Feb 2023 00:00:00 GMT",
                "Thu, 09 Feb 2023 00:00:00 GMT",
                "Tue, 14 Feb 2023 00:00:00 GMT",
                "Thu, 16 Feb 2023 00:00:00 GMT",
                "Tue, 21 Feb 2023 00:00:00 GMT",
                "Thu, 23 Feb 2023 00:00:00 GMT",
                "Tue, 28 Feb 2023 00:00:00 GMT",
                "Tue, 04 Apr 2023 00:00:00 GMT",
                "Thu, 06 Apr 2023 00:00:00 GMT",
                "Tue, 11 Apr 2023 00:00:00 GMT",
            ])
        })
    })
    describe('some cases from static validate', () => {
        const d = new Date('01:00:00 6-5-2025 GMT')// 5th june 2025
        it('#1 - returns the expected from `0 0 0 * * ? *`', () => {
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Fri, 06 Jun 2025 00:00:00 GMT",
                "Sat, 07 Jun 2025 00:00:00 GMT",
                "Sun, 08 Jun 2025 00:00:00 GMT",
            ])
        })
        it('#2 - returns the expected from `* * * * * ? *`', () => {
            c.everySecond()
                .everyMinute()
                .everyHour()
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 05 Jun 2025 01:00:01 GMT",
                "Thu, 05 Jun 2025 01:00:02 GMT",
                "Thu, 05 Jun 2025 01:00:03 GMT",
            ])
        })
        it('#3 - returns the expected from `0 0 0 1 * ? *`', () => {
            c.atMonthDay(1)
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Tue, 01 Jul 2025 00:00:00 GMT",
                "Fri, 01 Aug 2025 00:00:00 GMT",
                "Mon, 01 Sep 2025 00:00:00 GMT",
            ])
        })
        it('#4 - returns the expected from `0 0 0 1 1 ? *`', () => {
            c.atMonthDay(1)
                .atMonth(1)
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 01 Jan 2026 00:00:00 GMT",
                "Fri, 01 Jan 2027 00:00:00 GMT",
                "Sat, 01 Jan 2028 00:00:00 GMT",
            ])
        })
        it('#5 - returns the expected from `0 0 0 L 1 ? *`', () => {
            c.onLastMonthDay()
                .atMonth(1)
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Sat, 31 Jan 2026 00:00:00 GMT",
                "Sun, 31 Jan 2027 00:00:00 GMT",
                "Mon, 31 Jan 2028 00:00:00 GMT",
            ])
        })
        it('#6 - returns the expected from `0 0 0 LW 1 ? *`', () => {
            c.onLastMonthWeekDay()
                .atMonth(1)
            const next = c.next({ n: 3, date: d })
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Fri, 30 Jan 2026 00:00:00 GMT",
                "Fri, 29 Jan 2027 00:00:00 GMT",
                "Mon, 31 Jan 2028 00:00:00 GMT",
            ])
        })
        it('#7 - returns the expected from `0 0 0 3W 1 ? *`', () => {
            c.onClosestWorkingDayToTheNMonthDay(3)
                .atMonth(1)
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('0 0 0 3W 1 ? *')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Fri, 02 Jan 2026 00:00:00 GMT",
                "Mon, 04 Jan 2027 00:00:00 GMT",
                "Mon, 03 Jan 2028 00:00:00 GMT",
            ])
        })
        it('#8 - returns the expected from `0,1,5 1-31/5 * ? JAN,FeB 7#3 2026,2028,2032`', () => {
            c.atSecond('0,1,5')
                .betweenMinutes(1,31,5)
                .everyHour()
                .atMonth('1,2')
                .onNWeekDayOfTheMonth(3,7)
                .atYear(2026)
                    .atYearAdd(2028).atYearAdd(2032)
            const next = c.next({ n: 10, date: d })
            expect(c.out()).toBe('0,1,5 1-31/5 * ? 1,2 7#3 2026,2028,2032')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Sat, 17 Jan 2026 00:01:00 GMT",
                "Sat, 17 Jan 2026 00:01:01 GMT",
                "Sat, 17 Jan 2026 00:01:05 GMT",
                "Sat, 17 Jan 2026 00:06:00 GMT",
                "Sat, 17 Jan 2026 00:06:01 GMT",
                "Sat, 17 Jan 2026 00:06:05 GMT",
                "Sat, 17 Jan 2026 00:11:00 GMT",
                "Sat, 17 Jan 2026 00:11:01 GMT",
                "Sat, 17 Jan 2026 00:11:05 GMT",
                "Sat, 17 Jan 2026 00:16:00 GMT",
            ])
        })
        it('#9 - returns the expected from `* * * ? JAN,FEB 7#3 2026,2028,2032`', () => {
            c.everySecond()
                .everyMinute()
                .everyHour()
                .atMonth('1,2')
                .onNWeekDayOfTheMonth(3,7)
                .atYear(2026)
                    .atYearAdd(2028).atYearAdd(2032)
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('* * * ? 1,2 7#3 2026,2028,2032')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Sat, 17 Jan 2026 00:00:00 GMT",
                "Sat, 17 Jan 2026 00:00:01 GMT",
                "Sat, 17 Jan 2026 00:00:02 GMT",
            ])
        })
        it('#10 - returns the expected from `* * * ? JAN-DEC/2 7#3 2026-2080/4`', () => {
            c.everySecond()
                .everyMinute()
                .everyHour()
                .betweenMonths('JAN', 'DEC', 2)
                .onNWeekDayOfTheMonth(3,7)
                .betweenYears(2026, 2080, 4)
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('* * * ? JAN-DEC/2 7#3 2026-2080/4')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Sat, 17 Jan 2026 00:00:00 GMT",
                "Sat, 17 Jan 2026 00:00:01 GMT",
                "Sat, 17 Jan 2026 00:00:02 GMT",
            ])
        })
        it('#11 - returns the expected from `0 */2 * ? * * *`', () => {
            c.everyNMinutes(2)
                .everyHour()
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('0 0/2 * * * ? *')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 05 Jun 2025 01:02:00 GMT",
                "Thu, 05 Jun 2025 01:04:00 GMT",
                "Thu, 05 Jun 2025 01:06:00 GMT",
            ])
        })
        it('#12 - returns the expected from `0 1/2 * ? * * *`', () => {
            c.everyNMinutes(2, 1)
                .everyHour()
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('0 1/2 * * * ? *')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 05 Jun 2025 01:01:00 GMT",
                "Thu, 05 Jun 2025 01:03:00 GMT",
                "Thu, 05 Jun 2025 01:05:00 GMT",
            ])
        })
        it('#13 - returns the expected from `0 1/2 * ? * * *`', () => {
            c.everyNMinutes(2, 1)
                .everyHour()
            const next = c.next({ n: 3, date: d })
            expect(c.out()).toBe('0 1/2 * * * ? *')
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 05 Jun 2025 01:01:00 GMT",
                "Thu, 05 Jun 2025 01:03:00 GMT",
                "Thu, 05 Jun 2025 01:05:00 GMT",
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
