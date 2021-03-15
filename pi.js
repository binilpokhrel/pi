const pi="3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989"
const animation_interval = 300;

let dom_buttons = {};
let dom_button_start;
let dom_button_start_color;
let dom_scoreboard;
let dom_display;
let dom_display_text;

let starting_counter = 3;
let free_play = false;

let counter = 0;
let high_score = 0;
let curr_score = 0;
let index = 0;
let keys_enabled = false;

const animateSequence = () => {
    if (free_play) return;
    keys_enabled = false;
    for (let i = 0; i < counter; i++) {
        let char = pi[i];
        const original_color = dom_buttons[char].style.backgroundColor;
        const new_color = "#b5626a";
        setTimeout(() => {
            dom_buttons[char].style.backgroundColor = new_color;
            updateDisplayText(char);
        }, ((i+1)*animation_interval));
        setTimeout(() => { 
            if (i === counter-1) { keys_enabled = true; resetDisplayText(); dom_button_start.style.backgroundColor = "#ffb921"; }
            dom_buttons[char].style.backgroundColor = original_color;
        }, ((i+2)*animation_interval));
    }
}

const flashDisplayAndResetGameStatus = () => {
    const original_color = dom_display.style.backgroundColor;
    const error_color = "#ffc7a8";

    let time = 0;
    dom_display.style.backgroundColor = error_color;
    setTimeout(() => {
        dom_display.style.backgroundColor = original_color;
    }, time += animation_interval*0.5);
    setTimeout(() => {
        dom_display.style.backgroundColor = error_color;
    }, time += animation_interval*0.5);
    setTimeout(() => {
        resetGameStatus();
        dom_display.style.backgroundColor = original_color;
    }, time += 3*animation_interval*0.5);
}

const transitionToNextStep = () => {
    const original_color = dom_display.style.backgroundColor;
    const correct_color = "#2fd672";
    
    dom_display.style.backgroundColor = correct_color;
    setTimeout(() => {
        dom_display.style.backgroundColor = original_color;
        resetDisplayText();
        animateSequence();
    }, animation_interval);
}

const highlightError = (button, step) => {
    const error_color = "#d6482f";
    const correct_color = "#2fd672";
    const original_color = dom_buttons["0"].style.backgroundColor;
    let wrong_button = button;
    let right_button = dom_buttons[pi[step]];
    
    let time = 0;
    setTimeout(() => {
        wrong_button.style.backgroundColor = error_color;
    }, (time += animation_interval));
    setTimeout(() => {
        right_button.style.backgroundColor = correct_color;
    }, (time));
    setTimeout(() => {
        wrong_button.style.backgroundColor = original_color;
    }, (time += 1.5*animation_interval));
    setTimeout(() => {
        right_button.style.backgroundColor = original_color;
    }, (time));

}

const getDOMElements = () => {
    dom_buttons = {
        ".": document.querySelector("button[value='.']"),
        "0": document.querySelector("button[value='0']"),
        "1": document.querySelector("button[value='1']"),
        "2": document.querySelector("button[value='2']"),
        "3": document.querySelector("button[value='3']"),
        "4": document.querySelector("button[value='4']"),
        "5": document.querySelector("button[value='5']"),
        "6": document.querySelector("button[value='6']"),
        "7": document.querySelector("button[value='7']"),
        "8": document.querySelector("button[value='8']"),
        "9": document.querySelector("button[value='9']")
    };

    dom_button_start = document.querySelector("button.start");
    dom_button_start_color = dom_button_start.style.backgroundColor;

    dom_scoreboard = document.querySelector("span.score");

    dom_display = document.querySelector("div.display-wrapper");

    dom_display_text = document.querySelector("p.display-text");
}

const updateScores = (increment=1) => {
    curr_score += increment;
    if (curr_score > high_score) high_score = curr_score;
    dom_scoreboard.innerHTML = high_score;
}

const updateDisplayText = (char="") => {
    dom_display_text.innerHTML = dom_display_text.innerHTML === "0" ? char : `${dom_display_text.innerHTML}${char}`;
}

const resetScores = () => {
    curr_score = 0;
    updateScores(0);
}

const resetDisplayText = () => {
    dom_display_text.innerHTML = "0";
}

const resetGameStatus = () => {
    counter = starting_counter;
    index = 0;
    if (!free_play) {
        keys_enabled = false;
        dom_button_start.style.backgroundColor = dom_button_start_color;
    }
    resetScores();
    resetDisplayText();
}

const onNumpadClicked = (e) => {
    if (keys_enabled) {
        let button = (e.target) ? e.target : e.srcElement;
        if (pi[index] == button.value) {
            if (button.value != ".") updateScores();
            index++;
            updateDisplayText(button.value);
            if (!free_play && index === counter) {
                index = 0;
                counter++;
                curr_score = 0;
                transitionToNextStep();
            }
        } else {
            highlightError(button, index);
            flashDisplayAndResetGameStatus();
        }
    }
}

const onStartClicked = (e) => {
    counter = starting_counter + 1;
    if (free_play) {
        keys_enabled = true;
        dom_button_start.style.backgroundColor = "#ffb921";
    } else {
        animateSequence();
    }
}

const setButtonHandlers = () => {
    document.querySelectorAll("button.key").forEach((element) => {
        element.addEventListener("click", onNumpadClicked);
    })

    document.querySelector("button.start").addEventListener("click", onStartClicked);
}

const initializeGame = () => {
    getDOMElements();
    setButtonHandlers();
}

window.onload = initializeGame;
