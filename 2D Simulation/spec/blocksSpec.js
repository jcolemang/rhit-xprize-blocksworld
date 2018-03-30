describe("blocks", () => {
    let blocks = require('../blocks.js');
    let block_object = {};
    currentConfig = {};

    beforeEach(() => {
        $ = (id) => block_object;
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
});
