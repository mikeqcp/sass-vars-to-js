import assert from 'assert';
import parseVars from '../src/parseVars';

function validateLineParsing({input, expected}) {
    return assert.equal(parseVars(input), expected);
}

function validateValueParsing({input, expected}) {
    validateLineParsing({
        input: `$name: ${input};`,
        expected: `export const name = ${expected};`
    })
}

describe('parseVars', function() {
    it('should export parsed value as const', () => {
        return validateLineParsing({
            input: '$name: value;',
            expected: `export const name = 'value';`
        });
    });

    it('should parse basic variable into string', () => {
        return validateValueParsing({
            input: 'blue',
            expected: `'blue'`
        });
    });

    it('should parse number variable into number', () => {
        return validateValueParsing({
            input: '10',
            expected: `10`
        });
    });

    it('should parse pixel variable into string', () => {
        return validateValueParsing({
            input: '10px',
            expected: `'10px'`
        });
    });

    it('should parse math with variable into expression', () => {
        return validateValueParsing({
            input: '$otherVal + 1',
            expected: `otherVal + 1`
        });
    });

    it('should change varaible name to camelCase', () => {
        return validateLineParsing({
            input: '$font-color: red;',
            expected: `export const fontColor = 'red';`
        });
    });

    it('should change expression variable names to camelCase', () => {
        return validateLineParsing({
            input: '$val: $old-val + $new-val;',
            expected: `export const val = oldVal + newVal;`
        });
    });

    it('should skip line with //skip-js-export otion', () => {
        return validateLineParsing({
            input: '$val: 1; //skip-js-export',
            expected: ``
        });
    });

    it('should evaluate expression if //js-evaluate option is used', () => {
        return validateLineParsing({
            input: '$val: 12px; //js-evaluate',
            expected: `export const val = 12px;`
        });
    });

    it('shouldn\'t evaluate expression if //js-raw option is used', () => {
        return validateLineParsing({
            input: '$val: 12; //js-raw',
            expected: `export const val = '12';`
        });
    });
});
