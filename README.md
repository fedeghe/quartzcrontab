


# crontabbed (quartz)
<pre style="font-size:2em">s i h dom m dow y</pre>
[Quartz scheduler][quartz] offers way more flexibility compared to traditional [cron][cron] tool.  
That additional freedom clearly maps into less trivial composition for the cron strings, this library aims to help to programmatically create those cron expressions.


Quarts

## example
``` js
const Crontabbed = require('crontabbed');

const ct = new Crontabbed()
console.log(ct.out()) // 0 0 0 * ? * *
// thus the default is
// at midnight of everyday
// but default values can be changed when calling the constructor
ct.atHour(12)
    .atHourAdd(22)
    .onLastWeekDayOfMonth()
    .everyXYears(5)
// 0 0 12,22 LW * ? 2025/5
/*
At second :00, at minute :00, at 12pm and 22pm, on the last weekday of the month, every month, every 5 years starting in 2025
*/
```


## API

### seconds

- `everySecond()`  
no explanation needed

- `everyXSeconds(x, start = 0)`  
every `x` seconds (starting from `start`)

- `atSecond(sec)`  
no explanation needed;  
resets any previous value set there;  
can be called passing multiple comma separated values within [0, 59]

- `atSecondAdd(sec)`  
adds `sec` to the list of already set seconds (0 there by default); as in the previous can pass multiple values comma separated.

- `betweenSeconds(from, to, every)`  
all seconds from `from` to `to` seconds; optionally set the cadence passing an `every` integer.  

### minutes

- `everyMinute()`  
no explanation needed

- `everyXMinutes(x, start = 0)`  
every `x` minutes (starting from `start`)

- `atMinute(min)`  
no explanation needed;  
resets any previous value set there;  
can be called passing multiple comma separated values within [0, 59]

- `atMinuteAdd(min)`  
adds `min` to the list of already set minutes (0 there by default); as in the previous can pass multiple values comma separated.

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
can be called passing multiple comma separated values within [0, 23]

- `atHourAdd(h)`  
adds `h` to the list of already set hours (0 there by default); as in the previous can pass multiple values comma separated.

- `betweenHours(from, to, every)`  
all hours from `from` to `to` hours; optionally set the cadence passing an `every` integer.  

### day of month / day of week
- `everyDay()`  
no explanation needed

- `everyWeekDayStartingFromYDay(x, y)`  
every `x` [1-7][SUN,SAT] day of the week starting from `y`th day [1-31] of the target months. 

- `everyWeekDay(wd)`  
every `wd` [1-7][SUN,SAT]; resets any previous value set there; even here more than one comma separated value can be passed. 

- `everyWeekDayAdd(wd)`  
every `wd` [1-7][SUN,SAT]; adds one more weekday in the current (default empty) list.

### months


### years




[quartz]: https://www.quartz-scheduler.org/
[cron]: https://en.wikipedia.org/wiki/Cron