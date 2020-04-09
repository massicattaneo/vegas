const wait = require('./wait');
const rx = require('./Reactive');
const Stack = require('./Stack');
/** Thread */
let pointer = 1;

function getFunction(statements, statement) {
    if (statement instanceof Function) {
        return statement;
    } else {
        return statements[statement];
    }
}

const string = `onmessage = function (oEvent) {
    const evaluatedFn = Function.prototype.constructor.apply(Function, oEvent.data.fn);
    evaluatedFn.apply(null, oEvent.data.param)
        .then(function (result) {
            postMessage({
                'id': oEvent.data.id,
                'message': result,
                'type': 'success'
            });
        })
        .catch(function (error) {
            postMessage({
                'id': oEvent.data.id,
                'message': error,
                'type': 'error'
            });
        });

}`;

const asyncEval = function worker() {

    const hashCode = `data:text/javascript;charset=US-ASCII,${encodeURIComponent(string)}`;
    const aListeners = [], oParser = new Worker(hashCode);

    oParser.onmessage = function (oEvent) {
        if (aListeners[oEvent.data.id]) {
            aListeners[oEvent.data.id][oEvent.data.type](oEvent.data.message);
        }
        delete aListeners[oEvent.data.id];
    };

    return function (fn, param, success, error) {
        aListeners.push({ success, error });
        const oneLine = fn.toString().replace(/\n/g, '');
        oParser.postMessage({
            'id': aListeners.length - 1,
            fn: oneLine.match(/function [^(]*\(([^)]*)\)/)[1].split(',')
                .concat(oneLine.match(/function [^(]*\([^)]*\) \{(.*)\}/)[1]),
            param
        });
    };

};

module.exports = function Thread(statements = {}, sharedContext = {}, {
    name = pointer++,
    numberOfWorkers = 1
} = {}) {
    const thread = {};
    const errors = [];
    const context = {
        shared: sharedContext,
        threadName: `THREAD ${name}`
    };
    const workers = Array.from({ length: numberOfWorkers }, (v, i) => asyncEval());
    let workerIndex = 0;

    function throwError(message) {
        errors.forEach(callback => callback.call(context, { message }));
    }

    thread.main = (statement, callback) => {
        const params = [].concat(callback.call(context));
        const stack = Stack(context);
        stack.exe(function (next) {
            getFunction(statements, statement).call(context, ...params)
                .then(next)
                .catch(throwError);
        });
        return function (callback) {
            stack.exe(callback);
        };
    };

    thread.worker = (statement, callback) => {
        const stack = Stack(context);
        stack.exe(function (next) {
            workers[workerIndex++ % numberOfWorkers](getFunction(statements, statement), [].concat(callback.call(context)), next, throwError);
        });
        return function (callback) {
            stack.exe(callback);
        };
    };

    thread.catch = function (callback) {
        errors.push(callback);
    };

    return thread;
};
