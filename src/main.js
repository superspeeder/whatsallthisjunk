/*
Name: Andy Newton
Game Title: What's all this Junk??
Approx. Hours Spent: 28 hrs.

Creative Tilt:
    What does my game do that is technically interesting? Are you particularly proud of a programming technique you implemented? Did you look beyond the class examples and learn how to do something new?
        I made my own finite state machine and object pooling implementations, as well as a way to easily generate a distribution of things without being totally random (which I use for the amounts of the different kinds of obstacles).
        I also think that the way I manage obstacles is interesting, since I hold a pool of offscreen obstacles and have a minimum number of allowed offscreen obstacles, which is important because the pool of offscreen obstacles is how I make it more random in how the next obstacle gets selected since I don't just immediately move one from the bottom back to the top, instead I take a random offscreen one every time the timer runs out.
        I also spent a good amount of time learning how to write the .d.ts files so I could write those for the FSM implementation I made, which was fun. I also learned how to use JSDoc comments along the way, which helped my productivity immensely (autocomplete is always so nice).
        Another thing I enjoyed making was my abstraction of menu buttons, which made it so much easier to get cohesive looking buttons that are easy to just drop into a scene. For example, it only took me about 1 minute to hook up the buttons on the game over screen for return to main menu and play again.
    
    Does my game have a great visual style? Does it use music or art that you're particularly proud of? Are you trying something new or clever with the endless runner form?
        While I'm most certainly *not* doing anything especially clever with the endless runner form, I like how everything came together from my original idea. My original idea was to have the player dodging junk in space that doesn't exactly make sense to be there.
        I am especially proud of the bubble that you get a power up from, as that was fun and good practice to draw and animate (I'm definitely still working on my pixel art skills). I also think most of the other assets and the overall visual style doesn't look too inconsistent, and I think that everything works well together.
        I definitely think that the parallax I do for the background layers is super helpful in tying together the visual style (the nebulae were also really cool to get looking right since they really help to sell the scene in my opinion).
        I also think the audio elements ended up working out pretty well.
*/

'use strict';

const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 400,
    scene: [LoadScene, MainMenuScene, GameScene, TutorialScene, GameOverScene, CreditsScene],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }
        },
    },
    zoom: 2,
    pixelArt: true,
}

const game = new Phaser.Game(config);

let width = config.width, height = config.height;

/** @enum {integer} */
const LAYERS = {
    BACKGROUND: 0,
    BACKGROUND_DECORATION: 1,
    BACKGROUND_OBJECTS: 2,
    PLAYER: 3,
    FOREGROUND_OBJECTS: 4,
    COLLECTIBLES: 5,
    PARTICLES: 6,

    // unlike the others, UI_START is used as an offset for ui, since I use multiple levels for ui elements to make things easier to organize.
    UI_START: 10,
}

/** 
 * @typedef {Object} GameSettings
 * @property {integer} NUM_OBSTACLES
 * @property {integer} NUM_OFFSCREEN_OBSTACLES
 * @property {number} SCROLL_SPEED
 * @property {number} OBSTACLE_SPAWN_TIMING_MIN
 * @property {number} OBSTACLE_SPAWN_TIMING_MAX
 * @property {number} LASER_SHOT_SPEED
 * @property {number} PLAYER_MOVE_SPEED
 * @property {integer} MAX_HEALTH
 * @property {integer} RESPAWN_TIME
 */

/** @type {GameSettings} */
const GAME_SETTINGS = {
    // Total number of obstacles created.
    NUM_OBSTACLES: 96,

    // These will be in the collection of offscreen obstacles that the system chooses from when introducing the next obstacle.
    NUM_OFFSCREEN_OBSTACLES: 26,

    // How fast does everything move towards the player
    SCROLL_SPEED: 80, // in pixels/sec

    OBSTACLE_SPAWN_TIMING_MIN: 250,
    OBSTACLE_SPAWN_TIMING_MAX: 750,

    LASER_SHOT_SPEED: 100,
    PLAYER_MOVE_SPEED: 100,
    MAX_HEALTH: 5,
    RESPAWN_TIME: 750,
    POWERUP_SPAWN_TIME_MIN: 0,
    POWERUP_SPAWN_TIME_MAX: 100,
    GAMETIME_SPEEDFACTOR: 0.05,
    POWERUP_DURATION: 500,
};

