describe("movesCorrector", () => {
    let MovesCorrector = require('../movesCorrector.js');
    let movesCorrector = {};

    correctionUI = {
        display_flip_explanation: () => undefined,
        display_move_explanation: () => undefined
    };

    blocks = {
        get_block_left_pos: (id) => undefined,
        get_block_top_pos: (id) => undefined
    };

    beforeEach(() => {
        movesCorrector = new MovesCorrector();
    });

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

        it("should await a flip correction", () => {
            expect(movesCorrector._awaiting_flip_correction).toEqual(true);
            expect(movesCorrector._awaiting_move_correction).toEqual(false);
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

        it("should await a move correction", () => {
            expect(movesCorrector._awaiting_flip_correction).toEqual(false);
            expect(movesCorrector._awaiting_move_correction).toEqual(true);
        });
    });

    describe("when creating an undo move", () => {
        let moveData = {
            block_id: "block5"
        };

        let left_pos = 54;
        let top_pos = 32;

        let undo_move = {};

        beforeEach(() => {
            spyOn(blocks, "get_block_left_pos").and.returnValue(left_pos);
            spyOn(blocks, "get_block_top_pos").and.returnValue(top_pos);

            undo_move = movesCorrector._create_undo_move(moveData);
        });

        it("should create a new move action", () => {
            expect(undo_move.type).toEqual("move");
        });

        it("should create an action using the current position", () => {
            expect(undo_move.left).toEqual(left_pos);
            expect(undo_move.top).toEqual(top_pos);
        });

        it("should create an action using the given block id", () => {
            expect(undo_move.block_id).toEqual(moveData.block_id);
        });
    });

    describe("when creating an undo flip", () => {
        let block_id = 5;
        let undo_flip = {};

        beforeEach(() => {
            undo_flip = movesCorrector._create_undo_flip(block_id);
        });

        it("should create a new flip action", () => {
            expect(undo_flip.type).toEqual("flip");
        });

        it("should create an action using the given block id", () => {
            expect(undo_flip.block_id).toEqual(block_id);
        });
    });
});
