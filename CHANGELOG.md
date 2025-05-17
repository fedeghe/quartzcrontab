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