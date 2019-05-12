const Stack = require('./Stack');
module.exports = function Middleware(fnName, obj = {}, autoProceedToAfter = false) {
    const before = [];
    const after = [];
    const context = {};
    const capitalizedName = `${fnName[0].toUpperCase()}${fnName.split('').splice(1).join('')}`;

    obj[`before${capitalizedName}`] = function (md) {
        before.push(md);
    };

    obj[`after${capitalizedName}`] = function (md) {
        after.push(md);
    };

    obj[`context${capitalizedName}`] = () => context;

    const callback = obj[fnName] || new Function();

    obj[fnName] = function (...args) {
        const stack = Stack(context);
        stack.add(next => next());
        before.forEach(fn => stack.add((next) => fn.call(context, ...args, next)));
        if (autoProceedToAfter) {
            stack.add(function (next) {
                callback.call(context, ...args);
                next();
            });
        } else {
            stack.add((next => callback.call(context, ...args, next)));
        }
        after.forEach(fn => stack.add((next) => fn.call(context, ...args, next)));
        stack.exe();
        return function (callback) {
            return stack.exe(callback);
        };
    };

    return obj;
};
