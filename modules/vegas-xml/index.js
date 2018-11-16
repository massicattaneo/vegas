import {
    tagRegEx,
    tagNameRegEx,
    attributesRegEx,
    cssRegEx,
    cssRuleNameRegEx,
    cssRuleValueRegEx
} from '../vegas-regexp';

function createChild(name, parent) {
    const ret = {
        name,
        children: [],
        attributes: {},
        parent,
        content: '',
        autoClosing: false
    };
    return ret;
}

function convertValue(value) {
    const ret = value.toString()
        .replace(/"/g, '')
        .replace(/'/g, '')
        .trim();
    if (value.startsWith('url(#')) return '';
    if (value.indexOf('px') !== -1) {
        return `${Number(ret.replace('px', ''))}px`;
    }
    return isNaN(ret) ? ret : (Number(ret));
}

function parseXml(svgString) {
    const target = createChild('root');
    let ref = target;
    svgString.replace(/\n/g, '')
        .replace(/\s\s/g, '')
        .match(tagRegEx)
        .forEach(function (line) {
            if (!line.match(/^<\//) && line.match(/^</)) {
                const item = createChild(line.match(tagNameRegEx)[1].replace('/', ''), ref);
                item.autoClosing = line.endsWith('/>');
                const attr = line.match(attributesRegEx);
                if (attr) {
                    attr.forEach(function (a) {
                        const [name, value = ''] = a.split('=');
                        item.attributes[name.trim()] = convertValue(value);
                    });
                }
                ref.children.push(item);
                if (line.indexOf('/>') === -1) {
                    ref = item;
                }
            } else if (line.match(/^<\//)) {
                ref = ref.parent || target;
            } else {
                ref.content += line.trim();
            }
        });
    return target.children[0];
}

module.exports = {
    parseXml
};
