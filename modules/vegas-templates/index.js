function loopObjectOnString(...args) {
    const [prefix, action, scope, string] = args.length === 3 ? ['', args[0], args[1], args[2]] : args;
    return Object.keys(scope).reduce(function (s, key) {
        if (scope[key] instanceof Object)
            return loopObjectOnString(`${prefix ? `${prefix}.` : ''}${key}.`, action, scope[key], s);
        return action(s, prefix + key, scope[key], scope);
    }, string);
}

function handlebarVariable(string, key, value, formatters = {}) {
    const search = `{{${key}([^}]+)}}`;
    const match = string.match(new RegExp(search));
    if (match) {
        value = match[1].split(',').splice(1).reduce((val, i, index, arr) => {
            const [helper, param = ''] = i.trim().split(':');
            return formatters[helper] ? formatters[helper](val, param, (toChange) => index === 0 ? toChange : arr.slice(0, index)
                .map(i => (val) => {
                    return formatters[i.trim().split(':')[0]](val, i.trim().split(':')[1])
                }).map(c => c(toChange))) : val;
        }, value);
        return string.replace(new RegExp(search, 'g'), value);
    }
    return string.replace(new RegExp(`{{${key}}}`, 'g'), value);
}

function removeNewLine(string) {
    return string.replace(/\n/g, ' ');
}

function indexes(template, search) {
    const ret = [];
    const match = template.match(new RegExp(search, 'g'));
    if (!match) return ret;
    const repeat = match.length;
    for (let i = 0; i < repeat; i++) {
        ret.push(template.indexOf(search, (ret[i - 1] || -1) + 1));
    }
    return ret;
}

function replaceLoopsOnString(action, variables = {}, options, template) {
    const { startTag, endTag } = options;
    const [a, b] = startTag.split('*');
    const startIndexes = indexes(template, a.trim());
    const endIndexes = indexes(template, endTag);
    if (!startIndexes.length) return template;
    const loops = endIndexes.slice(0)
        .reduce(function (acc, item) {
            const starts = startIndexes.filter(start => start < item);
            const end = endIndexes.splice(0, starts.length).reduce((a, b) => b || a, 0) + endTag.length;
            return acc.concat(startIndexes.splice(0, starts.length).reduce(a => a, { start: starts[0] || 0, end }));
        }, [])
        .filter(i => i.start !== 0);
    const loopStrings = loops.map(i => {
        const match = template.substr(i.start).match(new RegExp(`${a.trim()}([^}]*)${b.trim()}`));
        const subTemplate = template.substr(i.start + match[0].length, i.end - i.start - match[0].length - endTag.length);
        return variables[match[1].trim().replace('this.', '')].map(i => {
            let ret = loopObjectOnString('this.', action, i, subTemplate);
            ret = loopObjectOnString(action, { this: i }, ret);
            return replaceLoopsOnString(action, i, options, ret);
        }).join('');

    });
    return `${template.substr(0, loops[0].start)}${loopStrings.join('')}${template.substr(loops[loops.length - 1].end)}`;
}

function handleBarEachOptions() {
    return { endTag: '{{/each}}', startTag: '{{#each *}}' };
}

module.exports = {
    loopObjectOnString,
    handlebarVariable,
    removeNewLine,
    replaceLoopsOnString,
    handleBarEachOptions
};
