describe("movesCorrector", () => {
    let movesCorrector = require('../movesCorrector.js');
    correctionUI = {
        display_flip_explanation: () => undefined,
        display_move_explanation: () => undefined
    };

    describe("when correcting a flip", () => {
        beforeEach(() => {
            spyOn(movesCorrector, "_start_correct_action");
            spyOn(correctionUI, "display_flip_explanation");

            movesCorrector.correct_flip();
        });

        it("should start a correction action", () => {
            expect(movesCorrector._start_correct_action).toHaveBeenCalled();
        });

        it("should display flip explanation", () => {
            expect(correctionUI.display_flip_explanation).toHaveBeenCalled();
        });
    });

    describe("when correcting a move", () => {
        beforeEach(() => {
            spyOn(movesCorrector, "_start_correct_action");
            spyOn(correctionUI, "display_move_explanation");

            movesCorrector.correct_move();
        });

        it("should start a correction action", () => {
            expect(movesCorrector._start_correct_action).toHaveBeenCalled();
        });

        it("should display move explanation", () => {
            expect(correctionUI.display_move_explanation).toHaveBeenCalled();
        });
    });
});
