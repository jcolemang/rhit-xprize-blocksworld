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
                                               ["css",
                                                "offset"]);
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

            mockGesture.offset.and.returnValue({ left: 75, top: 40 });

            mockParent.offset.and.returnValue({ left: 50, top: 30 });
            mockParent.width.and.returnValue(100);
            mockParent.height.and.returnValue(50);

            mockContainer.offset.and.returnValue({ left: 60, top: 40 });

            gesture.set_position(75, 40);
        });

        it("should set the left position to be a percent relative to its parent", () => {
            expect(mockGesture.css.calls.argsFor(0)).toEqual(['left', '25%']);
        });

        it("should set the top position to be a percent relative to its parent", () => {
            expect(mockGesture.css.calls.argsFor(1)).toEqual(['top', '20%']);
        });
    });
});
