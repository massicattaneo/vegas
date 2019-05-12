export default function load(resource) {

    function simpleObjectExtend(target, extend) {
        for (const key in extend) {
            if (extend.hasOwnProperty(key)) {
                target[key] = extend[key];
            }
        }
        return target;
    }

    /**
     * Load a http resource
     * @param {object} resource Http resource to load
     * @return {Promise} Promise resolved/rejected after load/error of the resource
     */
    function loadHttp(resource) {
        const request = new XMLHttpRequest();
        request.open('GET', resource.url);
        const start = Date.now();

        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {
                if (request.status === 200 && request.readyState === 4) {
                    resolve({
                        stats: { start, end: Date.now() },
                        resource: simpleObjectExtend({ data: request.responseText }, resource)
                    });
                } else if (request.status !== 200 && request.readyState === 4) {
                    reject({ message: `HTTP REQUEST STATUS ${request.status}`, resource });
                }
            };
            request.send();
        });
    }

    /** Load a HTML Image resource
     * @param {object} resource Image resource to load
     * @return {Promise} Promise resolved/rejected after load/error of the resource
     * */
    function loadImage(resource) {
        const image = new Image();
        const start = Date.now();
        return new Promise(function (resolve, reject) {
            image.onload = function () {
                resolve({
                    stats: { start, end: Date.now() },
                    resource: simpleObjectExtend({ data: image }, resource)
                });
            };
            image.onerror = function () {
                reject({ message: 'ERROR LOADING IMAGE', resource });
            };
            image.crossOrigin = 'anonymous';
            image.src = resource.url;
        });
    }

    function generate(loaderfFn, { maxRetry = 5, retryTimeout = 1000 } = {}) {
        return function retry(resource) {
            return new Promise(function (resolve, reject) {
                (function req(counter, res) {
                    loaderfFn(res)
                        .then(resolve)
                        .catch((e) => {
                            if (res.fallBackUrl) {
                                const fallback = simpleObjectExtend({}, res);
                                fallback.url = res.fallBackUrl;
                                delete fallback.fallBackUrl;
                                req(counter, fallback);
                            } else if (counter <= maxRetry) {
                                setTimeout(function () {
                                    req(counter + 1, res);
                                }, retryTimeout);
                            } else {
                                reject(e);
                            }
                        });
                }(1, resource));
            });
        }
    }

    const loader = resource.type === 'image' ? loadImage : loadHttp;
    const retrier = generate(loader);
    return retrier(resource);
}
