import { xmlToJson } from 'vegas-xml';

function xmlToLocales(localesXml) {
    const loc = xmlToJson(localesXml);
    const languages = loc.children.reduce(function (arr, item) {
        return arr.concat(item.children.map(o => o.name));
    }, []).filter((o, i, a) => a.indexOf(o) === i);
    return loc.children.reduce((acc, item) => {
        languages.forEach(function (language) {
            const find = item.children.find(o => o.name === language) || { content: '' };
            acc[language] = acc[language] || {};
            if (item.attributes.path) {
                acc[language][item.attributes.path] = acc[item.attributes.path] || {};
                acc[language][item.attributes.path][item.attributes.id] = find.content;
            } else {
                acc[language][item.attributes.id] = find.content;
            }
        });
        return acc;
    }, {});
}

module.exports = {
    xmlToLocales
};
