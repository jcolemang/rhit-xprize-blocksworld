describe("movesCorrector", () => {
    let MovesCorrector = require('../movesCorrector.js');
    let movesCorrector = {};

    correctionUI = jasmine.createSpyObj("correctionUI",
                                        ["display_flip_explanation",
                                         "display_move_explanation",
                                         "disable_incorrect_button",
                                         "hide_corrections_modal"]);

    blocks = jasmine.createSpyObj("blocks",
                                  ["get_block_top_pos",
                                   "get_block_left_pos",
                                   "get_block_text",
                                   "get_block_color",
                                   "display_block_letters",
                                   "display_block_ids"]);

    beforeEach(() => {
        movesCorrector = new MovesCorrector();
    });

    describe("when creating an undo move", () => {
        let moveData = {
            block_id: "block5"
        };

        let left_pos = 54;
        let top_pos = 32;

        let undo_move = {};

        beforeEach(() => {
            blocks.get_block_left_pos.and.returnValue(left_pos);
            blocks.get_block_top_pos.and.returnValue(top_pos);

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

    describe("when correcting a flip", () => {
        beforeEach(() => {
            spyOn(movesCorrector, "_start_correct_action");

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

    describe("when starting to correct an action", () => {
        beforeEach(() => {
            spyOn(movesCorrector, "_run_undo_action");

            movesCorrector._start_correct_action();
        });

        it("should hide the corrections modal", () => {
            expect(correctionUI.hide_corrections_modal).toHaveBeenCalled();
        });

        it("should disable the incorrect move button", () => {
            expect(correctionUI.disable_incorrect_button).toHaveBeenCalled();
        });

        it("should run the stored undo action", () => {
            expect(movesCorrector._run_undo_action).toHaveBeenCalled();
        });

        it("should display block ids", () => {
            expect(blocks.display_block_ids).toHaveBeenCalled();
        });
    });

    describe("when running an undo action", () => {
        describe("when the undo action is undefined", () => {
            beforeEach(() => {
                movesCorrector._run_undo_action();
            });

            it("should not do anything", () => {
                expect(movesCorrector._undo_action).toBeUndefined();
            });
        });

        describe("when the undo action is a flip", () => {
            let undo_action = {
                type: "flip",
                block_id: "block4"
            };

            let block_text = "A";
            let block_color = "green";

            beforeEach(() => {
                flipBlock = jasmine.createSpy("flipBlock");
                blocks.get_block_text.and.returnValue(block_text);
                blocks.get_block_color.and.returnValue(block_color);

                movesCorrector._undo_action = undo_action;

                movesCorrector._run_undo_action();
            });

            it("should flip the block with the stored block id", () => {
                expect(flipBlock.calls.argsFor(0)[0]).toEqual(undo_action.block_id);
            });

            it("should flip the block with the current text", () => {
                expect(flipBlock.calls.argsFor(0)[1]).toEqual(block_text);
            });

            it("should flip the block with the current color", () => {
                expect(flipBlock.calls.argsFor(0)[2]).toEqual(block_color);
            });

            it("should invalidate the stored undo action", () => {
                expect(movesCorrector._undo_action).toBeUndefined();
            });
        });

        describe("when the undo action is a move", () => {
            let undo_action = {
                type: "move"
            };

            beforeEach(() => {
                update_gui_block = jasmine.createSpy("update_gui_block");
                update_score = jasmine.createSpy("update_score");

                movesCorrector._undo_action = undo_action;

                movesCorrector._run_undo_action();
            });

            it("should move the block into its previous position", () => {
                expect(update_gui_block.calls.argsFor(0)[0]).toEqual(undo_action);
            });

            it("should update the score", () => {
                expect(update_score.calls.argsFor(0)[0]).toEqual(undo_action);
            });

            it("should invalidate the stored undo action", () => {
                expect(movesCorrector._undo_action).toBeUndefined();
            });
        });
    });

    describe("when intercepting a user message", () => {
        let message = "some user's message";

        describe("when awaiting a flip correction", () => {
            let result;

            beforeEach(() => {
                movesCorrector._awaiting_flip_correction = true;
                spyOn(movesCorrector, "_handle_flip_message");

                result = movesCorrector.handle_message(message);
            });

            it("should handle the flip message", () => {
                expect(movesCorrector._handle_flip_message).toHaveBeenCalled();
            });

            it("should return true", () => {
                expect(result).toEqual(true);
            });
        });

        describe("when awaiting a move correction", () => {
            let result;

            beforeEach(() => {
                movesCorrector._awaiting_move_correction = true;
                spyOn(movesCorrector, "_handle_move_message");

                result = movesCorrector.handle_message(message);
            });

            it("should handle the flip message", () => {
                expect(movesCorrector._handle_move_message).toHaveBeenCalled();
            });

            it("should return true", () => {
                expect(result).toEqual(true);
            });
        });

        describe("when not awaiting any correction", () => {
            let result;

            beforeEach(() => {
                result = movesCorrector.handle_message(message);
            });

            it("should return false", () => {
                expect(result).toEqual(false);
            });
        });
    });

    describe("when intercepting a flip correction", () => {
        beforeEach(() => {
            NumBlocks = 10;
            movesCorrector._awaiting_flip_correction = true;
        });

        describe("when given an invalid id", () => {
            beforeEach(() => {
                spyOn(movesCorrector, "_is_valid_id").and.returnValue(false);

                movesCorrector._handle_flip_message("not a valid number");
            });

            it("should display an explanation", () => {
                expect(correctionUI.display_flip_explanation).toHaveBeenCalled();
            });

            it("should continue awaiting a flip correction", () => {
                expect(movesCorrector._awaiting_flip_correction).toEqual(true);
            });
        });

        describe("when given an empty string", () => {
            beforeEach(() => {
                spyOn(movesCorrector, "_is_valid_id").and.returnValue(false);

                movesCorrector._handle_flip_message("");
            });

            it("should display an explanation", () => {
                expect(correctionUI.display_flip_explanation).toHaveBeenCalled();
            });

            it("should continue awaiting a flip correction", () => {
                expect(movesCorrector._awaiting_flip_correction).toEqual(true);
            });
        });

        describe("when given a valid id", () => {
            let block_text = "A";
            let block_color = "green";

            beforeEach(() => {
                flipBlock = jasmine.createSpy("flipBlock");

                blocks.get_block_text.and.returnValue(block_text);
                blocks.get_block_color.and.returnValue(block_color);

                spyOn(movesCorrector, "_is_valid_id").and.returnValue(true);

                movesCorrector._handle_flip_message("4");
            });

            it("should flip the block with given id", () => {
                expect(flipBlock.calls.argsFor(0)[0]).toEqual("block4");
            });

            it("should flip the block with the current block's actual text", () => {
                expect(flipBlock.calls.argsFor(0)[1]).toEqual(block_text);
            });

            it("should flip the block with the current block's color", () => {
                expect(flipBlock.calls.argsFor(0)[2]).toEqual(block_color);
            });

            it("should stop awaiting a flip correction", () => {
                expect(movesCorrector._awaiting_flip_correction).toEqual(false);
            });

            it("should display block letters", () => {
                expect(blocks.display_block_letters).toHaveBeenCalled();
            });
        });
    });

    describe("when intercepting a move correction", () => {
        beforeEach(() => {
            NumBlocks = 10;
            movesCorrector._awaiting_move_correction = true;
        });

        describe("when given an invalid id", () => {
            beforeEach(() => {
                spyOn(movesCorrector, "_is_valid_id").and.returnValue(false);

                movesCorrector._handle_move_message("not a valid number")
            });

            it("should display an explanation", () => {
                expect(correctionUI.display_move_explanation).toHaveBeenCalled();
            });

            it("should continue awaiting a move correction", () => {
                expect(movesCorrector._awaiting_move_correction).toEqual(true);
            });
        });

        describe("when given an empty string", () => {
            beforeEach(() => {
                spyOn(movesCorrector, "_is_valid_id").and.returnValue(false);

                movesCorrector._handle_move_message("")
            });

            it("should display an explanation", () => {
                expect(correctionUI.display_move_explanation).toHaveBeenCalled();
            });

            it("should continue awaiting a move correction", () => {
                expect(movesCorrector._awaiting_move_correction).toEqual(true);
            });
        });

        describe("when given a valid id", () => {
            let gesture_pos = {
                left: 100,
                top: 52
            };

            beforeEach(() => {
                get_gesture_position = jasmine.createSpy("get_gesture_position");
                get_gesture_position.and.returnValue(gesture_pos);

                update_gui_block = jasmine.createSpy("update_gui_block");
                hide_gesture = jasmine.createSpy("hide_gesture");

                movesCorrector._handle_move_message("4");
            });

            it("should stop awaiting a move correction", () => {
                expect(movesCorrector._awaiting_move_correction).toEqual(false);
            });

            it("should display block letters", () => {
                expect(blocks.display_block_letters).toHaveBeenCalled();
            });

            it("should move the block with the given id", () => {
                expect(update_gui_block.calls.argsFor(0)[0].block_id)
                    .toEqual("block4");
            });

            it("should move the block to the gesture position", () => {
                expect(update_gui_block.calls.argsFor(0)[0].top)
                    .toEqual(gesture_pos.top);
                expect(update_gui_block.calls.argsFor(0)[0].left)
                    .toEqual(gesture_pos.left);
            });

            it("should hide the last gesture", () => {
                expect(hide_gesture).toHaveBeenCalled();
            });
        });
    });
});
