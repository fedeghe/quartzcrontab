
[![Coverage Status](https://coveralls.io/repos/github/fedeghe/quartzcron/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/quartzcron?branch=master) ![NPM License](https://img.shields.io/npm/l/quartzcron?style=plastic&color=blue) [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/XxqmUuW3z2J9FC2yrGaqm6/Gqxo9Gfjfd8ERTJvcgnYw9/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/XxqmUuW3z2J9FC2yrGaqm6/Gqxo9Gfjfd8ERTJvcgnYw9/tree/master)

![GitHub top language](https://img.shields.io/github/languages/top/fedeghe/quartzcron?labelColor=%23fede76) ![Static Badge](https://img.shields.io/badge/Human%20coded-100%25-blue?style=plastic)

![urlotrack](https://click.jmvc.org/p/5I8eDsOJ/1)


# quartzcron  
version: `0.0.40`


[Quartz scheduler][quartz] offers way more flexibility compared to traditional [cron][cron] tool.  
That additional freedom clearly maps into less trivial composition for the cron strings, this library aims to  
 - **help to programmatically create cron expressions**  
 - **validate cron expressions**  
 - **get the _n_ next precise occurrences**  

A `quartz cron expression` is characterized by the following structure: 
```
s  i  h dom m dow y  
⎜  ⎜  ⎜  ⎜  ⎜  ⎜  ⎜  
⎜  ⎜  ⎜  ⎜  ⎜  ⎜  '-> years (optional)
⎜  ⎜  ⎜  ⎜  ⎜  '----> days of week  -\
⎜  ⎜  ⎜  ⎜  '-------> months          | mutually exclusive
⎜  ⎜  ⎜  '----------> days of month -/
⎜  ⎜  '-------------> hours
⎜  '----------------> minutes
'-------------------> seconds
```

## sample usage
``` js
const QuartzCron = require('quartzcron'),
    qct = new QuartzCron(),
    _ = console.log;
let exp = qct.out(); // ->  0 0 0 * * ? *
// thus the default is
// at midnight of everyday
// but default values can be changed when calling the constructor
qct.atHour(12)
    .atHourAdd(22)
    .onLastMonthDay()
    .everyNYears(5, 2025);

exp = qct.out(); //-> 0 0 12,22 L * ? 2025/5
/*
alternatively the cron expression is also returned
as the instance _toString_ invokation
*/

const next = qct.next({
    date: new Date('00:00:00 01-01-2024'),
    n: 3
})
/*
[
  2025-01-31T12:00:00.000Z,
  2025-01-31T22:00:00.000Z,
  2025-02-28T12:00:00.000Z
]
*/
```  
# API  

## constructor 👷🏽‍♂️ 
Constructor can handle: 

- **0 parameters**  
    default used `0 0 0 * * ? *`  
    ``` js
    const qc = new Quartzcron();
    ```
- **1 valid expression string**  
    when invalid throws and exception
    ``` js
    const qc = new Quartzcron('0 0 12,22 L * ? 2025/5');
    ```
- **1 object corresponding to a valid expression** 
    ``` js
    const exp = {
        s:0, i: 0, h: 0,
        dom:'*', m:'*', dow: '?', y: '*'
    }
    const qc = new Quartzcron(exp);
    ```
throws an exception when the resulting expression is not valid.

## get the quartz cron expression 🧊
Invoke `out()` ƒunction on the _quartzcron_ instance to get the related expression
``` js
qct.out(); // -> "0 0 12,22 L * ? 2025/5"
```

## validation API ✅  

Validation can be done on the _quartzcron_ instance just invoking the `validate` ƒunction. Pass the string to be evaluated as parameter.  

When nothing is passed it will validate the expression it would get from `out` (as useful as `expect(true).toBe(true)`).  

``` js
qct.validate('0 0 12,22 L * ? 2025/5')
// -> { valid: true, errors:[]}
```
returning an object shaped like follows:
``` js
{ valid: Boolean, errors:[String]}
```

Alternatively a static method is available: 
``` js 
QuartzCron.validate(yourExp)
// -> { valid: ?, errors:[?]}
``` 


## composition API 🧱  

Almost all 7 fields composing the final _cron expression_ are independent.  
The **only exception** is represented by the "days of month" (4th field) and the "days of week" (6th field) cause they cannot coexsist.  
Within the involved months/years: 
- `dom` sets target days referencing the month
- `dow` sets target days referencing the week  

One of the two must hold something valid different from `?`  
and the other one must just contain `?`.

## week days and month names aliases 

For weeekdays one can use seamlessly:  
``` js
[1,2,3,4,5,6,7]
// OR 
['SUN','MON','TUE','WED',
    'THU', 'FRI', 'SAT']
```  

similarly for months:  
``` js
[1,2,3,4,5,6,7,8,9,10,11,12]
// OR 
['JAN','FEB','MAR','APR',
 'MAY','JUN','JUL','AUG',
 'SEP','OCT','NOV','DEC']`.  
```

### seconds ⏱️   

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



### minutes ⏱️   

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


### hours ⏱️  

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


### day of month / day of week 📆  
- `everyDay()`  
no explanation needed  
    ``` js
    qct.everyDay()
    // { dom: '*', dow:'?', ...}
    ```

- `everyNDays(x, y)`  
every `x` `[1-7][SUN-SAT]` day of the week starting from `y`th day `[1-31]` of the target months. 
    ``` js
    qct.everyNDays('SUN', 10) 
    // { dom: `10/SUN`, dow: '?', ...}
    ```

- `atWeekDay(wd)`  
every `wd` `[1-7][SUN-SAT]`; resets any previous value set there; even here more than one comma separated value can be passed. 
    ``` js
    qtc.atWeekDay('WED')
    // { dom: `?`, dow: 'WED', ...}
    qtc.atWeekDay('WED,FRI')
    // { dom: `?`, dow: 'WED,FRI', ...}
    qtc.atWeekDay('MON-FRI/2')
    // { dom: '?`, dow: 'MON-FRI/2', ...}
    ```

- `atWeekDayAdd(wd)`  
every `wd` in `[1,7]` or (...and corresponding to) `{SUN,MON,TUE,WED,THU,FRI,SAT}`; adds one more weekday in the current (default empty) list.
    ``` js
    qtc.atWeekDayAdd('MON')
    // { dom: `?`, dow: 'MON', ...}
    qtc.atWeekDayAdd('WED')
    // { dom: `?`, dow: 'MON,WED', ...}
    qtc.atWeekDayAdd('FRI')
    // { dom: '?`, dow: 'MON,WED,FRI', ...}
    ```

- `everyWeekDay()`  
    shortcut to set Saturnday and Sunday  
    ``` js
    qtc.everyWeekDay()
    // { dom: `?`, dow: '2-6', ...}
    ```

- `everyWeekEnd()`  
shortcut to set Saturnday and Sunday
    ``` js
    qtc.everyWeekEnd()
    // { dom: `?`, dow: '7-1', ...}
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
allows to add one or more days to the existing target  
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
    qtc.onLastMonthDay()  // { dom: 'L', dow: '?', ...} 
    ```

- `onFirstMonthWeekDay`  
set as target day the first weekday of the month (working day)  
(same as `qtc.onClosestWorkingDayToTheNMonthDay(1)`)  
    ``` js
    qtc.onFirstMonthWeekDay() // { dom: '1W', dow: '?', ...} 
    ```

- `onLastMonthWeekDay`  
set as target day the last weekday of the month (working day)
    ``` js
    qtc.onLastMonthWeekDay() // { dom: 'LW', dow: '?', ...} 
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


### months 📆  

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


### years 📆  

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



## more ➕   

This library was primarily designed to achieve a quite simple task: compose the expression through methods; then validation, occurrences, ..  
The occurrences composition depends 100% on two data:
1) the current expression
2) the fererence date  

thus, calculate the occurrences of an already existing expression (for example given back from and endpoint) one could
override manually one or more elements in the expression `s,i,h,dom,m,dow,y`

 ``` js 
 inst.elements.s = 1
 ```

OR use 

- `updateExp(exp)`  
updates the current instance expression, handles   

    - **an expression string**  
        when invalid throws and exception
    - **an object corresponding to an expression** 
        ``` js
        {
            s:0, i: 0, h: 0,
            dom:'*', m:'*', dow: '?', y: '*'
        }
        ```
    throws an exception when the resulting expression is not valid

## range resolvers 🛸
_Range resolvers_ might be useful, initially only part of an internal utility, now are exposed in a static object.
``` js  
qct.out()// -> 45/2 1,2,3 15-19 L 1/2 ? *
Quartzcron.solvers.solve_0_59_ranges(qtc.elements.s)
// -> [45,47,49,51,53,55,57,59]
Quartzcron.solvers.solve_0_59_ranges(qtc.elements.i)
// -> [1,2,3]
Quartzcron.solvers.solve_hours_ranges(qtc.elements.h)
// -> [15,16,17,18,19]
Quartzcron.solvers.solve_dom(2025, 2, qtc.elements.dom)
// -> [28]
Quartzcron.solvers.solve_month_ranges(qtc.elements.m)
// [1,3,5,7,9,11]
Quartzcron.solvers.solve_dow(2025, 2, qtc.elements.dow)
// -> []
Quartzcron.solvers.solve_year_ranges(qtc.elements.y)
// -> [2025, ..., 2099] // here supposing we are in 2025

```
Clearly enough the two about `dom` and `dow` are function since they strictly depend on the _year_ and the _month_.  
_Solvers_ come quite in hand when from an expression one needs the actual targets.  

*Months* and *week days* will be always resolved numerically, thus `[1,12]` and `[1,7]` respectively.


##  Occurrences 🔭  
From an instance call the `next` ƒunction: 
``` js
const nextOccurrence = qct.next().map(s=>s.toString())
// ["Mon Jan 01 2024 02:00:00 GMT+0100"],
```
this ƒunction accepts three options:  
- `n`: the number of occurrences needed (1 is the default)  
- `date`: a reference date (js Date object) to be used as _present date_ (default is the current date). No dates before the _present date_ will be returned.

<br>
<br>


# 🩼 Limitations and plans  💡  

### ⏱️ Timezones 🗺️   
If the plan to use that utility on a browser the chances the client and server run on different timezones is quite high.  

A workaround would be so set the timezone to UTC on the server and in the UI explicitly inform the user that all dates & times are UTC.

> **For the moment this library relies 100% on [UTC][utc]**

**The plan** is to provide 2 static methods to allow to set the timezones for the client and the server.

``` js
QuartzCron.useClientLocalTimezone() // auto (e.g -2)
// or useClientUTCTimezone()

QuartzCron.setServerTimezone("America/Los_Angeles"); // +6
// or setServerUTCTimezone()
```

### Descriptions 📜
Having a quick way to get a user readable internationalized description out of an expression is quite useful.  
Meanwhile give a try to the awesome [cronstrue][cronstrue] npm package.

---
Last edit: 17/5/2025 at 15:46:37

[quartz]: https://www.quartz-scheduler.org/
[cron]: https://en.wikipedia.org/wiki/Cron
[utc]: https://en.wikipedia.org/wiki/Coordinated_Universal_Time
[cronstrue]: https://www.npmjs.com/package/cronstrue