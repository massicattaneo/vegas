import { xmlToJson } from '../vegas-xml';
import { tagRegEx } from '../vegas-regexp';

function loopObjectOnString(...args) {
    const [prefix, action, scope, string] = args.length === 3 ? ['', args[0], args[1], args[2]] : args;
    return Object.keys(scope).reduce(function (s, key) {
        if (scope[key] instanceof Object)
            return loopObjectOnString(`${prefix ? `${prefix}.` : ''}${key}.`, action, scope[key], s);
        return action(s, prefix + key, scope[key], scope);
    }, string);
}

function replaceVariable(formatters = {}, options = {}, string, key, value) {
    const { tagMatch } = options;
    const [a, b] = tagMatch.split('*');
    const search = `${a}${key}([^${b[b.length - 1]}]+)${b}`;
    const match = string.match(new RegExp(search));
    if (match) {
        value = match[1].split(',').splice(1).reduce((val, i, index, arr) => {
            const [helper, param = ''] = i.trim().split(':');
            return formatters[helper] ? formatters[helper](val, param, (toChange) => index === 0 ? toChange : arr.slice(0, index)
                .map(i => (val) => {
                    return formatters[i.trim().split(':')[0]](val, i.trim().split(':')[1]);
                }).map(c => c(toChange))) : val;
        }, value);
        return string.replace(new RegExp(search, 'g'), value);
    }
    return string.replace(new RegExp(`${a}${key}${b}`, 'g'), value);
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
        ret.push(template.indexOf(search.replace(/\\/g, ''), (ret[i - 1] || -1) + 1));
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
    return loops.reduce((result, i, index, array) => {
        const match = result.substr(i.start).match(new RegExp(`${a.trim()}([^${b[b.length - 1]}]*)${b.trim()}`));
        const subTemplate = result.substr(i.start + match[0].length, i.end - i.start - match[0].length - endTag.length);
        const t = variables[match[1].trim().replace('this.', '')].map(i => {
            let ret = loopObjectOnString('this.', action, i, subTemplate);
            ret = loopObjectOnString(action, { this: i }, ret);
            return replaceLoopsOnString(action, i, options, ret);
        }).join('');
        array.slice(index + 1).forEach(d => {
            d.start += (t.length - subTemplate.length - match[0].length - endTag.length);
            d.end += (t.length - subTemplate.length - match[0].length - endTag.length);
        });
        return `${result.substr(0, i.start)}${t}${result.substr(i.end)}`;
    }, template);
}

function evaluator(variables, toEval) {
    'use strict';
    const str = Object.keys(variables).reduce(function (acc, key) {
        return `var ${key} = '${variables[key]}'; ${acc};`;
    }, toEval);
    return eval(str);
}

function conditionBlock(match, template, variables) {
    const [ifTemplate, toEval, innerHtml] = match;
    return template.replace(ifTemplate, evaluator(variables, toEval) ? innerHtml : '');
}

function replaceBlocks(action, variables = {}, options, template) {
    const { startTag, endTag } = options;
    const [a, b] = startTag.split('*');
    const regExp = new RegExp(`${a}([^${b[0]}]*)${b}(.*)${endTag}`);
    let match = template.match(regExp);
    while (match) {
        template = action(match, template, variables);
        match = template.match(regExp);
    }
    return template;
}

function handlebarBlock(tag = '') {
    return { endTag: `{{/${tag}}}`, startTag: `{{#${tag} *}}`, tagMatch: '{{*}}' };
}

function localesBlock(tag = '') {
    return { endTag: `[[/${tag}]]`, startTag: `[[#${tag} *]]`, tagMatch: '\\[\\[*\\]\\]' };
}

function componentBlock(tag = '') {
    return { endTag: `\\(\\(/${tag}\\)\\)`, startTag: `\\(\\(#${tag} *\\)\\)`, tagMatch: '\\(\\(*\\)\\)' };
}

function handlebarBuilder(htmlTemplate, variables = {}, parsers = {}) {
    return Function
        .identity()
        .compose(removeNewLine)
        .compose(replaceBlocks.partial(conditionBlock, variables, handlebarBlock('if')))
        .compose(loopObjectOnString.partial(replaceVariable.partial(parsers, handlebarBlock()), variables))
        .compose(replaceLoopsOnString.partial(replaceVariable.partial(parsers, handlebarBlock()), variables, handlebarBlock('each')))
        .subscribe(htmlTemplate);
}

function localesBuilder(htmlTemplate, variables = {}, parsers = {}) {
    return Function
        .identity()
        .compose(removeNewLine)
        .compose(loopObjectOnString.partial(replaceVariable.partial(parsers, localesBlock()), variables))
        .subscribe(htmlTemplate);
}

function componentBuilder(htmlTemplate, variables = {}, parsers = {}) {
    return Function
        .identity()
        .compose(removeNewLine)
        .compose(loopObjectOnString.partial(replaceVariable.partial(parsers, componentBlock()), variables))
        .compose(replaceBlocks.partial(conditionBlock, variables, handlebarBlock('if')))
        .compose(loopObjectOnString.partial(replaceVariable.partial(parsers, handlebarBlock()), variables))
        .compose(replaceLoopsOnString.partial(replaceVariable.partial(parsers, handlebarBlock()), variables, handlebarBlock('each')))
        .subscribe(htmlTemplate);
}

function toVariables(json) {
    return json.children.reduce(function (acc, item) {
        if (!acc[item.name])
            acc[item.name] = item.content;
        else if (acc[item.name] instanceof Array)
            acc[item.name].push(item.content);
        else
            acc[item.name] = [acc[item.name], item.content];
        return acc;
    }, {});
}

function componentsHandler(html, components, parsers) {
    let classIndex = -1;
    let style = '';
    Object.keys(components).forEach(function (componentName) {
        let componentTpl = components[componentName].template;
        let componentStyle = components[componentName].style;
        const className = `v_${++classIndex}`;
        const cmpTags = componentTpl.match(tagRegEx).map(i => i.trim()).filter(i => i);
        const [cmpTag] = cmpTags;
        (html.match(new RegExp(`<${componentName}[^>]*>`, 'g')) || []).forEach(function () {
            const start = html.match(new RegExp(`<${componentName}[^>]*>`));
            const end = html.match(new RegExp(`<\\/${componentName}>`));
            const endTagLength = `</${componentName}>`.length;
            const toReplace = html.substr(start.index, end.index - start.index + endTagLength);
            const props = toVariables(xmlToJson(html.substr(start.index + start[0].length, end.index - start.index - start[0].length), true));
            const matchClass = cmpTag.match(/class="([^"]*)"/);
            if (matchClass) {
                componentTpl = componentTpl.replace(cmpTag,
                    `${cmpTag.substr(0, cmpTag.length - 1).replace(matchClass[0], '')} 
                    ${matchClass[0].substr(0, matchClass[0].length - 1)} ${className}" data-component="${componentName}"
                    data-props='${JSON.stringify(props)}'>`);
            } else {
                componentTpl = componentTpl.replace(cmpTag, `${cmpTag.substr(0, cmpTag.length - 1)} class="${className}" data-component="${componentName}">`);
            }
            const cmpBuild = componentBuilder(componentTpl, props, parsers);
            html = html.replace(toReplace, cmpBuild);
        });
        style += componentStyle.replace(/\.&/g, `.${className}`);
    });
    return { html, style };
}

module.exports = {
    handlebarBuilder,
    localesBuilder,
    componentBuilder,
    componentsHandler
};
