'use strict';

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    scene: [LoadScene, MainMenuScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    antialias: false,
    antialiasGL: false,
    pixelArt: true,
}

const game = new Phaser.Game(config);

let width = config.width, height = config.height;
