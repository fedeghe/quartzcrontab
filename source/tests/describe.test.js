
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
                'at second 01, at minute 05',
                i => i.atSecond(1)
                    .atMinute(5)
                    .everyHour(),
                en,
            ],
            [// 1,2
                'at second 02, at minutes 01, 05 and 15',
                i => i.atSecond(2)
                    .atMinute(1).atMinuteAdd(5).atMinuteAdd(15)
                    .everyHour(),
                en,
            ],
            [// 1,3
                'at second 03, every minute between 05 and 15',
                i => i.atSecond(3)
                    .betweenMinutes(5, 15)
                    .everyHour(),
                en,
            ],
            [// 1,4
                'at second 04, every 3 minutes between 05 and 15',
                i => i.atSecond(4)
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
                'at second 01, every minute, at hour 13',
                i => i.atSecond(1)
                    .everyMinute()
                    .atHour(13),
                en,
            ],
            // 1,2
            [
                'at second 02, every minute, at hours 02, 03 and 13',
                i => i.atSecond(2)
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
                'at second 04, every minute, every 2 hours between 03 and 13',
                i => i.atSecond(4)
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
                'at 13:44:01, every day',
                i => i.atSecond(1)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 1,1,2
            [
                'at second 02, at minute 44, at hours 13, 17 and 21, every day',
                i => i.atSecond(2)
                    .atMinute(44)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,1,3
            [
                'at second 03, at minute 44, every hour between 13 and 16, every day',
                i => i.atSecond(3)
                    .atMinute(44)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,1,4
            [
                'at second 04, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.atSecond(4)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            //
            // 1,2,1
            [
                'at second 05, every minute between 34 and 41, at hour 13, every day',
                i => i.atSecond(5)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 1,2,2
            [
                'at second 06, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(6)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,2,3
            [
                'at second 07, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(7)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,2,4
            [
                'at second 08, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(8)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 1,3,1
            [
                'at second 09, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.atSecond(9)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 1,3,2
            [
                'at second 10, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(10)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,3,3
            [
                'at second 11, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(11)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,3,4
            [
                'at second 12, every 3 minutes between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(12)
                    .betweenMinutes(34, 41, 3)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 1,4,1
            [
                'at second 13, at minutes 03, 41 and 56, at hour 13, every day',
                i => i.atSecond(13)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13),
                en,
            ],
            // 1,4,2
            [
                'at second 14, at minutes 03, 41 and 56, at hours 13, 17 and 21, every day',
                i => i.atSecond(14)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 1,4,3
            [
                'at second 15, at minutes 03, 41 and 56, every hour between 13 and 16, every day',
                i => i.atSecond(15)
                    .atMinute(3).atMinuteAdd(41).atMinuteAdd(56)
                    .betweenHours(13, 16),
                en,
            ],
            // 1,4,4
            [
                'at second 16, at minutes 03, 41 and 56, every 2 hours between 13 and 16, every day',
                i => i.atSecond(16)
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
                'at seconds 01, 07 and 34, at minute 44, at hour 13, every day',
                i => i.atSecond(1).atSecondAdd('7').atSecondAdd(34)
                    .atMinute(44)
                    .atHour(13),
                en,
            ],
            // 4,1,2
            [
                'at seconds 02, 07 and 34, at minute 44, at hours 13, 17 and 21, every day',
                i => i.atSecond(2).atSecondAdd(7).atSecondAdd(34)
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
                'at seconds 04, 07 and 34, at minute 44, every 2 hours between 13 and 16, every day',
                i => i.atSecond(4).atSecondAdd(7).atSecondAdd(34)
                    .atMinute(44)
                    .betweenHours(13, 16, 2),
                en,
            ],
            //
            // 4,2,1
            [
                'at seconds 05, 07 and 34, every minute between 34 and 41, at hour 13, every day',
                i => i.atSecond(5).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .atHour(13),
                en,
            ],
            // 4,2,2
            [
                'at seconds 06, 07 and 34, every minute between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(6).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,2,3
            [
                'at seconds 07, 07 and 34, every minute between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(7).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16),
                en,
            ],
            // 4,2,4
            [
                'at seconds 08, 07 and 34, every minute between 34 and 41, every 2 hours between 13 and 16, every day',
                i => i.atSecond(8).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41)
                    .betweenHours(13, 16, 2),
                en,
            ],
            
            //
            // 4,3,1
            [
                'at seconds 09, 07 and 34, every 3 minutes between 34 and 41, at hour 13, every day',
                i => i.atSecond(9).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13),
                en,
            ],
            // 4,3,2
            [
                'at seconds 10, 07 and 34, every 3 minutes between 34 and 41, at hours 13, 17 and 21, every day',
                i => i.atSecond(10).atSecondAdd(7).atSecondAdd(34)
                    .betweenMinutes(34, 41, 3)
                    .atHour(13).atHourAdd(17).atHourAdd(21),
                en,
            ],
            // 4,3,3
            [
                'at seconds 11, 07 and 34, every 3 minutes between 34 and 41, every hour between 13 and 16, every day',
                i => i.atSecond(11).atSecondAdd(7).atSecondAdd(34)
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
                'at 00:00:01, every day',
                i => i.atSecond(1).atMinute(0).atHour(0)
                .everyMonth()
                .everyYear(),
                en,
            ],
                
            //
            // ? month, every year
            [
                'at 00:00:02, every day, in April',
                i => i.atSecond(2).atMinute(0).atHour(0)
                .atMonth(4)
                .everyYear(),
                en,
            ],
            [
                'at 00:00:03, every day, in April, June and October',
                i => i.atSecond(3).atMinute(0).atHour(0)
                .atMonth(4).atMonthAdd(6).atMonthAdd(10)
                .everyYear(),
                en,
            ],
                        
            [
                'at 00:00:04, every day, every month between April and July',
                i => i.atSecond(4).atMinute(0).atHour(0)
                    .betweenMonths(4, 7)
                    .everyYear(),
                en,
            ],
            [
                'at 00:00:05, every day, every 2 months between April and July',
                i => i.atSecond(5).atMinute(0).atHour(0)
                    .betweenMonths(4, 7, 2)
                    .everyYear(),
                en,
            ],

            // ----- 
            // every month, ? year
            [
                'at 00:00:06, every day, in 2030',
                i => i.atSecond(6).atMinute(0).atHour(0)
                    .everyMonth()
                    .atYear(2030),
                en,
            ],
            [
                'at 00:00:07, every day, in 2030, 2032 and 2051',
                i => i.atSecond(7).atMinute(0).atHour(0)
                    .everyMonth()
                    .atYear(2030).atYearAdd(2032).atYearAdd(2051),
                en,
            ],
            [
                'at 00:00:08, every day, every year between 2030 and 2051',
                i => i.atSecond(8).atMinute(0).atHour(0)
                    .everyMonth()
                    .betweenYears(2030, 2051),
                en,
            ],
            [
                'at 00:00:09, every day, every 3 years between 2030 and 2051',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .everyMonth()
                    .betweenYears(2030, 2051, 3),
                en,
            ],

            // ? month, ? year
            // 4x4 cases
            // 1,1
            [
                'at 00:00:10, every day, in April 2030',
                i => i.atSecond(10).atMinute(0).atHour(0)
                    .atMonth(4)
                    .atYear(2030),
                en,
            ],
            // 1,2
            [
                'at 00:00:11, every day, in April, in 2030, 2031 and 2039',
                i => i.atSecond(11).atMinute(0).atHour(0)
                    .atMonth(4)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 1,3
            [
                'at 00:00:12, every day, in April, every year between 2039 and 2045',
                i => i.atSecond(12).atMinute(0).atHour(0)
                    .atMonth(4)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 1,4
            [
                'at 00:00:13, every day, in April, every 3 years between 2039 and 2045',
                i => i.atSecond(13).atMinute(0).atHour(0)
                    .atMonth(4)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 2,1
            [
                'at 00:00:14, every day, in April, June and December, 2030',
                i => i.atSecond(14).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .atYear(2030),
                en,
            ],
            // 2,2
            [
                'at 00:00:15, every day, in April, June and December, in 2030, 2031 and 2039',
                i => i.atSecond(15).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 2,3
            [
                'at 00:00:16, every day, in April, June and December, every year between 2039 and 2045',
                i => i.atSecond(16).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 2,4
            [
                'at 00:00:17, every day, in April, June and December, every 3 years between 2039 and 2045',
                i => i.atSecond(17).atMinute(0).atHour(0)
                    .atMonth(4).atMonthAdd(6).atMonthAdd(12)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 3,1
            [
                'at 00:00:18, every day, every month between February and May, 2030',
                i => i.atSecond(18).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .atYear(2030),
                en,
            ],
            // 3,2
            [
                'at 00:00:19, every day, every month between February and May, in 2030, 2031 and 2039',
                i => i.atSecond(19).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 3,3
            [
                'at 00:00:20, every day, every month between February and May, every year between 2039 and 2045',
                i => i.atSecond(20).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 3,4
            [
                'at 00:00:21, every day, every month between February and May, every 3 years between 2039 and 2045',
                i => i.atSecond(21).atMinute(0).atHour(0)
                    .betweenMonths(2, 5)
                    .betweenYears(2039, 2045, 3),
                en,
            ],

            //---
            // 4,1
            [
                'at 00:00:22, every day, every 2 months between February and October, 2030',
                i => i.atSecond(22).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .atYear(2030),
                en,
            ],
            // 4,2
            [
                'at 00:00:23, every day, every 2 months between February and October, in 2030, 2031 and 2039',
                i => i.atSecond(23).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .atYear(2030).atYearAdd(2031).atYearAdd(2039),
                en,
            ],
            // 4,3
            [
                'at 00:00:24, every day, every 2 months between February and October, every year between 2039 and 2045',
                i => i.atSecond(24).atMinute(0).atHour(0)
                    .betweenMonths(2, 10, 2)
                    .betweenYears(2039, 2045),
                en,
            ],
            // 4,4
            [
                'at 00:00:25, every day, every 2 months between February and October, every 3 years between 2039 and 2045',
                i => i.atSecond(25).atMinute(0).atHour(0)
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
                'at 00:00:01, every 10 days starting from the 3rd day, every month',
                i => i.atSecond(1).atMinute(0).atHour(0)
                    .everyNDays(3, 10),
                en,
            ],
            [
                'at 00:00:02, from the 2nd to the 10th day, every month',
                i => i.atSecond(2).atMinute(0).atHour(0)
                    .betweenMonthDays(2, 10),
                en,
            ],
            [
                'at 00:00:03, every 3 days from the 2nd to the 10th day, every month',
                i => i.atSecond(3).atMinute(0).atHour(0)
                    .betweenMonthDays(2, 10, 3),
                en,
            ],
            [
                'at 01:00:04, on the 2nd, 11th, 13th and 21st day, every month',
                i => i.atSecond(4).atMinute(0).atHour(1)
                    .atMonthDay(2).atMonthDayAdd(11).atMonthDayAdd(13).atMonthDayAdd(21),
                en,
            ],
            
            [
                'at 01:00:04, on the 2nd, 21st and 29th and every 5 days starting from 10th',
                i => i.atSecond(4).atMinute(0).atHour(1)
                    .atMonthDay(2).atMonthDayAdd(10, 5).atMonthDayAdd(21).atMonthDayAdd(29),
                en,
            ],
            
            [
                'at 01:30:05, on the last day of the month',
                i => i.atSecond(5).atMinute(30).atHour(1)
                    .onLastMonthDay(),
                en,
            ],
            [
                'at 01:30:06, on the last weekday of the month',
                i => i.atSecond(6).atMinute(30).atHour(1)
                    .onLastMonthWeekDay(),
                en,
            ],
            [
                'at 02:45:07, on the nearest weekday to the 7th of the month',
                i => i.atSecond(7).atMinute(45).atHour(2)
                    .onClosestWorkingDayToTheNMonthDay(7),
                en,
            ],
            [
                'at 03:15:08, 7 days before the end of the month',
                i => i.atSecond(8).atMinute(15).atHour(3)
                    .onNDayBeforeTheEndOfTheMonth(7),
                en,
            ],
            [
                'at 03:15:09, 1 day before the end of the month',
                i => i.atSecond(9).atMinute(15).atHour(3)
                    .onNDayBeforeTheEndOfTheMonth(1),
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
                'at 00:00:00, every day',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyWeek(),
                en,
            ],
            [
                'at 00:00:00, every weekend',
                i => i.atSecond(0).atMinute(0).atHour(0)
                    .everyWeekEnd(),
                en,
            ],[
                'at 00:00:01, every weekday',
                i => i.atSecond(1).atMinute(0).atHour(0)
                    .everyWeekDay(),
                en,
            ],
            [
                'at 00:00:02, every 3 days of the week starting on Monday',
                i => i.atSecond(2).atMinute(0).atHour(0)
                    .atWeekDay(2, 3),
                en,
            ],
            [
                'at 00:00:02, every 3 days of the week starting on Sunday',
                i => i.atSecond(2).atMinute(0).atHour(0)
                    .atWeekDay('*', 3),
                en,
            ],[
                'at 00:00:03, every day of the week starting on Monday',
                i => i.atSecond(3).atMinute(0).atHour(0)
                    .atWeekDay(2, 1),
                en,
            ],[
                'at 00:00:04, every 5 days of the week starting on Monday',
                i => i.atSecond(4).atMinute(0).atHour(0)
                    .atWeekDay(2, 5),
                en,
            ],[
                'at 00:00:05, every Friday',
                i => i.atSecond(5).atMinute(0).atHour(0)
                    .atWeekDay(6, 4),
                en,
            ],[
                'at 00:00:06, every Thursday',
                i => i.atSecond(6).atMinute(0).atHour(0)
                    .atWeekDay(5, 3),
                en,
            ],[
                'at 00:00:07, on Sunday, Monday, Wednesday and Saturday',
                i => i.atSecond(7).atMinute(0).atHour(0)
                    .atWeekDay(2).atWeekDay(2).atWeekDayAdd(1, 3),
                en,
            ],[
                'at 00:00:08, on Sunday and Monday',
                i => i.atSecond(8).atMinute(0).atHour(0)
                    .atWeekDay(2, 7).atWeekDayAdd(1, 7),
                en,
            ],[
                'at 00:00:09, between Monday and Thursday',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .betweenWeekDays(2, 5),
                en,
            ],[
                'at 00:00:09, every 3 days between Monday and Friday',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .betweenWeekDays(2, 6, 3),
                en,
            ],[
                'at 00:00:09, every day between Monday and Friday',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .betweenWeekDays(2, 6, 1),
                en,
            ],[
                'at 00:00:09, on the last Monday of the month',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .onLastMonthNWeekDay(2),
                en,
            ],[
                'at 00:00:09, on the 2nd Tuesday of the month',
                i => i.atSecond(9).atMinute(0).atHour(0)
                    .onNWeekDayOfTheMonth(2, 3),
                en,
            ]


        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })


    describe('full describe - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'at second 01, at 36, at 35 and every 2 minutes starting from 20, at hour 15, every day',
                i => i.atSecond(1)
                    .atMinute(20, 2)
                    .atMinuteAdd(35)
                    .atMinuteAdd(36)
                    .atHour(15),
                en,
            ]


        ])('%s', (expected, prep, lang ) => {
            qc.loadLang(lang);
            prep(qc);
            // console.log(qc.out())
            expect(qc.describe()).toBe(expected);
        })
    })

    describe('check mixed cadences - en', () => {
        let qc
        beforeEach(() => {
            qc = new Quartzcron()
        })
        test.each([
            [
                'every 3 seconds starting from 10 and every 5 seconds starting from 10, at minute 00, at hour 00, every day',
                i => i.atSecond(10, 3).atSecondAdd(10, 5),
                en,
            ],
            [
                'at second 00, every 3 minutes starting from 10 and every 5 minutes starting from 10, at hour 00, every day',
                i => i.atMinute(10, 3).atMinuteAdd(10, 5),
                en,
            ],
            [
                'at second 00, at minute 00, every 3 hours starting from 10 and every 5 hours starting from 10, every day',
                i => i.atHour(10, 3).atHourAdd(10, 5),
                en,
            ],


            // TODO !!!
            [
                'at 00:00:00, every 3 days starting from 3rd and every 5 days starting from 10th',
                i => i.atMonthDay(3, 3).atMonthDayAdd(10, 5),
                en,
            ],
            [
                'at 00:00:00, every day, every 3 months starting from 3 and every 5 months starting from 2',
                i => i.atMonth(3, 3).atMonthAdd(2, 5),
                en,
            ],
            [
                'at 00:00:00, every day, every 3 years starting from 2010 and every 4 years starting from 2020',
                i => i.atYear(2010, 3).atYearAdd(2020, 4),
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
