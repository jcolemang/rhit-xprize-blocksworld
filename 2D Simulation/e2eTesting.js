describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 5000;
    let short_timeout = 1000;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html");
    });

    afterEach(() => browser.refresh());

    it("should activate the start button", () => {
        let startButton = element(by.id('buttonStart'));

        browser.wait(EC.elementToBeClickable(startButton), short_timeout);
    });

    it("should have the correct window title", () => {
        expect(browser.getTitle()).toEqual('Blocks World');
    });
});
