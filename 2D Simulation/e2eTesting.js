describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 5000;
    let short_timeout = 500;

    let modal;
    let startButton;
    let endButton;
    let scoreBox;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html?config=fixed");

        modal = element(by.className('modal'));
        startButton = element(by.id('buttonStart'));
        endButton = element(by.id('buttonEnd'));
        scoreBox = element(by.id('scoreBox'));
    });

    it("should have a connected modal opened", () => {
        expect(browser.wait(EC.presenceOf(modal), long_timeout)).toEqual(true);
    });

    describe("after closing the connected modal", () => {
        beforeEach(() => {
            let closeModalButton = element(by.id('closeModalButton'));
            browser.wait(EC.presenceOf(closeModalButton), long_timeout);
            closeModalButton.click();
        });

        it("should hide the modal", () => {
            expect(browser.wait(EC.not(EC.presenceOf(modal)), short_timeout))
                .toEqual(true);
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

            it("should have a score of zero", () => {
                expect(scoreBox.getText()).toEqual("0");
            });
        });
    });
});
