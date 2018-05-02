describe("scoring", () => {
    let Scoring = require('../scoring.js');
    let scoring;

    let blocks = jasmine.createSpyObj("blocks", ["get_block_pos"]);

    let result;

    beforeEach(() => {
        scoring = new Scoring(blocks, 3);
    });

    describe("when setting the initial score", () => {
        let currentConfig = [{
            left: 10,
            top: 30
        }, {
            left: 20,
            top: 20
        }, {
            left: 30,
            top: 10
        }];

        beforeEach(() => {
            blocks.get_block_pos.and.returnValues(...currentConfig);
        });

        describe("when the blocks are perfectly matched", () => {
            beforeEach(() => {
                result = scoring.calc_score(currentConfig);
            });

            it("should return a score of 0", () => {
                expect(result).toEqual(0);
            });

            it("should store an initial score of 100", () => {
                expect(scoring._initialScore).toEqual(100);
            });
        });
    });
});
