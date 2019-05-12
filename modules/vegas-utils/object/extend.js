module.exports = function extend(target, extend) {
    for (const key in extend) {
        if (extend.hasOwnProperty(key)) {
            target[key] = extend[key];
        }
    }
    return target;
}

