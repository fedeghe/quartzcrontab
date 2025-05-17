## 0.0.41
added methods:
- `onFirstMonthWeekDay` (shortcut for `dom:1W`)
- describe works (only english locale shipped)

PROBLEM
all fields allow comma separated
values and one or more of those can be a cadence:
0 0 1,5/2 ? 1,4/2 1,5/2 *
"At 0 minutes past the hour, at 01:00 AM and every 2 hours, starting at 05:00 AM, only on Monday and , every 2 days of the week, starting only on Friday, only in January and , every 2 months, starting only in April"

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

## 0.0.29 (unpublished)  
fix: `dow` and `dow` additionally cant be both `?`  

## 0.0.28 (unpublished) 
validate can validate an instance unrelated expression  

## 0.0.27 (unpublished) 
first ready to use version  