module.exports = function Stack(context = {}) {
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
};
