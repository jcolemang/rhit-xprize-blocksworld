describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 5000;
    let short_timeout = 1000;

    let startButton;
    let endButton;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html");

        startButton = element(by.id('buttonStart'));
        endButton = element(by.id('buttonEnd'));
    });

    afterEach(() => browser.refresh());

    it("should activate the start button", () => {
        expect(startButton.isEnabled()).toEqual(true);
    });

    it("should have the correct window title", () => {
        expect(browser.getTitle()).toEqual('Blocks World');
    });

    describe("After starting the game", () => {
        beforeEach((done) => {
            startButton.click().then(done);
        });

        it("should deactivate the start button", () => {
            expect(startButton.isEnabled()).toEqual(false);
        });

        it("should activate the end button", () => {
            expect(endButton.isEnabled()).toEqual(true);
        });
    });
});
