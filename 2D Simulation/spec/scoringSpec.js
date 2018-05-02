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

        describe("when the centroids match", () => {
            let goal_config = [{
                left: 20,
                top: 20
            }, {
                left: 30,
                top: 10
            }, {
                left: 10,
                top: 30
            }];

            beforeEach(() => {
                result = scoring.calc_score(goal_config);
            });

            it("should return a score of zero", () => {
                expect(result).toEqual(0);
            });

            it("should store the correct score in initialScore", () => {
                expect(scoring._initialScore).toBeCloseTo(89.33);
            });
        });

        describe("when the centroids don't match", () => {
            let goal_config = [{
                left: 40,
                top: 40
            }, {
                left: 30,
                top: 10
            }, {
                left: 10,
                top: 30
            }];

            beforeEach(() => {
                result = scoring.calc_score(goal_config);
            });

            it("should return a score of zero", () => {
                expect(result).toEqual(0);
            });

            it("should store the correct score in initialScore", () => {
                expect(scoring._initialScore).toBeCloseTo(88.44);
            });
        });
    });

    describe("after setting the initial score", () => {
        let init_config = [{
            left: 20,
            top: 20
        }, {
            left: 40,
            top: 30
        }, {
            left: 60,
            top: 40
        }];

        let current_config = [{
            left: 40,
            top: 20
        }, {
            left: 50,
            top: 30
        }, {
            left: 60,
            top: 40
        }];

        let goal_config = [{
            left: 10,
            top: 30
        }, {
            left: 20,
            top: 45
        }, {
            left: 30,
            top: 50
        }];

        let initial_initialScore;

        beforeEach(() => {
            let full_config = init_config.concat(current_config);
            blocks.get_block_pos.and.returnValues(...full_config);

            scoring.calc_score(goal_config);
            initial_initialScore = scoring._initialScore;

            result = scoring.calc_score(goal_config);
        });

        it("should calculate the adjusted score", () => {
            expect(result).toBeCloseTo(75);
        });

        it("should leave the initial score the same", () => {
            expect(scoring._initialScore).toEqual(initial_initialScore);
        });
    });
});
