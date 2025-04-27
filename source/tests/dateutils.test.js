
const dateutils  = require('../dist/dateutils.js');

const {
    isLeap,
    lastMonthDay,
    nDaysBeforeEndOfMonth,
    nDayOfMonth
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
            [2000, 0, 31],
            [2000, 1, 29],
            [2001, 1, 28],
            [2100, 1, 28],
            [2025, 0, 31, true],
        ])('%i', (y, m, expected, wd=false) => {
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
                ['lower wd violation', 1, -1, 2025, 0,  1],
                ['higher wd violation', 1, 7, 2025, 0,  1],
            ])('%s', (_, n, wd, y, m, expected) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('given weekday does not exist [0-6]')
            })

            test.each([
                ['lower target #wd violation', -1, 1, 2025, 0,  1],
                ['higher target #wd violation', 6, 1, 2025, 0,  1],
            ])('%s', (_, n, wd, y, m, expected) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('not enough days in any month')
            })

            test.each([
                ['5th sat would be 32', 5, 6, 2025, 0,  1],
                ['5th sun would be 33', 5, 0, 2025, 0,  1],
            ])('%s', (_, n, wd, y, m, expected) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow('not enough days in this month')
            })
        })
    })
})