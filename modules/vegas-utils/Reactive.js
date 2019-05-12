const Em = require('./EventEmitter');
const Middleware = require('./Middleware');

function Reactive(entryValue) {
    const _emitter = Em();
    Middleware('emit', _emitter, true);
    let value = entryValue;

    function set(newValue) {
        value = newValue;
        return _emitter.emit('set', value);
    }

    function update(newValue) {
        value = newValue;
    }

    function get() {
        _emitter.emit('get', value);
        return value;
    }

    function valueOf() {
        return get();
    }

    function toString() {
        return get().toString();
    }

    return {
        set, get, _emitter, valueOf, toString, update
    };
}

function create(target) {
    if (target instanceof Object) return Object.keys(target).reduce((o, i) => Object.assign(o, { [i]: Reactive(target[i]) }), {});
    return Reactive(target);
}

function connect(store, callback) {
    let first = [];
    const removers = Object
        .keys(store)
        .map(key => {
            store[key]._emitter.beforeEmit(function (key, value, next) {
                if (key === 'first') {
                    first.push(key);
                    if (first.length === Object.keys(store).length)
                        callback(store);
                    value();
                } else {
                    next();
                }

            });
            return store[key]._emitter.on('set', () => callback(store));
        });
    Object.values(store).forEach(s => s._emitter.emit('first'));
    return () => removers.forEach(r => r());
}

function use(store, callback) {
    Object
        .keys(store)
        .forEach(key => store[key]._emitter.beforeEmit((key, value, next) => {
            if (key === 'first') callback(store, value);
            if (key === 'set') callback(store, next);
        }));
}

module.exports = {
    create,
    connect,
    use
};
