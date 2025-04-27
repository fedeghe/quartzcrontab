
const dateutils  = require('../dist/dateutils.js');
const C  = require('../dist/constants.js');

const {
    isLeap,
    lastMonthDay,
    nDaysBeforeEndOfMonth,
    nDayOfMonth,
    solveNumericRange,
    solve_year_ranges,
    solve_month_ranges,
    solve_week_ranges,
    solve_hours_ranges,
    solve_0_59_Range
} = dateutils
describe('date utils', () => {
    
    describe('isLeap', () => {
        describe('positives', () => {
            test.each([
                [2000, 2004, 2012, 2104, 2400],
            ])('%i', (arg) => {
                const res = isLeap(arg)
                expect(res).toBeTruthy()
            })
        })
        describe('negatives', () => {      
            test.each([
                [2003, 2100, 2200, 2205],
            ])('%i', (arg) => {
                const res = isLeap(arg)
                expect(res).toBeFalsy()
            })
        })
    })

    describe('lastMonthDay', () => {
        test.each([
            ['2000 jan gives 31', 2000, 0, 31],
            ['2000 feb(leap) gives 29', 2000, 1, 29],
            ['2001 feb gives 28', 2001, 1, 28],
            ['2100 feb gives 28', 2100, 1, 28],
            ['2025 jan gives 31', 2025, 0, 31, true],
            ['2025 may 31 is sat, gives 30 (weekday option)', 2025, 4, 30, true], // 31 may 2025 is sat, expect fri 30
            ['2025 aug 31 is sun, gives 29 (weekday option)', 2025, 7, 29, true], // 31 aug 2025 is sun, expect fri 29
        ])('%s', (_, y, m, expected, wd=false) => {
            const res = lastMonthDay(y, m, wd)
            expect(res).toBe(expected)
        })
    })

    describe('nDaysBeforeEndOfMonth', () => {
        describe('positives', () => {
            test.each([
                [1, 2000, 0, 30],
                [2, 2000, 1, 27],
                [3, 2001, 1, 25],
                [4, 2100, 1, 24],
            ])('%i', (n, y, m, expected) => {
                const res = nDaysBeforeEndOfMonth(n, y, m)
                expect(res).toBe(expected)
            })
        })
        describe('throws', () => {
            test.each([
                ['31-50 -> err', 50, 2000, 0],
                ['31-32 -> err', 32, 2000, 0],
                ['31-31 -> err', 31, 2000, 0],
            ])('%s', (_, n, y, m) => {

                expect(
                    () => nDaysBeforeEndOfMonth(n, y, m)
                ).toThrow('not enough days');
            })
        })

    })

    describe('nDayOfMonth', () => {
            /*  jan 2025
                --------
                M1 T2 W3 T4 F5 S6 S0
                      1  2  3  4  5
                6  7  8  9 10 11 12
               13 14 15 16 17 18 19
               20 21 22 23 24 25 26
               27 28 29 30 31
            */
        describe('positives', () => {
            test.each([
                ['1st wednesday jan 2025', 1, 3, 2025, 0,  1],
                ['1st monday jan 2025', 1, 1, 2025, 0,  6],
                ['2nd monday jan 2025', 2, 1, 2025, 0,  13],
                ['2nd sunday jan 2025', 2, 0, 2025, 0,  12],
                ['3rd sunday jan 2025', 3, 0, 2025, 0,  19],
                ['4th sunday jan 2025', 4, 0, 2025, 0,  26],
                ['4th sunday jan 2025', 4, 0, 2025, 0,  26],
                ['5th Friday jan 2025', 5, 5, 2025, 0,  31],
            ])('%s', (_, n, wd, y, m, expected) => {
                const res = nDayOfMonth(n, wd, y, m)
                expect(res).toBe(expected)
            })
        })
        describe('throws', () => {
            test.each([
                ['lower wd violation', 1, -1, 2025, 0],
                ['higher wd violation', 1, 7, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('given weekday does not exist [0-6]')
            })

            test.each([
                ['lower target #wd violation', -1, 1, 2025, 0],
                ['higher target #wd violation', 6, 1, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('not enough days in any month')
            })

            test.each([
                ['5th sat would be 32', 5, 6, 2025, 0],
                ['5th sun would be 33', 5, 0, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('not enough days in this month')
            })
        })
    })

    describe('solveNumericRange', () => {
        test.each([
            ['one int', 2, [2]],
            ['one str', '2', [2]],
            ['comma sep', '3,1,7', [1,3,7]],
            ['range', '3-7', [3,4,5,6,7]],
            ['range/cadence #1', '2-18/4', [2,6,10,14,18]],
            ['range/cadence #2', '2-21/4', [2,6,10,14,18]],
            ['range/cadence #3', '2-22/4', [2,6,10,14,18,22]],
            ['range/cadence #4', '2-21/3', [2,5,8,11,14,17,20]],
            // some year specific case just to check
            ['year', '1990', [1990]],
            ['years', '1990,1992', [1990,1992]],
            ['years range', '1990-1994', [1990, 1991, 1992, 1993, 1994]],
            ['years range with cadence', '1990-1999/2', [1990, 1992, 1994, 1996, 1998]],
        ])('%s', (_, n, expected) => {
            expect(solveNumericRange(n)).toMatchObject(expected)
        })
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solveNumericRange(n)).toBe(expected)
        })
    })

    describe('solve_year_ranges', () => {
        const allYears = Array.from({
            length:C.bounds.year.max - C.bounds.year.min + 1
        }, (_,i) => i + C.bounds.year.min)
        test.each([
            ['one', '1989', [1989]],
            ['more', '1989,1999,2013', [1989,1999,2013]],
            ['more unsorted', '1999,1989,2013', [1989,1999,2013]],
            ['every', '*', allYears],
            ['every even', '*/2', allYears.filter(y => y%2===0)],
            ['every even', '1970/2', allYears.filter(y => y%2===0)],
            ['every odd', '1971/2', allYears.filter(y => y%2===1)],
            ['range', '1990-1994', [1990,1991,1992,1993,1994]],
            ['range with cadence', '1990-1998/2', [1990,1992,1994,1996,1998]],
        ])('%s', (_, n, expected) => {
            expect(solve_year_ranges(n)).toMatchObject(expected)
        })
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solve_year_ranges(n)).toBe(expected)
        })
    })

    describe('solve_month_ranges', () => {
        const allMonths = Array.from({
            length:C.bounds.month.max - C.bounds.month.min + 1
        }, (_,i) => i + C.bounds.month.min)
        test.each([
            ['one', '2', [2]],
            ['one label', 'FEB', [2]],
            ['more', '1,3,7', [1,3,7]],
            ['more unsorted', '3,1,7', [1,3,7]],
            ['more label', 'FEB,MAR,JUL', [2,3,7]],
            ['every', '*', allMonths],
            ['every odd', '*/2', allMonths.filter(m => m%2)],
            ['every odd #2', '1/2', allMonths.filter(m => m%2)],
            ['every even', '2/2', allMonths.filter(m => m%2===0)],
            ['range', '2-10', [2,3,4,5,6,7,8,9,10]],
            ['range with cadence', '2-10/2', [2,4,6,8,10]],
            ['range label', 'FEB-JUN', [2,3,4,5,6]],
            ['range label with cadence', 'FEB-JUN/2', [2,4,6]],
        ])('%s', (_, n, expected) => {
            expect(solve_month_ranges(n)).toMatchObject(expected)
        })

        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solve_month_ranges(n)).toBe(expected)
        })
    })

    describe('solve_week_ranges', () => {
        const allWeekday = Array.from({
            length:C.bounds.week.max - C.bounds.week.min + 1
        }, (_,i) => i + C.bounds.week.min)
        test.each([
            ['one', '2', [2]],
            ['one label', 'MON', [2]],
            ['more', '2,5', [2,5]],
            ['more unsorted', '5,2', [2,5]],
            ['more label', 'MON,THU,SAT', [2,5,7]],
            ['every', '*', allWeekday],
            ['every odd', '*/2', [1,3,5,7]],
            ['every odd #2', '1/2', [1,3,5,7]],
            ['every even', '2/2', [2,4,6]],
            ['range', '2-6', [2,3,4,5,6]],
            ['range with cadence', '2-6/2', [2,4,6]],
            ['range label', 'MON-FRI', [2,3,4,5,6]],
            ['range label with cadence', 'MON-FRI/2', [2,4,6]],
        ])('%s', (_, n, expected) => {
            expect(solve_week_ranges(n)).toMatchObject(expected)
        })
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solve_week_ranges(n)).toBe(expected)
        })
    })

    describe('solve_hours_ranges', () => {
        const allHours = Array.from({
            length:C.bounds.hour.max - C.bounds.hour.min + 1
        }, (_,i) => i + C.bounds.hour.min)
        test.each([
            ['one', '2', [2]],
            ['more', '2,4,7', [2,4,7]],
            ['more unsorted', '4,2,7', [2,4,7]],
            ['every', '*', allHours],
            ['every even', '*/2', allHours.filter(e=> e%2===0)],
            ['every even #2', '0/2', allHours.filter(e=> e%2===0)],
            ['every odd', '1/2', allHours.filter(e=> e%2===1)],
            ['range', '2-19', allHours.filter(e=> e>1 && e<20)],
            ['range with cadence', '10-22/4', [10,14,18,22]],
        ])('%s', (_, n, expected) => {
            expect(solve_hours_ranges(n)).toMatchObject(expected)
        })
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solve_hours_ranges(n)).toBe(expected)
        })
    })

    describe('solve_0_59_Range', () => {
        const all60 = Array.from({
            length:C.bounds.seconds.max - C.bounds.seconds.min + 1
        }, (_,i) => i + C.bounds.seconds.min)
        test.each([
            ['one', '32', [32]],
            ['more', '32,45,56', [32,45,56]],
            ['more unsorted', '45,32,56', [32,45,56]],
            ['every', '*', all60],
            ['every even', '*/2', all60.filter(e=> e%2===0)],
            ['every even #2', '0/2', all60.filter(e=> e%2===0)],
            ['every odd', '1/2', all60.filter(e=> e%2===1)],
            ['range', '34-45', all60.filter(e=> e>33 && e<46)],
            ['range with cadence', '34-45/3', [34,37,40,43]],
        ])('%s', (_, n, expected) => {
            expect(solve_0_59_Range(n)).toMatchObject(expected)
        })
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
        ])('%s', (_, n, expected) => {
            expect(solve_0_59_Range(n)).toBe(expected)
        })
    })


})