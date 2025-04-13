
const Crontabist  = require('../dist/index.js');

describe('Crontabist', () => {
    describe('constructor', () => {
        it('should Initialize as default', () => {
            const c = new Crontabist()
            expect(c.out()).toBe('0 0 0 * * * *')
        })
        it('should Initialize with month', () => {
            const c = new Crontabist({ m: 3 })
            expect(c.out()).toBe('0 0 0 * 3 * *')
        })
        it('should Initialize with month-year', () => {
            const c = new Crontabist({ m: 3, y: 2023 })
            expect(c.out()).toBe('0 0 0 * 3 * 2023')
        })
        it('should Initialize with month-daysOfMonth', () => {
            const c = new Crontabist({ m: 3, dom: '9,12,17' })
            expect(c.out()).toBe('0 0 0 9,12,17 3 * *')
        })
        it('should Initialize with every second', () => {
            const c = new Crontabist({ s:'*', i: '*', h:'*' })
            expect(c.out()).toBe('* * * * * * *')
        })
    })
    describe('seconds', () => {
        it('everySecond', () => {
            const c = new Crontabist()
            c.everySecond()
            expect(c.out()).toBe('* 0 0 * * * *')
        })
        it('everyXSeconds every x from 0', () => {
            const c = new Crontabist()
            c.everyXSeconds({ freq: 6 })
            expect(c.out()).toBe('0/6 0 0 * * * *')
        })

        it('everyXSeconds every x from y', () => {
            const c = new Crontabist()
            c.everyXSeconds({ freq: 6, start:13 })
            expect(c.out()).toBe('13/6 0 0 * * * *')
        })

        it('atSecond', () => {
            const c = new Crontabist()
            c.atSecond(13)
            expect(c.out()).toBe('13 0 0 * * * *')
        })
        it('atSecond straight more', () => {
            const c = new Crontabist()
            c.atSecond('13,15,19')
            expect(c.out()).toBe('13,15,19 0 0 * * * *')
        })
        it('atSecondAdd', () => {
            const c = new Crontabist()
            c.atSecondAdd(13)
            c.atSecondAdd(19)
            expect(c.out()).toBe('0,13,19 0 0 * * * *')
        })
        it('betweenSeconds', () => {
            const c = new Crontabist()
            c.betweenSeconds(13,19)
            expect(c.out()).toBe('13-19 0 0 * * * *')
        })
        it('betweenSeconds every X seconds', () => {
            const c = new Crontabist()
            c.betweenSeconds(3,39, 2)
            expect(c.out()).toBe('3-39/2 0 0 * * * *')
        })
    })
    describe('minutes', () => {
        it('everyMinute', () => {
            const c = new Crontabist()
            c.everyMinute()
            expect(c.out()).toBe('0 * 0 * * * *')
        })
        it('everyXMinutes every x from 0', () => {
            const c = new Crontabist()
            c.everyXMinutes({ freq: 6 })
            expect(c.out()).toBe('0 0/6 0 * * * *')
        })

        it('everyXMinutes every x from y', () => {
            const c = new Crontabist()
            c.everyXMinutes({ freq: 6, start:13 })
            expect(c.out()).toBe('0 13/6 0 * * * *')
        })

        it('atMinute', () => {
            const c = new Crontabist()
            c.atMinute(13)
            expect(c.out()).toBe('0 13 0 * * * *')
        })
        it('atMinute straight more', () => {
            const c = new Crontabist()
            c.atMinute('13,15,19')
            expect(c.out()).toBe('0 13,15,19 0 * * * *')
        })
        it('atMinuteAdd', () => {
            const c = new Crontabist()
            c.atMinuteAdd(13)
            c.atMinuteAdd(19)
            expect(c.out()).toBe('0 0,13,19 0 * * * *')
        })
        it('betweenMinutes', () => {
            const c = new Crontabist()
            c.betweenMinutes(13,19)
            expect(c.out()).toBe('0 13-19 0 * * * *')
        })
        it('betweenMinutes every X minutes', () => {
            const c = new Crontabist()
            c.betweenMinutes(13,49, 7)
            expect(c.out()).toBe('0 13-49/7 0 * * * *')
        })
    })
    describe('hours', () => {
        it('everyHour', () => {
            const c = new Crontabist()
            c.everyHour()
            expect(c.out()).toBe('0 0 * * * * *')
        })
        it('everyXHours every x from 0', () => {
            const c = new Crontabist()
            c.everyXHours({ freq: 6 })
            expect(c.out()).toBe('0 0 0/6 * * * *')
        })

        it('everyXHours every x from y', () => {
            const c = new Crontabist()
            c.everyXHours({ freq: 6, start:13 })
            expect(c.out()).toBe('0 0 13/6 * * * *')
        })

        it('atHour', () => {
            const c = new Crontabist()
            c.atHour(13)
            expect(c.out()).toBe('0 0 13 * * * *')
        })
        it('atHour straight more', () => {
            const c = new Crontabist()
            c.atHour('13,15,19')
            expect(c.out()).toBe('0 0 13,15,19 * * * *')
        })
        it('atHourAdd', () => {
            const c = new Crontabist()
            c.atHourAdd(13)
            c.atHourAdd(19)
            expect(c.out()).toBe('0 0 0,13,19 * * * *')
        })
        it('betweenHours', () => {
            const c = new Crontabist()
            c.betweenHours(13,19)
            expect(c.out()).toBe('0 0 13-19 * * * *')
        })
        it('betweenHours every X hours', () => {
            const c = new Crontabist()
            c.betweenHours(2,19, 3)
            expect(c.out()).toBe('0 0 2-19/3 * * * *')
        })
    })
    describe('day of month/week', () => {
        it('everyDay', () => {
            const c = new Crontabist()
            c.everyDay()
            expect(c.out()).toBe('0 0 0 * * * *')
        })
        it('everyDay', () => {
            const c = new Crontabist()
            c.everyXDayStartingFromYDay(3, 15)
            expect(c.out()).toBe('0 0 0 15/3 * ? *')
        })
        it('everyDayOfWeek', () => {
            const c = new Crontabist()
            c.everyDayOfWeek(4)
            expect(c.out()).toBe('0 0 0 ? * 4 *')
        })
        it('everyDayOfWeekAdd', () => {
            const c = new Crontabist()
            c.everyDayOfWeekAdd(2)
            c.everyDayOfWeekAdd(4)
            expect(c.out()).toBe('0 0 0 ? * 2,4 *')
        })
        it('atDayOfMonth', () => {
            const c = new Crontabist()
            c.atDayOfMonth(21)
            expect(c.out()).toBe('0 0 0 21 * ? *')
        })
        it('atDayOfMonthAdd', () => {
            const c = new Crontabist()
            c.atDayOfMonthAdd(13)
            c.atDayOfMonthAdd(21)
            expect(c.out()).toBe('0 0 0 13,21 * ? *')
        })
        it('onLastDayOfMonth', () => {
            const c = new Crontabist()
            c.onLastDayOfMonth()
            expect(c.out()).toBe('0 0 0 L * ? *')
        })
        it('onLastWeekDayOfMonth', () => {
            const c = new Crontabist()
            c.onLastWeekDayOfMonth()
            expect(c.out()).toBe('0 0 0 LW * ? *')
        })
        it('onLastXWeekDayOfMonth', () => {
            const c = new Crontabist()
            c.onLastXWeekDayOfMonth(2)
            expect(c.out()).toBe('0 0 0 ? * 2L *')
        })
        it('onLastXDayBeforeTheEndOfTheMonth', () => {
            const c = new Crontabist()
            c.onLastXDayBeforeTheEndOfTheMonth(2)
            expect(c.out()).toBe('0 0 0 L-2 * ? *')
        })
        it('onClosestWorkingDayToTheXofTheMonth', () => {
            const c = new Crontabist()
            c.onClosestWorkingDayToTheXofTheMonth(2)
            expect(c.out()).toBe('0 0 0 2W * ? *')
        })

        it('onTheNthWeekDayOfTheMonth', () => {
            const c = new Crontabist()
            c.onTheNthWeekDayOfTheMonth(2, 4)
            expect(c.out()).toBe('0 0 0 ? * 4#2 *')
        })
    })
    describe('months', () => {
        it('everyMonth', () => {
            const c = new Crontabist()
            c.everyMonth()
            expect(c.out()).toBe('0 0 0 * * * *')
        })
        it('everyXMonths every x from 0', () => {
            const c = new Crontabist()
            c.everyXMonths({ freq: 6 })
            expect(c.out()).toBe('0 0 0 * 0/6 * *')
        })

        it('everyXMonths every x from y', () => {
            const c = new Crontabist()
            c.everyXMonths({ freq: 6, start:13 })
            expect(c.out()).toBe('0 0 0 * 13/6 * *')
        })

        it('atMonth', () => {
            const c = new Crontabist()
            c.atMonth(13)
            expect(c.out()).toBe('0 0 0 * 13 * *')
        })
        it('atMonth straight more', () => {
            const c = new Crontabist()
            c.atMonth('13,15,19')
            expect(c.out()).toBe('0 0 0 * 13,15,19 * *')
        })
        it('atMonthAdd', () => {
            const c = new Crontabist()
            c.atMonthAdd(13)
            c.atMonthAdd(19)
            expect(c.out()).toBe('0 0 0 * 13,19 * *')
        })
        it('betweenMonths', () => {
            const c = new Crontabist()
            c.betweenMonths(13,19)
            expect(c.out()).toBe('0 0 0 * 13-19 * *')
        })
        it('betweenMonths every X months', () => {
            const c = new Crontabist()
            c.betweenMonths(2,10, 3)
            expect(c.out()).toBe('0 0 0 * 2-10/3 * *')
        })
    })
    describe('years', () => {
        it('everyYear', () => {
            const c = new Crontabist()
            c.everyYear()
            expect(c.out()).toBe('0 0 0 * * * *')
        })
        it('everyXYears every x from 0', () => {
            const c = new Crontabist()
            c.everyXYears({ freq: 6 })
            expect(c.out()).toBe('0 0 0 * * * 0/6')
        })

        it('everyXYears every x from y', () => {
            const c = new Crontabist()
            c.everyXYears({ freq: 6, start:2025 })
            expect(c.out()).toBe('0 0 0 * * * 2025/6')
        })

        it('atYear', () => {
            const c = new Crontabist()
            c.atYear(2176)
            expect(c.out()).toBe('0 0 0 * * * 2176')
        })
        it('atYear straight more', () => {
            const c = new Crontabist()
            c.atYear('2063,2034')
            expect(c.out()).toBe('0 0 0 * * * 2063,2034')
        })
        it('atYearAdd', () => {
            const c = new Crontabist()
            c.atYearAdd(1976)
            c.atYearAdd(2034)
            expect(c.out()).toBe('0 0 0 * * * 1976,2034')
        })
        it('betweenYears', () => {
            const c = new Crontabist()
            c.betweenYears(2013,2039)
            expect(c.out()).toBe('0 0 0 * * * 2013-2039')
        })
        it('betweenYears every X years', () => {
            const c = new Crontabist()
            c.betweenYears(2013, 2039, 2)
            expect(c.out()).toBe('0 0 0 * * * 2013-2039/2')
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



