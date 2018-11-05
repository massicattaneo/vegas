function extendObject(target, extend) {
    for (const key in extend) {
        if (extend.hasOwnProperty(key)) {
            target[key] = extend[key];
        }
    }
    return target;
}

function Stack() {
    const obj = {};
    const stack = [];
    const context = {};
    let index = -1;
    let isRunning = false;

    function exe(...args) {
        if (stack[index + 1]) {
            isRunning = true;
            return stack[++index].call(context, ...args, exe);
        }
        isRunning = false;
    }

    obj.add = function (fn) {
        fn && stack.push(fn);
        return obj;
    };
    obj.exe = function (fn) {
        obj.add(fn);
        if (!isRunning) exe();
        return obj;
    };
    obj.reset = function () {
        stack.length = 0;
        index = -1;
        isRunning = false;
        return obj;
    };
    obj.context = function () {
        return context;
    };
    return obj;
}

function Middleware(fnName, obj = {}) {
    const before = [];
    const after = [];

    obj.before = function (callback) {
        before.push(callback);
    };

    obj.after = function (callback) {
        after.push(callback);
    };

    const callback = obj[fnName] || new Function();

    obj[fnName] = function (...args) {
        const stack = Stack();
        stack.add(next => next(...args));
        before.forEach(stack.add);
        stack.add(callback);
        after.forEach(stack.add);
        stack.exe();
        return function (callback) {
            stack.exe(callback);
        }
    };
    return obj;
}

module.exports = {
    extendObject, Stack, Middleware
};
