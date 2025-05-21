
const dateutils  = require('../dist/dateutils.js'),
    C  = require('../dist/constants.js'),
    {
        isLeap,
        lastMonthDay,
        nDaysBeforeEndOfMonth,
        nDayOfMonth,
        solve_year_ranges,
        solve_month_ranges,
        solve_week_ranges,
        solve_hours_ranges,
        solve_0_59_ranges,
        solve_dom,
        solve_dow
    } = dateutils;

describe('date utils', () => { 
    describe('isLeap', () => {
        describe('positives', () => {
            test.each([
                [2000, 2004, 2012, 2104, 2400],
            ])('%i', (arg) => {
                const res = isLeap(arg);
                expect(res).toBeTruthy();
            });
        });
        describe('negatives', () => {      
            test.each([
                [2003, 2100, 2200, 2205],
            ])('%i', (arg) => {
                const res = isLeap(arg);
                expect(res).toBeFalsy();
            });
        });
    });

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
            const res = lastMonthDay(y, m, wd);
            expect(res).toBe(expected);
        });
    });

    describe('nDaysBeforeEndOfMonth', () => {
        describe('positives', () => {
            test.each([
                [1, 2000, 0, 30],
                [2, 2000, 1, 27],
                [3, 2001, 1, 25],
                [4, 2100, 1, 24],
            ])('%i', (n, y, m, expected) => {
                const res = nDaysBeforeEndOfMonth(n, y, m);
                expect(res).toBe(expected);
            });
        });
        describe('throws', () => {
            test.each([
                ['31-50 -> err', 50, 2000, 0],
                ['31-32 -> err', 32, 2000, 0],
                ['31-31 -> err', 31, 2000, 0],
            ])('%s', (_, n, y, m) => {

                expect(
                    () => nDaysBeforeEndOfMonth(n, y, m)
                ).toThrow(C.errors.notEnoughDays);
            });
        });

    });

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
                const res = nDayOfMonth(n, wd, y, m);
                expect(res).toBe(expected);
            });
        });
        describe('throws', () => {
            test.each([
                ['lower wd violation', 1, -1, 2025, 0],
                ['higher wd violation', 1, 7, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow(C.errors.nonWeekday);
            });

            test.each([
                ['lower target #wd violation', -1, 1, 2025, 0],
                ['higher target #wd violation', 6, 1, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow(C.errors.monthsOutOfBounds);
            });

            test.each([
                ['5th sat would be 32', 5, 6, 2025, 0],
                ['5th sun would be 33', 5, 0, 2025, 0],
            ])('%s', (_, n, wd, y, m) => {
                expect(()=>nDayOfMonth(n, wd, y, m)).toThrow(C.errors.monthOutOfBounds);
            });
        });
    });
