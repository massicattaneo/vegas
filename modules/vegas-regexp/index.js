const tagRegEx = /(<\/?[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)?\s*(?:\s+[a-z0-9-_]+=(?:(?:'[\s\S]*?')|(?:"[\s\S]*?")))*\s*\/?>)|([^<]|<(?![a-z\/]))*/gi;
const tagNameRegEx = /^<([^\s-]*).*>$/;
const attributesRegEx = /\s[a-z0-9-_]+\b(\s*=\s*('|")[\s\S]*?\2)?/gi;
const cssRegEx = /(\.[^{]*){([^}]*)}/gi;
const cssRuleNameRegEx = /^([^{]*){/;
const cssRuleValueRegEx = /^[^{]*{([^}]*)}/;

module.exports = {
    tagRegEx,
    tagNameRegEx,
    attributesRegEx,
    cssRegEx,
    cssRuleNameRegEx,
    cssRuleValueRegEx
};
