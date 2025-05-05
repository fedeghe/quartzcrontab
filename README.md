

[![Coverage Status](https://coveralls.io/repos/github/fedeghe/quartzcron/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/quartzcron?branch=master)


# quartzcron (v. 0.0.23)


[Quartz scheduler][quartz] offers way more flexibility compared to traditional [cron][cron] tool.  
That additional freedom clearly maps into less trivial composition for the cron strings, this library aims to  
 - **help to programmatically create cron expressions**  
 - **validate cron expressions**  
 - **get the _n_ next precise occurrences**  

A `quartz cron expression` has the following structure: 
```
s  i  h dom m dow y
⎜  ⎜  ⎜  ⎜  ⎜  ⎜  ∖- years
⎜  ⎜  ⎜  ⎜  ⎜  ∖---- days of week  -\
⎜  ⎜  ⎜  ⎜  ∖------- months          | mutually exclusive
⎜  ⎜  ⎜  ∖---------- days of month -/
⎜  ⎜  ∖------------- hours
⎜  ∖---------------- minutes
∖------------------- seconds
```

## example
``` js
const QuartzCron = require('quartzcron');

const qct = new QuartzCron()
console.log(qct.out()) // 0 0 0 * * ? *
// thus the default is
// at midnight of everyday
// but default values can be changed when calling the constructor
qct.atHour(12)
    .atHourAdd(22)
    .onLastMonthDay()
    .everyNYears(5, 2025)

qct.out() /* 0 0 12,22 L * ? 2025/5 */
/*
alternatively the cron expression is also returned
as the _toString_ result og the class instance
and that can be done in quite some ways
*/
console.log(qct.toString()) 
console.log(''+qct) 
console.log(String(qct)) 
console.log(`${qct}`) 

const next = qct.next({date: new Date('00:00:00 01-01-2024'), n: 3})
/*
[
  2025-01-31T12:00:00.000Z,
  2025-01-31T22:00:00.000Z,
  2025-02-28T12:00:00.000Z
]
*/


```
## validation API

`QuartzCron.validate(exp)`  
when invoked it will return an object shaped like follows:
`{ valid: boolean, errors: ['error description',...]}`


## composition API

Almost all _seven_ fields composing the final _cron expression_ are independent. The only exception is represented by the "days of month" (4th field) and the "days of week" (6th field) cause they cannot coexsist. Basically whenever one of the two is set the other one is forced to contain just `?`.

Another small thing:  
for weeekdays we can use seamlessly  
`[1,2,3,4,5,6,7]`  or
`['SUN','MON','TUE','WED','THU', 'FRI', 'SAT']`  

similarly for months:  
`[1,2,3,4,5,6,7,8,9,10,11,12]` or 
`['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']`.  


### seconds

- `everySecond()`  
no explanation needed; still one should consider that this command will only update the `s` to `*`.  
Which minute/s will actually be part of the target depends on how the instance was constructed.  
If no other command is executed the target will be from 0-th to 59-th second of the first minutes of the first hour of the following day and this is cause the default values are `0 0 0 * * ? *`.  
This clearly applies similarly also for almost all other commands.

- `everyNSeconds(x, start = 0)`  
every `x` seconds (starting from `start`)  

- `atSecond(sec)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 59]`

- `atSecondAdd(sec)`  
adds `sec` to the list of already set seconds (`0` there by default); as in the previous can pass multiple values comma separated.

- `betweenSeconds(from, to, every)`  
all seconds from `from` to `to` seconds; optionally set the cadence passing an `every` integer.  

---

### minutes

- `everyMinute()`  
no explanation needed

- `everyNMinutes(x, start = 0)`  
every `x` minutes (starting from `start`)

- `atMinute(min)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 59]`

- `atMinuteAdd(min)`  
adds `min` to the list of already set minutes (`0` there by default); as in the previous can pass multiple values comma separated.

- `betweenMinutes(from, to, every)`  
all minutes from `from` to `to` minutes; optionally set the cadence passing an `every` integer.  

---

### hours  
- `everyHour()`  
no explanation needed

- `everyNHours(x, start = 0)`  
every `x` hours (starting from `start`)

- `atHour(h)`  
no explanation needed;  
resets any previous value set there;  
can be called passing multiple comma separated values within `[0, 23]`

- `atHourAdd(h)`  
adds `h` to the list of already set hours (0 there by default); as in the previous can pass multiple values comma separated.

- `betweenHours(from, to, every)`  
all hours from `from` to `to` hours; optionally set the cadence passing an `every` integer.  

---

### day of month / day of week  
- `everyDay()`  
no explanation needed  
    ``` js
    qct.everyDay()
    // { dom: '*', dow:'?', ...}
    ```

- `everyWeekDayStartingFromNMonthDay(x, y)`  
every `x` `[1-7][SUN-SAT]` day of the week starting from `y`th day `[1-31]` of the target months. 
    ``` js
    qct.everyWeekDayStartingFromNMonthDay('SUN', 10) 
    // { dom: `10/SUN`, dow: '?', ...}
    ```

- `everyWeekDay(wd)`  
every `wd` `[1-7][SUN-SAT]`; resets any previous value set there; even here more than one comma separated value can be passed. 
    ``` js
    qtc.everyWeekDay('WED')
    // { dom: `?`, dow: 'WED', ...}
    qtc.everyWeekDay('WED,FRI')
    // { dom: `?`, dow: 'WED,FRI', ...}
    qtc.everyWeekDay('MON-FRI/2')
    // { dom: '?`, dow: 'MON-FRI/2', ...}
    ```

- `everyWeekDayAdd(wd)`  
every `wd` in `[1,7]` or (...and corresponding to) `{SUN,MON,TUE,WED,THU,FRI,SAT}`; adds one more weekday in the current (default empty) list.
    ``` js
    qtc.everyWeekDayAdd('MON')
    // { dom: `?`, dow: 'MON', ...}
    qtc.everyWeekDayAdd('WED')
    // { dom: `?`, dow: 'MON,WED', ...}
    qtc.everyWeekDayAdd('FRI')
    // { dom: '?`, dow: 'MON,WED,FRI', ...}
    ```

- `everyWeekEnd()`  
shortcut to set Saturnday and Sunday
    ``` js
    qtc.everyWeekEnd('MON')
    // { dom: `?`, dow: 'SUN-SAT', ...}
    ```

- `atMonthDay(dom)`  
sets the target day of month, can be: 
    - `*`: all days
    - `n`: with n in `[1,31]`
    - `n,m,...`: comma separated values all in `[1,31]`
    - `n-m`: from `n` to `m` (in `[1,31]`)
    - `n-m/c`: from `n` to `m` (in `[1,31]`) with `c` cadence
for the last two examples there's also an on purpose method named `betweenMonthDays`
    ``` js
    qtc.atMonthDay('*') //same as qtc.everyDay()
    // { dom: '*', dow: '?', ...} 
    qtc.atMonthDay(10)
    // { dom: '10', dow: '?', ...} 
    qtc.atMonthDay('10,20')
    // { dom: '10,20', dow: '?', ...} 
    qtc.atMonthDay('10-20')
    // { dom: '10-20', dow: '?', ...} 
    qtc.atMonthDay('10-20/2')
    // { dom: '10-20/2', dow: '?', ...} 
    ```

- `atMonthDayAdd(dom)`  
this one allows to add one or more days to the existing target  
    ``` js
    qtc.atMonthDayAdd('10')
    // { dom: '10', dow: '?', ...} 
    qtc.atMonthDayAdd('13')
    // { dom: '10,13', dow: '?', ...} 
    qtc.atMonthDayAdd('23')
    // { dom: '10,13,23', dow: '?', ...} 
    ```
- `betweenMonthDays(from, to, every)`  
set target days from `from` to `to` with, if passed > 1, a cadence bigger than 1
    ``` js
    qtc.betweenMonthDays(10, 20) 
    // { dom: '10-20', dow: '?', ...} 
    qtc.betweenMonthDays(10, 20, 2) 
    // { dom: '10-20/2', dow: '?', ...} 
    ```

- `onLastMonthDay`  
set the target day to the last day of the target months
    ``` js
    qtc.onLastMonthDay() 
    // { dom: 'L', dow: '?', ...} 
    ```

- `onLastMonthWeekDay`  
set as target day the last weekday of the month (working day)
    ``` js
    qtc.onLastMonthWeekDay() 
    // { dom: 'LW', dow: '?', ...} 
    ```

- `onLastMonthNWeekDay(x)`  
set as target day the last selected week day of the month
    ``` js
    qtc.onLastMonthNWeekDay(2)
    // last monday of the month 
    // { dom: '?', dow: '2L', ...} 
    ```

- `onNDayBeforeTheEndOfTheMonth(n)`  
set as target the X-th day before the end of the month
    ``` js
    qtc.onNDayBeforeTheEndOfTheMonth(9)
    // nine days before the end of the month 
    // { dom: 'L-9', dow: '?', ...} 
    ```

- `onClosestWorkingDayToTheNMonthDay(x)`  
set as target the nearest weekday (working day) to the x-th day of the month
    ``` js
    qtc.onClosestWorkingDayToTheNMonthDay(15)
    // the closest woring day (mon->fri) to the 15th 
    // { dom: '15W', dow: '?', ...} 
    ```

- `onNWeekDayOfTheMonth(n, wd)`  
set as target the n-th week day of the month
    ``` js
    qtc.onNWeekDayOfTheMonth(4, 2)
    // the 4th tuesday 
    // { dom: '?', dow: '2#4', ...} 
    ```
---

### months  
- `everyMonth()`  
no explanation needed

- `everyNMonths(freq, start)`  
every `freq` months (starting from `start`)

- `atMonth(m)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[1, 12]` or [JAN -> DEC]

- `atMonthAdd(m)`  
adds `m` to the list of already set months; as in the previous can pass multiple values comma separated.

- `betweenMonths(from, to, every)`  
all months from `from` month to `to` month; optionally set the cadence passing an `every` integer. 

---

### years  
- `everyYear()`  
no explanation needed

- `everyNYears(freq, start)`  
every `x` years (starting from `start`)

- `atYear(y)`  
resets any previous value set there;  
can be called passing multiple comma separated values within `[1970, 2099]`

- `atYearAdd(y)`  
adds `min` to the list of already set minutes; as in the previous can pass multiple values comma separated, within `[1970, 2099]`

- `betweenYears(from, to, every)`  
all years from `from` year to `to` year; optionally set the cadence passing an `every` integer.  

---


## Occurrences
From an instance call the `next` function: 
``` js
const nextOccurrence = qct.next()
// "Mon Jan 01 2024 02:00:00 GMT+0100 (Central European Standard Time)",
```
this function accepts two options:  
- `n`: the number of occurrences needed (1 is the default)  
- `date`: a reference date (js Date) to be used as _present date_ (default is the current date). No dates before the _present date_ will be returned.
- `exp`: in case from an instance one wants to validate a different expression


# Limitations and plans

### Timezones
In case one plans to use that utility on a browser the chances the client and server run on different timezones is quite high.  

One workaround would be so set the timezone to UTC on the server and in the UI explicitly inform the user that all dates & times are UTC.

> **For the moment this library relies 100% on [UTC][utc]**

**The plan** is to provide 2 static methods to allow to set the timezones for the client and the server.

``` js
QuartzCron.useClientLocalTimezone() // auto (e.g -2)
// or useClientUTCTimezone()

QuartzCron.setServerTimezone("America/Los_Angeles"); // +6
// or setServerUTCTimezone()
```

### Descriptions
Having a quick way to get a readable internationalized string out of an expression would be quite useful.  
Another option is to try out [this npm package](https://www.npmjs.com/package/cronstrue).

[quartz]: https://www.quartz-scheduler.org/
[cron]: https://en.wikipedia.org/wiki/Cron
[utc]: https://en.wikipedia.org/wiki/Coordinated_Universal_Time