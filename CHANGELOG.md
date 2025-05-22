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