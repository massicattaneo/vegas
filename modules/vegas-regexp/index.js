const xmlTags = /(<\/?[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)?\s*(?:\s+[a-z0-9-_]+=(?:(?:'[\s\S]*?')|(?:"[\s\S]*?")))*\s*\/?>)|([^<]|<(?![a-z\/]))*/gi;
const xmlAttributes = /\s[a-z0-9-_]+\b(\s*=\s*('|")[\s\S]*?\2)?/gi;
const xmlTagName = /^<([^\s-]*).*>$/;

module.exports = { xmlTags, xmlAttributes, xmlTagName };
