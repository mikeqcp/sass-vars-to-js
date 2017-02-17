import camelCase from 'to-camel-case';

const LINE_OPTS = {
    Evaluate: 'js-evaluate',
    Raw: 'js-raw',
    Skip: 'skip-js-export'
};

function checkOption(line, option) {
    return line.indexOf(`//${option}`) > -1;
}

function isExpression(value) {
    const isNumber = /^-?((\d+)|(\d?\.\d+))$/.test(value);
    const isMathExpr = /.+\s*[\+\-\\\*]\s*.+/.test(value);
    const isVariable = /\$/i.test(value);

    return isNumber || isMathExpr || isVariable;
}

function isLineValid(line) {
    return /^\$.+:\s*.+;(\s+\/\/.*)?$/gi.test(line) && !checkOption(line, LINE_OPTS.Skip);
}

function evaluate(value) {
    const parts = value.split(/\s/).map(p => {
        return p[0] === '$' ? camelCase(p.slice(1)) : p;
    });
    return parts.join(' ');
}

function parseLine(line) {
    const [ , name, value] = /^\$(.+):\s*(.+);/gi.exec(line);

    const shouldEvaluate = !checkOption(line, LINE_OPTS.Raw) &&
        (checkOption(line, LINE_OPTS.Evaluate) || isExpression(value));
    const valueExpr = shouldEvaluate ? evaluate(value) : `'${value}'`;

    return `export const ${camelCase(name)} = ${valueExpr};`;
}

export default function parse(vars) {
    const lines = vars.split('\n').filter(isLineValid);
    return lines.map(parseLine).join('\n');
}
