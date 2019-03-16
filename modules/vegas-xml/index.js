const {
    tagRegEx,
    tagNameRegEx,
    attributesRegEx,
    cssRegEx,
    cssRuleNameRegEx,
    cssRuleValueRegEx
} = require('../vegas-regexp');

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
        // .replace(/'/g, '')
        .trim();
    if (value.indexOf('px') !== -1) {
        return `${Number(ret.replace('px', ''))}px`;
    }
    return isNaN(ret) ? ret : (Number(ret));
}

function xmlToJson(svgString, root = false) {
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
    return root ? target : target.children[0];
}

function jsonToXml(json) {
    return `<${json.name} ${Object.keys(json.attributes).map(n => `${n}="${json.attributes[n]}"`).join(' ')}>${json.content}${json.children.map(jsonToXml).join('')}</${json.name}>`;
}

module.exports = {
    xmlToJson,
    jsonToXml
};
