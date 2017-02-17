import path from 'path';
import fs from 'fs';
import parseVars from './parseVars';

module.exports = class ScssVarsPlugin {
    constructor(opts) {
        this.opts = opts;
    }

    apply(compiler) {
        compiler.plugin('compile', () => {
            const {source, target} = this.opts;

            const sourceFiles = (typeof source === 'string') ? [source] : source;
            const sourcePaths = sourceFiles.map(s => path.join(compiler.options.context, s));
            const targetPath = path.join(compiler.options.context, target);

            const vars = sourcePaths.map(p => fs.readFileSync(p, {encoding: 'utf8'})).join('\n');
            const targetFile = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, {encoding: 'utf8'}) : null;
            const result = parseVars(vars);

            if (targetFile !== result) {
                fs.writeFileSync(targetPath, result);
            }
        });
    };
};
