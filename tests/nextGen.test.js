
const Quartzcron  = require('../dist/index.js');
const C = require('../dist/constants.js');

describe('Quartzcron.next', () => {
    let c
    beforeEach(() => {
        c = new Quartzcron()
    })

    describe('basic next coverage cases', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'too late',
                i => i.atYear(2024)
                    .betweenMonths(1, 3)
                    .atWeekDay('1')
                    .atHour('1,5'),
                1,
                s=>s.toString(),
                new Date('18:00:00 1-2-2025'),
                []
            ],
            [
                'dow',
                i => i.atYear(2024)
                    .atMonth(2)
                    .atWeekDay('2')
                    .atHour('1,5'),
                10,
                s=>s.toUTCString(),
                new Date('18:00:00 1-2-2024'),
                [
                    "Mon, 05 Feb 2024 01:00:00 GMT",
                    "Mon, 05 Feb 2024 05:00:00 GMT",
                    "Mon, 12 Feb 2024 01:00:00 GMT",
                    "Mon, 12 Feb 2024 05:00:00 GMT",
                    "Mon, 19 Feb 2024 01:00:00 GMT",
                    "Mon, 19 Feb 2024 05:00:00 GMT",
                    "Mon, 26 Feb 2024 01:00:00 GMT",
                    "Mon, 26 Feb 2024 05:00:00 GMT",
                ]
            ],
            [
                'dom',
                i => i.atYear('2024,2026')
                    .atMonth(1)
                    .onLastMonthDay()
                    .atHour(1),
                10,
                s=>s.toGMTString(),
                new Date('00:00:01 1-15-2023 GMT'),
                [
                    "Wed, 31 Jan 2024 01:00:00 GMT",
                    "Sat, 31 Jan 2026 01:00:00 GMT",
                ]
            ],
            [
                'weekdays',
                i => i.atYear('2024,2026')
                    .atMonth(1)
                    .atWeekDay('2,3,4,5,6')
                    .atHour(1),
                10,
                s=>s.toUTCString(),
                new Date('00:00:01 1-15-2023 GMT'),
                [
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
                ]
            ],
            [
                'weekdays',
                i => i.atYear('2025')
                        .atWeekDay('3,5')
                        .atHour('2,4')   
                        .atMonth('6,8'),
                    20,
                    s=>s.toUTCString(),
                    new Date('03:00:00 6-5-2025 GMT'),
                    [
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
                    ]
            ],
            [
                'too late #2',
                i => i.atYear('2025')
                        .atWeekDay('3,5')
                        .atHour('2,4')   
                        .atMonth('6,8'),
                    20,
                    s=>s.toUTCString(),
                    new Date('03:00:00 6-5-2025 GMT'),
                    [
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
                    ]
            ],
            [
                'too late #3 - weekdays',
                i => i.atYear('2023')
                        .atWeekDay('3,5')   // TUE, THU
                        .atMonth('2,4'),        // FEB, APR
                    10,
                    s=>s.toUTCString(),
                    new Date('03:00:00 2-6-2023 GMT'),// today 6th feb 2023
                    [
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
                    ]
            ],
            [
                'mixed days',
                i => i.atYear('2023')
                        .atMonthDay(2).atMonthDayAdd(5, 7)
                        .atMonth(4, 3).atMonthAdd(2),
                    10,
                    s=>s.toUTCString(),
                    new Date('03:00:00 2-6-2023 GMT'),// today 6th feb 2023
                    [
                        "Sun, 12 Feb 2023 00:00:00 GMT",
                        "Sun, 19 Feb 2023 00:00:00 GMT",
                        "Sun, 26 Feb 2023 00:00:00 GMT",
                        "Sun, 02 Apr 2023 00:00:00 GMT",
                        "Wed, 05 Apr 2023 00:00:00 GMT",
                        "Wed, 12 Apr 2023 00:00:00 GMT",
                        "Wed, 19 Apr 2023 00:00:00 GMT",
                        "Wed, 26 Apr 2023 00:00:00 GMT",
                        "Sun, 02 Jul 2023 00:00:00 GMT",
                        "Wed, 05 Jul 2023 00:00:00 GMT",
                    ]
            ],[
                'sorted mixed days',
                i => i.atYear('2023')
                        .atMonthDay(4).atMonthDayAdd(1).atMonthDayAdd(5, 7),
                    10,
                    s=>s.toUTCString(),
                    new Date('03:00:00 2-6-2023 GMT'),// today 6th feb 2023
                    [
                        "Sun, 12 Feb 2023 00:00:00 GMT",
                        "Sun, 19 Feb 2023 00:00:00 GMT",
                        "Sun, 26 Feb 2023 00:00:00 GMT",
                        "Wed, 01 Mar 2023 00:00:00 GMT",
                        "Sat, 04 Mar 2023 00:00:00 GMT",
                        "Sun, 05 Mar 2023 00:00:00 GMT",
                        "Sun, 12 Mar 2023 00:00:00 GMT",
                        "Sun, 19 Mar 2023 00:00:00 GMT",
                        "Sun, 26 Mar 2023 00:00:00 GMT",
                        "Sat, 01 Apr 2023 00:00:00 GMT",
                    ]
            ],

        ])('%s', (_ , prep, n, trans, date, expected) => {
            prep(qc)
            expect(
                qc.next({ n, date }).map(trans)
            ).toMatchObject(expected)
        })
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
        it('next handles the passed', () => {
            c.atYear('2099');
            const next = c.next()
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject([
                "Thu, 01 Jan 2099 00:00:00 GMT"
            ])
        })
    })
    describe('some cases from static validate', () => {
        const date = new Date('01:00:00 6-5-2025 GMT')// 5th june 2025
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                '0 0 0 * * ? *',
                i => {},
                3,
                [
                    "Fri, 06 Jun 2025 00:00:00 GMT",
                    "Sat, 07 Jun 2025 00:00:00 GMT",
                    "Sun, 08 Jun 2025 00:00:00 GMT",
                ]
            ],
            [
                '* * * * * ? *',
                i => i.everySecond().everyMinute().everyHour(),
                3,
                [
                    "Thu, 05 Jun 2025 01:00:01 GMT",
                    "Thu, 05 Jun 2025 01:00:02 GMT",
                    "Thu, 05 Jun 2025 01:00:03 GMT",
                ]
            ],
            [
                '0 0 0 1 * ? *',
                i => i.atMonthDay(1),
                3,
                [
                    "Tue, 01 Jul 2025 00:00:00 GMT",
                    "Fri, 01 Aug 2025 00:00:00 GMT",
                    "Mon, 01 Sep 2025 00:00:00 GMT",
                ]
            ],
            [
                '0 0 0 1 1 ? *',
                i => i.atMonthDay(1).atMonth(1),
                3,
                [
                    "Thu, 01 Jan 2026 00:00:00 GMT",
                    "Fri, 01 Jan 2027 00:00:00 GMT",
                    "Sat, 01 Jan 2028 00:00:00 GMT",
                ]
            ],
            [
                '0 0 0 L 1 ? *',
                i => i.onLastMonthDay().atMonth(1),
                3,
                [
                    "Sat, 31 Jan 2026 00:00:00 GMT",
                    "Sun, 31 Jan 2027 00:00:00 GMT",
                    "Mon, 31 Jan 2028 00:00:00 GMT",
                ]
            ],
            [
                '0 0 0 LW 1 ? *',
                i => i.onLastMonthWeekDay().atMonth(1),
                3,
                [
                    "Fri, 30 Jan 2026 00:00:00 GMT",
                    "Fri, 29 Jan 2027 00:00:00 GMT",
                    "Mon, 31 Jan 2028 00:00:00 GMT",
                ]
            ],
            [
                '0 0 0 3W 1 ? *',
                i => i.onClosestWorkingDayToTheNMonthDay(3).atMonth(1),
                3,
                [
                    "Fri, 02 Jan 2026 00:00:00 GMT",
                    "Mon, 04 Jan 2027 00:00:00 GMT",
                    "Mon, 03 Jan 2028 00:00:00 GMT",
                ]
            ],
            [
                '0,1,5 1-31/5 * ? 1,2 7#3 2026,2028,2032',
                i => i.atSecond('0,1,5')
                    .betweenMinutes(1,31,5)
                    .everyHour()
                    .atMonth('1,2')
                    .onNWeekDayOfTheMonth(3,7)
                    .atYear(2026)
                    .atYearAdd(2028).atYearAdd(2032),
                10,
                [
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
                ]
            ],
            [
                '* * * ? 1,2 7#3 2026,2028,2032',
                i => i.everySecond()
                    .everyMinute()
                    .everyHour()
                    .atMonth('1,2')
                    .onNWeekDayOfTheMonth(3,7)
                    .atYear(2026)
                    .atYearAdd(2028).atYearAdd(2032),
                3,
                [
                    "Sat, 17 Jan 2026 00:00:00 GMT",
                    "Sat, 17 Jan 2026 00:00:01 GMT",
                    "Sat, 17 Jan 2026 00:00:02 GMT",
                ]
            ],
            [
                '* * * ? JAN-DEC/2 7#3 2026-2080/4',
                i => i.everySecond()
                    .everyMinute()
                    .everyHour()
                    .betweenMonths('JAN', 'DEC', 2)
                    .onNWeekDayOfTheMonth(3,7)
                    .betweenYears(2026, 2080, 4),
                3,
                [
                    "Sat, 17 Jan 2026 00:00:00 GMT",
                    "Sat, 17 Jan 2026 00:00:01 GMT",
                    "Sat, 17 Jan 2026 00:00:02 GMT",
                ]
            ],
            [
                '0 0/2 * * * ? *',
                i => i.everyNMinutes(2).everyHour(),
                3,
                [
                    "Thu, 05 Jun 2025 01:02:00 GMT",
                    "Thu, 05 Jun 2025 01:04:00 GMT",
                    "Thu, 05 Jun 2025 01:06:00 GMT",
                ]
            ],
            [
                '0 1/2 * * * ? *',
                i => i.everyNMinutes(2, 1).everyHour(),
                3,
                [
                    "Thu, 05 Jun 2025 01:01:00 GMT",
                    "Thu, 05 Jun 2025 01:03:00 GMT",
                    "Thu, 05 Jun 2025 01:05:00 GMT",
                ]
            ]
        ])('case %s', (str, act, n, exp) => {
            act(qc);
            const next = qc.next({ n, date });
            expect(qc.out()).toBe(str)
            expect(
                next.map(s=>s.toUTCString())
            ).toMatchObject(exp)
            expect(
                qc.next({ n, date, exp: str})
                    .map(s=>s.toUTCString())
            ).toMatchObject(exp)
        })
    })

    it('throws when invalid date is passed', () => {
        expect(
            () => c.next({
                date: new Date('18:19:20 56-37-2025')
            })
        ).toThrow(C.errors.invalidDate)
    })
})
