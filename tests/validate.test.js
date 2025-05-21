
const {
    validators,
    fieldCorrelationValidators
}  = require('../dist/validators.js');

describe('utils', () => {
    describe('validators', () => {
        describe('seconds', () => {

            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
            ])('positives', v => {
                expect(validators.second(v)).toBeTruthy();
            });

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives', v => {
                expect(validators.second(v)).toBeFalsy();
            });
        }); 

        describe('minutes', () => {
            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
            ])('positives', v => {
                expect(validators.minute(v)).toBeTruthy();
            });

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives', v => {
                expect(validators.minute(v)).toBeFalsy();
            });
        }); 

        describe('hours', () => {
            test.each([
                '*', 0, 1, 23,
                '1,2,4,8',
                '0-22',
                '0-21/3',
            ])('positives', v => {
                expect(validators.hour(v)).toBeTruthy();
            });

            test.each([
                -2, 24,
                '1;2,4,8',
                '0+23',
                '0-21\\3',
            ])('negatives', v => {
                expect(validators.hour(v)).toBeFalsy();
            });
        }); 

        describe('months', () => {
            test.each([
                '*', 1, 12,
                '1,2,4,8',
                '1-11',
                '1-10/2',
            ])('positives', v => {
                expect(validators.month(v)).toBeTruthy();
            });

            test.each([
                -1, 0, 13,
                '1;2,4,8',
                '1+12',
                '1-11\\3',
            ])('negatives', v => {
                expect(validators.month(v)).toBeFalsy();
            });
        }); 

        describe('years', () => {
            test.each([
                '*', 1970, 2099,
                '1972,1973,1999,2033',
                '1972-2050',
                '1972-2050/3',
            ])('positives', v => {
                expect(validators.year(v)).toBeTruthy();
            });

            test.each([
                -1, 1969, 2100,
                '1972;1973,1999,2033',
                '1972+2050',
                '1972-2050\\/3',
            ])('negatives', v => {
                expect(validators.year(v)).toBeFalsy();
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
            ])('positives', v => {
                expect(validators.dayOfMonth(v)).toBeTruthy();
            });

            test.each([
                '**', '!',
                'Lw', 'lW',
                'L+2', 'L+31',
                'L-0', 'L-32',
                '64W',
                -1, 32
            ])('negatives', v => {
                expect(validators.dayOfMonth(v)).toBeFalsy();
            });
        }); 

        describe('day of week', () => {
            test.each([
                '*', '?',
                '2L', '4#2',
                '1', '7',
                '1-5', '1-5/2',
                'SUN-TUE','SUN-TUE/2',
                'SUN', 'SAT'
            ])('positives', v => {
                expect(validators.dayOfWeek(v)).toBeTruthy();
            });

            test.each([
                '**', '!',
                '72L', '43#2',
                '-2L', '3#32',
                '0', '8',
                '0-8', '0-8/9',
                'SUN+TUE','SUN-TUE=2',
                'SAN', 'SUT'
            ])('negatives', v => {
                expect(validators.dayOfWeek(v)).toBeFalsy();
            });
        }); 
    });
    describe('fieldCorrelationValidators', () => {
        test.each([
            { dom: '?', dow: '*'},
            { dom: '*', dow: '?'},
        ])('positives', o => {
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
        ])('negatives', o => {
            fieldCorrelationValidators.forEach(
                ({validator}) => {
                    expect(validator(o)).toBeFalsy();
                }
            );
        });
    });
});