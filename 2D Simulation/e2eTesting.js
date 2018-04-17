describe('Blocksworld', () => {
    let EC = protractor.ExpectedConditions;
    let timeout = 10000;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get('http://localhost:8000/game.html');
    });

    it('should alert the user they have connected', () => {
        expect(browser.wait(EC.alertIsPresent(), timeout)).toEqual(true);
    });
});
