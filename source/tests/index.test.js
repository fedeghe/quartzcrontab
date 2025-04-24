
const Crontabist  = require('../dist/index.js');

describe('Crontabist', () => {

    describe('constructor', () => {
        
        it('should Initialize as default', () => {
            const c = new Crontabist()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('should Initialize with month', () => {
            const c = new Crontabist({ m: 3 })
            expect(c.out()).toBe('0 0 0 * 3 ? *')
        })
        it('should Initialize with month-year', () => {
            const c = new Crontabist({ m: 3, y: 2023 })
            expect(c.out()).toBe('0 0 0 * 3 ? 2023')
        })
        it('should Initialize with month-daysOfMonth', () => {
            const c = new Crontabist({ m: 3, dom: '9,12,17' })
            expect(c.out()).toBe('0 0 0 9,12,17 3 ? *')
        })
        it('should Initialize with every second', () => {
            const c = new Crontabist({ s:'*', i: '*', h:'*' })
            expect(c.out()).toBe('* * * * * ? *')
        })
        it('should toString as expected', () => {
            const c = new Crontabist({ s:'*', i: '*', h:'*' })
            expect(c.toString()).toBe('* * * * * ? *')
            expect(c+'').toBe('* * * * * ? *')
            expect(String(c)).toBe('* * * * * ? *')
            expect(`${c}`).toBe('* * * * * ? *')
        })
    })
    
    describe('seconds', () => {
        let c
        beforeEach(() => {
            c = new Crontabist()
        })
        it('everySecond', () => {
            c.everySecond()
            expect(c.out()).toBe('* 0 0 * * ? *')
        })
        it('everyNSeconds every x from 0', () => {
            c.everyNSeconds({ freq: 6 })
            expect(c.out()).toBe('0/6 0 0 * * ? *')
        })
        it('everyNSeconds every x from y', () => {
            c.everyNSeconds({ freq: 6, start:13 })
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
            c = new Crontabist()
        })
        it('everyMinute', () => {
            c.everyMinute()
            expect(c.out()).toBe('0 * 0 * * ? *')
        })
        it('everyNMinutes every x from 0', () => {
            c.everyNMinutes({ freq: 6 })
            expect(c.out()).toBe('0 0/6 0 * * ? *')
        })
        it('everyNMinutes every x from y', () => {  
            c.everyNMinutes({ freq: 6, start:13 })
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
            c = new Crontabist()
        })
        it('everyHour', () => {
            c.everyHour()
            expect(c.out()).toBe('0 0 * * * ? *')
        })
        it('everyNHours every x from 0', () => {
            c.everyNHours({ freq: 6 })
            expect(c.out()).toBe('0 0 0/6 * * ? *')
        })
        it('everyNHours every x from y', () => {  
            c.everyNHours({ freq: 6, start:13 })
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
            c = new Crontabist()
        })
        it('everyDay', () => {
            c.everyDay()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('every weekday starting from', () => {
            c.everyWeekDayStartingFromNMonthDay(3, 15)
            expect(c.out()).toBe('0 0 0 15/3 * ? *')
        })
        it('everyWeekDay - num', () => {
            c.everyWeekDay(4)
            expect(c.out()).toBe('0 0 0 ? * 4 *')
        })
        it('everyWeekDay - label', () => {
            c.everyWeekDay('MON')
            expect(c.out()).toBe('0 0 0 ? * MON *')
        })
        it('everyWeekDayAdd - num', () => {
            c.everyWeekDayAdd(2)
            c.everyWeekDayAdd(4)
            expect(c.out()).toBe('0 0 0 ? * 2,4 *')
        })
        it('everyWeekDayAdd - label', () => {
            c.everyWeekDayAdd('MON')
            c.everyWeekDayAdd('FRI')
            expect(c.out()).toBe('0 0 0 ? * MON,FRI *')
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
            c.atMonthDayAdd(21)
            expect(c.out()).toBe('0 0 0 13,21 * ? *')
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
            c = new Crontabist()
        })
        it('everyMonth', () => {
            c.everyMonth()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('everyNMonths every x from 0', () => {
            c.everyNMonths({ freq: 6 })
            expect(c.out()).toBe('0 0 0 * 0/6 ? *')
        })
        it('everyNMonths every x from y', () => {  
            c.everyNMonths({ freq: 6, start:13 })
            expect(c.out()).toBe('0 0 0 * 13/6 ? *')
        })
        it('atMonth', () => {
            c.atMonth(13)
            expect(c.out()).toBe('0 0 0 * 13 ? *')
        })
        it('atMonth straight more', () => {
            c.atMonth('13,15,19')
            expect(c.out()).toBe('0 0 0 * 13,15,19 ? *')
        })
        it('atMonthAdd', () => {
            c.atMonthAdd(13)
            c.atMonthAdd(19)
            expect(c.out()).toBe('0 0 0 * 13,19 ? *')
        })
        it('betweenMonths', () => {
            c.betweenMonths(13,19)
            expect(c.out()).toBe('0 0 0 * 13-19 ? *')
        })
        it('betweenMonths every X months', () => {
            c.betweenMonths(2,10, 3)
            expect(c.out()).toBe('0 0 0 * 2-10/3 ? *')
        })
    })
    
    describe('years', () => {
        let c
        beforeEach(() => {
            c = new Crontabist()
        })
        it('everyYear', () => {
            c.everyYear()
            expect(c.out()).toBe('0 0 0 * * ? *')
        })
        it('everyNYears every x from 0', () => {
            var d = new Date(),
                y = d.getFullYear();
            c.everyNYears({ freq: 6 })
            expect(c.out()).toBe(`0 0 0 * * ? ${y}/6`)
        })
        it('everyNYears every x from y', () => {  
            c.everyNYears({ freq: 6, start:2025 })
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
            c = new Crontabist()
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
                .everyWeekDayStartingFromNMonthDay(5, 2)
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
            c = new Crontabist()
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
            c = new Crontabist()
        })
        it('default', () => {
            expect(c.describe()).toBe('every second of every day of every year')
        })
    })

    describe('static', () => {
        it('CronTabist.getRanger should work as expected', () => {
            const ranger24 = Crontabist.getRanger(24),
                ranger60 = Crontabist.getRanger(60),
                exp24 = [
                    {inp:0,out:0},
                    {inp:11,out:11},
                    {inp:23,out:23},
                    {inp:24,out:0},
                    {inp:26,out:2},
                    {inp:47,out:23},
                    {inp:49,out:1},
                    {inp:-1,out:23},
                ],
                exp60=[
                    {inp:0,out:0},
                    {inp:11,out:11},
                    {inp:12,out:12},
                    {inp:59,out:59},
                    {inp:60,out:0},
                    {inp:62,out:2},
                    {inp:118,out:58},
                    {inp:-1,out:59},
                ];
            exp24.forEach(({inp, out}) => {
                expect(ranger24(inp)).toBe(out)
            });
            exp60.forEach(({inp, out}) => {
                expect(ranger60(inp)).toBe(out)
            })
        })
    })

    describe('validation', () => {
        describe('- seconds', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
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
                })
            })
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
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
                })
            })
        })
        describe('- minutes', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
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
                    c = new Crontabist()
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
                    c = new Crontabist()
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
                    c = new Crontabist()
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
                    c = new Crontabist()
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
                    c = new Crontabist()
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
                // note: to support ranges like MON,SUN or MON-SUN 
                // instead of numeric values we need a less trivial rx.splitter
                beforeEach(() => {
                    c = new Crontabist()
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
            })
            
            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
                })
                it('out of expected range', () => {
                    c.over({dom: '?', dow:8})
                    expect(c.validate().valid).toBeFalsy()
                    expect(c.validate().errors.length).toBe(1)
                    expect(c.validate().errors[0]).toBe('Dow has unexpected value')
                })
            })
             
        })
        describe('- months', () => {
            describe('- positives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
                })
                test.each([
                    ['every', {m: '*'}],// every month does that
                    ['single - num', {m: '3'}],// every month does that
                    ['single - label', {m: 'JAN'}],// every month does that
                    ['multiple - num', {m: '1,2,3'}],// every month does that
                    ['multiple - label', {m: 'JAN,FEB,MAR'}],// every month does that
                    ['interval - num', {m: '1-6'}],// every month does that
                    ['interval - label', {m: 'JAN-JUN'}],// every month does that
                    ['interval with cadence - num', {m: '1-8/2'}],// every month does that
                    ['interval with cadence - label', {m: 'JAN-AUG/2'}],// every month does that  
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })


            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
                })
                test.each([
                    ['single invalid', {m: '13'}],// every month does that
                    ['some invalid', {m: '2,13'}],// every month does that
                    ['all invalid', {m: '13,21,23'}],// every month does that
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
                    c = new Crontabist()
                })

                test.each([
                    ['every', {y: '*'}],// every month does that
                    ['one number', {y: '2030'}],// every month does that
                    ['more than one number', {y: '2030,2032'}],// every month does that
                    ['interval', {y: '2020-2032'}],// every month does that
                    ['interval with cadence', {y: '2010-2032/2'}],// every month does that
                    
                ])('%s', (_, arg) => {
                    c.over(arg)
                    expect(c.validate().valid).toBeTruthy()
                    expect(c.validate().errors.length).toBe(0)
                })
            })


            describe('- negatives', () => {
                let c
                beforeEach(() => {
                    c = new Crontabist()
                })
                test.each([
                    ['single invalid lower', {y: '1969'}],// every month does that
                    ['single invalid higher', {y: '2100'}],// every month does that
                    ['some invalid', {y: '1200,2000'}],// every month does that
                    ['all invalid', {y: '1200,2300,34000'}],// every month does that
                    
                    
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
                    ['0 0 0 * * ? *'],
                    ['* * * * * ? *'],
                    ['0 0 0 1 * ? *'],
                    ['0 0 0 1 1 ? *'],
                    ['0 0 0 L 1 ? *'],
                    ['0 0 0 LW 1 ? *'],
                    ['0 0 0 3W 1 ? *'],
                    ['0,1,5 1-31/5 * ? JAN,FeB 7#3 2026,2028,2032'],
                    ['* * * ? JAN,FEB 7#3 2026,2028,2032'],
                    ['* * * ? JAN-DEC/2 7#3 2026-2080/4'],

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
                    const validation = Crontabist.validate(arg)
                    expect(validation.valid).toBeTruthy()
                    expect(validation.errors.length).toBe(0)
                })
            })
            describe('- negatives', () => {
                test.each([
                    ['-1 0 0 * * ? *', ['Seconds are not well formatted']],
                    ['0 -1 0 * * ? *', ['Minutes are not well formatted']],
                    ['0 0 -12 * * ? *', ['Hours are not well formatted']],
                    ['0 0 0 s * ? *', ['Dom has unexpected value']],
                    ['0 0 0 * aaa ? *', ['Months are not well formatted']],
                    ['0 0 0 ? * 333 *', ['Dow has unexpected value']],
                    ['0 0 0 ? * * aaaa', ['Years are not well formatted']],
                    ['0 0 0 1 * 1 *', ['either dom either dow must contain "?"']],
                    // more than one
                    ['-1 -1 -12 s aaa 333 sss', [
                        'either dom either dow must contain "?"',
                        'Seconds are not well formatted',
                        'Minutes are not well formatted',
                        'Hours are not well formatted',
                        'Months are not well formatted',
                        'Years are not well formatted',
                        'Dom has unexpected value',
                        'Dow has unexpected value',
                    ]],
                ])('%s', (arg, err) => {
                    const validation = Crontabist.validate(arg)
                    expect(validation.valid).toBeFalsy()
                    expect(validation.errors).toMatchObject(err)
                })

                it('nothing passed', () => {
                    const validation = Crontabist.validate()
                    expect(validation.valid).toBeFalsy()
                    expect(validation.errors).toMatchObject([])
                })
            })
            
        }) 
        describe('correlations', () => {
            describe('- dow <> dom', () => { 
                describe('- negatives', () => {
                    let c
                    beforeEach(() => {
                        c = new Crontabist()
                    })
                    it('dow and dow cant be both set', () => {
                        c.over({dom: 12, dow:2})
                        expect(c.validate().valid).toBeFalsy()
                        expect(c.validate().errors.length).toBe(1)
                        expect(c.validate().errors[0]).toBe('either dom either dow must contain "?"')
                    })
                })
            })
        })      
    })

    describe('next', () => {
        it.skip('basic', () => {
            const d = new Date('18:19:20 3-12-2025');
            Crontabist.next(d, {
                s: 21,
                i: 20,
                h: 19,
                dow: '?',
                m: 3,
                dom:11,
                y: 2025
            })

        })
    })

    
})



