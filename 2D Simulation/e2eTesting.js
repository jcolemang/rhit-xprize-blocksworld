describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 5000;
    let short_timeout = 500;

    let startButton;
    let endButton;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html?config=fixed");

        startButton = element(by.id('buttonStart'));
        endButton = element(by.id('buttonEnd'));
    });

    afterEach(() => {
        browser.refresh();
        browser.sleep(short_timeout);
    });

    it("should have a connected alert opened", () => {
        expect(browser.wait(EC.alertIsPresent(), long_timeout)).toEqual(true);
        browser.switchTo().alert().dismiss();
    });

    describe("after closing the connected alert", () => {
        beforeEach(() => {
            browser.wait(EC.alertIsPresent(), long_timeout);
            browser.switchTo().alert().dismiss();
        });

        describe("before starting the game", () => {
            it("should activate the start button", () => {
                expect(startButton.isEnabled()).toEqual(true);
            });
        });

        describe("after starting the game", () => {
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
});
