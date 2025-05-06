
const utils  = require('../dist/utils.js');

const {
    validators,
    fieldCorrelationValidators,
    defaults,
    yearNow,
    removeSpaces,
    daysLabels2Numbers,
    exp2elements
} = utils
describe('utils', () => {
    describe('validators', () => {
        describe('seconds', () => {

            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
            ])('positives', v => {
                expect(validators.second(v)).toBeTruthy()
            })

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives', v => {
                expect(validators.second(v)).toBeFalsy()
            })
        }) 

        describe('minutes', () => {
            test.each([
                '*', 0, 1, 59,
                '1,2,4,8',
                '0-58',
                '0-58/3',
            ])('positives', v => {
                expect(validators.minute(v)).toBeTruthy()
            })

            test.each([
                -2, 60,
                    '1;2,4,8',
                    '0+58',
                    '0-58\\3',
            ])('negatives', v => {
                expect(validators.minute(v)).toBeFalsy()
            })
        }) 

        describe('hours', () => {
            test.each([
                '*', 0, 1, 23,
                '1,2,4,8',
                '0-22',
                '0-21/3',
            ])('positives', v => {
                expect(validators.hour(v)).toBeTruthy()
            })

            test.each([
                -2, 24,
                '1;2,4,8',
                '0+23',
                '0-21\\3',
            ])('negatives', v => {
                expect(validators.hour(v)).toBeFalsy()
            })
        }) 

        describe('months', () => {
            test.each([
                '*', 1, 12,
                '1,2,4,8',
                '1-11',
                '1-10/2',
            ])('positives', v => {
                expect(validators.month(v)).toBeTruthy()
            })

            test.each([
                -1, 0, 13,
                '1;2,4,8',
                '1+12',
                '1-11\\3',
            ])('negatives', v => {
                expect(validators.month(v)).toBeFalsy()
            })
        }) 

        describe('years', () => {
            test.each([
                '*', 1970, 2099,
                '1972,1973,1999,2033',
                '1972-2050',
                '1972-2050/3',
            ])('positives', v => {
                expect(validators.year(v)).toBeTruthy()
            })

            test.each([
                -1, 1969, 2100,
                '1972;1973,1999,2033',
                '1972+2050',
                '1972-2050\\/3',
            ])('negatives', v => {
                expect(validators.year(v)).toBeFalsy()
            })
        }) 

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
                expect(validators.dayOfMonth(v)).toBeTruthy()
            })

            test.each([
                '**', '!',
                'Lw', 'lW',
                'L+2', 'L+31',
                'L-0', 'L-32',
                '64W',
                -1, 32
            ])('negatives', v => {
                expect(validators.dayOfMonth(v)).toBeFalsy()
            })
        }) 

        describe('day of week', () => {
            test.each([
                '*', '?',
                '2L', '4#2',
                '1', '7',
                '1-5', '1-5/2',
                'SUN-TUE','SUN-TUE/2',
                'SUN', 'SAT'
            ])('positives', v => {
                expect(validators.dayOfWeek(v)).toBeTruthy()
            })

            test.each([
                '**', '!',
                '72L', '43#2',
                '-2L', '3#32',
                '0', '8',
                '0-8', '0-8/9',
                'SUN+TUE','SUN-TUE=2',
                'SAN', 'SUT'
            ])('negatives', v => {
                expect(validators.dayOfWeek(v)).toBeFalsy()
            })
        }) 
    })

    describe('fieldCorrelationValidators', () => {
        test.each([
            { dom: '?', dow: '*'},
            { dom: '*', dow: '?'},
            { dom: '?', dow: '?'},
        ])('positives', o => {
            fieldCorrelationValidators.forEach(
                ({validator}) => {
                    expect(validator(o)).toBeTruthy()
                }
            )
        })

        test.each([
            { dom: '3', dow: '4'},
            { dom: '*', dow: '*'},
        ])('negatives', o => {
            fieldCorrelationValidators.forEach(
                ({validator}) => {
                    expect(validator(o)).toBeFalsy()
                }
            )
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
        test.each([
            [' a, b c d e f g', 'a,bcdefg'],
            [' 45 c246u35w qc5yh    w45  ', '45c246u35wqc5yhw45'],
        ])('removeSpaces("%s")', (inp, expected) => {
            expect(removeSpaces(inp)).toBe(expected)
        })
    })

    describe('daysLabels2Numbers', () => {
        test.each([
            ['MON,SUN', '2,1'],
            ['MON,FRI,SAT', '2,6,7'],
            ['MON,FRU,SAT', '2,FRU,7'],
        ])(`daysLabels2Numbers("%s")`, (inp, expected) => {
            expect(daysLabels2Numbers(inp)).toBe(expected)
        })
    })
    describe('exp2elements', () => {

        test.each([
            ['0 0 0 * * ? *', {s:'0',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            ['*/10 0 0 * * ? *', {s:'*/10',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            ['*/10 0 0 * * ? *', {s:'*/10',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            
        ])('%s', (exp, expected) => {
            expect(exp2elements(exp)).toMatchObject(expected)
        })
    })
})