/** @enum {integer} */
const OBSTACLE_TYPES = {
    CAR_TEAL: 0,
    CAR_RED: 1,
    CARDBOARD_BOX_INDIVIDUAL: 2,
    CARDBOARD_BOX_STACK: 3,
};


/** @type {DistributionDefEntry<integer>} */
const OBSTACLE_DISTRIBUTION = [
    { value: OBSTACLE_TYPES.CAR_TEAL, p: 0.2 },
    { value: OBSTACLE_TYPES.CAR_RED, p: 0.2 },
    { value: OBSTACLE_TYPES.CARDBOARD_BOX_INDIVIDUAL, p: 0.35 },
    { value: OBSTACLE_TYPES.CARDBOARD_BOX_STACK, p: 0.25 },
];

// if a layer isn't in this object, then it does not move with the world (i.e. ui layers, player, collectibles).
/** @type {Object.<integer, number>} */
const PARALLAX_FACTORS = {
    [LAYERS.BACKGROUND]: 0.2,
    [LAYERS.BACKGROUND_DECORATION]: 0.25,
    [LAYERS.BACKGROUND_OBJECTS]: 1.0,
    [LAYERS.FOREGROUND_OBJECTS]: 1.0,
    [LAYERS.PARTICLES]: 1.0,
};

const OBSTACLE_TYPE_NAMES = {
    [OBSTACLE_TYPES.CAR_TEAL]: "car-teal",
    [OBSTACLE_TYPES.CAR_RED]: "car-red",
    [OBSTACLE_TYPES.CARDBOARD_BOX_INDIVIDUAL]: "cardboard-box",
    [OBSTACLE_TYPES.CARDBOARD_BOX_STACK]: "cardboard-box-stack",
};

const TEXTURE_NAMES = {
    MENU_BACKGROUND: "menu_background",
    MENU_BACKGROUND_2: "menu_background_2",
    GAME_BACKGROUND: "background",
    OBSTACLES: "obstacles",
    NEBULAE: "nebulae",
    PLAYER: "player",
    LASER_SHOT: "laser_shot",
    HEALTH_BAR: "health_bar",
    POWERUP: "powerup",
};

const ANIM_NAMES = {
    PLAYER_IDLE: "player-idle",
    PLAYER_FIRING: "player-firing",
    PLAYER_FIRING_COOLDOWN: "player-firing-cooldown",
    POWERUP_IDLE: "powerup-idle",
    POWERUP_POP: "powerup-pop",
};

const ANIM_FRAMERATES = {
    PLAYER_IDLE: 8,
    PLAYER_FIRING: 12,
    PLAYER_FIRING_COOLDOWN: 8,
    POWERUP_IDLE: 16,
    POWERUP_POP: 8,
};

const ANIM_FRAMES = {
    PLAYER_IDLE: [0,1,2],
    PLAYER_FIRING: [3,4,5,6],
    PLAYER_FIRING_COOLDOWN: [7,8,9,10],
    POWERUP_IDLE: [0,1,2,3,4,5,6,7,8,9,10],
    POWERUP_POP: [11,12,13,14,15,16,17,18,19,20],
};

const ANIM_PLAYER_IDLE_REPEAT_DELAY = 750;

const UI_LAYOUT = {
    HEALTH_BAR: {
        x: 8,
        y: 8,
    },
    BUTTON: {
        STROKE_WIDTH: 2,
        FONT_SIZE: 14,
        WIDTH: 80,
        HEIGHT: 32,
    },
    TEXT: {
        FONT_FAMILY: 'verdana',
    }
};

function getHighScore() {
    let highScore = localStorage.getItem("whatsallthisjunk.highScore");
    if (highScore === null || highScore === undefined) {
        return 0;
    } else {
        return parseInt(highScore);
    }
}

/**
 * @param {integer} score
 */
function saveHighScore(score) {
    if (Math.floor(score) > getHighScore()) {
        localStorage.setItem("whatsallthisjunk.highScore", Math.floor(score).toString())
        return true;
    }
    return false;
}

function resetPersistence() {
    localStorage.removeItem("whatsallthisjunk.highScore");
}