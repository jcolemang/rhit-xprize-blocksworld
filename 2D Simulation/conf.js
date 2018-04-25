exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2eTesting.js'],
    baseUrl: 'http://localhost:8000',
    capabilities: {
        browserName: 'firefox',
        marionette: true
    }
}
