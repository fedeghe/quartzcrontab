

[![Coverage Status](https://coveralls.io/repos/github/fedeghe/quartzcrontab/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/quartzcrontab?branch=master)


# quartzcrontab (v. 0.0.7)
<pre style="font-size:2em">s i h dom m dow y</pre>
[Quartz scheduler][quartz] offers way more flexibility compared to traditional [cron][cron] tool.  
That additional freedom clearly maps into less trivial composition for the cron strings, this library aims to  
 - **help to programmatically create those cron expressions**  
 - **validate an expression**  
 - **get the _n_ next precise occurrences**  



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
    .everyNYears(5)

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
## validation API

`QuartzCrontab.validate(exp)`  
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


## occurrences
Fron an instance call the `next` function: 
``` js
const nextOccurrence = qct.next()
// "Mon Jan 01 2024 02:00:00 GMT+0100 (Central European Standard Time)",
```
this function accepts two options:  
- `n`: the number of occurrences needed (1 is the default)  
- `date`: a reference date (js Date) to be used as _present time_ (default is the current date). No dates before the _present date_ will be returned.


# timezones 
In case one plans to use that utility on the client the chances the server runs ona different timezone is quite high, thus there is the need to set it correctly using a static method:
```
// one among Intl.supportedValuesOf("timeZone")
QuartzCrontab.setClientTimezone() //
QuartzCrontab.setServerTimezone() // default UTC
```
<details>
<summary>click here to see the full list</summary>

``` js  
"Africa/Abidjan",
"Africa/Accra",
"Africa/Addis_Ababa",
"Africa/Algiers",
"Africa/Asmera",
"Africa/Bamako",
"Africa/Bangui",
"Africa/Banjul",
"Africa/Bissau",
"Africa/Blantyre",
"Africa/Brazzaville",
"Africa/Bujumbura",
"Africa/Cairo",
"Africa/Casablanca",
"Africa/Ceuta",
"Africa/Conakry",
"Africa/Dakar",
"Africa/Dar_es_Salaam",
"Africa/Djibouti",
"Africa/Douala",
"Africa/El_Aaiun",
"Africa/Freetown",
"Africa/Gaborone",
"Africa/Harare",
"Africa/Johannesburg",
"Africa/Juba",
"Africa/Kampala",
"Africa/Khartoum",
"Africa/Kigali",
"Africa/Kinshasa",
"Africa/Lagos",
"Africa/Libreville",
"Africa/Lome",
"Africa/Luanda",
"Africa/Lubumbashi",
"Africa/Lusaka",
"Africa/Malabo",
"Africa/Maputo",
"Africa/Maseru",
"Africa/Mbabane",
"Africa/Mogadishu",
"Africa/Monrovia",
"Africa/Nairobi",
"Africa/Ndjamena",
"Africa/Niamey",
"Africa/Nouakchott",
"Africa/Ouagadougou",
"Africa/Porto-Novo",
"Africa/Sao_Tome",
"Africa/Tripoli",
"Africa/Tunis",
"Africa/Windhoek",
"America/Adak",
"America/Anchorage",
"America/Anguilla",
"America/Antigua",
"America/Araguaina",
"America/Argentina/La_Rioja",
"America/Argentina/Rio_Gallegos",
"America/Argentina/Salta",
"America/Argentina/San_Juan",
"America/Argentina/San_Luis",
"America/Argentina/Tucuman",
"America/Argentina/Ushuaia",
"America/Aruba",
"America/Asuncion",
"America/Bahia",
"America/Bahia_Banderas",
"America/Barbados",
"America/Belem",
"America/Belize",
"America/Blanc-Sablon",
"America/Boa_Vista",
"America/Bogota",
"America/Boise",
"America/Buenos_Aires",
"America/Cambridge_Bay",
"America/Campo_Grande",
"America/Cancun",
"America/Caracas",
"America/Catamarca",
"America/Cayenne",
"America/Cayman",
"America/Chicago",
"America/Chihuahua",
"America/Ciudad_Juarez",
"America/Coral_Harbour",
"America/Cordoba",
"America/Costa_Rica",
"America/Creston",
"America/Cuiaba",
"America/Curacao",
"America/Danmarkshavn",
"America/Dawson",
"America/Dawson_Creek",
"America/Denver",
"America/Detroit",
"America/Dominica",
"America/Edmonton",
"America/Eirunepe",
"America/El_Salvador",
"America/Fort_Nelson",
"America/Fortaleza",
"America/Glace_Bay",
"America/Godthab",
"America/Goose_Bay",
"America/Grand_Turk",
"America/Grenada",
"America/Guadeloupe",
"America/Guatemala",
"America/Guayaquil",
"America/Guyana",
"America/Halifax",
"America/Havana",
"America/Hermosillo",
"America/Indiana/Knox",
"America/Indiana/Marengo",
"America/Indiana/Petersburg",
"America/Indiana/Tell_City",
"America/Indiana/Vevay",
"America/Indiana/Vincennes",
"America/Indiana/Winamac",
"America/Indianapolis",
"America/Inuvik",
"America/Iqaluit",
"America/Jamaica",
"America/Jujuy",
"America/Juneau",
"America/Kentucky/Monticello",
"America/Kralendijk",
"America/La_Paz",
"America/Lima",
"America/Los_Angeles",
"America/Louisville",
"America/Lower_Princes",
"America/Maceio",
"America/Managua",
"America/Manaus",
"America/Marigot",
"America/Martinique",
"America/Matamoros",
"America/Mazatlan",
"America/Mendoza",
"America/Menominee",
"America/Merida",
"America/Metlakatla",
"America/Mexico_City",
"America/Miquelon",
"America/Moncton",
"America/Monterrey",
"America/Montevideo",
"America/Montserrat",
"America/Nassau",
"America/New_York",
"America/Nome",
"America/Noronha",
"America/North_Dakota/Beulah",
"America/North_Dakota/Center",
"America/North_Dakota/New_Salem",
"America/Ojinaga",
"America/Panama",
"America/Paramaribo",
"America/Phoenix",
"America/Port-au-Prince",
"America/Port_of_Spain",
"America/Porto_Velho",
"America/Puerto_Rico",
"America/Punta_Arenas",
"America/Rankin_Inlet",
"America/Recife",
"America/Regina",
"America/Resolute",
"America/Rio_Branco",
"America/Santarem",
"America/Santiago",
"America/Santo_Domingo",
"America/Sao_Paulo",
"America/Scoresbysund",
"America/Sitka",
"America/St_Barthelemy",
"America/St_Johns",
"America/St_Kitts",
"America/St_Lucia",
"America/St_Thomas",
"America/St_Vincent",
"America/Swift_Current",
"America/Tegucigalpa",
"America/Thule",
"America/Tijuana",
"America/Toronto",
"America/Tortola",
"America/Vancouver",
"America/Whitehorse",
"America/Winnipeg",
"America/Yakutat",
"Antarctica/Casey",
"Antarctica/Davis",
"Antarctica/DumontDUrville",
"Antarctica/Macquarie",
"Antarctica/Mawson",
"Antarctica/McMurdo",
"Antarctica/Palmer",
"Antarctica/Rothera",
"Antarctica/Syowa",
"Antarctica/Troll",
"Antarctica/Vostok",
"Arctic/Longyearbyen",
"Asia/Aden",
"Asia/Almaty",
"Asia/Amman",
"Asia/Anadyr",
"Asia/Aqtau",
"Asia/Aqtobe",
"Asia/Ashgabat",
"Asia/Atyrau",
"Asia/Baghdad",
"Asia/Bahrain",
"Asia/Baku",
"Asia/Bangkok",
"Asia/Barnaul",
"Asia/Beirut",
"Asia/Bishkek",
"Asia/Brunei",
"Asia/Calcutta",
"Asia/Chita",
"Asia/Colombo",
"Asia/Damascus",
"Asia/Dhaka",
"Asia/Dili",
"Asia/Dubai",
"Asia/Dushanbe",
"Asia/Famagusta",
"Asia/Gaza",
"Asia/Hebron",
"Asia/Hong_Kong",
"Asia/Hovd",
"Asia/Irkutsk",
"Asia/Jakarta",
"Asia/Jayapura",
"Asia/Jerusalem",
"Asia/Kabul",
"Asia/Kamchatka",
"Asia/Karachi",
"Asia/Katmandu",
"Asia/Khandyga",
"Asia/Krasnoyarsk",
"Asia/Kuala_Lumpur",
"Asia/Kuching",
"Asia/Kuwait",
"Asia/Macau",
"Asia/Magadan",
"Asia/Makassar",
"Asia/Manila",
"Asia/Muscat",
"Asia/Nicosia",
"Asia/Novokuznetsk",
"Asia/Novosibirsk",
"Asia/Omsk",
"Asia/Oral",
"Asia/Phnom_Penh",
"Asia/Pontianak",
"Asia/Pyongyang",
"Asia/Qatar",
"Asia/Qostanay",
"Asia/Qyzylorda",
"Asia/Rangoon",
"Asia/Riyadh",
"Asia/Saigon",
"Asia/Sakhalin",
"Asia/Samarkand",
"Asia/Seoul",
"Asia/Shanghai",
"Asia/Singapore",
"Asia/Srednekolymsk",
"Asia/Taipei",
"Asia/Tashkent",
"Asia/Tbilisi",
"Asia/Tehran",
"Asia/Thimphu",
"Asia/Tokyo",
"Asia/Tomsk",
"Asia/Ulaanbaatar",
"Asia/Urumqi",
"Asia/Ust-Nera",
"Asia/Vientiane",
"Asia/Vladivostok",
"Asia/Yakutsk",
"Asia/Yekaterinburg",
"Asia/Yerevan",
"Atlantic/Azores",
"Atlantic/Bermuda",
"Atlantic/Canary",
"Atlantic/Cape_Verde",
"Atlantic/Faeroe",
"Atlantic/Madeira",
"Atlantic/Reykjavik",
"Atlantic/South_Georgia",
"Atlantic/St_Helena",
"Atlantic/Stanley",
"Australia/Adelaide",
"Australia/Brisbane",
"Australia/Broken_Hill",
"Australia/Darwin",
"Australia/Eucla",
"Australia/Hobart",
"Australia/Lindeman",
"Australia/Lord_Howe",
"Australia/Melbourne",
"Australia/Perth",
"Australia/Sydney",
"Europe/Amsterdam",
"Europe/Andorra",
"Europe/Astrakhan",
"Europe/Athens",
"Europe/Belgrade",
"Europe/Berlin",
"Europe/Bratislava",
"Europe/Brussels",
"Europe/Bucharest",
"Europe/Budapest",
"Europe/Busingen",
"Europe/Chisinau",
"Europe/Copenhagen",
"Europe/Dublin",
"Europe/Gibraltar",
"Europe/Guernsey",
"Europe/Helsinki",
"Europe/Isle_of_Man",
"Europe/Istanbul",
"Europe/Jersey",
"Europe/Kaliningrad",
"Europe/Kiev",
"Europe/Kirov",
"Europe/Lisbon",
"Europe/Ljubljana",
"Europe/London",
"Europe/Luxembourg",
"Europe/Madrid",
"Europe/Malta",
"Europe/Mariehamn",
"Europe/Minsk",
"Europe/Monaco",
"Europe/Moscow",
"Europe/Oslo",
"Europe/Paris",
"Europe/Podgorica",
"Europe/Prague",
"Europe/Riga",
"Europe/Rome",
"Europe/Samara",
"Europe/San_Marino",
"Europe/Sarajevo",
"Europe/Saratov",
"Europe/Simferopol",
"Europe/Skopje",
"Europe/Sofia",
"Europe/Stockholm",
"Europe/Tallinn",
"Europe/Tirane",
"Europe/Ulyanovsk",
"Europe/Vaduz",
"Europe/Vatican",
"Europe/Vienna",
"Europe/Vilnius",
"Europe/Volgograd",
"Europe/Warsaw",
"Europe/Zagreb",
"Europe/Zurich",
"Indian/Antananarivo",
"Indian/Chagos",
"Indian/Christmas",
"Indian/Cocos",
"Indian/Comoro",
"Indian/Kerguelen",
"Indian/Mahe",
"Indian/Maldives",
"Indian/Mauritius",
"Indian/Mayotte",
"Indian/Reunion",
"Pacific/Apia",
"Pacific/Auckland",
"Pacific/Bougainville",
"Pacific/Chatham",
"Pacific/Easter",
"Pacific/Efate",
"Pacific/Enderbury",
"Pacific/Fakaofo",
"Pacific/Fiji",
"Pacific/Funafuti",
"Pacific/Galapagos",
"Pacific/Gambier",
"Pacific/Guadalcanal",
"Pacific/Guam",
"Pacific/Honolulu",
"Pacific/Kiritimati",
"Pacific/Kosrae",
"Pacific/Kwajalein",
"Pacific/Majuro",
"Pacific/Marquesas",
"Pacific/Midway",
"Pacific/Nauru",
"Pacific/Niue",
"Pacific/Norfolk",
"Pacific/Noumea",
"Pacific/Pago_Pago",
"Pacific/Palau",
"Pacific/Pitcairn",
"Pacific/Ponape",
"Pacific/Port_Moresby",
"Pacific/Rarotonga",
"Pacific/Saipan",
"Pacific/Tahiti",
"Pacific/Tarawa",
"Pacific/Tongatapu",
"Pacific/Truk",
"Pacific/Wake",
"Pacific/Wallis"
```
</details>

when not set, both will be by default [UTC][utc]



[quartz]: https://www.quartz-scheduler.org/
[cron]: https://en.wikipedia.org/wiki/Cron
[utc]: https://en.wikipedia.org/wiki/Coordinated_Universal_Time