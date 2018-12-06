function extendObject(target, extend) {
    for (const key in extend) {
        if (extend.hasOwnProperty(key)) {
            target[key] = extend[key];
        }
    }
    return target;
}

function Stack(context = {}) {
    const obj = {};
    const stack = [];
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

function Middleware(fnName, obj = {}, autoProceedToAfter = true) {
    const before = [];
    const after = [];
    const context = {};

    obj.before = function (md) {
        before.push(md);
    };

    obj.after = function (md) {
        after.push(md);
    };

    obj.context = () => context;

    const callback = obj[fnName] || new Function();

    obj[fnName] = function (...args) {
        const stack = Stack(context);
        stack.add(next => next(...args));
        before.forEach(stack.add);
        if (autoProceedToAfter) {
            stack.add(function (...args) {
                callback.call(context, ...args);
                args[args.length - 1]();
            });
        } else {
            stack.add(callback);
        }
        after.forEach(stack.add);
        stack.exe();
        return function (callback) {
            return stack.exe(callback);
        };
    };

    obj.run = function (...args) {
        const callback = args[args.length - 1];
        const arg = args.splice(0, args.length - 1);
        const stack = Stack(context);
        stack.add(next => next(...arg));
        before.forEach(stack.add);
        stack.add(function (...args) {
            callback.call(context, ...args);
        });
        stack.exe();
        return function (callback) {
            return stack.exe(callback);
        };
    };

    return obj;
}

module.exports = {
    extendObject, Stack, Middleware
};
