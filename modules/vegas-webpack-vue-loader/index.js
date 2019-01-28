const vueParser = require('./vue-parser');
const fs = require('fs');
const path = require('path');

function escape(string) {
    return string.replace(/'/g, '\\\'');
}

function parseStyle(componentStyle, relativePath) {
    let imports = componentStyle.match(/@import "([^;]*)"[^;]*;/);
    while (imports) {
        const scssPath = path.resolve(relativePath, `${imports[1]}.scss`);
        this.addDependency(scssPath);
        const imp = fs.readFileSync(scssPath, 'utf8');
        componentStyle = componentStyle.replace(imports[0], imp.replace(/\n/g, ''));
        imports = componentStyle.match(/@import "([^;]*)"[^;]*;/);
    }
    const lineVars = componentStyle.match(/\$[^:{}]*: [^;{}]*;/g) || [];
    componentStyle = lineVars.reduce(function (string, line) {
        return string.replace(line, '');
    }, componentStyle);
    const vars = lineVars.reduce(function (acc, line) {
        const [a, b] = line.match(/\$(.*):(.*);/).splice(1, 2).map(i => i.trim());
        acc[a] = b;
        return acc;
    }, {});
    componentStyle = (componentStyle.match(/\$[^;]*/g) || []).reduce(function (string, itemName) {
        return string.replace(new RegExp(itemName.replace('$', '\\$'), 'g'), vars[itemName.replace('$', '')]);
    }, componentStyle);
    return componentStyle;
}

async function webpackVueLoader(source) {
    const [dirname, relativePath] = this.currentRequest.split('!');
    const callback = this.async();
    const parsed = vueParser(source);
    const style = escape(parseStyle.call(this, parsed.style.replace(/\n/g, ''), path.dirname(relativePath)));
    return callback(null, `${parsed.script}\nexport const template = '${escape(parsed.template.replace(/\n/g, ''))}';\nexport const style = '${style}'`);
}

webpackVueLoader.vueParser = vueParser;

module.exports = webpackVueLoader;
