describe("blocks", () => {
    let blocks = require('../blocks.js');
    let block_object = {};

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
});
