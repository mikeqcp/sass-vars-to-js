# Webpack scss-vars-to-js plugin


## How it works

It parses *.scss files with variable definitions to JS module and allows you to use it from JS code.

## Usage

```javascript
const ScssVarsPlugin = require('scss-vars-to-js-webpack-plugin');

const webpackConfig = {
    //...
    plugins: [
        //...
        new ScssVarsPlugin({
            source: 'src/styles/vars.scss',
            target: 'src/scripts/vars.js'
        })
    ]
};
```

Plugin is capable of parsing file with simply structured varialbes in SCSS format.
It also supports basic operators on primitive values like +, -, *, /.

```scss
$variable-name: variableValue;

//i.e.
$color-black: black;
$color-other: #fafafa;

$size-x: 12px;
$some-value: 10;
$other-value: $some-value + 1;
```

The SCSS file source above would be parsed to JS file as:

```javascript

export const variableName = 'variableValue';
export const colorBlack = 'black';
export const colorOther = '#fafafa';
export const sizeX = '12px';
export const someValue = 10;
export const otherValue = someValue + 1;
```

## Options
- source: source files to be parsed - it can be string or array of multiple path strings
- target: generated *.js file will be saved here

Additionally each line can be annotated with a comment in the following way:

```scss
$size-x: 12px; //skip-js-export
```

Available comments are: 
- //skip-js-export: Skips this line while parsing
- //js-raw: Force export as a string (it won't be treated as variables)
- //js-evaluate: Force evaluation as variables 
