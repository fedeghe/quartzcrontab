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
        it('everySecond', () => {
            c.everySecond();
            expect(c.out()).toBe('* 0 0 * * ? *');
        });
        it('everyNSeconds every x from 0', () => {
            c.everyNSeconds(6);
            expect(c.out()).toBe('0/6 0 0 * * ? *');
        });
        it('everyNSeconds every x from y', () => {
            c.everyNSeconds(6, 13);
            expect(c.out()).toBe('13/6 0 0 * * ? *');
        });
        it('atSecond', () => {
            c.atSecond(13);
            expect(c.out()).toBe('13 0 0 * * ? *');
        });
        it('atSecond straight more', () => {  
            c.atSecond('13,15,19');
            expect(c.out()).toBe('13,15,19 0 0 * * ? *');
        });
        it('atSecondAdd - single', () => {
            c.atSecondAdd(13);
            c.atSecondAdd(19);
            expect(c.out()).toBe('0,13,19 0 0 * * ? *');
        });
        it('atSecondAdd - multiple', () => {
            c.atSecondAdd(12);
            c.atSecondAdd('13,19');
            expect(c.out()).toBe('0,12,13,19 0 0 * * ? *');
        });
        it('betweenSeconds', () => {
            c.betweenSeconds(13,19);
            expect(c.out()).toBe('13-19 0 0 * * ? *');
        });
        it('betweenSeconds every X seconds', () => {
            c.betweenSeconds(3,39, 2);
            expect(c.out()).toBe('3-39/2 0 0 * * ? *');
        });
    });
    
    describe('minutes', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('everyMinute', () => {
            c.everyMinute();
            expect(c.out()).toBe('0 * 0 * * ? *');
        });
        it('everyNMinutes every x from 0', () => {
            c.everyNMinutes(6);
            expect(c.out()).toBe('0 0/6 0 * * ? *');
        });
        it('everyNMinutes every x from y', () => {  
            c.everyNMinutes(6, 13);
            expect(c.out()).toBe('0 13/6 0 * * ? *');
        });
        it('atMinute', () => {  
            c.atMinute(13);
            expect(c.out()).toBe('0 13 0 * * ? *');
        });
        it('atMinute straight more', () => {
            c.atMinute('13,15,19');
            expect(c.out()).toBe('0 13,15,19 0 * * ? *');
        });
        it('atMinuteAdd', () => {
            c.atMinuteAdd(13);
            c.atMinuteAdd(19);
            expect(c.out()).toBe('0 0,13,19 0 * * ? *');
        });
        it('betweenMinutes', () => {
            c.betweenMinutes(13,19);
            expect(c.out()).toBe('0 13-19 0 * * ? *');
        });
        it('betweenMinutes every X minutes', () => {
            c.betweenMinutes(13,49, 7);
            expect(c.out()).toBe('0 13-49/7 0 * * ? *');
        });
    });
    
    describe('hours', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('everyHour', () => {
            c.everyHour();
            expect(c.out()).toBe('0 0 * * * ? *');
        });
        it('everyNHours every x from 0', () => {
            c.everyNHours(6);
            expect(c.out()).toBe('0 0 0/6 * * ? *');
        });
        it('everyNHours every x from y', () => {  
            c.everyNHours(6, 13);
            expect(c.out()).toBe('0 0 13/6 * * ? *');
        });
        it('atHour', () => {  
            c.atHour(13);
            expect(c.out()).toBe('0 0 13 * * ? *');
        });
        it('atHour straight more', () => {
            c.atHour('13,15,19');
            expect(c.out()).toBe('0 0 13,15,19 * * ? *');
        });
        it('atHourAdd', () => {
            c.atHourAdd(13);
            c.atHourAdd(19);
            expect(c.out()).toBe('0 0 0,13,19 * * ? *');
        });
        it('betweenHours', () => {
            c.betweenHours(13,19);
            expect(c.out()).toBe('0 0 13-19 * * ? *');
        });
        it('betweenHours every X hours', () => {
            c.betweenHours(2,19, 3);
            expect(c.out()).toBe('0 0 2-19/3 * * ? *');
        });
    });
    
    describe('day of month/week', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('everyDay', () => {
            c.everyDay();
            expect(c.out()).toBe('0 0 0 * * ? *');
        });
        it('every n days', () => {
            c.everyNDays(3);
            expect(c.out()).toBe('0 0 0 1/3 * ? *');
        });
        it('every n days starting from', () => {
            c.everyNDays(3, 15);
            expect(c.out()).toBe('0 0 0 15/3 * ? *');
        });
        it('every weekend', () => {
            c.everyWeekEnd();
            expect(c.out()).toBe('0 0 0 ? * 7,1 *');
        });
        it('everyWeekDay => weekdays mon-fri', () => {
            c.everyWeekDay();
            expect(c.out()).toBe('0 0 0 ? * 2-6 *');
        });

        it('atWeekDay', () => {
            c.atWeekDay(3);
            expect(c.out()).toBe('0 0 0 ? * 3 *');
        });
        it('atWeekDayAdd', () => {
            c.atWeekDayAdd(5);
            expect(c.out()).toBe('0 0 0 ? * 5 *');
        });
        it('atWeekDayAdd on something', () => {
            c.atWeekDay(2)
                .atWeekDayAdd('5/2');
            expect(c.out()).toBe('0 0 0 ? * 2,5/2 *');
        });

        it('betweenWeekDays', () => {
            c.betweenWeekDays(2, 5);
            expect(c.out()).toBe('0 0 0 ? * 2-5 *');
        });
        it('betweenWeekDays (wrong, unchanged)', () => {
            c.betweenWeekDays(5, 2);
            expect(c.out()).toBe('0 0 0 * * ? *');
        });
        it('betweenWeekDays with cadence', () => {
            c.betweenWeekDays(2, 5, 2);
            expect(c.out()).toBe('0 0 0 ? * 2-5/2 *');
        });

        it('atMonthDay', () => {
            c.atMonthDay(21);
            expect(c.out()).toBe('0 0 0 21 * ? *');
        });
        it('atMonthDay range', () => {
            c.atMonthDay('21-29');
            expect(c.out()).toBe('0 0 0 21-29 * ? *');
        });
        it('atMonthDay range with cadence', () => {
            c.atMonthDay('21-29/2');
            expect(c.out()).toBe('0 0 0 21-29/2 * ? *');
        });
        it('atMonthDayAdd', () => {
            c.atMonthDayAdd(13);
            c.atMonthDayAdd('21/2');
            c.atMonthDayAdd(24);
            expect(c.out()).toBe('0 0 0 13,21/2,24 * ? *');
        });
        it('betweenMonthDays', () => {
            c.betweenMonthDays(12,19);
            expect(c.out()).toBe('0 0 0 12-19 * ? *');
        });
        it('betweenMonthDays with cadence', () => {
            c.betweenMonthDays(12,19, 2);
            expect(c.out()).toBe('0 0 0 12-19/2 * ? *');
        });
        it('onLastMonthDay', () => {
            c.onLastMonthDay();
            expect(c.out()).toBe('0 0 0 L * ? *');
        });
        it('onFirstMonthWeekDay', () => {
            c.onFirstMonthWeekDay();
            expect(c.out()).toBe('0 0 0 1W * ? *');
        });
        it('onLastMonthWeekDay', () => {
            c.onLastMonthWeekDay();
            expect(c.out()).toBe('0 0 0 LW * ? *');
        });
        it('onLastMonthNWeekDay', () => {
            c.onLastMonthNWeekDay(2);
            expect(c.out()).toBe('0 0 0 ? * 2L *');
        });
        it('onNDayBeforeTheEndOfTheMonth', () => {
            c.onNDayBeforeTheEndOfTheMonth(2);
            expect(c.out()).toBe('0 0 0 L-2 * ? *');
        });
        it('onClosestWorkingDayToTheNMonthDay', () => {
            c.onClosestWorkingDayToTheNMonthDay(2);
            expect(c.out()).toBe('0 0 0 2W * ? *');
        });
        
        it('onNWeekDayOfTheMonth', () => {
            c.onNWeekDayOfTheMonth(2, 4);
            expect(c.out()).toBe('0 0 0 ? * 4#2 *');
        });
    });
    
    describe('months', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('everyMonth', () => {
            c.everyMonth();
            expect(c.out()).toBe('0 0 0 * * ? *');
        });
        it('everyNMonths every x from 0', () => {
            c.everyNMonths(6);
            expect(c.out()).toBe('0 0 0 * 0/6 ? *');
        });
        it('everyNMonths every x from y', () => {  
            c.everyNMonths(6, 3);
            expect(c.out()).toBe('0 0 0 * 3/6 ? *');
        });
        it('atMonth', () => {
            c.atMonth(3);
            expect(c.out()).toBe('0 0 0 * 3 ? *');
        });
        it('atMonth straight more', () => {
            c.atMonth('3,5,9');
            expect(c.out()).toBe('0 0 0 * 3,5,9 ? *');
        });
        it('atMonthAdd', () => {
            c.atMonthAdd(3);
            c.atMonthAdd(9);
            expect(c.out()).toBe('0 0 0 * 3,9 ? *');
        });
        it('betweenMonths', () => {
            c.betweenMonths(3,9);
            expect(c.out()).toBe('0 0 0 * 3-9 ? *');
        });
        it('betweenMonths every X months', () => {
            c.betweenMonths(2,10, 3);
            expect(c.out()).toBe('0 0 0 * 2-10/3 ? *');
        });
    });
    
    describe('years', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        it('everyYear', () => {
            c.everyYear();
            expect(c.out()).toBe('0 0 0 * * ? *');
        });
        it('everyNYears every x from 0', () => {
            var d = new Date(),
                y = d.getFullYear();
            c.everyNYears(6);
            expect(c.out()).toBe(`0 0 0 * * ? ${y}/6`);
        });
        it('everyNYears every x from y', () => {  
            c.everyNYears(6, 2025);
            expect(c.out()).toBe('0 0 0 * * ? 2025/6');
        });
        it('atYear', () => {
            c.atYear(2176);
            expect(c.out()).toBe('0 0 0 * * ? 2176');
        });
        it('atYear straight more', () => {
            c.atYear('2063,2034');
            expect(c.out()).toBe('0 0 0 * * ? 2063,2034');
        });
        it('atYearAdd', () => {
            c.atYearAdd(1976);
            c.atYearAdd(2034);
            expect(c.out()).toBe('0 0 0 * * ? 1976,2034');
        });
        it('betweenYears', () => {
            c.betweenYears(2013,2039);
            expect(c.out()).toBe('0 0 0 * * ? 2013-2039');
        });
        it('betweenYears every X years', () => {
            c.betweenYears(2013, 2039, 2);
            expect(c.out()).toBe('0 0 0 * * ? 2013-2039/2');
        });
    });

    describe('cadences', () => {
        let c;
        beforeEach(() => {
            c = new Quartzcron();
        });
        test.each([
            // seconds
            [
                '2/6 0 0 * * ? *',
                i => i.atSecond(2,6)
            ],
            [
                '2,5/7 0 0 * * ? *',
                i => i.atSecond(2).atSecondAdd(5, 7)
            ],
            // minutes
            [
                '0 2/7 0 * * ? *',
                i => i.atMinute(2,7)
            ],
            [
                '0 2,5/8 0 * * ? *',
                i => i.atMinute(2).atMinuteAdd(5, 8)
            ],
            // hours
            [
                '0 0 2/8 * * ? *',
                i => i.atHour(2,8)
            ],
            [
                '0 0 2,5/9 * * ? *',
                i => i.atHour(2).atHourAdd(5, 9)
            ],
            // weekday
            [
                '0 0 0 ? * 2/6 *',
                i => i.atWeekDay(2,6)
            ],
            [
                '0 0 0 ? * 2,3/2 *',
                i => i.atWeekDay(2).atWeekDayAdd(3, 2)
            ],
            // monthday
            [
                '0 0 0 2/6 * ? *',
                i => i.atMonthDay(2,6)
            ],
            [
                '0 0 0 2,3/2 * ? *',
                i => i.atMonthDay(2).atMonthDayAdd(3, 2)
            ],
            // month
            [
                '0 0 0 * 2/4 ? *',
                i => i.atMonth(2,4)
            ],
            [
                '0 0 0 * 2,3/2 ? *',
                i => i.atMonth(2).atMonthAdd(3, 2)
            ],
            // year
            [
                '0 0 0 * * ? 2024/6',
                i => i.atYear(2024,6)
            ],
            [
                '0 0 0 * * ? 2024,2050/2',
                i => i.atYear(2024).atYearAdd(2050, 2)
            ]
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
            ])('', ({inp, out}) => {
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
            ])('', ({inp, out}) => {
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
            ])('', inp => {
                expect(typeof Quartzcron.solvers[inp]).toBe('function');
            });
        });
    });

    
});
