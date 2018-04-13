describe("movesTracker", () => {
    let imported = require('../movesTracker.js');

    let MovesTracker = imported.MovesTracker;
    let _Gesture = imported._Gesture;
    let _Instruction = imported._Instruction;
    let _Flip = imported._Flip;
    let _Move = imported._Move;

    let movesTracker;

    beforeEach(() => {
        movesTracker = new MovesTracker();

        getDateTime = jasmine.createSpy("getDateTime");
    });

    describe("when exporting gestures", () => {
        // getDateTime returns a string, therefore:
        let current_date = "<now>";
        let left = 49;
        let top = 33;

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            let gesture = new _Gesture(left, top);
            string = gesture.export_to_string();
        });

        it("should have the proper formatting", () => {
            expect(string).toEqual("Gesture " + current_date
                                   + " (" + left + "," + top + ")");
        });
    });

    describe("when exporting instructions", () => {
        // getDateTime returns a string, therefore:
        let start_date = "<then>";
        let current_date = "<now>";
        let start_time = 122;
        let current_time = 142;
        let text = "Hello world!";

        let string;

        beforeEach(() => {
            getDateTime.and.returnValue(current_date);

            Date = jasmine.createSpy(Date);
            Date.and.returnValue({
                getTime: () => current_time
            });

            let instruction = new _Instruction(start_date, start_time, text);
            string = instruction.export_to_string();
        });

        it("should have the proper formating", () => {
            expect(string).toEqual("Instruction " + start_date + " "
                                   + current_date + " "
                                   + (current_time - start_time) + " "
                                   + text);
        });
    });
});
