describe("gesture", () => {
    let Gesture = require('../gesture.js');
    let gesture = {};

    $ = jasmine.createSpy('$');

    movesTracker = jasmine.createSpyObj("movesTracker", ["add_gesture"]);

    beforeEach(() => {
        gesture = new Gesture();
    });

    describe("when setting the position", () => {
        let mockGesture = jasmine.createSpyObj("mockGesture",
                                               ["css"]);
        let mockParent = jasmine.createSpyObj("mockParent",
                                              ["offset",
                                               "width",
                                               "height"]);
        let mockContainer = jasmine.createSpyObj("mockContainer",
                                                 ["offset",
                                                  "width",
                                                  "height"]);

        beforeEach(() => {
            spyOn(gesture, "_get_gesture").and.returnValue(mockGesture);
            spyOn(gesture, "_get_parent").and.returnValue(mockParent);
            spyOn(gesture, "_get_container").and.returnValue(mockContainer);
            spyOn(gesture, "show");

            mockParent.offset.and.returnValue({ left: 50, top: 30 });
            mockParent.width.and.returnValue(100);
            mockParent.height.and.returnValue(50);

            mockContainer.offset.and.returnValue({ left: 60, top: 35 });
            mockContainer.width.and.returnValue(80);
            mockContainer.height.and.returnValue(30);

            gesture.set_position(75, 40);
        });

        it("should set the left position to be a percent relative to its parent", () => {
            expect(mockGesture.css.calls.argsFor(0)).toEqual(['left', '25%']);
        });

        it("should set the top position to be a percent relative to its parent", () => {
            expect(mockGesture.css.calls.argsFor(1)).toEqual(['top', '20%']);
        });

        it("should store the logical left position percentage", () => {
            expect(gesture.get_game_position().left).toBeCloseTo(18.75);
        });

        it("should store the logical right position percentage", () => {
            expect(gesture.get_game_position().top).toBeCloseTo(16.67);
        });

        it("should add the logical gesture to the moves tracker", () => {
            expect(movesTracker.add_gesture.calls.argsFor(0)[0])
                .toBeCloseTo(18.75);
            expect(movesTracker.add_gesture.calls.argsFor(0)[1])
                .toBeCloseTo(16.67);
        });

        it("should display the div", () => {
            expect(gesture.show).toHaveBeenCalled();
        });
    });
});
