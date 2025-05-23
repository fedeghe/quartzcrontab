## 0.0.46
**bugfix**
everyNMonths and everyNMonthsAdd when the start (second param) is not passed were setting the defautl start at 0 which is not correct.

**describe removed**: need a smarter approach

**fullsetters fix**  
before that it was not possible for all compliant fields to be set (using setters) as multiple comma separated values, as  
`5,15-20,30-40/2,50/5`  for example for seconds.  

Now every compliant setter `x` has a `xAdd` version available which grants to add to the current value;
practically (assuming the default is not changed from `0 0 0 * * ? *`) this can be described with an example:  
``` js
qc.atSecond(2, 3)
 // 2/3 0 0 * * ? *
    .atSecondAdd(10)
// 2/3,10 0 0 * * ? *
    .betweenSecondsAdd(30, 40, 2)
// 2/3,10,30-40/2 0 0 * * ? *
    atSecond(3) // this resets
// 3 0 0 * * ? *
```
As a rule of thumb amyway only setters ending with _Add_ guarantee an addition on the target field.


## 0.0.45
added methods:
- `onFirstMonthWeekDay` (shortcut for `dom:1W`)
- experimental: describe works (only english locale shipped)

bugfix:
validators where not set correctly to accept multimple values like `2,30-39,45-50/2,55/5` for seconds for example
same was happening for all fields allowing multiple elements, giving false negatives when invoking `validate`


## 0.0.43  
cadences optional added in:  
- `atSecond`, `atSecondAdd`
- `atMinute`, `atMinuteAdd`
- `atHour`, `atHourAdd`
- `atWeekDay`, `atWeekDayAdd`
- `atMonthDay`, `atMonthDayAdd`
- `atMonth`, `atMonthAdd`
- `atYear`, `atYearAdd`


## 0.0.42  
- fixed wrong behaviour of `betweenWeekDays`
    which was allowing to set the first bigger than the second  
- fixed `everyWeekEnd`

## 0.0.40  
BUGFIX missing _dom_ `a-b` solver added  

## 0.0.39
some changes on the api  
changes: 
- `everyWeekDayStartingFromNMonthDay` replaced for `everyNDays`  
- `everyWeekDay` chage behaviour, now does not accept parameters, it jsut set `dow` to `2-6`

additions
- `everyWeekDay` to set `dow` to `2-6`
- `atWeekDay` and `atWeekDayAdd`
- `betweenWeekDays`


## 0.0.38  
all 7 range resolvers are exposed in static `Quartzcron.solvers`  