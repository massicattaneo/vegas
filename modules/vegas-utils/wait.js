const wait = {
    time: (time) => {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    },
    promise: (resolver) => {
        return new Promise(resolver)
    },
    timeoutPromise: (resolver, time) => {
        return new Promise(function (resolve, reject) {
            resolver(resolve);
            setTimeout(reject, time);
        })
    },
    event: (bus, eventName, timeout) => {
        return new Promise((resolve, reject) => {
            const remove = bus.on(eventName, (...args) => {
                remove();
                resolve(args);
            });
            if (timeout) setTimeout(() => {
                reject(remove());
            }, timeout);
        });
    },
    cssAnimation: () => {}
};

module.exports = wait;
