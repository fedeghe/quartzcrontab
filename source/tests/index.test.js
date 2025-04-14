
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
        it('everyXSeconds every x from 0', () => {
            c.everyXSeconds({ freq: 6 })
            expect(c.out()).toBe('0/6 0 0 * * ? *')
        })
        it('everyXSeconds every x from y', () => {
            c.everyXSeconds({ freq: 6, start:13 })
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
        it('atSecondAdd', () => {
            c.atSecondAdd(13)
            c.atSecondAdd(19)
            expect(c.out()).toBe('0,13,19 0 0 * * ? *')
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
        it('everyXMinutes every x from 0', () => {
            c.everyXMinutes({ freq: 6 })
            expect(c.out()).toBe('0 0/6 0 * * ? *')
        })
        it('everyXMinutes every x from y', () => {  
            c.everyXMinutes({ freq: 6, start:13 })
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
        it('everyXHours every x from 0', () => {
            c.everyXHours({ freq: 6 })
            expect(c.out()).toBe('0 0 0/6 * * ? *')
        })
        it('everyXHours every x from y', () => {  
            c.everyXHours({ freq: 6, start:13 })
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
        it('everyDay', () => {
            c.everyXDayStartingFromYDay(3, 15)
            expect(c.out()).toBe('0 0 0 15/3 * ? *')
        })
        it('everyDayOfWeek', () => {
            c.everyDayOfWeek(4)
            expect(c.out()).toBe('0 0 0 ? * 4 *')
        })
        it('everyDayOfWeekAdd', () => {
            c.everyDayOfWeekAdd(2)
            c.everyDayOfWeekAdd(4)
            expect(c.out()).toBe('0 0 0 ? * 2,4 *')
        })
        it('atDayOfMonth', () => {
            c.atDayOfMonth(21)
            expect(c.out()).toBe('0 0 0 21 * ? *')
        })
        it('atDayOfMonthAdd', () => {
            c.atDayOfMonthAdd(13)
            c.atDayOfMonthAdd(21)
            expect(c.out()).toBe('0 0 0 13,21 * ? *')
        })
        it('onLastDayOfMonth', () => {
            c.onLastDayOfMonth()
            expect(c.out()).toBe('0 0 0 L * ? *')
        })
        it('onLastWeekDayOfMonth', () => {
            c.onLastWeekDayOfMonth()
            expect(c.out()).toBe('0 0 0 LW * ? *')
        })
        it('onLastXWeekDayOfMonth', () => {
            c.onLastXWeekDayOfMonth(2)
            expect(c.out()).toBe('0 0 0 ? * 2L *')
        })
        it('onLastXDayBeforeTheEndOfTheMonth', () => {
            c.onLastXDayBeforeTheEndOfTheMonth(2)
            expect(c.out()).toBe('0 0 0 L-2 * ? *')
        })
        it('onClosestWorkingDayToTheXofTheMonth', () => {
            c.onClosestWorkingDayToTheXofTheMonth(2)
            expect(c.out()).toBe('0 0 0 2W * ? *')
        })
        it('onTheNthWeekDayOfTheMonth', () => {
            c.onTheNthWeekDayOfTheMonth(2, 4)
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
        it('everyXMonths every x from 0', () => {
            c.everyXMonths({ freq: 6 })
            expect(c.out()).toBe('0 0 0 * 0/6 ? *')
        })
        it('everyXMonths every x from y', () => {  
            c.everyXMonths({ freq: 6, start:13 })
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
        it('everyXYears every x from 0', () => {
            c.everyXYears({ freq: 6 })
            expect(c.out()).toBe('0 0 0 * * ? 0/6')
        })
        it('everyXYears every x from y', () => {  
            c.everyXYears({ freq: 6, start:2025 })
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
                .everyXDayStartingFromYDay(5, 2)
            expect(c.out()).toBe('30 0 12 2/5 * ? *')
        })
        it('atSecond atMinute every hour in the 3rd saturday of JAN and FEB on years 2026,2028,2032', () => {
            c.atSecondAdd(1)
                .atSecondAdd(5)
                .atMinute(0)
                .everyHour()
                .onTheNthWeekDayOfTheMonth(3, 7)
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
                ranger60 = Crontabist.getRanger(60)
            
            expect(ranger24(0)).toBe(0)
            expect(ranger24(11)).toBe(11)
            expect(ranger24(12)).toBe(12)
            expect(ranger24(23)).toBe(23)
            expect(ranger24(24)).toBe(0)
            expect(ranger24(26)).toBe(2)
            expect(ranger24(47)).toBe(23)
            expect(ranger24(-1)).toBe(23)

            expect(ranger60(0)).toBe(0)
            expect(ranger60(11)).toBe(11)
            expect(ranger60(12)).toBe(12)
            expect(ranger60(59)).toBe(59)
            expect(ranger60(60)).toBe(0)
            expect(ranger60(62)).toBe(2)
            expect(ranger60(118)).toBe(58)
            expect(ranger60(-1)).toBe(59)
        })
    })
})



