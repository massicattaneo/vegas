import DeviceInfo from './index';
import useAgentStrings from './userAgentStrings';

describe('DEVICE INFO', function () {
    const checkDevice = function (dm, c) {
        expect(dm.deviceType).toEqual(c.deviceType);
        expect(dm.os).toEqual(c.os);
        expect(dm.osVersion).toEqual(Number(c.osVersion));
        expect(dm.browserName).toEqual(c.browserName);
        expect(dm.browserVersion).toEqual(Number(c.browserVersion));
    };

    describe('On using the class', function () {

        it('should have the possibility to testUserAgent', function () {
            const device = DeviceInfo({ ua: useAgentStrings.windows7.Chrome });
            expect(device.testUserAgent(/Windows/)).toEqual(true);
        });
    });

    describe('On getting the device info', function () {
        describe('On having an unknown device', function () {
            it('should get the information of unknown browser/device', function () {
                const device = DeviceInfo({ ua: '' });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'unknown',
                    os: 'unknown',
                    osVersion: -1,
                    browserName: 'unknown',
                    browserVersion: -1
                });
            });
        });

        describe('On having a Window10 machine', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows10.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: 10,
                    browserName: 'chrome',
                    browserVersion: '60.0'
                });
            });

            it('should get the information of edge browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows10.Edge });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: 10,
                    browserName: 'edge',
                    browserVersion: -1
                });
            });

            xit('should get the information of ie11 browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.IE11 });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '11'
                });
            });

        });

        describe('On having a Window7 machine', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of firefox browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.Firefox });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'firefox',
                    browserVersion: '45.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'safari',
                    browserVersion: '5.1'
                });
            });

            it('should get the information of ie11 browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.IE11 });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '11'
                });
            });

            it('should get the information of ie10 browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.IE10 });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '10'
                });
            });

            it('should get the information of ie9 browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.IE9 });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '9'
                });
            });

            it('should get the information of ie8 browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.windows7.IE8 });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '8'
                });
            });
        });

        describe('On having a Mac OSX 10 machine', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.MacOSx10.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'osx',
                    osVersion: '10.11',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of firefox browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.MacOSx10.Firefox });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'osx',
                    osVersion: '10.11',
                    browserName: 'firefox',
                    browserVersion: '44.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.MacOSx10.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'osx',
                    osVersion: '10.11',
                    browserName: 'safari',
                    browserVersion: '9.0'
                });
            });

            it('should get the information of opera browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.MacOSx10.Opera });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'osx',
                    osVersion: '10.11',
                    browserName: 'opera',
                    browserVersion: '26.0'
                });
            });
        });

        describe('On having a Ubuntu Linux machine', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.Ubuntu15.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'linux',
                    osVersion: -1,
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of firefox browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.Ubuntu15.Firefox });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'linux',
                    osVersion: -1,
                    browserName: 'firefox',
                    browserVersion: '45.0'
                });
            });

            it('should get the information of opera browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.Ubuntu15.Opera });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'linux',
                    osVersion: -1,
                    browserName: 'opera',
                    browserVersion: '36.0'
                });
            });
        });

        describe('On having a iPhone 6 - OS 8.4', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone6OSx84.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '8.4',
                    browserName: 'chrome',
                    browserVersion: '47.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone6OSx84.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '8.4',
                    browserName: 'safari',
                    browserVersion: '8.0'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone6OSx84.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '8.4',
                    browserName: 'uc',
                    browserVersion: '10.6'
                });
            });
        });

        describe('On having a iPhone4S- OS 7.1', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone4SOSx712.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'chrome',
                    browserVersion: '47.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone4SOSx712.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'safari',
                    browserVersion: '7.0'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPhone4SOSx712.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'uc',
                    browserVersion: '9.3'
                });
            });
        });

        describe('On having a iPad 4 - OS 7.1', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPad4OSx71.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'chrome',
                    browserVersion: '47.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPad4OSx71.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'safari',
                    browserVersion: '7.0'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPad4OSx71.UCHD });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '7.1',
                    browserName: 'uchd',
                    browserVersion: '2.4'
                });
            });
        });

        describe('On having a iPadAir2 - OS 9.2', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPadAir2OSx92.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '9.2',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPadAir2OSx92.Safari });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '9.2',
                    browserName: 'safari',
                    browserVersion: '9.0'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.iPadAir2OSx92.UCHD });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'tablet',
                    os: 'ios',
                    osVersion: '9.2',
                    browserName: 'uchd',
                    browserVersion: '2.4'
                });
            });
        });

        describe('On having a Samsung S6 - Android 5.11', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS6Android511.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.1',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS6Android511.Embedded });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.1',
                    browserName: 'embedded',
                    browserVersion: '4.0'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS6Android511.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.1',
                    browserName: 'uc',
                    browserVersion: '10.9'
                });
            });
        });

        describe('On having a Samsung Note3 - Android 4.3', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungNote3Android43.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '4.3',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungNote3Android43.Embedded });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '4.3',
                    browserName: 'embedded',
                    browserVersion: '1.5'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungNote3Android43.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '4.3',
                    browserName: 'uc',
                    browserVersion: '10.9'
                });
            });
        });

        describe('On having a Samsung S4 - Android 5.01', function () {
            it('should get the information of chrome browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS4Android501.Chrome });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.0',
                    browserName: 'chrome',
                    browserVersion: '49.0'
                });
            });

            it('should get the information of safari browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS4Android501.Embedded });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.0',
                    browserName: 'embedded',
                    browserVersion: '2.1'
                });
            });

            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS4Android501.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '5.0',
                    browserName: 'uc',
                    browserVersion: '10.8'
                });
            });
        });

        describe('On having a XiomiMi4 - OS 4.44', function () {
            it('should get the information of UC browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.XiomiMi4OS444.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '4.4',
                    browserName: 'uc',
                    browserVersion: '10.9'
                });
            });
        });

        describe('On having a Honor 4x - QQ Browser', function () {
            it('should get the information of QQ browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.Honor4x.QQ });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '4.4',
                    browserName: 'qqbrowser',
                    browserVersion: '6.6'
                });
            });
        });

        describe('On having a Samsung S7 - UC Browser', function () {
            it('should get the information of UC Browser', function () {
                const device = DeviceInfo({ ua: useAgentStrings.SamsungS7.UC });
                const dm = device.info();
                checkDevice(dm, {
                    deviceType: 'mobile',
                    os: 'android',
                    osVersion: '7.0',
                    browserName: 'uc',
                    browserVersion: '11.4'
                });
            });
        });
    });
});
