/* eslint-disable no-unused-vars */

const Quartzcron = require('../dist/index.js');
const {
    validators,
    fieldCorrelationValidators
}  = require('../dist/validators.js');

const { errors } = require('../dist/constants.js');

describe('utils', () => {
    describe('validators', () => {
        describe('seconds', () => {

            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
                '2,5-10,20-40/4,54'
            ])('positives %s', v => {
                expect(validators.second(v)).toBeTruthy();
            });

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives %s', v => {
                expect(validators.second(v)).toBeFalsy();
            });
        }); 

        describe('minutes', () => {
            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
                '2,5-10,20-40/4,54'
            ])('positives %s', v => {
                expect(validators.minute(v)).toBeTruthy();
            });

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives %s', v => {
                expect(validators.minute(v)).toBeFalsy();
            });
        }); 

        describe('hours', () => {
            test.each([
                '*', 0, 1, 23,
                '1,2,4,8',
                '0-22',
                '0-21/3',
                '2,5-10,20-4/4,23'
            ])('positives %s', v => {
                expect(validators.hour(v)).toBeTruthy();
            });

            test.each([
                -2, 24,
                '1;2,4,8',
                '0+23',
                '0-21\\3',
                '2,5-10,2-4/4,24',
                '2,5-10,20-40/4,54'
            ])('negatives %s', v => {
                expect(validators.hour(v)).toBeFalsy();
            });
        }); 

        describe('day of month', () => {
            test.each([
                '*', '?',
                'L', 'LW',
                'L-2', 'L-31',
                '2W',
                1, 19, 31,
                '15/3',
                '12,14,17,18',
                '5-18',
                '5-28/3',
                '1,2-3,5-28/3',
            ])('positives %s', v => {
                expect(validators.dayOfMonth(v)).toBeTruthy();
            });

            test.each([
                '**', '!',
                'Lw', 'lW',
                'L+2', 'L+31',
                'L-0', 'L-32',
                '64W',
                -1, 32
            ])('negatives %s', v => {
                expect(validators.dayOfMonth(v)).toBeFalsy();
            });
        }); 

        describe('months', () => {
            test.each([
                '*', 1, 12,
                '1,2,4,8',
                '1-11',
                '1-10/2',
                '1,2-4,6-10/2,10/2',
            ])('positives %s', v => {
                expect(validators.month(v)).toBeTruthy();
            });

            test.each([
                -1, 0, 13,
                '1;2,4,8',
                '1+12',
                '1-11\\3',
            ])('negatives %s', v => {
                expect(validators.month(v)).toBeFalsy();
            });
        }); 

        describe('day of week', () => {
            test.each([
                '*', '?',
                '2L', '4#2',
                '1', '7',
                '1-5', '1-5/2',
                'SUN-TUE','SUN-TUE/2',
                'SUN', 'SAT',
                'MON-WED/2,SUN'
            ])('positives %s', v => {
                expect(validators.dayOfWeek(v)).toBeTruthy();
            });

            test.each([
                '**', '!',
                '72L', '43#2',
                '-2L', '3#32',
                '0', '8',
                '0-8', '0-8/9',
                'SUN+TUE','SUN-TUE=2',
                'SAN', 'SUT',
                'MON-WED/2,SAN'
            ])('negatives %s', v => {
                expect(validators.dayOfWeek(v)).toBeFalsy();
            });
        }); 

        describe('years', () => {
            test.each([
                '*', 1970, 2099,
                '1972,1973,1999,2033',
                '1972-2050',
                '1972-2050/3',
                '1972-2050/3,2020-2030,2040/3',
                '2040/3',
                '2020-2030',
                '1972-2050/3',
            ])('positive %s', v => {
                expect(validators.year(v)).toBeTruthy();
            });

            test.each([
                -1, 1969, 2100,
                '1972;1973,1999,2033',
                '1972+2050',
                '1972-2050\\/3',
            ])('negatives %s', v => {
                expect(validators.year(v)).toBeFalsy();
            });
        }); 
    });
    describe('fieldCorrelationValidators', () => {
        test.each([
            { dom: '?', dow: '*'},
            { dom: '*', dow: '?'},
        ])('positives %o', o => {
            fieldCorrelationValidators.forEach(
                ({validator}) => {
                    expect(validator(o)).toBeTruthy();
                }
            );
        });
        
        test.each([
            { dom: '?', dow: '?'},
            { dom: '3', dow: '4'},
            { dom: '*', dow: '*'},
        ])('negatives %o', o => {
            fieldCorrelationValidators.forEach(
                ({validator}) => {
                    expect(validator(o)).toBeFalsy();
                }
            );
        });
    });

    /**
     * the whole validation test exploit directly the "over" method
     * which is not actually supposed to be used directly,
     * "over" allows to set the elements for the validation in one single call
     */
    describe('validation', () => {
        describe('- seconds', () => {
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{s: '*'}],
                    [{s: '3'}],
                    [{s: '3,5,7'}],
                    [{s: '3-45'}],
                    [{s: '3-45/3'}],
                    [{s: '2,3-45/3,10-30,56/2'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                    expect(c.validate(c.out()).valid).toBeTruthy();
                    expect(c.validate(c.out()).errors.length).toBe(0);
                });
            });
            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{s: -1}],
                    [{s: 60}],
                    [{s: '3--30'}],
                    [{s: 'a'}],
                    [{s: '-'}],
                    [{s: '-1'}],
                    [{s: ''}],
                    [{s: /^$/}],
                    [{s: ()=>{}}],
                    [{s: '2-60'}],
                    [{s: '2,3-90'}],
                    [{s: '2,3-30/90'}],
                    [{s: '2,3-30/50,4/76'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                    expect(c.validate(c.out()).valid).toBeFalsy();
                    expect(c.validate(c.out()).errors.length).toBe(1);
                });
            });
        });
        describe('- minutes', () => {
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{i: '*'}],
                    [{i: '3'}],
                    [{i: '3,11,36'}],
                    [{i: '11-36'}],
                    [{i: '11-36/2'}],
                    [{i: '2,11-36/2,20-30,45,50/3'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                });
            });
            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{i: -1}],
                    [{i: 60}],
                    [{i: '3--30'}],
                    [{i: 'a'}],
                    [{i: '-'}],
                    [{i: '-1'}],
                    [{i: ''}],
                    [{i: /^$/}],
                    [{i: ()=>{}}],
                    [{i: '2-60'}],
                    [{i: '2,3-90'}],
                    [{i: '2,3-30/90'}],
                    [{i: '2,3-30/50,3/78'}],
                    [{i: '2,3-30/50,2-100,3/8'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                });
            });
        });
        describe('- hours', () => {
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{h: '*'}],
                    [{h: '3'}],
                    [{h: '3,5,9'}],
                    [{h: '3-9'}],
                    [{h: '3-9/2'}],
                    [{h: '2,3-9/2,4-9,3/2'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                });
            });

            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{h: -1}],
                    [{h: 24}],
                    [{h: '3--30'}],
                    [{h: 'a'}],
                    [{h: '-'}],
                    [{h: '-1'}],
                    [{h: ''}],
                    [{h: /^$/}],
                    [{h: ()=>{}}],
                    [{h: '24,2-4,2/4,3-8/2'}],
                    [{h: '23,2-43,2/4,3-8/2'}],
                    [{h: '23,2-4,2/43,3-8/2'}],
                    [{h: '23,2-4,2/4,3-85/2'}],
                    [{h: '23,2-4,2/4,3-8/27'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                });
            });
        });
        describe('- dom', () => { 
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{dom: '?', dow:2}],
                    [{dom: '*', dow:'?'}],
                    [{dom: '3/21', dow:'?'}],
                    [{dom: '3', dow:'?'}],
                    [{dom: '2,3,4', dow:'?'}],
                    [{dom: '1-5/2', dow:'?'}],
                    [{dom: 'L', dow:'?'}],
                    [{dom: 'LW', dow:'?'}],
                    [{dom: '1W', dow:'?'}],
                    [{dom: 'L-12', dow:'?'}],
                    [{dom: '13L', dow:'?'}],
                    [{dom: '13,14-18,20-24/2,28/2', dow:'?'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                }); 
            });
            
            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{dom: 32}],
                    [{dom: -1}],
                    [{dom: 0}],
                    [{dom: 'I'}],
                    [{dom: 'Lx'}],
                    [{dom: 'L1'}],
                    [{dom: '0L'}],
                    [{dom: '1123L'}],
                    [{dom: '32L'}],
                    [{dom: '33,14-18,20-24/2,28/2', dow:'?'}],
                    [{dom: '13,34-18,20-24/2,28/2', dow:'?'}],
                    [{dom: '13,14-58,20-24/2,28/2', dow:'?'}],
                    [{dom: '13,14-18,42-24/2,28/2', dow:'?'}],
                    [{dom: '13,14-18,20-49/2,28/2', dow:'?'}],
                    [{dom: '13,14-18,20-24/233,28/2', dow:'?'}],
                    [{dom: '13,14-18,20-24/2,58/2', dow:'?'}],
                    [{dom: '13,14-18,20-24/2,28/32', dow:'?'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                }); 
            });
            
        });
        describe('- dow', () => { 

            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{dom: '*', dow:'?'}],
                    [{dom: '?', dow:'2'}],
                    [{dom: '?', dow:'FRI'}],
                    [{dom: '?', dow:'1,3'}],
                    [{dom: '?', dow:'MON,FRI'}],
                    [{dom: '?', dow:'1-5'}],
                    [{dom: '?', dow:'MoN-FrI'}],
                    [{dom: '?', dow:'1-5/2'}],
                    [{dom: '?', dow:'MON-FRI/2'}],
                    [{dom: '?', dow:'3L'}],
                    [{dom: '?', dow:'SUNL'}],
                    [{dom: '?', dow:'3#2'}],
                    [{dom: '?', dow:'MON#2'}],
                    [{dom: '?', dow:'MON,TUE/2,THU-WED/2,FRI-SUN'}],
                    
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                }); 
                it('no params - everyWeekDay', ()=>{
                    c.everyWeekDay();
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.elements.dow).toBe('2-6');
                    expect(c.elements.dom).toBe('?'); 
                }); 
            });
            

            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{dom: '?', dow:0}],
                    [{dom: '?', dow:'FRU'}],
                    [{dom: '?', dow:'FRI/44'}],
                    [{dom: '?', dow:'FRI/4,THY'}],
                    [{dom: '?', dow:'FRI/4,THU,MON-FRU'}],
                    [{dom: '?', dow:'FRI/4,THU,MON-FRI,FRI-SUN/8'}],
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors[0]).toBe(errors.malformed.dow);
                }); 
            });
        });
        describe('- months', () => {
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{m: '*'}],// every month does that
                    [{m: '3'}],
                    [{m: 'JAN'}],
                    [{m: '1,2,3'}],
                    [{m: 'JAN,FEB,MAR'}],
                    [{m: '1-6'}],
                    [{m: 'JAN-JUN'}],
                    [{m: '1-8/2'}],
                    [{m: 'JAN-AUG/2'}],  
                    [{m: 'JAN,FEB-AUG/2'}],  
                    [{m: 'JAN,FEB-MAY/2,JUN-SEP'}],  
                    [{m: 'JAN,FEB-MAY/2,JUN-SEP,OCT-NOV/2'}],  
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                });
            });

            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{m: '13'}],
                    [{m: '2,13'}],
                    [{m: '13,21,23'}],
                    [{m: 'JA2'}],  
                    [{m: 'JAN-AU/2'}],  
                    [{m: 'JAN,FEB-AUG/13'}],  
                    [{m: 'JAN,FEB-MAY/2,JUN-SEX'}],  
                    [{m: 'JAN,FEB-MAY/2,JUN-SEP,OC-NOV/2'}],  
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                });
            });
        });
        describe('- years', () => {
            describe('- positives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{y: '*'}],
                    [{y: '2030'}],
                    [{y: '2030,2032'}],
                    [{y: '2020-2032'}],
                    [{y: '2010-2032/2'}],
                    [{y:'2013-2034/2,2045-2047,2056,2067-2077'}]
                    
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeTruthy();
                    expect(c.validate().errors.length).toBe(0);
                });
            });

            describe('- negatives', () => {
                let c;
                beforeEach(() => {
                    c = new Quartzcron();
                });
                test.each([
                    [{y: '1969'}],
                    [{y: '2100'}],
                    [{y: '1200,2000'}],
                    [{y: '1200,2300,34000'}],
                    [{y:'2113-2034/2,2045-2047,2056,2067-2077'}],
                    [{y:'2013-2134/2,2045-2047,2056,2067-2077'}],
                    [{y:'2013-2034/23333,2045-2047,2056,2067-2077'}],
                    [{y:'2013-2034/2,3045-2047,2056,2067-2077'}],
                    [{y:'2013-2034/2,2045-9047,2056,2067-2077'}],
                    [{y:'2013-2034/2,2045-2047,1056,2067-2077'}],
                    [{y:'2013-2034/2,2045-2047,2056,67-2077'}],
                    [{y:'2013-2034/2,2045-2047,2056,2067-77'}]
                ])('%o', arg => {
                    c.over(arg);
                    expect(c.validate().valid).toBeFalsy();
                    expect(c.validate().errors.length).toBe(1);
                });
            });

        });

        describe('static validate', () => {    
            describe('- positives', () => {
                test.each([
                    '0 0 0 * * ? *',
                    '* * * * * ? *',
                    '0 0 0 1 * ? *',
                    '0 0 0 1 1 ? *',
                    '0 0 0 L 1 ? *',
                    '0 0 0 LW 1 ? *',
                    '0 0 0 3W 1 ? *',
                    '0,1,5 1-31/5 * ? JAN,FeB 7#3 2026,2028,2032',
                    '* * * ? JAN,FEB 7#3 2026,2028,2032',
                    '* * * ? JAN-DEC/2 7#3 2026-2080/4',

                    // from https://www.freeformatter.com/cron-expression-generator-quartz.html
                    '* * * ? * *', 
                    '0 * * ? * *',
                    '0 */2 * ? * *',
                    '0 1/2 * ? * *',
                    '0 */2 * ? * *',
                    '0 */3 * ? * *',
                    '0 */4 * ? * *',
                    '0 */5 * ? * *',
                    '0 */10 * ? * *',
                    '0 */15 * ? * *',
                    '0 */30 * ? * *',
                    '0 15,30,45 * ? * *',
                    '0 0 * ? * *',
                    '0 0 */2 ? * *',
                    '0 0 0/2 ? * *',
                    '0 0 1/2 ? * *',
                    '0 0 */3 ? * *',
                    '0 0 */4 ? * *',
                    '0 0 */6 ? * *',
                    '0 0 */8 ? * *',
                    '0 0 */12 ? * *',
                    '0 0 0 * * ?',
                    '0 0 1 * * ?',
                    '0 0 6 * * ?',
                    '0 0 12 * * ?',
                    '0 0 12 * * ?',
                    '0 0 12 ? * SUN',
                    '0 0 12 ? * MON',
                    '0 0 12 ? * TUE',
                    '0 0 12 ? * WED',
                    '0 0 12 ? * THU',
                    '0 0 12 ? * FRI',
                    '0 0 12 ? * SAT',
                    '0 0 12 ? * MON-FRI',
                    '0 0 12 ? * SUN,SAT',
                    '0 0 12 */7 * ?',
                    '0 0 12 1 * ?',
                    '0 0 12 2 * ?',
                    '0 0 12 15 * ?',
                    '0 0 12 1/2 * ?',
                    '0 0 12 1/4 * ?',
                    '0 0 12 L * ?',
                    '0 0 12 L-2 * ?',
                    '0 0 12 LW * ?',
                    '0 0 12 1L * ?',
                    '0 0 12 2L * ?',
                    '0 0 12 6L * ?',
                    '0 0 12 1W * ?',
                    '0 0 12 15W * ?',
                    '0 0 12 ? * 2#1',
                    '0 0 12 ? * 6#1',
                    '0 0 12 ? * 2#2',
                    '0 0 12 ? * 5#3',
                    '0 0 12 ? JAN *',
                    '0 0 12 ? JUN *',
                    '0 0 12 ? JAN,JUN *',
                    '0 0 12 ? DEC *',
                    '0 0 12 ? JAN,FEB,MAR,APR *',
                    '0 0 12 ? 9-12 *',
                    '0 0 12 ? 9-12 */3',

                    // articulated
                    '1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077'
                ])('%s', (arg) => {
                    const validation = Quartzcron.validate(arg);
                    expect(validation.valid).toBeTruthy();
                    expect(validation.errors.length).toBe(0);
                });
            });

            describe('- negatives', () => {
                test.each([
                    ['-1 0 0 * * ? *', [errors.malformed.seconds]],
                    ['0 -1 0 * * ? *', [errors.malformed.minutes]],
                    ['0 0 -12 * * ? *', [errors.malformed.hours]],
                    ['0 0 0 s * ? *', [errors.malformed.dom]],
                    ['0 0 0 * aaa ? *', [errors.malformed.months]],
                    ['0 0 0 ? * 333 *', [errors.malformed.dow]],
                    ['0 0 0 ? * * aaaa', [errors.malformed.years]],
                    ['0 0 0 1 * 1 *', [errors.domdowExclusivity]],
                    // more than one
                    ['-1 -1 -12 s aaa 333 sss', [
                        errors.domdowExclusivity,
                        errors.malformed.seconds,
                        errors.malformed.minutes,
                        errors.malformed.hours,
                        errors.malformed.dom,
                        errors.malformed.months,
                        errors.malformed.dow,
                        errors.malformed.years,
                    ]],
                    // articulated
                    /* eslint-disable max-len */
                    ['99,2-20/3,30 99,5-3/3,7 92-14,15,18-23/2 1-95/3,9,10-16,23-26/2,28 1-6/92 ? 2913-2034/2,2045-2047,2056,2067-2077', [errors.malformed.seconds,errors.malformed.minutes,errors.malformed.hours,errors.malformed.dom,errors.malformed.months,errors.malformed.years]],
                    ['91,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.seconds]],
                    ['1,92-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.seconds]],
                    ['1,2-920/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.seconds]],
                    ['1,2-20/93,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.seconds]],
                    ['1,2-20/3,930 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.seconds]],
                    ['1,2-20/3,30 94,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.minutes]],
                    ['1,2-20/3,30 4,95-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.minutes]],
                    ['1,2-20/3,30 4,5-93/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.minutes]],
                    ['1,2-20/3,30 4,5-3/93,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.minutes]],
                    ['1,2-20/3,30 4,5-3/3,97 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.minutes]],
                    ['1,2-20/3,30 4,5-3/3,7 912-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],
                    ['1,2-20/3,30 4,5-3/3,7 12-914,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,915,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,918-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-923/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/92 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.hours]],

                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 91-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-95/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/93,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,99,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,910-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-916,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,923-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-926/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/92,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,928 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.dom]],

                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 91-6/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.months]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-96/2 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.months]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/92 ? 2013-2034/2,2045-2047,2056,2067-2077',[errors.malformed.months]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2913-2034/2,2045-2047,2056,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2934/2,2045-2047,2056,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/299,2045-2047,2056,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2945-2047,2056,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2947,2056,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2956,2067-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2967-2077',[errors.malformed.years]],
                    ['1,2-20/3,30 4,5-3/3,7 12-14,15,18-23/2 1-5/3,9,10-16,23-26/2,28 1-6/2 ? 2013-2034/2,2045-2047,2056,2067-2977',[errors.malformed.years]],
                    /* eslint-enable max-len */
                ])('%s', (arg, err) => {
                    const validation = Quartzcron.validate(arg);
                    expect(validation.valid).toBeFalsy();
                    expect(validation.errors).toMatchObject(err);
                });

                it('nothing passed', () => {
                    const validation = Quartzcron.validate();
                    expect(validation.valid).toBeFalsy();
                    expect(validation.errors).toMatchObject([errors.staticValidationParamMissing]);
                });
            });
            
        }); 

        describe('correlations', () => {

            describe('- dow <> dom', () => { 

                describe('- negatives', () => {
                    let c;
                    beforeEach(() => {
                        c = new Quartzcron();
                    });
                    it('dow and dow cant be both set', () => {
                        c.over({dom: 12, dow:2});
                        expect(c.validate().valid).toBeFalsy();
                        expect(c.validate().errors.length).toBe(1);
                        expect(c.validate().errors[0]).toBe(errors.domdowExclusivity);
                    });
                });
            });
        });      
    });
});