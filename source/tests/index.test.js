/* eslint-disable no-unused-vars */

const Quartzcron  = require('../dist/index.js');
const { errors, defaults } = require('../dist/constants.js');

describe('Quartzcron', () => {

    describe('constructor', () => {
        
        // with object
        it('should Initialize as default', () => {
            const c = new Quartzcron();
            expect(c.out()).toBe('0 0 0 * * ? *');
        });
        it('should Initialize with month', () => {
            const c = new Quartzcron({ m: 3 });
            expect(c.out()).toBe('0 0 0 * 3 ? *');
        });
        it('should Initialize with month-year', () => {
            const c = new Quartzcron({ m: 3, y: 2023 });
            expect(c.out()).toBe('0 0 0 * 3 ? 2023');
        });
        it('should Initialize with month-daysOfMonth', () => {
            const c = new Quartzcron({ m: 3, dom: '9,12,17' });
            expect(c.out()).toBe('0 0 0 9,12,17 3 ? *');
        });
        it('should Initialize with every second', () => {
            const c = new Quartzcron({ s:'*', i: '*', h:'*' });
            expect(c.out()).toBe('* * * * * ? *');
        });
        it('should toString as expected', () => {
            const c = new Quartzcron({ s:'*', i: '*', h:'*' });
            expect(c.toString()).toBe('* * * * * ? *');
            expect(c+'').toBe('* * * * * ? *');
            expect(String(c)).toBe('* * * * * ? *');
            expect(`${c}`).toBe('* * * * * ? *');
        });

        // with string
        it('should Initialize with hour - from string', () => {
            const c = new Quartzcron('0 0 1 * * ? *');
            expect(c.out()).toBe('0 0 1 * * ? *');
        });
        it('should Initialize with h:i:s - from string', () => {
            const c = new Quartzcron('59 15 1 * * ? *');
            expect(c.out()).toBe('59 15 1 * * ? *');
        });
        //throws in case
        describe('throws in case an incompatible string is passed', () => {
            test.each([
                ['not enough', '59 15 1 *'],
                ['seconds oob', '69 15 1 * * ? *'],
                ['minutes oob', '59 61 1 * * ? *'],
                ['hours oob', '59 30 24 * * ? *'],
                ['dom oob', '0 0 0 32 * ? *'],
                ['month oob', '0 0 0 * 13 ? *'],
                ['dow unexpected', '0 0 0 * * LOM *'],
                ['year oob', '0 0 0 * * ? 2100'],
            ])('%s', (_, p) => {
                expect(() => {
                    new Quartzcron(p);
                }).toThrow(errors.constructorErr);
            });
        });
    });
    
    describe('updateExp', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['1 1 1 * * ? 2013'],
            [{s:1,i:1,h:1,dom:'*',m:'*',dow:'?',y:2013}, '1 1 1 * * ? 2013'],
        ])('update to %s', (s, exp = null) => {
            c.updateExp(s);
            expect(c.out()).toBe(exp || s);
        });
        it('nothing passed goes to defaults', () => {
            c.updateExp();
            expect(c.out()).toBe(Object.values(defaults).join(' '));
        });

        test.each([
            ['1 1 59 * * ? 20133423'],
            ['-1 1 1 * * ? 2013'],
            ['1 60 1 * * ? 2013'],
            ['1 0 441 * * ? 2013'],
            ['1 0 1 ? * ? 2013'],
        ])('update to %s', s => {
            expect(() => 
                c.updateExp(s)
            ).toThrow(errors.updateExpErr);
        });
    });


    describe('seconds', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everySecond', i => i.everySecond(), '* 0 0 * * ? *'],
            ['everyNSeconds every x from 0', i => i.everyNSeconds(6), '0/6 0 0 * * ? *'],
            ['everyNSeconds every x from y', i => i.everyNSeconds(6, 13), '13/6 0 0 * * ? *'],
            ['everyNSecondsAdd every x from y', i => i.everyNSeconds(6).everyNSecondsAdd(6, 8).everyNSecondsAdd(3), '0/6,8/6,0/3 0 0 * * ? *'],
            ['atSecond', i => i.atSecond(13), '13 0 0 * * ? *'],
            ['atSecond straight more', i => i.atSecond('13,15,19'), '13,15,19 0 0 * * ? *'],
            ['atSecondAdd - single', i => i.atSecondAdd(13).atSecondAdd(19), '0,13,19 0 0 * * ? *'],
            ['atSecondAdd - multiple', i => i.atSecondAdd(12).atSecondAdd('13,19') ,'0,12,13,19 0 0 * * ? *'],
            ['betweenSeconds', i => i.betweenSeconds(13,19),'13-19 0 0 * * ? *'],
            ['betweenSeconds every X seconds', i => i.betweenSeconds(3,39, 2),'3-39/2 0 0 * * ? *'],
            ['betweenSecondsAdd', i => i.betweenSecondsAdd(11,15).betweenSecondsAdd(23,29), '0,11-15,23-29 0 0 * * ? *'],
            ['betweenSecondsAdd every X seconds', i => i.betweenSecondsAdd(3,39, 2).betweenSecondsAdd(41,59, 3), '0,3-39/2,41-59/3 0 0 * * ? *'],
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
    });
    describe('minutes', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everyMinute', i => i.everyMinute(), '0 * 0 * * ? *'],
            ['everyNMinutes every x from 0', i => i.everyNMinutes(6), '0 0/6 0 * * ? *'],
            ['everyNMinutes every x from y', i => i.everyNMinutes(6, 13), '0 13/6 0 * * ? *'],
            ['everyNMinutesAdd every x from y', i => i.everyNMinutes(6).everyNMinutesAdd(6, 13).everyNMinutesAdd(9), '0 0/6,13/6,0/9 0 * * ? *'],
            ['atMinute', i => i.atMinute(13), '0 13 0 * * ? *'],
            ['atMinute straight more', i => i.atMinute('13,15,19'), '0 13,15,19 0 * * ? *'],
            ['atMinuteAdd', i => i.atMinuteAdd(13).atMinuteAdd(19), '0 0,13,19 0 * * ? *'],
            ['betweenMinutes', i => i.betweenMinutes(13,19), '0 13-19 0 * * ? *'],
            ['betweenMinutes every X minutes', i => i.betweenMinutes(13,49, 7), '0 13-49/7 0 * * ? *'],
            ['betweenMinutesAdd', i => i.betweenMinutesAdd(13,19).betweenMinutesAdd(33,37), '0 0,13-19,33-37 0 * * ? *'],
            ['betweenMinutesAdd every X minutes', i => i.betweenMinutesAdd(13,19, 7).betweenMinutesAdd(23,49), '0 0,13-19/7,23-49 0 * * ? *'],    
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
    });
    
    describe('hours', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everyHour', i => i.everyHour(), '0 0 * * * ? *'],
            ['everyNHours every x from 0', i => i.everyNHours(6), '0 0 0/6 * * ? *'],
            ['everyNHours every x from y', i => i.everyNHours(6, 13), '0 0 13/6 * * ? *'],
            ['everyNHoursAdd every x from y', i => i.everyNHours(6).everyNHoursAdd(2, 7).everyNHoursAdd(12), '0 0 0/6,7/2,0/12 * * ? *'],
            ['atHour', i => i.atHour(13), '0 0 13 * * ? *'],
            ['atHour straight more', i => i.atHour('13,15,19'), '0 0 13,15,19 * * ? *'],
            ['atHourAdd', i => i.atHourAdd(13).atHourAdd(19), '0 0 0,13,19 * * ? *'],
            ['betweenHours', i => i.betweenHours(13,19), '0 0 13-19 * * ? *'],
            ['betweenHours every X hours', i => i.betweenHours(2,19, 3), '0 0 2-19/3 * * ? *'],
            ['betweenHoursAdd every X hours', i => i.betweenHours(2,4).betweenHoursAdd(6,10).betweenHoursAdd(11,18, 3), '0 0 2-4,6-10,11-18/3 * * ? *'],
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
        
    });
    
    describe('day of month/week', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everyDay', i => i.everyDay(), '0 0 0 * * ? *'],
            ['everyNDays', i => i.everyNDays(3), '0 0 0 1/3 * ? *'],
            ['everyNDays starting from', i => i.everyNDays(3, 15), '0 0 0 15/3 * ? *'],
            ['everyNDaysAdd starting from', i => i.everyNDays(3, 15).everyNDaysAdd(4).everyNDaysAdd(5,2), '0 0 0 15/3,1/4,2/5 * ?,?,? *'],
            ['every weekend', i => i.everyWeekEnd(), '0 0 0 ? * 7,1 *'],
            ['everyWeekDay => weekdays mon-fri', i => i.everyWeekDay(), '0 0 0 ? * 2-6 *'],
            ['atWeekDay', i => i.atWeekDay(3), '0 0 0 ? * 3 *'],
            ['atWeekDayAdd', i => i.atWeekDayAdd(5), '0 0 0 ? * 5 *'],
            ['atWeekDayAdd', i => i.atWeekDayAdd(5,2), '0 0 0 ? * 5/2 *'],
            ['atWeekDayAdd on something', i => i.atWeekDay(2).atWeekDayAdd(5, 2), '0 0 0 ? * 2,5/2 *'],
            ['labelled atWeekDay', i => i.atWeekDay('TUE'), '0 0 0 ? * 3 *'],
            ['labelled atWeekDayAdd', i => i.atWeekDayAdd('THU'), '0 0 0 ? * 5 *'],
            ['labelled atWeekDayAdd on something', i => i.atWeekDay('MON').atWeekDayAdd('THU/2'), '0 0 0 ? * 2,5/2 *'],
            ['betweenWeekDays', i => i.betweenWeekDays(2, 5), '0 0 0 ? * 2-5 *'],
            ['betweenWeekDays (wrong, unchanged)', i => i.betweenWeekDays(5, 2), '0 0 0 * * ? *'],
            ['betweenWeekDays with cadence', i => i.betweenWeekDays(2, 5, 2), '0 0 0 ? * 2-5/2 *'],
            ['betweenWeekDaysAdd (one is null)',
                i => i
                    .betweenWeekDays(1, 3, 2)
                    .betweenWeekDaysAdd(8, 4) // null
                    .betweenWeekDaysAdd(3, 4)
                    .betweenWeekDaysAdd(6, 7, 2),
                '0 0 0 ?,? * 1-3/2,3-4,6-7/2 *'
            ],
            ['atMonthDay', i => i.atMonthDay(21), '0 0 0 21 * ? *'],
            ['atMonthDay range', i => i.atMonthDay('21-29'), '0 0 0 21-29 * ? *'],
            ['atMonthDay range with cadence', i => i.atMonthDay('21-29/2'), '0 0 0 21-29/2 * ? *'],
            ['atMonthDayAdd', i => i.atMonthDayAdd(13), '0 0 0 13 * ? *'],
            ['atMonthDayAdd+', i => i.atMonthDayAdd(13).atMonthDayAdd(21, 2).atMonthDayAdd(24), '0 0 0 13,21/2,24 * ? *'],
            ['atMonthDayAdd+ cad', i => i.atMonthDayAdd(13, 2), '0 0 0 13/2 * ? *'],
            ['betweenMonthDays', i => i.betweenMonthDays(12,19), '0 0 0 12-19 * ? *'],
            ['betweenMonthDays with cadence', i => i.betweenMonthDays(12,19, 2), '0 0 0 12-19/2 * ? *'],
            ['betweenMonthDaysAdd',
                i => i.betweenMonthDays(12,19)
                    .betweenMonthDaysAdd(21,27)
                    .betweenMonthDaysAdd(28, 31, 2),
                '0 0 0 12-19,21-27,28-31/2 * ? *'
            ],
            ['onLastMonthDay', i => i.onLastMonthDay(), '0 0 0 L * ? *'],
            ['onFirstMonthWeekDay', i => i.onFirstMonthWeekDay(), '0 0 0 1W * ? *'],
            ['onLastMonthWeekDay', i => i.onLastMonthWeekDay(), '0 0 0 LW * ? *'],
            ['onLastMonthNWeekDay', i => i.onLastMonthNWeekDay(2), '0 0 0 ? * 2L *'],
            ['onNDayBeforeTheEndOfTheMonth', i => i.onNDayBeforeTheEndOfTheMonth(2), '0 0 0 L-2 * ? *'],
            ['onClosestWorkingDayToTheNMonthDay', i => i.onClosestWorkingDayToTheNMonthDay(2), '0 0 0 2W * ? *'],
            ['onNWeekDayOfTheMonth',i => i.onNWeekDayOfTheMonth(2, 4), '0 0 0 ? * 4#2 *']
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
    });
    
    describe('months', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everyMonth', i => i.everyMonth(), '0 0 0 * * ? *'],
            ['everyNMonths every x from 0', i => i.everyNMonths(6), '0 0 0 * 1/6 ? *'],
            ['everyNMonths every x from y', i => i.everyNMonths(6, 3), '0 0 0 * 3/6 ? *'],
            ['everyNMonthsAdd every x from y', i => i.everyNMonthsAdd(6, 3), '0 0 0 * 3/6 ? *'],
            ['everyNMonthsAdd2 every x from y', i => i.everyNMonths(3).everyNMonthsAdd(6, 3).everyNMonthsAdd(7), '0 0 0 * 1/3,3/6,1/7 ? *'],
            ['atMonth', i => i.atMonth(3), '0 0 0 * 3 ? *'],
            ['atMonth straight more', i => i.atMonth('3,5,9'), '0 0 0 * 3,5,9 ? *'],
            ['atMonthAdd', i => i.atMonth(3).atMonthAdd(9), '0 0 0 * 3,9 ? *'],
            ['atMonthAdd cad', i => i.atMonthAdd(3, 5), '0 0 0 * 3/5 ? *'],
            ['betweenMonths', i => i.betweenMonths(3,9), '0 0 0 * 3-9 ? *'],
            ['betweenMonths every X months', i => i.betweenMonths(2,10, 3), '0 0 0 * 2-10/3 ? *'],
            ['betweenMonthsAdd', i => i.betweenMonths(1,2).betweenMonthsAdd(3,9), '0 0 0 * 1-2,3-9 ? *'],
            ['betweenMonthsAdd cad', i => i.betweenMonths(1,4,2).betweenMonthsAdd(7,11,2), '0 0 0 * 1-4/2,7-11/2 ? *'],
            ['betweenMonthsAdd +', i => i.betweenMonthsAdd(3,9), '0 0 0 * 3-9 ? *'],
            ['betweenMonthsAdd + cad', i => i.betweenMonthsAdd(3,9, 2), '0 0 0 * 3-9/2 ? *'],
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
    });
    
    describe('years', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['everyYear', i => i.everyYear(), '0 0 0 * * ? *'],
            ['everyNYears every x from 0', i => i.everyNYears(6), `0 0 0 * * ? ${new Date().getFullYear()}/6`],
            ['everyNYears every x from y', i => i.everyNYears(6, 2025), '0 0 0 * * ? 2025/6'],
            ['everyNYearsAdd every x from y', i => i.everyNYears(7).everyNYearsAdd(6, 2025).everyNYearsAdd(11), '0 0 0 * * ? 2025/7,2025/6,2025/11'],
            ['everyNYearsAdd2 every x from y', i => i.everyNYears(6, 2025).everyNYearsAdd(2, 2065), '0 0 0 * * ? 2025/6,2065/2'],
            ['everyNYearsAdd3', i => i.everyNYearsAdd(2, 2065), '0 0 0 * * ? 2065/2'],
            ['atYear', i => i.atYear(2176), '0 0 0 * * ? 2176'],
            ['atYear straight more', i => i.atYear('2063,2034'), '0 0 0 * * ? 2063,2034'],
            ['atYearAdd', i => i.atYearAdd(1976).atYearAdd(2034), '0 0 0 * * ? 1976,2034'],
            ['atYearAdd +', i => i.atYearAdd(2034, 2), '0 0 0 * * ? 2034/2'],
            ['betweenYears', i => i.betweenYears(2013,2039), '0 0 0 * * ? 2013-2039'],
            ['betweenYears every X years', i => i.betweenYears(2013, 2039, 2), '0 0 0 * * ? 2013-2039/2'],
            ['betweenYearsAdd', i => i.betweenYears(2013,2039).betweenYearsAdd(2049,2079), '0 0 0 * * ? 2013-2039,2049-2079'],
            ['betweenYearsAdd +', i => i.betweenYearsAdd(2049,2079), '0 0 0 * * ? 2049-2079'],
            ['betweenYearsAdd cad', i => i.betweenYears(2013,2039,2).betweenYearsAdd(2049,2079,2), '0 0 0 * * ? 2013-2039/2,2049-2079/2'],
            ['betweenYearsAdd + cad', i => i.betweenYearsAdd(2049,2079,2), '0 0 0 * * ? 2049-2079/2'],
        ])('%s', (_, setup, exp) => {
            setup(c);
            expect(c.out()).toBe(exp);
        });
    });

    describe('cadences', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            ['2/6 0 0 * * ? *', i => i.atSecond(2,6)],
            ['2,5/7 0 0 * * ? *', i => i.atSecond(2).atSecondAdd(5, 7)],
            ['0 2/7 0 * * ? *', i => i.atMinute(2,7)],
            ['0 2,5/8 0 * * ? *', i => i.atMinute(2).atMinuteAdd(5, 8)],
            ['0 0 2/8 * * ? *', i => i.atHour(2,8)],
            ['0 0 2,5/9 * * ? *', i => i.atHour(2).atHourAdd(5, 9)],
            ['0 0 0 ? * 2/6 *', i => i.atWeekDay(2,6)],
            ['0 0 0 ? * 2,3/2 *', i => i.atWeekDay(2).atWeekDayAdd(3, 2)],
            ['0 0 0 2/6 * ? *', i => i.atMonthDay(2,6)],
            ['0 0 0 2,3/2 * ? *', i => i.atMonthDay(2).atMonthDayAdd(3, 2)],
            ['0 0 0 * 2/4 ? *', i => i.atMonth(2,4)],
            ['0 0 0 * 2,3/2 ? *', i => i.atMonth(2).atMonthAdd(3, 2)],
            ['0 0 0 * * ? 2024/6', i => i.atYear(2024,6)],
            ['0 0 0 * * ? 2024,2050/2', i => i.atYear(2024).atYearAdd(2050, 2)]
        ])('%s', (exp, prep) => {
            prep(c);
            expect(c.out()).toBe(exp);
        });
    });

    describe('chained actions', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('atSecond atMinute atHour', () => {
            c.atSecond(3)
                .atMinute(14)
                .atHour(23);
            expect(c.out()).toBe('3 14 23 * * ? *');
        });
        it('atSecond atMinute atHour every X days starting from day Y', () => {
            c.atSecond(30)
                .atMinute(0)
                .atHour(12)
                .everyNDays(5, 2);
            expect(c.out()).toBe('30 0 12 2/5 * ? *');
        });
        it('atSecond atMinute every hour in the 3rd saturday of JAN and FEB on years 2026,2028,2032', () => {
            c.atSecondAdd(1)
                .atSecondAdd(5)
                .atMinute(0)
                .everyHour()
                .onNWeekDayOfTheMonth(3, 7)
                .atMonthAdd('JAN')
                .atMonthAdd('FEB')
                .atYearAdd(2026)
                .atYearAdd(2028)
                .atYearAdd(2032);
            expect(c.out()).toBe('0,1,5 0 * ? JAN,FEB 7#3 2026,2028,2032');
        });
    });
    
    describe('edge examples', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('atSecond atMinute atHour atMonth all at range+cadence', () => {
            c.atSecond('3-30/2')
                .atMinute('15-45/5')
                .atHour('12-23/3')
                .atMonth('3-10/2');
            expect(c.out()).toBe('3-30/2 15-45/5 12-23/3 * 3-10/2 ? *');
        });
        it('utils.removeSpaces', () => {
            c.atSecond('3 - 30 / 2')
                .atMinute('15 - 45 / 5')
                .atHour('12 - 2 3 / 3')
                .atMonth('3 - 1 0 / 2');
            expect(c.out()).toBe('3-30/2 15-45/5 12-23/3 * 3-10/2 ? *');
        });
    });

    describe('describe as expected', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('default', () => {
            expect(c.describe()).toBe('at 00:00:00, every day');
        });
    });

    describe('static', () => {
        const ranger24 = Quartzcron.getRanger(24),
            ranger60 = Quartzcron.getRanger(60);
        
        describe('Quartzcron.getRanger(24) returned ranger should work as expected', () => {
            test.each([
                {inp:0,out:0},
                {inp:11,out:11},
                {inp:23,out:23},
                {inp:24,out:0},
                {inp:26,out:2},
                {inp:47,out:23},
                {inp:49,out:1},
                {inp:-1,out:23},
            ])('%o', ({inp, out}) => {
                expect(ranger24(inp)).toBe(out);
            });
        });

        describe('Quartzcron.getRanger(60) returned ranger should work as expected', () => {
            test.each([
                {inp:0,out:0},
                {inp:11,out:11},
                {inp:12,out:12},
                {inp:59,out:59},
                {inp:60,out:0},
                {inp:62,out:2},
                {inp:118,out:58},
                {inp:-1,out:59},
            ])('%o', ({inp, out}) => {
                expect(ranger60(inp)).toBe(out);
            });
        });

        describe('Quartzcron.solvers contains all range solvers', () => {
            test.each([
                ['solve_0_59_ranges'],
                ['solve_hours_ranges'],
                ['solve_week_ranges'],
                ['solve_month_ranges'],
                ['solve_year_ranges'],
                ['solve_dom'],
                ['solve_dow']
            ])('%s', inp => {
                expect(typeof Quartzcron.solvers[inp]).toBe('function');
            });
        });
    });
});
