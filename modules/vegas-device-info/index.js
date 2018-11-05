import EventEmitter from 'vegas-event-emitter';
import { extendObject } from 'vegas-utils';

function calculateBrowserVersion(fullVersion, subVersion) {
    subVersion = subVersion || false;
    var integer = fullVersion ? fullVersion.split('.') : ['0'];
    return subVersion ? integer[0] + '.' + integer[1] : integer[0];
}

function getBrowserInfo(ua) {
    if (ua.match(/(OPR)[^\d]\d*.\d*/)) {
        return ['', 'opera', ua.match(/OPR[^\d](\d*.\d*)/)[1]];
    } else if (ua.match(/Edge\//)) {
        return ['', 'edge', -1];
    } else if (ua.match(/(MQQBrowser)\/(\d*\.\d*)/i)) {
        return ['', 'QQBrowser', ua.match(/MQQBrowser\/(\d*\.\d*)/i)[1]];
    } else if (ua.match(/(ucbrowser(?=\/))\/?\s*([\d\.]+)/i)) {
        const newVar = ['', '', ''];
        if ((/U3\//.test(ua) || /U2\//.test(ua)) && /iPhone|iPad/i.test(ua)) {
            newVar[1] = 'UCHD';
        } else {
            newVar[1] = 'UC';
        }
        var version = ua.match(/(?:ucbrowser\/)([\d\.]+)/i);
        newVar[2] = calculateBrowserVersion(version[1], 1);
        return newVar;
    }
    else if (ua.match(/(Chrome)\/(\d*\.\d*)/)) {
        if (/SamsungBrowser\/(\d*\.\d*)/.test(ua)) {
            return ['', 'embedded', ua.match(/SamsungBrowser\/(\d*\.\d*)/)[1]];
        }
        if (/Version\/(\d*\.\d*)/.test(ua)) {
            return ['', 'embedded', ua.match(/Version\/(\d*\.\d*)/)[1]];
        }
        return (ua.match(/(Chrome)\/(\d*\.\d*)/));
    }
    else if (ua.match(/(Firefox)\/(\d*\.\d*)/)) {
        return (ua.match(/(Firefox)\/(\d*\.\d*)/));
    }
    else if (ua.match(/(CriOS)\/(\d*\.\d*)/)) {
        let myNewVar = (ua.match(/(CriOS)\/(\d*\.\d*)/));
        myNewVar[1] = 'chrome';
        return myNewVar;
    }
    else if (ua.match(/(Safari)\/(\d*\.\d*)/)) {
        let myNewVar = (ua.match(/(Version)\/(\d*\.\d*)/));
        myNewVar[1] = 'Safari';
        return myNewVar;
    } else if (ua.match(/Trident\/(\d)/)) {
        var match = Number(ua.match(/Trident\/(\d)/)[1]) + 4;
        return ['', 'IE', match.toString()];
    }
    return ['', 'unknown', 'unknown'];
}

function getOsInfo(ua) {
    var ret = ['unknown', -1];
    if (ua.match(/WOW64/)) {
        ret[0] = 'windows';
        if (ua.match(/Windows NT 6/)) {
            ret[1] = 7;
        }
    } else if (ua.match(/Win64/)) {
        ret[0] = 'windows';
        if (ua.match(/Windows NT 10/)) {
            ret[1] = 10;
        }
    } else if (ua.indexOf('Android ') > 0) {
        ret[0] = 'Android';
        ret[1] = ua.substr(ua.indexOf('Android ') + 8, 3);
    } else if (/iPhone|iPad/i.test(ua)) {
        ret[0] = 'iOS';
        ret[1] = ua.match(/OS (\d*[^\d]\d*)/)[1].replace('_', '.');
    } else if (ua.match(/Macintosh/)) {
        ret[0] = 'OSX';
        ret[1] = ua.match(/Mac OS X (\d*[^\d]\d*)/)[1].replace('_', '.');
    } else if (ua.match(/Linux/)) {
        ret = ['Linux', -1];
    }
    return ret;
}

function getDeviceType(ua) {
    if (!/(Mobi|iPad|Tablet|Android)/i.test(ua) && (/Linux/.test(ua) || /Windows/.test(ua) || /Macintosh/.test(ua))) {
        return 'desktop';
    } else if (ua.indexOf('Android ') > 0) {
        return (/Mobile/i.test(ua)) ? 'mobile' : 'tablet';
    } else if (/iPhone|iPad/i.test(ua)) {
        return (/iPhone/i.test(ua)) ? 'mobile' : 'tablet';
    } else if (/Tablet/i.test(ua)) {
        return 'tablet';
    }
    return 'unknown';
}

function getWindowInfo() {
    if (!window) return { width: 0, height: 0 };
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight)
    };
}

export default function ({ ua, assetsQuality }, errorHandler = e => e) {
    const em = EventEmitter();
    const designModes = [];
    const obj = {};

    const privateInfo = {
        deviceType: 'unknown',
        os: 'unknown',
        osVersion: -1,
        browserName: 'unknown',
        browserVersion: -1,
        width: getWindowInfo().width,
        height: getWindowInfo().height,
        designMode: ''
    };
    try {
        const osInfo = getOsInfo(ua);
        const browserInfo = getBrowserInfo(ua);
        privateInfo.deviceType = getDeviceType(ua);
        privateInfo.os = osInfo[0].toLowerCase();
        privateInfo.osVersion = Number(osInfo[1]);
        privateInfo.browserName = browserInfo[1].toLowerCase();
        privateInfo.browserVersion = (isNaN(browserInfo[2]) ? -1 : Number(browserInfo[2]));
    } catch (error) {
        errorHandler({ type: 'DEVICE INFO SETUP', subType: error, description: ua });
    }

    function testUserAgent(deviceName) {
        return RegExp(deviceName).test(ua);
    }

    function getIExtendedInfo() {
        const opts = { testUserAgent };
        extendObject(opts, privateInfo);
        return opts;
    }

    function updateMode() {
        const result = designModes.filter(item => item.fn(getIExtendedInfo()));
        privateInfo.designMode = result.length ? result[0].name : '';
    }

    function resize() {
        extendObject(privateInfo, getWindowInfo());
        updateMode();
        em.emit('resize', privateInfo);
    }

    obj.setDesignMode = function (name, fn) {
        designModes.unshift({ name, fn });
        updateMode();
    };

    obj.info = function () {
        return privateInfo;
    };

    obj.testUserAgent = function (regEx) {
        return testUserAgent(regEx);
    };

    obj.onResize = function (callback) {
        callback(privateInfo);
        return em.on('resize', callback);
    };

    obj.extend = function (property, value, callback = e => true) {
        if (callback(getIExtendedInfo())) {
            privateInfo[property] = value;
        }
    };

    if (window)
        window.addEventListener('resize', resize, false);

    return obj;
}
