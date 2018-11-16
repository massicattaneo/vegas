const Em = require('vegas-event-emitter');
const { Middleware } = require('vegas-utils');
const em = Em();
Middleware('emit', em);
let referenceId = 0;
let isCollecting = false;
let emitChanges = true;

function defineProps(store, key, target, globalKey) {
    Object.defineProperty(store, key, {
        get: function () {
            em.emit('get', { value: target[key], globalKey });
            return target[key];
        },
        set: function (newValue) {
            const diffs = target[key] !== newValue;
            target[key] = newValue;
            ((diffs || isCollecting) && emitChanges) && em.emit(globalKey.toString(), target[key]);
        },
        enumerable: true
    });
}

function getter(fn) {
    let ret = '';
    const rem = em.on('get', function (p) {
        ret = p;
        isCollecting = false;
    });
    fn();
    rem();
    return ret;
}

function Reactive() {
}

module.exports = function () {
    const reactive = {};
    reactive.create = function create(target) {
        const store = new Reactive();

        Object.keys(target).forEach(function (key) {
            let globalKey = referenceId.toString();
            const isFunction = target[key] instanceof Function;
            if (isFunction) {
                let get = getter(target[key]);
                globalKey = get.globalKey;
                target[key] = get.value;
                em.on(globalKey, value => target[key] = value, true);
            } else {
                referenceId++;
            }
            defineProps(store, key, target, globalKey);
            if (!isFunction && store[key] instanceof Array) {
                const oldPush = store[key].push;
                const oldSplice = store[key].splice;
                store[key].push = function () {
                    const ret = oldPush.apply(store[key], arguments);
                    em.emit(globalKey.toString(), store[key]);
                    return ret;
                };
                store[key].splice = function () {
                    const ret = oldSplice.apply(store[key], arguments);
                    em.emit(globalKey.toString(), store[key]);
                    return ret;
                };
            }
        });

        return store;
    };

    reactive.connect = function connect(store, callback) {
        const rx = (store instanceof Reactive) ? store : reactive.create(store);
        const remove = Object.keys(rx)
            .map(key => {
                isCollecting = true;
                const { globalKey } = getter(() => {
                    rx[key] = rx[key];
                });
                return em.on(globalKey, function (v) {
                    rx[key] = v;
                    return callback.call(em.context(), rx, key);
                });
            });
        callback(rx);
        return () => remove.forEach(r => r());
    };

    reactive.set = function set(store, key, value) {
        emitChanges = false;
        store[key] = value;
        const { globalKey } = getter(() => {
            store[key] = store[key];
        });
        emitChanges = true;
        return em.emit(globalKey, store[key]);
    };

    reactive.use = function (store, callback) {
        const rx = (store instanceof Reactive) ? store : reactive.create(store);
        const keys = Object.keys(store).map(function (key) {
            const { globalKey } = getter(() => {
                rx[key] = rx[key];
            });
            return [globalKey, key];
        });
        em.before(function (event, value, next) {
            const find = keys.find(([a, b]) => a === event);
            emitChanges = false;
            if (find) {
                callback.call(this, rx, () => {
                    next(event, store[find[1]]);
                });
            } else {
                next(event, value);
            }
            emitChanges = true;
        });
    };

    return reactive;
};
