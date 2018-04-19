describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 5000;
    let short_timeout = 500;

    let startButton;
    let endButton;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html?config=fixed");
        browser.sleep(short_timeout);

        startButton = element(by.id('buttonStart'));
        endButton = element(by.id('buttonEnd'));
    });

    describe("before starting the game", () => {
        xit("should activate the start button", () => {
            expect(startButton.isEnabled()).toEqual(true);
        });

        it("should have the correct window title", () => {
            browser.wait(EC.titleIs('Connected'), long_timeout);
            expect(browser.getTitle()).toEqual('Connected');
        });
    });
});


// describe("Blocksworld", () => {
//     let EC = protractor.ExpectedConditions;
//     let long_timeout = 5000;
//     let short_timeout = 500;

//     let startButton;
//     let endButton;

//     beforeEach(() => {
//         browser.waitForAngularEnabled(false);
//         browser.get("http://localhost:8000/game.html?config=fixed");

//         startButton = element(by.id('buttonStart'));
//         endButton = element(by.id('buttonEnd'));
//         browser.sleep(short_timeout);
//     });

//     afterEach(() => {
//         browser.refresh();
//         browser.sleep(short_timeout);
//     });


//     describe("before starting the game", () => {
//         it("should activate the start button", () => {
//             expect(startButton.isEnabled()).toEqual(true);
//         });

//         it("should have the correct window title", () => {
//             browser.wait(EC.titleIs('Connected'), long_timeout);
//             expect(browser.getTitle()).toEqual('Connected');
//         });
//     });

//     describe("after starting the game", () => {
//         beforeEach((done) => {
//             startButton.click().then(done);
//         });

//         it("should deactivate the start button", () => {
//             expect(startButton.isEnabled()).toEqual(false);
//         });

//         it("should activate the end button", () => {
//             expect(endButton.isEnabled()).toEqual(true);
//         });
//     });
// });
