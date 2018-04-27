function initAll() {
    let possibleLetters = ["A", "B", "C", "D", "E", "F", "G"];
    let possibleColors = ['red', 'blue','green','orange','yellow'];

    if (!isFixed()) {
        currentConfig = getInitialConfiguration(possibleColors, possibleLetters, NumBlocks);
        finalBlocks = getFinalConfiguration(currentConfig);
    } else {
        currentConfig = [{
            topLetter: 'A',
            bottomLetter: 'B',
            topColor: 'red',
            bottomColor: 'green',
            left: 50,
            top: 40,
            id: 0
        }];

        finalBlocks = [{
            topLetter: 'B',
            bottomLetter: 'A',
            topColor: 'green',
            bottomColor: 'red',
            left: 50,
            top: 40,
            id: 0,
            position: [10, 20]
        }];
    }

    initBlocks(currentConfig);
    writeBlockStyles(currentConfig);

    popUpGameIntro();
}

function getInitialConfiguration(possibleColors, possibleLetters, numBlocks) {
    let topColors = makeColorsArray(possibleColors, numBlocks);
    let bottomColors = makeColorsArray(possibleColors, numBlocks);

    let topLetters = makeLettersArray(possibleLetters, numBlocks);
    let bottomLetters = makeLettersArray(possibleLetters, numBlocks);

    let leftPositions = makeLeftPositions(numBlocks);
    let topPositions = makeTopPositions(numBlocks);

    return generateBlocks(topColors, bottomColors,
                          topLetters, bottomLetters,
                          leftPositions, topPositions,
                          numBlocks);
}

function makeColorsArray(possibleColors, numBlocks) {
    let colors = [];
    for (let i = 0; i < numBlocks; i++) {
        rand = Math.floor(Math.random() * possibleColors.length);
        colors.push(possibleColors[rand]);
    }
    return colors;
}

function makeLettersArray(possibleLetters, numBlocks) {
    let letters = [];
    for (var i = 0; i < numBlocks; i++) {
        y = Math.floor(Math.random() * possibleLetters.length);
        letters.push(possibleLetters[y]);
    }
    return letters;
}

function makeLeftPositions(numBlocks) {
    let containerRect = document.getElementById('container').getBoundingClientRect()

    let horizNum = containerRect.right - 50 - 8 - 4 - 4;
    let horizDenom = containerRect.right * 100;

    let left_positions = [];
    for (let i = 0; i < numBlocks; i++) {
        left_positions.push(Math.random() * Math.floor(horizNum / horizDenom));
    }

    return left_positions;
}

function makeTopPositions(numBlocks) {
    let containerRect = document.getElementById('container').getBoundingClientRect();

    let vertNum = containerRect.bottom - 50 - 8 - 4 - 4;
    let vertDenom = containerRect.bottom * 100;

    let top_positions = [];
    for (let i = 0; i < numBlocks; i++) {
        top_positions.push(Math.random() * Math.floor(vertNum / vertDenom));
    }

    return top_positions;
}

function generateBlocks(topColors, bottomColors,
                        topLetters, bottomLetters,
                        leftPositions, topPositions,
                        numBlocks) {
    let blocks = [];
    for (i = 0; i < numBlocks; i++) {
        let block = {
            topLetter: topLetters[i],
            bottomLetter: bottomLetters[i],
            topColor: topColors[i],
            bottomColor: bottomColors[i],
            left: leftPositions[i],
            top: topPositions[i],
            id: i
        };
        blocks.push(block);
    }

    return blocks;
}

function getFinalConfiguration(initialConfiguration) {
    return initialConfiguration.map(block => {
        let newBlock = Object.assign({}, block);

        if (Math.random() < 0.5) {
            let tempColor = newBlock.topColor;
            let tempLetter = newBlock.topLetter;
            newBlock.topLetter = newBlock.bottomLetter;
            newBlock.topColor = newBlock.bottomColor;
            newBlock.bottomLetter = tempLetter;
            newBlock.bottomColor = tempColor;
        }

        newBlock.position = [Math.random() * 100, Math.random() * 100];

        return newBlock;
    });
}

function isFixed() {
    let url = window.location.href;

    return url.indexOf("?config=fixed") !== -1;
}

function initBlocks(config) {
    for (let i = 0; i < config.length; i++) {
        let block = config[i];
        addBlockToContainer(block);
        blocks.set_block_text(block.id, block.topLetter);

        standard_info.push("block:" + block.id + " "
                           + "standard position: (" + block.left + "%, " + block.top + "%) "
                           + "color: " + block.color
                           + " letters: " + block.topLetter
                           + " flipletters: " + block.bottomLetter);

        $("#block" + i).data("id", i);
        $("#block" + i).data("horizontal_percent", block.left);
        $("#block" + i).data("vertical_percent", block.top);
    }
}

function addBlockToContainer(block) {
    $("#container").append('<div class="block" id="block' + block.id + '" '
                           + 'style="left: ' + block.left + '%; '
                           + 'top: ' + block.top + '%; '
                           + 'background-color: ' + block.topColor + '"></div>');
}
