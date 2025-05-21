const {
        defaults,
        yearNow,
        removeSpaces,
        daysLabels2Numbers,
        exp2elements
    }  = require('../dist/utils.js');

describe('utils', () => {

    describe('defaults', () => {
        it('have the expected values', () => {
            expect(defaults.s).toBe('0');
            expect(defaults.i).toBe('0');
            expect(defaults.h).toBe('0');
            expect(defaults.dom).toBe('*');
            expect(defaults.m).toBe('*');
            expect(defaults.dow).toBe('?');
            expect(defaults.y).toBe('*');
        });
    });

    describe('yearNow', () => {
        it('return the expected', () => {
            expect(yearNow).toBe((new Date).getFullYear());
        });
    });

    describe('removeSpaces', () => {
        test.each([
            [' a, b c d e f g', 'a,bcdefg'],
            [' 45 c246u35w qc5yh    w45  ', '45c246u35wqc5yhw45'],
        ])('removeSpaces("%s")', (inp, expected) => {
            expect(removeSpaces(inp)).toBe(expected);
        });
    });

    describe('daysLabels2Numbers', () => {
        test.each([
            ['MON,SUN', '2,1'],
            ['MON,FRI,SAT', '2,6,7'],
            ['MON,FRU,SAT', '2,FRU,7'],
        ])(`daysLabels2Numbers("%s")`, (inp, expected) => {
            expect(daysLabels2Numbers(inp)).toBe(expected);
        });
    });
    describe('exp2elements', () => {

        test.each([
            ['0 0 0 * * ? *', {s:'0',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            ['*/10 0 0 * * ? *', {s:'*/10',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            ['*/10 0 0 * * ? *', {s:'*/10',i:'0',h:'0',dom:'*',m:'*',dow:'?',y:'*'}],
            
        ])('%s', (exp, expected) => {
            expect(exp2elements(exp)).toMatchObject(expected);
        });
    });
});



