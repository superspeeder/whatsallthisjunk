'use strict';

const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 400,
    scene: [LoadScene, MainMenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
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
    GAME_BACKGROUND: "background",
    OBSTACLES: "obstacles",
    NEBULAE: "nebulae",
};
