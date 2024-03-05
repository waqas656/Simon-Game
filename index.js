// setting audio objects
var green = new Audio('./sounds/green.mp3');
var red = new Audio('./sounds/red.mp3');
var yellow = new Audio('./sounds/yellow.mp3');
var blue = new Audio('./sounds/blue.mp3');
var wrong = new Audio('./sounds/wrong.mp3');

//to check if game is started or not
var gameStarted = false;

//for increasing levels on h1
var level = 0;

// to set the randomly chosen color
var chosen;

// to keep track of each iteration of user guesses for a sequence
var userCurrentIteration = 0;

// to get colors randomly
var allColors = ['red', 'yellow', 'green', 'blue'];

// stores the color in the sequence which is randomly generated (one after the other)
var currentPattern;

// key listener for any key
$(document).on("keydown", function (event) {
    if (level === 0) { //to make sure nothing is done on keypresses after the game starts
        console.log(event.key + " clicked");
        gameStarted = true;
        level += 1
        
        setLevel(level);

        currentPattern = [];

        //gets a random color then save it into pattern array
        firstColor = getRandomColor();
        currentPattern.push(firstColor);

        // passing true to mark it as first time call
        checkAndPlaySound(firstColor, userCurrentIteration, true);
    }
})

// click listener for all buttons
$('div[type="button"]').on("click", function () {
    if (gameStarted) { // to execute logic only if the game is started
        var clickedBtn = $(this);

        var divId = $(clickedBtn).attr("id");

        checkAndPlaySound(divId, userCurrentIteration, false);

    } else { //play wrong selection sound if game is not started
        wrong.play();
    }
});


//function to set the level on the h1 element on top
function setLevel(newLevel) {
    $("h1").text("Level " + newLevel);
} 

//this function checks each user selected color and also it executes when the user starts the game
function checkAndPlaySound(userPlayed, userCurrentIteration, firstTime) {
    var correct = true;

    // play the pressed animation on the button with id of the given color
    playPressedAnimation(getButtonById(userPlayed));
    playSound(userPlayed);

    // if first time, then don't check if the sequence is correct, instead wait for the user input
    if (!firstTime) {
        correct = checkIfUserPlayedCorrectSequence(userPlayed, userCurrentIteration);
    }

    if (!correct) {
        resetGame();
    }
}

// plays an animation of pressed by applying a class and then removing it after 200 milliseconds
function playPressedAnimation(btn) {
    $(btn).addClass("pressed");

    setTimeout(function () {
        $(btn).removeClass("pressed");
    }, 200);
}

// gets a random color from colors array
function getRandomColor() {
    var idx = Math.floor(Math.random() * 4);

    chosen = allColors[idx];
    return chosen;
}

//resets levels, game started boolean, user iteration number and pattern array
function resetGame() {
    wrong.play();
    wrong.play();
    gameStarted = false;
    level = 0;
    chosen = undefined;
    currentPattern = [];
    userCurrentIteration = 0;
    $("h1").text("Game Over. Press any key to start again !!");
}

// finds and returns button using its id which is color name itself
function getButtonById(btnId) {
    return $("#" + btnId);
}

// plays the sound according to the provided color
function playSound(selectedColor) {
    if (selectedColor === 'green') {
        green.play();
    } else if (selectedColor === 'red') {
        red.play();
    } else if (selectedColor === 'yellow') {
        yellow.play();
    } else if (selectedColor === 'blue') {
        blue.play();
    }
}

function checkIfUserPlayedCorrectSequence(userPlayed) {
    // check if pattern array contains the user clicked button color
    if (userPlayed !== currentPattern[userCurrentIteration]) {
        return false;
    }

    /* checking if current iteration of user input for a sequence is at last element of pattern array
     if it is at last element of pattern array, then we increase the level and another random color in the pattern
     and set the user iteration to 0
     */
    if (userCurrentIteration == (currentPattern.length - 1)) {
        chosen = getRandomColor();
        currentPattern.push(chosen);
        userCurrentIteration = 0;
        setTimeout(function () {
            playPressedAnimation(getButtonById(chosen));
            playSound(chosen);
            ++level; // increasing the level by 1 and then setting it on h1 element
            setLevel(level);
        }, 500);
        return true;
    } else {
        // if user is not at last element of pattern array then just increase the user iteration number
        ++userCurrentIteration;
    }

    return true;
}
