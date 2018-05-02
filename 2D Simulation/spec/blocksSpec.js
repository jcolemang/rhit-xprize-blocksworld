describe("blocks", () => {
    let blocks = require('../blocks.js');
    let block_object = {
        length: 1
    };
    currentConfig = {};

    beforeEach(() => {
        $ = (id) => id === "#block5" ? block_object : {
            length: 0
        };
    });

    describe("when setting their text", () => {
        let html_text = "";

        beforeEach(() => {
            block_object.html = (contents) => html_text = contents;
        });

        it("should change the HTML with the text", () => {
            let example_text = "Some example text";

            blocks.set_block_text(5, example_text);

            expect(html_text).toContain(example_text);
        });
    });

    describe("when getting their text", () => {
        let html_text = "C";

        beforeEach(() => {
            currentConfig[5] = {
                topLetter: html_text
            };
        });

        it("should return the current text", () => {
            expect(blocks.get_block_text(5)).toEqual(html_text);
        });

        describe("when using an invalid id", () => {
            it("should return an empty string", () => {
                expect(blocks.get_block_text(6)).toEqual("");
            });
        });
    });

    describe("when getting left position", () => {
        let left_pos = 43.234;

        beforeEach(() => {
            block_object.prop = (key) => key !== "style" ? {} : {
                left: left_pos + "%"
            };
        });

        it("should return the left style property", () => {
            expect(blocks.get_block_left_pos(5)).toEqual(left_pos);
        });

        describe("when using an invalid id", () => {
            it("should return undefined", () => {
                expect(blocks.get_block_left_pos(6)).toBeUndefined();
            });
        });
    });

    describe("when getting top position", () => {
        let top_pos = 43.234;

        beforeEach(() => {
            block_object.prop = (key) => key !== "style" ? {} : {
                top: top_pos + "%"
            };
        });

        it("should return the top style property", () => {
            expect(blocks.get_block_top_pos(5)).toEqual(top_pos);
        });

        describe("when using an invalid id", () => {
            it("should return undefined", () => {
                expect(blocks.get_block_top_pos(6)).toBeUndefined();
            });
        });
    });

    describe("when getting the full position", () => {
        let left = 59.24;
        let top = 60.75;

        let position;

        beforeEach(() => {
            spyOn(blocks, "get_block_left_pos").and.returnValue(left);
            spyOn(blocks, "get_block_top_pos").and.returnValue(top);

            position = blocks.get_block_pos(5);
        });

        it("should return the correct position", () => {
            expect(position).toEqual({
                left: left,
                top: top
            });
        });

        it("should check the position of the correct block", () => {
            expect(blocks.get_block_left_pos.calls.argsFor(0)[0]).toEqual(5);
            expect(blocks.get_block_top_pos.calls.argsFor(0)[0]).toEqual(5);
        });
    });

    describe("when setting the block color", () => {
        let background_color = "";
        let goal_color = "green";

        beforeEach(() => {
            block_object.css = (key, value) => {
                if (key === "background-color")
                    background_color = value;
            };
        });

        it("should set the background color", () => {
            blocks.set_block_color(5, goal_color);

            expect(background_color).toEqual(goal_color);
        });
    });

    describe("when getting the block color", () => {
        let background_color = "orange";

        beforeEach(() => {
            currentConfig[5] = {
                topColor: background_color
            };
        });

        it("should return the background color", () => {
            expect(blocks.get_block_color(5)).toEqual(background_color);
        });

        describe("when using an invalid id", () => {
            it("should return the empty string", () => {
                expect(blocks.get_block_color(6)).toEqual("");
            });
        });
    });

    describe("when flipping a block", () => {
        beforeEach(() => {
            spyOn(blocks, "_swap_color");
            spyOn(blocks, "_swap_letter");
        });

        it("should swap colors", () => {
            blocks.flip_block(5);

            expect(blocks._swap_color).toHaveBeenCalled();
        });

        it("should swap colors on the correct block", () => {
            blocks.flip_block(5);

            expect(blocks._swap_color.calls.argsFor(0)).toEqual([5]);
        });

        it("should swap letters", () => {
            blocks.flip_block(5);

            expect(blocks._swap_letter).toHaveBeenCalled();
        });

        it("should swap letters on the correct block", () => {
            blocks.flip_block(5);

            expect(blocks._swap_letter.calls.argsFor(0)).toEqual([5]);
        });
    });

    describe("when swapping colors", () => {
        let bottomColor = "orange";
        let topColor = "red";

        beforeEach(() => {
            spyOn(blocks, "get_block_color").and.returnValue(topColor);
            spyOn(blocks, "set_block_color");

            currentConfig[5] = {
                bottomColor: bottomColor,
                topColor: topColor
            };
        });

        it("should update the block color", () => {
            blocks._swap_color(5);

            expect(blocks.set_block_color).toHaveBeenCalled();
        });

        it("should set the block color to the old bottom color", () => {
            blocks._swap_color(5);

            expect(blocks.set_block_color.calls.argsFor(0))
                .toEqual([5, bottomColor]);
        });

        it("should swap the stored block colors", () => {
            blocks._swap_color(5);

            expect(currentConfig[5].topColor).toEqual(bottomColor);
            expect(currentConfig[5].bottomColor).toEqual(topColor);
        });
    });

    describe("when swapping letters", () => {
        let bottomText = "A";
        let topText = "B";

        beforeEach(() => {
            spyOn(blocks, "get_block_text").and.returnValue(topText);
            spyOn(blocks, "set_block_text");

            currentConfig[5] = {
                topLetter: topText,
                bottomLetter: bottomText
            };
        });

        it("should update the block text", () => {
            blocks._swap_letter(5);

            expect(blocks.set_block_text).toHaveBeenCalled();
        });

        it("should set the block text to the old bottom text", () => {
            blocks._swap_letter(5);

            expect(blocks.set_block_text.calls.argsFor(0))
                .toEqual([5, bottomText]);
        });

        it("should swap the stored block text", () => {
            blocks._swap_letter(5);

            expect(currentConfig[5].topLetter).toEqual(bottomText);
            expect(currentConfig[5].bottomLetter).toEqual(topText);
        });
    });
});
