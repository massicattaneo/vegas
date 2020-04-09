module.exports = function (FnObj = {}) {
    const proto = FnObj.prototype || FnObj;

    proto.partial = function (...args1) {
        const self = this;
        return function (...args2) {
            return self(...args1, ...args2);
        };
    };

    proto.argumentsOrder = function (...args1) {
        const self = this;
        return function (...args2) {
            const params = args1.map(i => args2[i]);
            return self(...params);
        };
    };

    proto.filter = function (filter) {
        const self = this;
        let counter = 0;
        return function (callback) {
            return self(function (...args) {
                if (filter.call(this, ...args, counter++))
                    return callback.call(this, ...args);
            });
        };
    };

    proto.map = function (map) {
        const self = this;
        let counter = 0;
        return function (callback) {
            return self(function (...args) {
                return callback.call(this, map.call(this, ...args, counter++));
            });
        };
    };

    proto.spread = function () {
        const self = this;
        return function (callback) {
            return self(function (args) {
                return callback(...args);
            });
        };
    };

    proto.destructure = function (...args1) {
        const self = this;
        return function (callback) {
            return self(function (o) {
                return callback(...args1.map(key => o[key]));
            });
        };
    };

    proto.debounce = function (time) {
        const self = this;
        return function (callback) {
            let start = Date.now();
            let first = true;
            let to;
            return self(function (...args) {
                if (first) {
                    first = false;
                    start = Date.now();
                    return callback.call(this, ...args);
                } else {
                    if ((Date.now() - start) < time) {
                        clearTimeout(to);
                        to = setTimeout(() => callback.call(this, ...args), (Date.now() - start));
                    } else {
                        first = true;
                    }
                }
            });
        };
    };

    proto.queue = function () {
        const self = this;
        const queue = [];
        let queueIndex = 0;
        let isRunning = false;

        function run() {
            if (queue[queueIndex]) {
                queue[queueIndex++]().then(run);
                isRunning = true;
            } else if (isRunning) {
                isRunning = false;
            }
        }

        return function (callback) {
            return self(function (...args) {
                queue.push(() => callback(...args));
                !isRunning && run();
            });
        };
    };

    proto.compose = function (fn) {
        const self = this;
        return function (...args) {
            return fn(self(...args));
        };
    };

    proto.prepose = function (fn) {
        const self = this;
        return function (...args) {
            return self(fn(...args));
        };
    };

    proto.subscribe = function (callback = e => e) {
        return this(callback);
    };

    proto.promise = function () {
        const self = this;
        return new Promise(function (resolve) {
            self(resolve);
        });
    };

    proto.memoize = function (transform = e => e.toString()) {
        const self = this;
        const memory = [];
        return function (...args) {
            const memo = memory[transform(...args)];
            if (memo) return memo;
            const res = self(...args);
            memory[transform(...args)] = res;
            return res;
        };
    };

    FnObj.wrap = function (value) {
        return function (callback) {
            return callback(value);
        };
    };

    FnObj.identity = function () {
        return function (value) {
            return value;
        };
    };

    return proto;

};
