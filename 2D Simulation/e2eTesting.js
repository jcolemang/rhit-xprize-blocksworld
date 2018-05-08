describe("Blocksworld", () => {
    let EC = protractor.ExpectedConditions;
    let long_timeout = 2000;
    let short_timeout = 500;

    let modal;
    let container;
    let gesture;
    let startButton;
    let endButton;
    let scoreBox;

    let gesture_target;

    function make_gesture(x_percent, y_percent, done) {
        return container.getLocation()
            .then(container_location => {
                let x_absolute = (x_percent / 100) * container_location.width;
                let y_absolute = (y_percent / 100) * container_location.height;

                let x_relative = x_absolute - (container_location.width / 2);
                let top_relative = y_absolute - (container_location.height / 2);

                return browser.actions()
                    .mouseMove(container, {
                        x: x_relative,
                        y: top_relative
                    })
                    .click()
                    .perform()
                    .then(() => {
                        gesture_target = {
                            x: container_location.x + x_absolute,
                            y: container_location.y + y_absolute
                        };
                    })
                    .then(done);
            });
    }

    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get("http://localhost:8000/game.html?config=fixed");

        modal = element(by.className('modal'));

        container = element(by.id('container'));
        gesture = element(by.id('gestureToggle'));

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

            describe("before doing anything else", () => {
                it("should deactivate the start button", () => {
                    expect(startButton.isEnabled()).toEqual(false);
                });

                it("should activate the end button", () => {
                    expect(endButton.isEnabled()).toEqual(true);
                });

                it("should have a score of zero", () => {
                    expect(scoreBox.getText()).toEqual("0");
                });

                it("should display the goal configuration", () => {
                    expect(element(by.id('ghost_block0')).isDisplayed()).toEqual(true);
                });

                it("should display the current configuration", () => {
                    expect(element(by.id('block0')).isDisplayed()).toEqual(true);
                });
            });

            describe("after pressing the hide construction button", () => {
                beforeEach((done) => {
                    element(by.id('constructionToggle')).click().then(done);
                });

                it("should hide the goal configuration", () => {
                    expect(element(by.id('ghost_block0')).isDisplayed()).toEqual(false);
                });
            });

            describe("after clicking in the container", () => {
                beforeEach((done) => {
                    make_gesture(25, 40, done);
                });

                it("should display the gesture marker", () => {
                    expect(gesture.isDisplayed()).toEqual(true);
                });

                it("should move the gesture marker to the correct position", (done) => {
                    gesture.getLocation().then(location => {
                        expect(location.x).toBeCloseTo(gesture_target.x, -1);
                        expect(location.y).toBeCloseTo(gesture_target.y, -1);

                        done();
                    });
                });
            });
        });
    });
});
