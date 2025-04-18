

[![Coverage Status](https://coveralls.io/repos/github/fedeghe/quartzcrontab/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/quartzcrontab?branch=master)


# quartzcrontab (v. maltaV('PACKAGE.version'))
<pre style="font-size:2em">s i h dom m dow y</pre>
[Quartz scheduler][quartz] offers way more flexibility compared to traditional [cron][cron] tool.  
That additional freedom clearly maps into less trivial composition for the cron strings, this library **aims to help to programmatically create those cron expressions**.


Compared to [cron][cron], [Quartz scheduler][quartz] offers in addition the ability to target:
 - last day of the month
 - n-th last day of the month
 - working day closest to the n-th week of the month
 - a week day of the n-th week  
 ...and more

## example
``` js
const QuartzCrontab = require('quartzcrontab');

const qct = new QuartzCrontab()
console.log(qct.out()) // 0 0 0 * ? * *
// thus the default is
// at midnight of everyday
// but default values can be changed when calling the constructor
qct.atHour(12)
    .atHourAdd(22)
    .onLastMonthDay()
    .everyXYears(5)

console.log(qct.out()) 
/* 0 0 12,22 LW * ? 2025/5

At second :00, at minute :00, at 12pm and 22pm, on the last weekday of the month, every month, every 5 years starting in 2025
*/

/*
alternatively the cron expression is also returned
as the _toString_ result og the class instance
and that can be done in quite some ways
*/
console.log(qct.toString()) 
console.log(''+qct) 
console.log(String(qct)) 
console.log(`${qct}`) 
```


## API

### seconds

- `everySecond()`  
no explanation needed

- `everyXSeconds(x, start = 0)`  
every `x` seconds (starting from `start`)

- `atSecond(sec)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 59]`

- `atSecondAdd(sec)`  
adds `sec` to the list of already set seconds (`0` there by default); as in the previous can pass multiple values comma separated.

- `betweenSeconds(from, to, every)`  
all seconds from `from` to `to` seconds; optionally set the cadence passing an `every` integer.  

### minutes

- `everyMinute()`  
no explanation needed

- `everyXMinutes(x, start = 0)`  
every `x` minutes (starting from `start`)

- `atMinute(min)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 59]`

- `atMinuteAdd(min)`  
adds `min` to the list of already set minutes (`0` there by default); as in the previous can pass multiple values comma separated.

- `betweenMinutes(from, to, every)`  
all minutes from `from` to `to` minutes; optionally set the cadence passing an `every` integer.  

### hours  
- `everyHour()`  
no explanation needed

- `everyXHours(x, start = 0)`  
every `x` hours (starting from `start`)

- `atHour(h)`  
no explanation needed;  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 23]`

- `atHourAdd(h)`  
adds `h` to the list of already set hours (0 there by default); as in the previous can pass multiple values comma separated.

- `betweenHours(from, to, every)`  
all hours from `from` to `to` hours; optionally set the cadence passing an `every` integer.  

### day of month / day of week  
- `everyDay()`  
no explanation needed

- `everyWeekDayStartingFromYMonthDay(x, y)`  
every `x` `[1-7][SUN-SAT]` day of the week starting from `y`th day `[1-31]` of the target months. 

- `everyWeekDay(wd)`  
every `wd` `[1-7][SUN-SAT]`; resets any previous value set there; even here more than one comma separated value can be passed. 

- `everyWeekDayAdd(wd)`  
every `wd` in `[1,7]` or (...and corresponding to) `{SUN,MON,TUE,WED,THU,FRI,SAT}`; adds one more weekday in the current (default empty) list.

- `atMonthDay(dom)`  
sets the target day of month, can be: 
    - `*`: all days
    - `n`: with n in `[1,31]`
    - `n,m,...`: comma separated values all in `[1,31]`
    - `n-m`: from `n` to `m` (in `[1,31]`)
    - `n-m/c`: from `n` to `m` (in `[1,31]`) with `c` cadence
for the last two examples there's also an on purpose method named `betweenMonthDays`

- `atMonthDayAdd(dom)`  
this one allows to add one or more days to the existing target  

- `betweenMonthDays(from, to, every)`  
set target days from `from` to `to` with, if passed > 1, a cadence bigger than 1

- `onLastMonthDay`  
set the target day to the last day of the target months

- `onLastMonthWeekDay`  
set as target day the last weekday of the month (working day)

- `onLastXMonthWeekDay(x)`  
set as target day the last selected week day of the month

- `onXDayBeforeTheEndOfTheMonth(n)`  
set as target the X-th day before the end of the month

- `onClosestWorkingDayToTheXMonthDay(x)`  
set as target the nearest weekday (working day) to the x-th day of the month

- `onNWeekDayOfTheMonth(n, wd)`  
set as target the n-th week day of the month

### months  
- `everyMonth()`  
no explanation needed

- `everyXMonths(freq, start)`  
every `freq` months (starting from `start`)

- `atMonth(m)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[1, 12]` or [JAN -> DEC]

- `atMonthAdd(m)`  
adds `m` to the list of already set months; as in the previous can pass multiple values comma separated.

- `betweenMonths(from, to, every)`  
all months from `from` month to `to` month; optionally set the cadence passing an `every` integer. 

### years  
- `everyYear()`  
no explanation needed

- `everyXYears(freq, start)`  
every `x` years (starting from `start`)

- `atYear(y)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[1970, 2099]`

- `atYearAdd(y)`  
adds `min` to the list of already set minutes; as in the previous can pass multiple values comma separated, within `[1970, 2099]`

- `betweenYears(from, to, every)`  
all years from `from` year to `to` year; optionally set the cadence passing an `every` integer.  




[quartz]: https://www.quartz-scheduler.org/
[cron]: https://en.wikipedia.org/wiki/Cron