describe("scoring", () => {
    let Scoring = require('../scoring.js');
    let scoring;

    let blocks = jasmine.createSpyObj("blocks", ["get_block_pos"]);

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

    let result;

    beforeEach(() => {
        scoring = new Scoring(blocks, 3, goal_config);
    });

    describe("before setting the initial score", () => {
        it("should throw an error when calculating the score", () => {
            expect(scoring.calc_score).toThrow();
        });
    });

    describe("when setting the initial score", () => {
        describe("when the blocks are perfectly matched", () => {
            beforeEach(() => {
                blocks.get_block_pos.and.returnValues(...goal_config);

                scoring.set_initial_score();
            });

            it("should store an initial score of 100", () => {
                expect(scoring._initialScore).toEqual(100);
            });
        });

        describe("when the centroids match", () => {
            let current_config = [{
                left: 45,
                top: 55
            }, {
                left: 20,
                top: 30
            }, {
                left: 20,
                top: 50
            }];

            beforeEach(() => {
                blocks.get_block_pos.and.returnValues(...current_config);

                scoring.set_initial_score();
            });

            it("should store the correct score in initialScore", () => {
                expect(scoring._initialScore).toBeCloseTo(92.44);
            });
        });

        describe("when the centroids don't match", () => {
            let current_config = [{
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
                blocks.get_block_pos.and.returnValues(...current_config);

                scoring.set_initial_score();
            });

            it("should store the correct score in initialScore", () => {
                expect(scoring._initialScore).toBeCloseTo(92.89);
            });
        });

        describe("when setting the initial score twice", () => {
            let current_config = [{
                left: 40,
                top: 40
            }, {
                left: 30,
                top: 10
            }, {
                left: 10,
                top: 30
            }];

            it("should throw an error", () => {
                blocks.get_block_pos.and.returnValues(...current_config);
                scoring.set_initial_score();
                expect(scoring.set_initial_score).toThrow();
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

            scoring.set_initial_score();
            initial_initialScore = scoring._initialScore;

            result = scoring.calc_score();
        });

        it("should calculate the adjusted score", () => {
            expect(result).toBeCloseTo(25);
        });

        it("should leave the initial score the same", () => {
            expect(scoring._initialScore).toEqual(initial_initialScore);
        });
    });
});
