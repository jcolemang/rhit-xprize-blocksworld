exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2eTesting.js'],
    capabilities: {
        browserName: 'chrome'
    }
}