/*
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
*/
    describe('solve_year_ranges', () => {
        const allYears = Array.from({
            length:C.bounds.year.max - C.bounds.year.min + 1
        }, (_,i) => i + C.bounds.year.min);
        test.each([
            ['one', '1989', [1989]],
            ['more', '1989,1999,2013', [1989,1999,2013]],
            ['more unsorted', '1999,1989,2013', [1989,1999,2013]],
            ['multi mixed', '1999,2080/2,2099', [1999,2080,2082,2084,2086,2088,2090,2092,2094,2096,2098,2099]],
            ['every', '*', allYears],
            ['every even', '*/2', allYears.filter(y => y%2===0)],
            ['every even', '1970/2', allYears.filter(y => y%2===0)],
            ['every odd', '1971/2', allYears.filter(y => y%2===1)],
            ['range', '1990-1994', [1990,1991,1992,1993,1994]],
            ['range with cadence', '1990-1998/2', [1990,1992,1994,1996,1998]],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_year_ranges(n)).toMatchObject(expected);
        });
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_year_ranges(n)).toBe(expected);
        });
    });

    describe('solve_month_ranges', () => {
        const allMonths = Array.from({
            length:C.bounds.month.max - C.bounds.month.min + 1
            // eslint-disable-next-line no-unused-vars
        }, (_,i) => i + C.bounds.month.min);
        test.each([
            ['one', '2', [2]],
            ['one label', 'FEB', [2]],
            ['more', '1,3,7', [1,3,7]],
            ['more unsorted', '3,1,7', [1,3,7]],
            ['multi mixed', '7,4/2,1', [1,4,6,7,8,10,12]],
            ['more label', 'FEB,MAR,JUL', [2,3,7]],
            ['multi mixed label', 'JAN,FEB/2', [1,2,4,6,8,10,12]],
            ['every', '*', allMonths],
            ['every odd', '*/2', allMonths.filter(m => m%2)],
            ['every odd #2', '1/2', allMonths.filter(m => m%2)],
            ['every even', '2/2', allMonths.filter(m => m%2===0)],
            ['range', '2-10', [2,3,4,5,6,7,8,9,10]],
            ['range with cadence', '2-10/2', [2,4,6,8,10]],
            ['range label', 'FEB-JUN', [2,3,4,5,6]],
            ['range label with cadence', 'FEB-JUN/2', [2,4,6]],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_month_ranges(n)).toMatchObject(expected);
        });

        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_month_ranges(n)).toBe(expected);
        });
    });

    describe('solve_week_ranges', () => {
        const allWeekday = Array.from({
            length:C.bounds.week.max - C.bounds.week.min + 1
            // eslint-disable-next-line no-unused-vars
        }, (_,i) => i + C.bounds.week.min);
        test.each([
            ['one', '2', [2]],
            ['one label', 'MON', [2]],
            ['more', '2,5', [2,5]],
            ['more unsorted', '5,2', [2,5]],
            ['more unsorted mixed', '2,6,3/2', [2,3,5,6,7]],
            ['more label', 'MON,THU,SAT', [2,5,7]],
            ['more label mixed', 'MON,THU/2', [2,5,7]],
            ['every', '*', allWeekday],
            ['every odd', '*/2', [1,3,5,7]],
            ['every odd #2', '1/2', [1,3,5,7]],
            ['every even', '2/2', [2,4,6]],
            ['range', '2-6', [2,3,4,5,6]],
            ['range with cadence', '2-6/2', [2,4,6]],
            ['range label', 'MON-FRI', [2,3,4,5,6]],
            ['range label with cadence', 'MON-FRI/2', [2,4,6]],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_week_ranges(n)).toMatchObject(expected);
        });
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
            ['?', '?', null],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_week_ranges(n)).toBe(expected);
        });
    });

    describe('solve_hours_ranges', () => {
        const allHours = Array.from({
            length:C.bounds.hour.max - C.bounds.hour.min + 1
            // eslint-disable-next-line no-unused-vars
        }, (_,i) => i + C.bounds.hour.min);
        test.each([
            ['one', '2', [2]],
            ['more', '2,4,7', [2,4,7]],
            ['more unsorted', '4,2,7', [2,4,7]],
            ['more unsorted mixed', '4,2,7,15/3', [2,4,7, 15,18,21]],
            ['every', '*', allHours],
            ['every even', '*/2', allHours.filter(e=> e%2===0)],
            ['every even #2', '0/2', allHours.filter(e=> e%2===0)],
            ['every odd', '1/2', allHours.filter(e=> e%2===1)],
            ['range', '2-19', allHours.filter(e=> e>1 && e<20)],
            ['range with cadence', '10-22/4', [10,14,18,22]],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_hours_ranges(n)).toMatchObject(expected);
        });
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_hours_ranges(n)).toBe(expected);
        });
    });

    describe('solve_0_59_ranges', () => {
        const all60 = Array.from({
            length:C.bounds.seconds.max - C.bounds.seconds.min + 1
            // eslint-disable-next-line no-unused-vars
        }, (_,i) => i + C.bounds.seconds.min);
        test.each([
            ['one', '32', [32]],
            ['more', '32,45,56', [32,45,56]],
            ['more unsorted', '45,32,56', [32,45,56]],
            ['more unsorted mixed', '4,7/8,14', [4,7,14,15,23,31,39,47,55]],
            ['every', '*', all60],
            ['every even', '*/2', all60.filter(e=> e%2===0)],
            ['every even #2', '0/2', all60.filter(e=> e%2===0)],
            ['every odd', '1/2', all60.filter(e=> e%2===1)],
            ['range', '34-45', all60.filter(e=> e>33 && e<46)],
            ['range with cadence', '34-45/3', [34,37,40,43]],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_0_59_ranges(n)).toMatchObject(expected);
        });
        test.each([
            ['null #1', 'aaa', null],
            ['null #2', ' ', null],
            // eslint-disable-next-line no-unused-vars
        ])('%s', (_, n, expected) => {
            expect(solve_0_59_ranges(n)).toBe(expected);
        });
    });
    
    describe('solve_dom', () => {

        describe('*', () => {
            test.each([
                ['* (2025 jan)', 2025, 1, '*', C.THIRTYONE],
                ['* (2025 feb)', 2025, 2, '*', C.TWENTYEIGTH],
                ['* (2025 apr)', 2025, 4, '*', C.THIRTY],
                ['* (2024 feb*)', 2024, 2, '*', C.TWENTYNINE],
                // eslint-disable-next-line no-unused-vars
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });
        describe('[1-31]/[1-31]', () => {
            test.each([
                ['1/2 (2025 apr)', 2025, 4, '1/2', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29]],
                ['27/1 (2025 apr)', 2025, 4, '27/1', [27,28,29,30]],
                ['7/5 (2025 apr)', 2025, 4, '7/5', [7,12,17,22,27]],
                ['8/31 (2025 apr)', 2025, 4, '8/31', [8]],
                ['14/11 (2025 apr)', 2025, 4, '14/14', [14,28]],
                ['15/7 (2025 apr)', 2025, 4, '15/7', [15,22,29]],
                ['21/7 (2025 apr)', 2025, 4, '21/7', [21,28]],
                // // leap
                ['1/4 (2024 feb*)', 2024, 2, '1/4', [1,5,9,13,17,21,25,29]],
                ['8/7 (2024 feb*)', 2024, 2, '8/7', [8,15,22,29]],
                ['15/7 (2024 feb*)', 2024, 2, '15/7', [15,22,29]],
                ['22/7 (2024 feb*)', 2024, 2, '22/7', [22,29]],
                ['29/4 (2024 feb*)', 2024, 2, '29/4', [29]],
                ['31/4 (2024 feb*)', 2024, 2, '31/4', []],
                // eslint-disable-next-line no-unused-vars
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });
        describe('one or more [1-31] , separated', () => {
            test.each([
                ['1 (2025 apr)', 2025, 4, '1', [1]],
                ['31 (2025 apr)', 2025, 4, '31', []], 
                ['31 (2025 may) ', 2025, 5, '31', [31]], 
                ['31 (2023 feb)', 2023, 2, '29', []],
                ['-1 (2025 apr)', 2025, 4, '-1', []],
                ['32 (2025 apr)', 2025, 4, '32', []],

                ['1 (2025 apr)', 2025, 4, '1', [1]],
                ['31 (2025 apr)', 2025, 4, '31', []],
                ['1,2,3 (2025 apr)', 2025, 4, '1,2,3', [1,2,3]],
                ['1,2,3,30 (2025 apr)', 2025, 4, '1,2,3,30', [1,2,3,30]],
                ['1,2,3,31 (2025 apr)', 2025, 4, '1,2,3,31', [1,2,3]],
                ['1,2,3,31 (2025 may)', 2025, 5, '1,2,3,31', [1,2,3,31]],
                ['1,2,3,32 (2025 apr)', 2025, 4, '1,2,3,32', []],
                ['32 (2025 apr)', 2025, 4, '32', []],
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });
        describe('[1-31] - [1-31] / [1-31]', () => {
            test.each([
                ['1-10/2 (2025 apr)', 2025, 4, '1-10/2', [1,3,5,7,9]],
                ['1-11/2 (2025 apr)', 2025, 4, '1-11/2', [1,3,5,7,9,11]],
                ['1-31/2 (2025 apr)', 2025, 4, '1-31/2', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29]],
                ['1-31/2 (2025 may)', 2025, 5, '1-31/2', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31]],
                // eslint-disable-next-line no-unused-vars
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });
        describe('[1-31] - [1-31]', () => {
            test.each([
                ['1-5 (2025 apr)', 2025, 4, '1-5', [1,2,3,4,5]],
                ['1-11 (2025 apr)', 2025, 4, '1-11', [1,2,3,4,5,6,7,8,9,10,11]],
                ['1-31 (2025 apr)', 2025, 4, '1-31', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]],// ** no 31!!!
                ['1-3 (2025 may)', 2025, 5, '1-3', [1,2,3]],
            // eslint-disable-next-line no-unused-vars
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });

        describe('L', () => {
            test.each([
                ['L (2025 apr)', 2025, 4, 'L', [30]],
                ['L (2025 may)', 2025, 5, 'L', [31]],
                ['L (2025 feb)', 2025, 2, 'L', [28]],
                ['L (2024 feb*)', 2024, 2, 'L', [29]],
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });

        describe('LW', () => {
            test.each([
                ['LW (2025 mar)', 2025, 3, 'LW', [31]],
                ['LW (2025 apr)', 2025, 4, 'LW', [30]],
                ['LW (2025 may)', 2025, 5, 'LW', [30]],
                ['LW (2025 aug)', 2025, 8, 'LW', [29]],
                // eslint-disable-next-line no-unused-vars
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });
        describe('[1-31]W', () => {
            test.each([
                ['1W (2025 mar)', 2025, 3, '1W', [3]],
                ['2W (2025 mar)', 2025, 3, '2W', [3]],
                ['13W (2025 mar)', 2025, 3, '13W', [13]],
                ['22W (2025 mar)', 2025, 3, '22W', [21]],
                ['23W (2025 mar)', 2025, 3, '23W', [24]],
                ['30W (2025 mar)', 2025, 3, '30W', [31]],
                ['1W (2025 jun)', 2025, 6, '1W', [2]],
                ['31W (2025 aug)', 2025, 8, '31W', [29]],
                ['29W (2025 jun)', 2025, 6, '29W', [30]],   
                ['1W (2025 jan)', 2025, 1, '1W', [1]],   
                ['30W (2025 apr)', 2025, 4, '30W', [30]],   
                ['31W (2025 may)', 2025, 5, '31W', [30]],   
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });

        describe('L-[1-31]', () => {
            test.each([
                ['L-1 (2025 march)', 2025, 3, 'L-1', [30]],
                ['L-5 (2025 march)', 2025, 3, 'L-5', [26]],
                ['L-30 (2025 march)', 2025, 3, 'L-30', [1]],
                ['L-31 (2025 march)', 2025, 3, 'L-31', []],
            ])('%s', (_, y, m, dom, expected) => {
                expect(solve_dom(y, m, dom)).toMatchObject(expected);
            });
        });        
    });

    describe('solve_dow', () => {

        describe ('*', () => {
            test.each([
                ['* (2024 jan)', 2025, 1, '*', C.THIRTYONE],
                ['* (2025 feb)', 2025, 2, '*', C.TWENTYEIGTH],
                ['*3 (2025 jan)', 2025, 2, '*3', []],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        describe('[1-7]|* / [1-7]', () => {
            test.each([
                ['*/4 (2025 jan)', 2025, 1, '*/4', [5,9,13,17,21,25,29]],
                ['1/4 (2025 jan)', 2025, 1, '1/4', [5,9,13,17,21,25,29]],
                ['7/5 (2024 jan)', 2025, 1, '7/5',   [4,9,14,19,24,29]],
                ['7/8 (2024 jan)', 2025, 1, '7/8', []],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        describe('[1-7] OR [SUN-SAT]', () => {
            test.each([
                ['1 (2024 jan)', 2024, 1, '1', [7,14,21,28]],
                ['SUN (2024 jan)', 2024, 1, 'SUN', [7,14,21,28]],
                ['1 (2025 jan)', 2025, 1, '1', [5,12,19,26]],
                ['SUN (2025 jan)', 2025, 1, 'SUN', [5,12,19,26]],
                ['MON (2025 jan)', 2025, 1, 'MON', [6,13,20,27]],
                ['1,3 (2025 jan)', 2025, 1, '1,3', [5,7,12,14,19,21,26,28]],
                ['MON/2 (2025 jan)', 2025, 1, 'MON/2', [1,3,6,8,10,13,15,17,20,22,24,27,29,31]],
                ['TUE,MON/2 (2025 jan)', 2025, 1, 'TUE,MON/2', [1,3,6, 7, 8,10,13, 14, 15,17,20, 21, 22,24,27, 28, 29,31]],
                ['3,2/2 (2025 jan)', 2025, 1, '3,2/2', [1,3,6, 7, 8,10,13, 14, 15,17,20, 21, 22,24,27, 28, 29,31]],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        describe('[1-7]-[1-7] OR [SUN-SAT]-[SUN-SAT]', () => {
            test.each([
                ['1-3 (2025 jan)', 2025, 1, '1-3', [5,6,7, 12,13,14, 19,20,21, 26,27,28]],
                ['MON-WED (2025 jan)', 2025, 1, 'SAT-SUN', [4,5, 11,12, 18,19, 25,26]],
                ['0-W32 (2025 jan)', 2025, 1, '0-32', []],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        describe('[1-7]-[1-7]/[1-7] OR [SUN-SAT]-[SUN-SAT]/[1-7]', () => {
            test.each([
                ['2-5/2 (2025 jan)', 2025, 1, '2-6/2', [
                       1, 3,
                    6, 8, 10,
                    13, 15, 17,
                    20, 22, 24,
                    27, 29, 31
                ]],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        //     JS  QZ
        // SUN: 0   1 
        // MON: 1   2 
        // TUE: 2   3 
        // WED: 3   4 
        // THU: 4   5 
        // FRI: 5   6 
        // SAt: 6   7 
        describe('[1-7]L', () => {
            test.each([
                ['1L (2025 jan)', 2025, 1, '1L', [26]],
                ['2L (2025 jan)', 2025, 1, '2L', [27]],
                ['3L (2025 jan)', 2025, 1, '3L', [28]],
                ['4L (2025 jan)', 2025, 1, '4L', [29]],
                ['5L (2025 jan)', 2025, 1, '5L', [30]],
                ['6L (2025 jan)', 2025, 1, '6L', [31]],
                ['7L (2025 jan)', 2025, 1, '7L', [25]],
                ['5L (2025 feb)', 2025, 2, '7L', [22]],
                ['5L (2024 feb*)', 2024, 2, '5L', [29]],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });

        describe('[1-7]#[1-5]', () => {
            test.each([
                ['2#2 (2025 jan)', 2025, 1, '2#1', [6]],
                ['2#2 (2025 jan)', 2025, 1, '2#2', [13]],
                ['2#2 (2026 feb)', 2026, 2, '2#2', [9]],
                ['2#2 (2028 feb)', 2026, 2, '3#5', []],// edge
                ['2#2 (2028 feb)', 2028, 2, '3#5', [29]],
            ])('%s', (_, y, m, dow, expected) => {
                expect(solve_dow(y, m, dow)).toMatchObject(expected);
            });
        });
        
    });


});