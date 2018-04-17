describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.waitForAngularEnabled(false);
        browser.get('http://localhost:8000/game.html');

        expect(browser.getTitle()).toEqual('Blocks World');
    });
});
