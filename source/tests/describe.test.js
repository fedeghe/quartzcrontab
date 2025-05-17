
const Quartzcron  = require('../dist/index.js');
const C = require('../dist/constants.js');

const en = require('../dist/langs/en.js');
const ita = require('../dist/langs/it.js');

describe('describe', () => {
    let c
    beforeEach(() => {
        c = new Quartzcron()
    })

    describe('basic describe sector - h:i:s - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'at 13:00:00, every day',
                i => i.atSecond(0)
                    .atMinute(0)  
                    .atHour(13),
                en,
            ],[
                'every second',
                i => i.everySecond()
                    .everyMinute()  
                    .everyHour(),
                en,
            ],
            
            //-------------
            // 1,1
            [
                'at second 05, every minute',
                i => i.atSecond(5)
                    .everyMinute()  
                    .everyHour(),
                en,
            ],
            // 1,2
            [
                'at seconds 01, 05 and 15, every minute',
                i => i.atSecond(1).atSecondAdd(5).atSecondAdd(15)
                    .everyMinute()  
                    .everyHour(),
                en,
            ],
            // 1,3
            [
                'every second between 05 and 10, every minute',
                i => i.betweenSeconds(5, 10)
                    .everyMinute()  
                    .everyHour(),
                en,
            ],
            // 1,4
            [
                'every 3 seconds between 05 and 15, every minute',
                i => i.betweenSeconds(5, 15, 3)
                    .everyMinute()  
                    .everyHour(),
                en,
            ],
            
            // every hour, ? minutes, every second
            // 1,1
            [
                'every second, at minute 04',
                i => i.everySecond()
                    .atMinute(4)  
                    .everyHour(),
                en,
            ],
            // 1,2
            [
                'every second, at minutes 01, 05 and 15',
                i => i.everySecond()
                    .atMinute(1).atMinuteAdd(5).atMinuteAdd(15)
                    .everyHour(),
                en,
            ],
            // 1,3
            [
                'every second, every minute between 05 and 10',
                i => i.everySecond()
                    .betweenMinutes(5, 10)
                    .everyHour(),
                en,
            ],
            // 1,4
            [
                'every second, every 3 minutes between 05 and 15',
                i => i.everySecond()
                    .betweenMinutes(5, 15, 3)
                    .everyHour(),
                en,
            ],

            //===============================================================================================
            // ? second, ? minute, every hour
            // 4 X 4 cases
            [// 1,1
                'at second 05, at minute 05',
                i => i.atSecond(5)
                    .atMinute(5)
                    .everyHour(),
                en,
            ],
            [// 1,2
                'at second 05, at minutes 01, 05 and 15',
                i => i.atSecond(5)
                    .atMinute(1).atMinuteAdd(5).atMinuteAdd(15)
                    .everyHour(),
                en,
            ],
            [// 1,3
                'at second 05, every minute between 05 and 15',
                i => i.atSecond(5)
                    .betweenMinutes(5, 15)
                    .everyHour(),
                en,
            ],
            [// 1,4
                'at second 05, every 3 minutes between 05 and 15',
                i => i.atSecond(5)
                    .betweenMinutes(5, 15, 3)
                    .everyHour(),
                en,
            ],

            [// 2,1
                'every second between 05 and 15, at minute 03',
                i => i.betweenSeconds(5, 15)
                    .atMinute(3)
                    .everyHour(),
                en,
            ],
            [// 2,2
                'every second between 05 and 15, at minutes 02, 03 and 14',
                i => i.betweenSeconds(5, 15)
                    .atMinute(2).atMinuteAdd(3).atMinuteAdd(14)
                    .everyHour(),
                en,
            ],
            [// 2,3
                'every second between 05 and 15, every minute between 03 and 13',
                i => i.betweenSeconds(5, 15)
                    .betweenMinutes(3, 13)
                    .everyHour(),
                en,
            ],
            [// 2,4
                'every second between 05 and 15, every 2 minutes between 03 and 13',
                i => i.betweenSeconds(5, 15)
                    .betweenMinutes(3, 13, 2)
                    .everyHour(),
                en,
            ],
            

            [// 3,1
                'every 3 seconds between 05 and 15, at minute 03',
                i => i.betweenSeconds(5, 15, 3)
                    .atMinute(3)
                    .everyHour(),
                en,
            ],
            [// 3,2
                'every 3 seconds between 05 and 15, at minutes 02, 03 and 14',
                i => i.betweenSeconds(5, 15, 3)
                    .atMinute(2).atMinuteAdd(3).atMinuteAdd(14)
                    .everyHour(),
                en,
            ],
            [// 3,3
                'every 3 seconds between 05 and 15, every minute between 03 and 13',
                i => i.betweenSeconds(5, 15, 3)
                    .betweenMinutes(3, 13)
                    .everyHour(),
                en,
            ],
            [// 3,4
                'every 3 seconds between 05 and 15, every 2 minutes between 03 and 13',
                i => i.betweenSeconds(5, 15, 3)
                    .betweenMinutes(3, 13, 2)
                    .everyHour(),
                en,
            ],
            
            [// 4,1
                'at seconds 03, 04 and 07, at minute 03',
                i => i.atSecond(3).atSecondAdd(4).atSecondAdd(7)
                    .atMinute(3)
                    .everyHour(),
                en,
            ],
            [// 4,2
                'at seconds 03, 04 and 07, at minutes 02, 03 and 14',
                i => i.atSecond(3).atSecondAdd(4).atSecondAdd(7)
                    .atMinute(2).atMinuteAdd(3).atMinuteAdd(14)
                    .everyHour(),
                en,
            ],
            [// 4,3
                'at seconds 03, 04 and 07, every minute between 03 and 13',
                i => i.atSecond(3).atSecondAdd(4).atSecondAdd(7)
                    .betweenMinutes(3, 13)
                    .everyHour(),
                en,
            ],
            [// 4,4
                'at seconds 03, 04 and 07, every 2 minutes between 03 and 13',
                i => i.atSecond(3).atSecondAdd(4).atSecondAdd(7)
                    .betweenMinutes(3, 13, 2)
                    .everyHour(),
                en,
            ],
            

            // every second, every minute, ? hour
            [
                'every second, at hour 13',
                i => i.everySecond()
                    .everyMinute()
                    .atHour(13),
                en,
            ],

            [
                'every second, at hours 03, 07 and 15',
                i => i.everySecond()
                    .everyMinute()
                    .atHour(3).atHourAdd(7).atHourAdd(15),
                en,
            ],
            [
                'every second, every hour between 13 and 17',
                i => i.everySecond()
                    .everyMinute()
                    .betweenHours(13, 17),
                en,
            ],
            [
                'every second, every 3 hours between 13 and 17',
                i => i.everySecond()
                    .everyMinute()
                    .betweenHours(13, 17, 3),
                en,
            ],

            //===============================================================================================
            // ? second, every minute, ? hour
            // 4x4 cases
            // 1,1
            [
                'at second 03, every minute, at hour 13',
                i => i.atSecond(3)
                    .everyMinute()
                    .atHour(13),
                en,
            ],
            // 1,2
            [
                'at second 03, every minute, at hours 02, 03 and 13',
                i => i.atSecond(3)
                    .everyMinute()
                    .atHour(2).atHourAdd(3).atHourAdd(13),
                en,
            ],
            // 1,3
            [
                'at second 03, every minute, every hour between 03 and 13',
                i => i.atSecond(3)
                    .everyMinute()
                    .betweenHours(3, 13),
                en,
            ],
            // 1,4
            [
                'at second 03, every minute, every 2 hours between 03 and 13',
                i => i.atSecond(3)
                    .everyMinute()
                    .betweenHours(3, 13, 2),
                en,
            ],
            
            //---
            // 2,1
            [
                'every second between 03 and 10, every minute, at hour 13',
                i => i.betweenSeconds(3, 10)
                    .everyMinute()
                    .atHour(13),
                en,
            ],
            // 2,2
            [
                'every second between 03 and 10, every minute, at hours 02, 03 and 13',
                i => i.betweenSeconds(3, 10)
                    .everyMinute()
                    .atHour(2).atHourAdd(3).atHourAdd(13),
                en,
            ],
            // 2,3
            [
                'every second between 03 and 10, every minute, every hour between 03 and 13',
                i => i.betweenSeconds(3, 10)
                    .everyMinute()
                    .betweenHours(3, 13),
                en,
            ],
            // 2,4
            [
                'every second between 03 and 10, every minute, every 2 hours between 03 and 13',
                i => i.betweenSeconds(3, 10)
                    .everyMinute()
                    .betweenHours(3, 13, 2),
                en,
            ],
            
            //---
            // 3,1
            [
                'every 2 seconds between 03 and 10, every minute, at hour 13',
                i => i.betweenSeconds(3, 10, 2)
                    .everyMinute()
                    .atHour(13),
                en,
            ],
            // 3,2
            [
                'every 2 seconds between 03 and 10, every minute, at hours 02, 03 and 13',
                i => i.betweenSeconds(3, 10, 2)
                    .everyMinute()
                    .atHour(2).atHourAdd(3).atHourAdd(13),
                en,
            ],
            // 3,3
            [
                'every 2 seconds between 03 and 10, every minute, every hour between 03 and 13',
                i => i.betweenSeconds(3, 10, 2)
                    .everyMinute()
                    .betweenHours(3, 13),
                en,
            ],
            // 3,4
            [
                'every 2 seconds between 03 and 10, every minute, every 2 hours between 03 and 13',
                i => i.betweenSeconds(3, 10, 2)
                    .everyMinute()
                    .betweenHours(3, 13, 2),
                en,
            ],
            
            //---
            // 4,1
            [
                'at seconds 02, 06 and 11, every minute, at hour 13',
                i => i.atSecond(2).atSecondAdd(6).atSecondAdd(11)
                    .everyMinute()
                    .atHour(13),
                en,
            ],
            // 4,2
            [
                'at seconds 02, 06 and 11, every minute, at hours 02, 03 and 13',
                i => i.atSecond(2).atSecondAdd(6).atSecondAdd(11)
                    .everyMinute()
                    .atHour(2).atHourAdd(3).atHourAdd(13),
                en,
            ],
            // 4,3
            [
                'at seconds 02, 06 and 11, every minute, every hour between 03 and 13',
                i => i.atSecond(2).atSecondAdd(6).atSecondAdd(11)
                    .everyMinute()
                    .betweenHours(3, 13),
                en,
            ],
            // 4,4
            [
                'at seconds 02, 06 and 11, every minute, every 2 hours between 03 and 13',
                i => i.atSecond(2).atSecondAdd(6).atSecondAdd(11)
                    .everyMinute()
                    .betweenHours(3, 13, 2),
                en,
            ],
            

            //===============================================================================================
            // every second, ? minute, ?hour
            // 4x4 cases
            // 1,1
            [
                'every second, at minute 03, at hour 13',
                i => i.everySecond()
                    .atMinute(3)
                    .atHour(13),
                en,
            ],
            // 1,2
            [
                'every second, at minute 03, at hours 13, 18 and 21',
                i => i.everySecond()
                    .atMinute(3)
                    .atHour(13).atHourAdd(18).atHourAdd(21),
                en,
            ],
            // 1,3
            [
                'every second, at minute 03, every hour between 13 and 17',
                i => i.everySecond()
                    .atMinute(3)
                    .betweenHours(13,17),
                en,
            ],,
            // 1,4
            [
                'every second, at minute 03, every 3 hours between 13 and 17',
                i => i.everySecond()
                    .atMinute(3)
                    .betweenHours(13,17, 3),
                en,
            ],

            //
            // 2,1
            [
                'every second, every minute between 03 and 56, at hour 13',
                i => i.everySecond()
                    .betweenMinutes(3, 56)
                    .atHour(13),
                en,
            ],
            // 2,2
            [
                'every second, every minute between 03 and 56, at hours 13, 18 and 21',
                i => i.everySecond()
                    .betweenMinutes(3, 56)
                    .atHour(13).atHourAdd(18).atHourAdd(21),
                en,
            ],
            // 2,3
            [
                'every second, every minute between 03 and 56, every hour between 13 and 17',
                i => i.everySecond()
                    .betweenMinutes(3, 56)
                    .betweenHours(13,17),
                en,
            ],
            // 2,4
            [
                'every second, every minute between 03 and 56, every 3 hours between 13 and 17',
                i => i.everySecond()
                    .betweenMinutes(3, 56)
                    .betweenHours(13,17, 3),
                en,
            ],
            

            //
            // 3,1
            [
                'every second, every 4 minutes between 03 and 56, at hour 13',
                i => i.everySecond()
                    .betweenMinutes(3, 56, 4)
                    .atHour(13),
                en,
            ],
            // 3,2
            [
                'every second, every 4 minutes between 03 and 56, at hours 13, 18 and 21',
                i => i.everySecond()
                    .betweenMinutes(3, 56, 4)
                    .atHour(13).atHourAdd(18).atHourAdd(21),
                en,
            ],
            // 3,3
            [
                'every second, every 4 minutes between 03 and 56, every hour between 13 and 17',
                i => i.everySecond()
                    .betweenMinutes(3, 56, 4)
                    .betweenHours(13,17),
                en,
            ],
            // 3,4
            [
                'every second, every 4 minutes between 03 and 56, every 3 hours between 13 and 17',
                i => i.everySecond()
                    .betweenMinutes(3, 56, 4)
                    .betweenHours(13,17, 3),
                en,
            ],
            

            //
            // 4,1
            [
                'every second, at minutes 04, 10 and 34, at hour 13',
                i => i.everySecond()
                    .atMinute(4).atMinuteAdd(10).atMinuteAdd(34)
                    .atHour(13),
                en,
            ],
            // 4,2
            [
                'every second, at minutes 04, 10 and 34, at hours 13, 18 and 21',
                i => i.everySecond()
                    .atMinute(4).atMinuteAdd(10).atMinuteAdd(34)
                    .atHour(13).atHourAdd(18).atHourAdd(21),
                en,
            ],
            // 4,3
            [
                'every second, at minutes 04, 10 and 34, every hour between 13 and 17',
                i => i.everySecond()
                    .atMinute(4).atMinuteAdd(10).atMinuteAdd(34)
                    .betweenHours(13,17),
                en,
            ],
            // 4,4
            [
                'every second, at minutes 04, 10 and 34, every 3 hours between 13 and 17',
                i => i.everySecond()
                    .atMinute(4).atMinuteAdd(10).atMinuteAdd(34)
                    .betweenHours(13,17, 3),
                en,
            ],
            
            
            //===============================================================================================
            // ? second, ? minute, ?hour
            // 4 X 4 X 4 cases
            // 1,1,1
            [
                'at 13:44:34, every day',
                i => i.atSecond(34)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 1,1,2
            [
                'at second 34, at minute 44, at hours 13, 17 and 21, every day',
                i => i.atSecond(34)
                    .atMinute(44)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,1,3
            [
                'at second 34, at minute 44, every hour between 13 and 16, every day',
                i => i.atSecond(34)
                    .atMinute(44)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,1,4
            [
                'at second 34, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.atSecond(34)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            //
            // 1,2,1
            [
                'at second 34, every minute between 34 and 41, at hour 13, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 1,2,2
            [
                'at second 34, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,2,3
            [
                'at second 34, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,2,4
            [
                'at second 34, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 1,3,1
            [
                'at second 34, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 1,3,2
            [
                'at second 34, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,3,3
            [
                'at second 34, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,3,4
            [
                'at second 34, every 3 minutes between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(34)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 1,4,1
            [
                'at second 34, at minutes 03, 41 and 56, at hour 13, every day',
                i => i.atSecond(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13),
                en,
            ],
            // 1,4,2
            [
                'at second 34, at minutes 03, 41 and 56, at hours 13, 17 and 21, every day',
                i => i.atSecond(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,4,3
            [
                'at second 34, at minutes 03, 41 and 56, every hour between 13 and 16, every day',
                i => i.atSecond(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,4,4
            [
                'at second 34, at minutes 03, 41 and 56, every 2 hours between 13 and 16, every day',
                i => i.atSecond(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16, 2),
                en,
            ],
            

            //---------

            // 2,1,1
            [
                'every second between 03 and 13, at minute 44, at hour 13, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 2,1,2
            [
                'every second between 03 and 13, at minute 44, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(44)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 2,1,3
            [
                'every second between 03 and 13, at minute 44, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(44)
                    .betweenHours(13, 16),
                en,
            ],
            // 2,1,4
            [
                'every second between 03 and 13, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 2,2,1
            [
                'every second between 03 and 13, every minute between 34 and 41, at hour 13, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 2,2,2
            [
                'every second between 03 and 13, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 2,2,3
            [
                'every second between 03 and 13, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 2,2,4
            [
                'every second between 03 and 13, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 2,3,1
            [
                'every second between 03 and 13, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 2,3,2
            [
                'every second between 03 and 13, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 2,3,3
            [
                'every second between 03 and 13, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16),
                en,
            ],
            // 2,3,4
            [
                'every second between 03 and 13, every 3 minutes between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 2,4,1
            [
                'every second between 03 and 13, at minutes 03, 41 and 56, at hour 13, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13),
                en,
            ],
            // 2,4,2
            [
                'every second between 03 and 13, at minutes 03, 41 and 56, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 2,4,3
            [
                'every second between 03 and 13, at minutes 03, 41 and 56, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16),
                en,
            ],
            // 2,4,4
            [
                'every second between 03 and 13, at minutes 03, 41 and 56, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16, 2),
                en,
            ],
            

            //---------

            // 3,1,1
            [
                'every 2 seconds between 03 and 13, at minute 44, at hour 13, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 3,1,2
            [
                'every 2 seconds between 03 and 13, at minute 44, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(44)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 3,1,3
            [
                'every 2 seconds between 03 and 13, at minute 44, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(44)
                    .betweenHours(13, 16),
                en,
            ],
            // 3,1,4
            [
                'every 2 seconds between 03 and 13, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 3,2,1
            [
                'every 2 seconds between 03 and 13, every minute between 34 and 41, at hour 13, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 3,2,2
            [
                'every 2 seconds between 03 and 13, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 3,2,3
            [
                'every 2 seconds between 03 and 13, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 3,2,4
            [
                'every 2 seconds between 03 and 13, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 3,3,1
            [
                'every 2 seconds between 03 and 13, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 3,3,2
            [
                'every 2 seconds between 03 and 13, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 3,3,3
            [
                'every 2 seconds between 03 and 13, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16),
                en,
            ],
            // 3,3,4
            [
                'every 2 seconds between 03 and 13, every 3 minutes between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 3,4,1
            [
                'every 2 seconds between 03 and 13, at minutes 03, 41 and 56, at hour 13, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13),
                en,
            ],
            // 3,4,2
            [
                'every 2 seconds between 03 and 13, at minutes 03, 41 and 56, at hours 13, 17 and 21, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 3,4,3
            [
                'every 2 seconds between 03 and 13, at minutes 03, 41 and 56, every hour between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16),
                en,
            ],
            // 3,4,4
            [
                'every 2 seconds between 03 and 13, at minutes 03, 41 and 56, every 2 hours between 13 and 16, every day',
                i => i.betweenSeconds(3, 13, 2)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16, 2),
                en,
            ],
            


            //---------

            // 4,1,1
            [
                'at seconds 03, 07 and 34, at minute 44, at hour 13, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 4,1,2
            [
                'at seconds 03, 07 and 34, at minute 44, at hours 13, 17 and 21, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(44)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,1,3
            [
                'at seconds 03, 07 and 34, at minute 44, every hour between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(44)
                    .betweenHours(13, 16),
                en,
            ],
            // 4,1,4
            [
                'at seconds 03, 07 and 34, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            //
            // 4,2,1
            [
                'at seconds 03, 07 and 34, every minute between 34 and 41, at hour 13, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 4,2,2
            [
                'at seconds 03, 07 and 34, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,2,3
            [
                'at seconds 03, 07 and 34, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 4,2,4
            [
                'at seconds 03, 07 and 34, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 4,3,1
            [
                'at seconds 03, 07 and 34, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 4,3,2
            [
                'at seconds 03, 07 and 34, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,3,3
            [
                'at seconds 03, 07 and 34, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16),
                en,
            ],
            // 4,3,4
            [
                'at seconds 03, 07 and 34, every 3 minutes between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16, 2),
                en,
            ],
            //
            // 4,4,1
            [
                'at seconds 03, 07 and 34, at minutes 03, 41 and 56, at hour 13, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13),
                en,
            ],
            // 4,4,2
            [
                'at seconds 03, 07 and 34, at minutes 03, 41 and 56, at hours 13, 17 and 21, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,4,3
            [
                'at seconds 03, 07 and 34, at minutes 03, 41 and 56, every hour between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16),
                en,
            ],
            // 4,4,4
            [
                'at seconds 03, 07 and 34, at minutes 03, 41 and 56, every 2 hours between 13 and 16, every day',
                i => i.atSecond(3).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16, 2),
                en,
            ],


        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })

    describe('basic describe sector - m:y - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([

            [
                'at 00:00:00, every day, in January 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(1)
                    .atYear(2030),
                en,
            ],
            [
                'at 00:00:00, every day',
                i => i.atSecond(0).atMinute(0).atHour(0)
                .everyMonth()
                .everyYear(),
                en,
                ],
                
                //
                // ? month, every year
                [
                    'at 00:00:00, every day, in April',
                    i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4)
                    .everyYear(),
                    en,
                    ],
                    [
                        'at 00:00:00, every day, in April, June and October',
                        i => i.atSecond(0).atMinute(0).atHour(0)
                        .atMonth(4).atMonthAdd(6).atMonthAdd(10)
                        .everyYear(),
                        en,
                        ],
                        
            [
                'at 00:00:00, every day, every month between April and July',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(4, 7)
                    .everyYear(),
                en,
            ],
            [
                'at 00:00:00, every day, every 2 months between April and July',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(4, 7, 2)
                    .everyYear(),
                en,
            ],

            // ----- 
            // every month, ? year
            [
                'at 00:00:00, every day, in 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyMonth()
                    .atYear(2030),
                en,
            ],
            [
                'at 00:00:00, every day, in 2030, 2032 and 2051',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyMonth()
                    .atYear(2030).atYearAdd(2032).atYearAdd(2051),
                en,
            ],
            [
                'at 00:00:00, every day, every year between 2030 and 2051',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyMonth()
                    .betweenYears(2030, 2051),
                en,
            ],
            [
                'at 00:00:00, every day, every 3 years between 2030 and 2051',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyMonth()
                    .betweenYears(2030, 2051, 3),
                en,
            ],

            // ? month, ? year
            // 4x4 cases
            // 1,1
            [
                'at 00:00:00, every day, in April 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4)
                    .atYear(2030),
                en,
            ],
            // 1,2
            [
                'at 00:00:00, every day, in April, in 2030, 2031 and 2039',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 1,3
            [
                'at 00:00:00, every day, in April, every year between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 1,4
            [
                'at 00:00:00, every day, in April, every 3 years between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 2,1
            [
                'at 00:00:00, every day, in April, June and December, 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .atYear(2030),
                en,
            ],
            // 2,2
            [
                'at 00:00:00, every day, in April, June and December, in 2030, 2031 and 2039',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 2,3
            [
                'at 00:00:00, every day, in April, June and December, every year between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 2,4
            [
                'at 00:00:00, every day, in April, June and December, every 3 years between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 3,1
            [
                'at 00:00:00, every day, every month between February and May, 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .atYear(2030),
                en,
            ],
            // 3,2
            [
                'at 00:00:00, every day, every month between February and May, in 2030, 2031 and 2039',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 3,3
            [
                'at 00:00:00, every day, every month between February and May, every year between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 3,4
            [
                'at 00:00:00, every day, every month between February and May, every 3 years between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 4,1
            [
                'at 00:00:00, every day, every 2 months between February and October, 2030',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .atYear(2030),
                en,
            ],
            // 4,2
            [
                'at 00:00:00, every day, every 2 months between February and October, in 2030, 2031 and 2039',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 4,3
            [
                'at 00:00:00, every day, every 2 months between February and October, every year between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 4,4
            [
                'at 00:00:00, every day, every 2 months between February and October, every 3 years between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .betweenYears(2039, 2045, 3),
                en,
            ],
            
        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })

    describe('basic describe sector - dom - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'at 00:00:00, on the 2nd day, every month',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .atMonthDay(2),
                en,
            ],
            [
                'at 00:00:00, from the 2nd to the 10th, every month',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonthDays(2, 10),
                en,
            ]
        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })

    describe('basic describe sector - dow - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'at 00:00:00, every day, every 2 months between February and October, every 3 years between 2039 and 2045',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .betweenYears(2039, 2045, 3),
                en,
            ]
        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })
    

    it('throws when no lang file loaded', () => {
        c.loadLang(null)
        expect(
            () => c.describe()
        ).toThrow(C.errors.noLangFile)
    })
})
