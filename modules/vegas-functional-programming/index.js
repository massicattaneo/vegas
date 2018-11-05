module.exports = function (FnObj = Function) {
    const proto = FnObj.prototype;

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
        return function (callback) {
            return self(function (...args) {
                if (filter.call(this, ...args))
                    return callback.call(this, ...args);
            });
        };
    };

    proto.map = function (map) {
        const self = this;
        return function (callback) {
            return self(function (...args) {
                return callback.call(this, map.call(this, ...args));
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

    proto.subscribe = function (callback) {
        return this(callback);
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

};
