function initAll() {
    let possibleLetters = ["A", "B", "C", "D", "E", "F", "G"];
    let possibleColors = ['red', 'blue','green','orange','yellow'];

    if (!isFixed()) {
        currentConfig = getInitialConfiguration(possibleColors, possibleLetters, NumBlocks);
        finalBlocks = getFinalConfiguration(currentConfig);
    } else {
        currentConfig = loadFixedInitConfig();
        finalBlocks = loadFixedGoalConfig();

        NumBlocks = currentConfig.length;
    }

    initBlocks(currentConfig);
    writeBlockStyles(currentConfig);
}

function getInitialConfiguration(possibleColors, possibleLetters, numBlocks) {
    let topColors = makeColorsArray(possibleColors, numBlocks);
    let bottomColors = makeColorsArray(possibleColors, numBlocks);

    let topLetters = makeLettersArray(possibleLetters, numBlocks);
    let bottomLetters = makeLettersArray(possibleLetters, numBlocks);

    let leftPositions = makePositions(numBlocks);
    let topPositions = makePositions(numBlocks);

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

function makePositions(numBlocks) {
    let positions = [];
    for (let i = 0; i < numBlocks; i++) {
        positions.push(Math.random() * 100);
    }

    return positions;
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
        let flip = Math.random() < 0.5;
        return {
            id: block.id,
            top: Math.random() * 100,
            left: Math.random() * 100,
            topColor: flip ? block.topColor : block.bottomColor,
            topLetter: flip ? block.topLetter : block.bottomLetter
        };
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

initAll();
