
const utils  = require('../dist/utils.js');

const {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces
} = utils
describe('utils', () => {
    describe('validators', () => {
        describe('seconds', () => {
            it('positives', () => {
                [
                    '*', 0, 1, 59,
                    '1,2,4,8',
                    '0-58',
                    '0-58/3',
                ].forEach(v => {
                    expect(validators.second(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
                ].forEach(v => {
                    expect(validators.second(v)).toBeFalsy()
                })
            })
        }) 

        describe('minutes', () => {
            it('positives', () => {
                [
                    '*', 0, 1, 59,
                    '1,2,4,8',
                    '0-58',
                    '0-58/3',
                ].forEach(v => {
                    expect(validators.minute(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
                ].forEach(v => {
                    expect(validators.minute(v)).toBeFalsy()
                })
            })
        }) 

        describe('hours', () => {
            it('positives', () => {
                [
                    '*', 0, 1, 23,
                    '1,2,4,8',
                    '0-22',
                    '0-21/3',
                ].forEach(v => {
                    expect(validators.hour(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    -2, 24,
                    '1;2,4,8',
                    '0+23',
                    '0-21\\3',
                ].forEach(v => {
                    expect(validators.hour(v)).toBeFalsy()
                })
            })
        }) 

        describe('months', () => {
            it('positives', () => {
                [
                    '*', 1, 12,
                    '1,2,4,8',
                    '1-11',
                    '1-10/2',
                ].forEach(v => {
                    expect(validators.month(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    -1, 0, 13,
                    '1;2,4,8',
                    '1+12',
                    '1-11\\3',
                ].forEach(v => {
                    expect(validators.month(v)).toBeFalsy()
                })
            })
        }) 

        describe('years', () => {
            it('positives', () => {
                [
                    '*', 1970, 2099,
                    '1972,1973,1999,2033',
                    '1972-2050',
                    '1972-2050/3',
                ].forEach(v => {
                    expect(validators.year(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    -1, 1969, 2100,
                    '1972;1973,1999,2033',
                    '1972+2050',
                    '1972-2050\\/3',
                ].forEach(v => {
                    expect(validators.year(v)).toBeFalsy()
                })
            })
        }) 

        describe('day of month', () => {
            it('positives', () => {
                [
                    '*', '?',
                    'L', 'LW',
                    'L-2', 'L-31',
                    '2W',
                    1, 19, 31,
                    '15/3',
                    '12,14,17,18',
                    '5-18',
                    '5-28/3',
                ].forEach(v => {
                    expect(validators.dayOfMonth(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    '**', '!',
                    'Lw', 'lW',
                    'L+2', 'L+31',
                    'L-0', 'L-32',
                    '64W',
                    -1, 32
                ].forEach(v => {
                    expect(validators.dayOfMonth(v)).toBeFalsy()
                })
            })
        }) 

        describe('day of week', () => {
            it('positives', () => {
                [
                    '*', '?',
                    '2L', '4#2',
                    '1', '7',
                    '1-5', '1-5/2',
                    'SUN-TUE','SUN-TUE/2',
                    'SUN', 'SAT'
                ].forEach(v => {
                    expect(validators.dayOfWeek(v)).toBeTruthy()
                })
            })
            it('negatives', () => {
                [
                    '**', '!',
                    '72L', '43#2',
                    '-2L', '3#32',
                    '0', '8',
                    '0-8', '0-8/9',
                    'SUN+TUE','SUN-TUE=2',
                    'SAN', 'SUT'
                ].forEach(v => {
                    expect(validators.dayOfWeek(v)).toBeFalsy()
                })
            })
        }) 
    })

    describe('fieldCorrelationValidators', () => {
        it('positives', () => {
            [
                { dom: '?', dow: '*'},
                { dom: '*', dow: '?'},
                { dom: '?', dow: '?'},
            ].forEach(o => {
                fieldCorrelationValidators.forEach(
                    ({validator}) => {
                        expect(validator(o)).toBeTruthy()
                    }
                )
            })
        })
        it('negatives', () => {
            [
                { dom: '3', dow: '4'},
                { dom: '*', dow: '*'},
            ].forEach(o => {
                fieldCorrelationValidators.forEach(
                    ({validator}) => {
                        expect(validator(o)).toBeFalsy()
                    }
                )
            })
        })

    })

    describe('defaults', () => {
        it('have the expected values', () => {
            expect(defaults.s).toBe('0')
            expect(defaults.i).toBe('0')
            expect(defaults.h).toBe('0')
            expect(defaults.dom).toBe('*')
            expect(defaults.m).toBe('*')
            expect(defaults.dow).toBe('?')
            expect(defaults.y).toBe('*')
        })
    })

    describe('yearNow', () => {
        it('return the expected', () => {
            expect(yearNow).toBe((new Date).getFullYear())
        })
    })

    describe('removeSpaces', () => {
        it('as expected', () => {
            [
                [' a, b c d e f g', 'a,bcdefg'],
                [' 45 c246u35w qc5yh    w45  ', '45c246u35wqc5yhw45'],
            ].forEach(o => 
                expect(removeSpaces(o[0])).toBe(o[1])
            )
        })
    })
})



