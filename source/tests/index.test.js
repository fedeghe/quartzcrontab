
const Quartzcron  = require('../dist/index.js');
const C = require('../dist/constants.js')

describe('Quartzcron', () => {

    describe('constructor', () => {
        
        // with object
        it('should Initialize as default', () => {
            const c = new Quartzcron()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('should Initialize with month', () => {
            const c = new Quartzcron({ m: 3 })
            expect(c.out()).toBe('0 0 0 * 3 ? *')
        })
        it('should Initialize with month-year', () => {
            const c = new Quartzcron({ m: 3, y: 2023 })
            expect(c.out()).toBe('0 0 0 * 3 ? 2023')
        })
        it('should Initialize with month-daysOfMonth', () => {
            const c = new Quartzcron({ m: 3, dom: '9,12,17' })
            expect(c.out()).toBe('0 0 0 9,12,17 3 ? *')
        })
        it('should Initialize with every second', () => {
            const c = new Quartzcron({ s:'*', i: '*', h:'*' })
            expect(c.out()).toBe('* * * * * ? *')
        })
        it('should toString as expected', () => {
            const c = new Quartzcron({ s:'*', i: '*', h:'*' })
            expect(c.toString()).toBe('* * * * * ? *')
            expect(c+'').toBe('* * * * * ? *')
            expect(String(c)).toBe('* * * * * ? *')
            expect(`${c}`).toBe('* * * * * ? *')
        })

        // with string
        it('should Initialize with hour - from string', () => {
            const c = new Quartzcron('0 0 1 * * ? *')
            expect(c.out()).toBe('0 0 1 * * ? *')
        })
        it('should Initialize with h:i:s - from string', () => {
            const c = new Quartzcron('59 15 1 * * ? *')
            expect(c.out()).toBe('59 15 1 * * ? *')
        })
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
                    new Quartzcron(p)
                }).toThrow(C.errors.constructorErr)
            })
        })
    })
    
    describe('updateExp', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        test.each([
            ['1 1 1 * * ? 2013'],
            [{s:1,i:1,h:1,dom:'*',m:'*',dow:'?',y:2013}, '1 1 1 * * ? 2013'],
        ])('update to %s', (s, exp = null) => {
            c.updateExp(s);
            expect(c.out()).toBe(exp || s)
        })
        it('nothing passed goes to defaults', () => {
            c.updateExp();
            expect(c.out()).toBe(Object.values(C.defaults).join(' '));
        })

        test.each([
            ['1 1 59 * * ? 20133423'],
            ['-1 1 1 * * ? 2013'],
            ['1 60 1 * * ? 2013'],
            ['1 0 441 * * ? 2013'],
            ['1 0 1 ? * ? 2013'],
        ])('update to %s', s => {
            expect(() => 
                c.updateExp(s)
            ).toThrow(C.errors.updateExpErr)
        })
    })


    describe('seconds', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everySecond', () => {
            c.everySecond()
            expect(c.out()).toBe('* 0 0 * * ? *')
        })
        it('everyNSeconds every x from 0', () => {
            c.everyNSeconds(6)
            expect(c.out()).toBe('0/6 0 0 * * ? *')
        })
        it('everyNSeconds every x from y', () => {
            c.everyNSeconds(6, 13)
            expect(c.out()).toBe('13/6 0 0 * * ? *')
        })
        it('atSecond', () => {
            c.atSecond(13)
            expect(c.out()).toBe('13 0 0 * * ? *')
        })
        it('atSecond straight more', () => {  
            c.atSecond('13,15,19')
            expect(c.out()).toBe('13,15,19 0 0 * * ? *')
        })
        it('atSecondAdd - single', () => {
            c.atSecondAdd(13)
            c.atSecondAdd(19)
            expect(c.out()).toBe('0,13,19 0 0 * * ? *')
        })
        it('atSecondAdd - multiple', () => {
            c.atSecondAdd(12)
            c.atSecondAdd('13,19')
            expect(c.out()).toBe('0,12,13,19 0 0 * * ? *')
        })
        it('betweenSeconds', () => {
            c.betweenSeconds(13,19)
            expect(c.out()).toBe('13-19 0 0 * * ? *')
        })
        it('betweenSeconds every X seconds', () => {
            c.betweenSeconds(3,39, 2)
            expect(c.out()).toBe('3-39/2 0 0 * * ? *')
        })
    })
    
    describe('minutes', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everyMinute', () => {
            c.everyMinute()
            expect(c.out()).toBe('0 * 0 * * ? *')
        })
        it('everyNMinutes every x from 0', () => {
            c.everyNMinutes(6)
            expect(c.out()).toBe('0 0/6 0 * * ? *')
        })
        it('everyNMinutes every x from y', () => {  
            c.everyNMinutes(6, 13)
            expect(c.out()).toBe('0 13/6 0 * * ? *')
        })
        it('atMinute', () => {  
            c.atMinute(13)
            expect(c.out()).toBe('0 13 0 * * ? *')
        })
        it('atMinute straight more', () => {
            c.atMinute('13,15,19')
            expect(c.out()).toBe('0 13,15,19 0 * * ? *')
        })
        it('atMinuteAdd', () => {
            c.atMinuteAdd(13)
            c.atMinuteAdd(19)
            expect(c.out()).toBe('0 0,13,19 0 * * ? *')
        })
        it('betweenMinutes', () => {
            c.betweenMinutes(13,19)
            expect(c.out()).toBe('0 13-19 0 * * ? *')
        })
        it('betweenMinutes every X minutes', () => {
            c.betweenMinutes(13,49, 7)
            expect(c.out()).toBe('0 13-49/7 0 * * ? *')
        })
    })
    
    describe('hours', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everyHour', () => {
            c.everyHour()
            expect(c.out()).toBe('0 0 * * * ? *')
        })
        it('everyNHours every x from 0', () => {
            c.everyNHours(6)
            expect(c.out()).toBe('0 0 0/6 * * ? *')
        })
        it('everyNHours every x from y', () => {  
            c.everyNHours(6, 13)
            expect(c.out()).toBe('0 0 13/6 * * ? *')
        })
        it('atHour', () => {  
            c.atHour(13)
            expect(c.out()).toBe('0 0 13 * * ? *')
        })
        it('atHour straight more', () => {
            c.atHour('13,15,19')
            expect(c.out()).toBe('0 0 13,15,19 * * ? *')
        })
        it('atHourAdd', () => {
            c.atHourAdd(13)
            c.atHourAdd(19)
            expect(c.out()).toBe('0 0 0,13,19 * * ? *')
        })
        it('betweenHours', () => {
            c.betweenHours(13,19)
            expect(c.out()).toBe('0 0 13-19 * * ? *')
        })
        it('betweenHours every X hours', () => {
            c.betweenHours(2,19, 3)
            expect(c.out()).toBe('0 0 2-19/3 * * ? *')
        })
    })
    
    describe('day of month/week', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everyDay', () => {
            c.everyDay()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('every n days', () => {
            c.everyNDays(3)
            expect(c.out()).toBe('0 0 0 1/3 * ? *')
        })
        it('every n days starting from', () => {
            c.everyNDays(3, 15)
            expect(c.out()).toBe('0 0 0 15/3 * ? *')
        })
        it('every weekend', () => {
            c.everyWeekEnd()
            expect(c.out()).toBe('0 0 0 ? * 7,1 *')
        })
        it('everyWeekDay => weekdays mon-fri', () => {
            c.everyWeekDay()
            expect(c.out()).toBe('0 0 0 ? * 2-6 *')
        })

        it('atWeekDay', () => {
            c.atWeekDay(3)
            expect(c.out()).toBe('0 0 0 ? * 3 *')
        })
        it('atWeekDayAdd', () => {
            c.atWeekDayAdd(5)
            expect(c.out()).toBe('0 0 0 ? * 5 *')
        })
        it('atWeekDayAdd on something', () => {
            c.atWeekDay(2)
                .atWeekDayAdd('5/2')
            expect(c.out()).toBe('0 0 0 ? * 2,5/2 *')
        })

        it('betweenWeekDays', () => {
            c.betweenWeekDays(2, 5)
            expect(c.out()).toBe('0 0 0 ? * 2-5 *')
        })
        it('betweenWeekDays (wrong, unchanged)', () => {
            c.betweenWeekDays(5, 2)
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('betweenWeekDays with cadence', () => {
            c.betweenWeekDays(2, 5, 2)
            expect(c.out()).toBe('0 0 0 ? * 2-5/2 *')
        })

        it('atMonthDay', () => {
            c.atMonthDay(21)
            expect(c.out()).toBe('0 0 0 21 * ? *')
        })
        it('atMonthDay range', () => {
            c.atMonthDay('21-29')
            expect(c.out()).toBe('0 0 0 21-29 * ? *')
        })
        it('atMonthDay range with cadence', () => {
            c.atMonthDay('21-29/2')
            expect(c.out()).toBe('0 0 0 21-29/2 * ? *')
        })
        it('atMonthDayAdd', () => {
            c.atMonthDayAdd(13)
            c.atMonthDayAdd('21/2')
            c.atMonthDayAdd(24)
            expect(c.out()).toBe('0 0 0 13,21/2,24 * ? *')
        })
        it('betweenMonthDays', () => {
            c.betweenMonthDays(12,19)
            expect(c.out()).toBe('0 0 0 12-19 * ? *')
        })
        it('betweenMonthDays with cadence', () => {
            c.betweenMonthDays(12,19, 2)
            expect(c.out()).toBe('0 0 0 12-19/2 * ? *')
        })
        it('onLastMonthDay', () => {
            c.onLastMonthDay()
            expect(c.out()).toBe('0 0 0 L * ? *')
        })
        it('onFirstMonthWeekDay', () => {
            c.onFirstMonthWeekDay()
            expect(c.out()).toBe('0 0 0 1W * ? *')
        })
        it('onLastMonthWeekDay', () => {
            c.onLastMonthWeekDay()
            expect(c.out()).toBe('0 0 0 LW * ? *')
        })
        it('onLastMonthNWeekDay', () => {
            c.onLastMonthNWeekDay(2)
            expect(c.out()).toBe('0 0 0 ? * 2L *')
        })
        it('onNDayBeforeTheEndOfTheMonth', () => {
            c.onNDayBeforeTheEndOfTheMonth(2)
            expect(c.out()).toBe('0 0 0 L-2 * ? *')
        })
        it('onClosestWorkingDayToTheNMonthDay', () => {
            c.onClosestWorkingDayToTheNMonthDay(2)
            expect(c.out()).toBe('0 0 0 2W * ? *')
        })
        
        it('onNWeekDayOfTheMonth', () => {
            c.onNWeekDayOfTheMonth(2, 4)
            expect(c.out()).toBe('0 0 0 ? * 4#2 *')
        })
    })
    
    describe('months', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everyMonth', () => {
            c.everyMonth()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('everyNMonths every x from 0', () => {
            c.everyNMonths(6)
            expect(c.out()).toBe('0 0 0 * 0/6 ? *')
        })
        it('everyNMonths every x from y', () => {  
            c.everyNMonths(6, 3)
            expect(c.out()).toBe('0 0 0 * 3/6 ? *')
        })
        it('atMonth', () => {
            c.atMonth(3)
            expect(c.out()).toBe('0 0 0 * 3 ? *')
        })
        it('atMonth straight more', () => {
            c.atMonth('3,5,9')
            expect(c.out()).toBe('0 0 0 * 3,5,9 ? *')
        })
        it('atMonthAdd', () => {
            c.atMonthAdd(3)
            c.atMonthAdd(9)
            expect(c.out()).toBe('0 0 0 * 3,9 ? *')
        })
        it('betweenMonths', () => {
            c.betweenMonths(3,9)
            expect(c.out()).toBe('0 0 0 * 3-9 ? *')
        })
        it('betweenMonths every X months', () => {
            c.betweenMonths(2,10, 3)
            expect(c.out()).toBe('0 0 0 * 2-10/3 ? *')
        })
    })
    
    describe('years', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('everyYear', () => {
            c.everyYear()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('everyNYears every x from 0', () => {
            var d = new Date(),
                y = d.getFullYear();
            c.everyNYears(6)
            expect(c.out()).toBe(`0 0 0 * * ? ${y}/6`)
        })
        it('everyNYears every x from y', () => {  
            c.everyNYears(6, 2025)
            expect(c.out()).toBe('0 0 0 * * ? 2025/6')
        })
        it('atYear', () => {
            c.atYear(2176)
            expect(c.out()).toBe('0 0 0 * * ? 2176')
        })
        it('atYear straight more', () => {
            c.atYear('2063,2034')
            expect(c.out()).toBe('0 0 0 * * ? 2063,2034')
        })
        it('atYearAdd', () => {
            c.atYearAdd(1976)
            c.atYearAdd(2034)
            expect(c.out()).toBe('0 0 0 * * ? 1976,2034')
        })
        it('betweenYears', () => {
            c.betweenYears(2013,2039)
            expect(c.out()).toBe('0 0 0 * * ? 2013-2039')
        })
        it('betweenYears every X years', () => {
            c.betweenYears(2013, 2039, 2)
            expect(c.out()).toBe('0 0 0 * * ? 2013-2039/2')
        })
    })

    describe('chained actions', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('atSecond atMinute atHour', () => {
            c.atSecond(3)
                .atMinute(14)
                .atHour(23)
            expect(c.out()).toBe('3 14 23 * * ? *')
        })
        it('atSecond atMinute atHour every X days starting from day Y', () => {
            c.atSecond(30)
                .atMinute(0)
                .atHour(12)
                .everyNDays(5, 2)
            expect(c.out()).toBe('30 0 12 2/5 * ? *')
        })
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
                .atYearAdd(2032)
            expect(c.out()).toBe('0,1,5 0 * ? JAN,FEB 7#3 2026,2028,2032')
        })
    })
    
    describe('edge examples', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('atSecond atMinute atHour atMonth all at range+cadence', () => {
            c.atSecond('3-30/2')
                .atMinute('15-45/5')
                .atHour('12-23/3')
                .atMonth('3-10/2')
            expect(c.out()).toBe('3-30/2 15-45/5 12-23/3 * 3-10/2 ? *')
        })
        it('utils.removeSpaces', () => {
            c.atSecond('3 - 30 / 2')
                .atMinute('15 - 45 / 5')
                .atHour('12 - 2 3 / 3')
                .atMonth('3 - 1 0 / 2')
            expect(c.out()).toBe('3-30/2 15-45/5 12-23/3 * 3-10/2 ? *')
        })
    })

    describe('describe as expected', () => {
        let c
        beforeEach(() => {
            c = new Quartzcron()
        })
        it('default', () => {
            expect(c.describe()).toBe('at midnight of every day')
        })
    })

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
                expect(ranger24(inp)).toBe(out)
            });
        })

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
                expect(ranger60(inp)).toBe(out)
            });
        })

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
                expect(typeof Quartzcron.solvers[inp]).toBe('function')
            });
        })
    })

    /**
     * the whole validation test exploit directly the "over" method
     * which is not actually supposed to be used directly,
     * "over" allows to set the elements for the validation in one single call
     */
    describe('validation', () => {
        describe('- seconds', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['every', {s: '*'}],
                    ['one number', {s: '3'}],
                    ['more than one number', {s: '3,5,7'}],
                    ['interval', {s: '3-45'}],
                    ['interval with cadence', {s: '3-45/3'}],
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                    expect(c.validate(c.out()).valid).toBeTruthy()
                    expect(c.validate(c.out()).errors.length).toBe(0)
                })
            })
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['negative', {s: -1}],
                    ['over 23', {s: 60}],
                    ['invalid interval', {s: '3--30'}],
                    ['alpha', {s: 'a'}],
                    ['minus', {s: '-'}],
                    ['minus one str', {s: '-1'}],
                    ['empty str', {s: ''}],
                    ['regexp', {s: /^$/}],
                    ['func', {s: ()=>{}}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                    expect(c.validate(c.out()).valid).toBeFalsy()
                    expect(c.validate(c.out()).errors.length).toBe(1)
                })
            })
        })
        describe('- minutes', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['every', {i: '*'}],
                    ['one number', {i: '3'}],
                    ['more than one number', {i: '3,11,36'}],
                    ['interval', {i: '11-36'}],
                    ['interval with cadence', {i: '11-36/2'}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['negative', {i: -1}],
                    ['over 23', {i: 60}],
                    ['invalid interval', {i: '3--30'}],
                    ['alpha', {i: 'a'}],
                    ['minus', {i: '-'}],
                    ['minus one str', {i: '-1'}],
                    ['empty str', {i: ''}],
                    ['regexp', {i: /^$/}],
                    ['func', {i: ()=>{}}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                })
            })
        })
        describe('- hours', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['every', {h: '*'}],
                    ['one number', {h: '3'}],
                    ['more than one number', {h: '3,5,9'}],
                    ['interval', {h: '3-9'}],
                    ['interval with cadence', {h: '3-9/2'}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })

            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['negative', {h: -1}],
                    ['over 23', {h: 24}],
                    ['invalid interval', {h: '3--30'}],
                    ['alpha', {h: 'a'}],
                    ['minus', {h: '-'}],
                    ['minus one str', {h: '-1'}],
                    ['empty str', {h: ''}],
                    ['regexp', {h: /^$/}],
                    ['func', {h: ()=>{}}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                })
            })
        })
        describe('- dom', () => { 
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['?', {dom: '?', dow:2}],
                    ['*', {dom: '*', dow:'?'}],
                    ['weekday/[1-31]', {dom: '3/21', dow:'?'}],
                    ['weekday', {dom: '3', dow:'?'}],
                    ['weekdays', {dom: '2,3,4', dow:'?'}],
                    ['weekdays/cadence', {dom: '1-5/2', dow:'?'}],
                    ['L', {dom: 'L', dow:'?'}],
                    ['LW', {dom: 'LW', dow:'?'}],
                    ['1W', {dom: '1W', dow:'?'}],
                    ['L-x', {dom: 'L-12', dow:'?'}],
                    ['xL', {dom: '13L', dow:'?'}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                }) 
            })
            
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['too big', {dom: 32}],
                    ['too small', {dom: -1}],
                    ['still too small', {dom: 0}],
                    ['unexpected I', {dom: 'I'}],
                    ['wrong suffix', {dom: 'Lx'}],
                    ['wrong order', {dom: 'L1'}],
                    ['too small prefix', {dom: '0L'}],
                    ['too big prefix', {dom: '1123L'}],
                    ['still too big prefix', {dom: '32L'}],
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                }) 
            })
            
        })
        describe('- dow', () => { 

            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['?', {dom: '*', dow:'?'}],
                    ['weekday - num', {dom: '?', dow:'2'}],
                    ['weekday - label', {dom: '?', dow:'FRI'}],
                    ['weekdays - nums', {dom: '?', dow:'1,3'}],
                    ['weekdays - labels', {dom: '?', dow:'MON,FRI'}],
                    ['weekdays range - nums', {dom: '?', dow:'1-5'}],
                    ['weekdays range - labels', {dom: '?', dow:'MoN-FrI'}],
                    ['weekdays range with cadence', {dom: '?', dow:'1-5/2'}],
                    ['weekdays range with cadence - label', {dom: '?', dow:'MON-FRI/2'}],
                    ['xL - num', {dom: '?', dow:'3L'}],
                    ['xL - label', {dom: '?', dow:'SUNL'}],
                    ['x#y - num', {dom: '?', dow:'3#2'}],
                    ['x#y - label', {dom: '?', dow:'MON#2'}],
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                }) 
                it('no params - everyWeekDay', ()=>{
                    c.everyWeekDay()
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.elements.dow).toBe('2-6')
                    expect(c.elements.dom).toBe('?')
                    
                }) 
            })
            
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                it('out of expected range', () => {
                    c.over({dom: '?', dow:8})
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                    expect(c.validate().errors[0]).toBe(C.errors.malformed.dow)
                })
            })
             
        })
        describe('- months', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['every', {m: '*'}],// every month does that
                    ['single - num', {m: '3'}],
                    ['single - label', {m: 'JAN'}],
                    ['multiple - num', {m: '1,2,3'}],
                    ['multiple - label', {m: 'JAN,FEB,MAR'}],
                    ['interval - num', {m: '1-6'}],
                    ['interval - label', {m: 'JAN-JUN'}],
                    ['interval with cadence - num', {m: '1-8/2'}],
                    ['interval with cadence - label', {m: 'JAN-AUG/2'}],  
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })

            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['single invalid', {m: '13'}],
                    ['some invalid', {m: '2,13'}],
                    ['all invalid', {m: '13,21,23'}],
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                })
            })
        })

        describe('- years', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['every', {y: '*'}],
                    ['one number', {y: '2030'}],
                    ['more than one number', {y: '2030,2032'}],
                    ['interval', {y: '2020-2032'}],
                    ['interval with cadence', {y: '2010-2032/2'}],
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })

            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Quartzcron()
                })
                test.each([
                    ['single invalid lower', {y: '1969'}],
                    ['single invalid higher', {y: '2100'}],
                    ['some invalid', {y: '1200,2000'}],
                    ['all invalid', {y: '1200,2300,34000'}],
                    
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                })
            })
        })

        describe('static validate', () => {    
            describe('- positives', () => {
                test.each([
                    '0 0 0 * * ? *',
                    '* * * * * ? *',
                    '0 0 0 1 * ? *',
                    '0 0 0 1 1 ? *',
                    '0 0 0 L 1 ? *',
                    '0 0 0 LW 1 ? *',
                    '0 0 0 3W 1 ? *',
                    '0,1,5 1-31/5 * ? JAN,FeB 7#3 2026,2028,2032',
                    '* * * ? JAN,FEB 7#3 2026,2028,2032',
                    '* * * ? JAN-DEC/2 7#3 2026-2080/4',

                    // from https://www.freeformatter.com/cron-expression-generator-quartz.html
                    '* * * ? * *', 
                    '0 * * ? * *',
                    '0 */2 * ? * *',
                    '0 1/2 * ? * *',
                    '0 */2 * ? * *',
                    '0 */3 * ? * *',
                    '0 */4 * ? * *',
                    '0 */5 * ? * *',
                    '0 */10 * ? * *',
                    '0 */15 * ? * *',
                    '0 */30 * ? * *',
                    '0 15,30,45 * ? * *',
                    '0 0 * ? * *',
                    '0 0 */2 ? * *',
                    '0 0 0/2 ? * *',
                    '0 0 1/2 ? * *',
                    '0 0 */3 ? * *',
                    '0 0 */4 ? * *',
                    '0 0 */6 ? * *',
                    '0 0 */8 ? * *',
                    '0 0 */12 ? * *',
                    '0 0 0 * * ?',
                    '0 0 1 * * ?',
                    '0 0 6 * * ?',
                    '0 0 12 * * ?',
                    '0 0 12 * * ?',
                    '0 0 12 ? * SUN',
                    '0 0 12 ? * MON',
                    '0 0 12 ? * TUE',
                    '0 0 12 ? * WED',
                    '0 0 12 ? * THU',
                    '0 0 12 ? * FRI',
                    '0 0 12 ? * SAT',
                    '0 0 12 ? * MON-FRI',
                    '0 0 12 ? * SUN,SAT',
                    '0 0 12 */7 * ?',
                    '0 0 12 1 * ?',
                    '0 0 12 2 * ?',
                    '0 0 12 15 * ?',
                    '0 0 12 1/2 * ?',
                    '0 0 12 1/4 * ?',
                    '0 0 12 L * ?',
                    '0 0 12 L-2 * ?',
                    '0 0 12 LW * ?',
                    '0 0 12 1L * ?',
                    '0 0 12 2L * ?',
                    '0 0 12 6L * ?',
                    '0 0 12 1W * ?',
                    '0 0 12 15W * ?',
                    '0 0 12 ? * 2#1',
                    '0 0 12 ? * 6#1',
                    '0 0 12 ? * 2#2',
                    '0 0 12 ? * 5#3',
                    '0 0 12 ? JAN *',
                    '0 0 12 ? JUN *',
                    '0 0 12 ? JAN,JUN *',
                    '0 0 12 ? DEC *',
                    '0 0 12 ? JAN,FEB,MAR,APR *',
                    '0 0 12 ? 9-12 *',
                    '0 0 12 ? 9-12 */3',
                ])('%s', (arg) => {
                    const validation = Quartzcron.validate(arg)
                    expect(validation.valid).toBeTruthy()
                    expect(validation.errors.length).toBe(0)
                })
            })

            describe('- negatives', () => {
                test.each([
                    ['-1 0 0 * * ? *', [C.errors.malformed.seconds]],
                    ['0 -1 0 * * ? *', [C.errors.malformed.minutes]],
                    ['0 0 -12 * * ? *', [C.errors.malformed.hours]],
                    ['0 0 0 s * ? *', [C.errors.malformed.dom]],
                    ['0 0 0 * aaa ? *', [C.errors.malformed.months]],
                    ['0 0 0 ? * 333 *', [C.errors.malformed.dow]],
                    ['0 0 0 ? * * aaaa', [C.errors.malformed.years]],
                    ['0 0 0 1 * 1 *', [C.errors.domdowExclusivity]],
                    // more than one
                    ['-1 -1 -12 s aaa 333 sss', [
                        C.errors.domdowExclusivity,
                        C.errors.malformed.seconds,
                        C.errors.malformed.minutes,
                        C.errors.malformed.hours,
                        C.errors.malformed.months,
                        C.errors.malformed.years,
                        C.errors.malformed.dom,
                        C.errors.malformed.dow,
                    ]],
                ])('%s', (arg, err) => {
                    const validation = Quartzcron.validate(arg)
                    expect(validation.valid).toBeFalsy()
                    expect(validation.errors).toMatchObject(err)
                })

                it('nothing passed', () => {
                    const validation = Quartzcron.validate()
                    expect(validation.valid).toBeFalsy()
                    expect(validation.errors).toMatchObject([C.errors.staticValidationParamMissing])
                })
            })
            
        }) 

        describe('correlations', () => {

            describe('- dow <> dom', () => { 

                describe('- negatives', () => {
                    let c
                    beforeEach(() => {
                        c = new Quartzcron()
                    })
                    it('dow and dow cant be both set', () => {
                        c.over({dom: 12, dow:2})
                        expect(c.validate().valid).toBeFalsy()
                        expect(c.validate().errors.length).toBe(1)
                        expect(c.validate().errors[0]).toBe(C.errors.domdowExclusivity)
                    })
                })
            })
        })      
    })
})
