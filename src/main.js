'use strict';

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    scene: [LoadScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
}

const game = new Phaser.Game(config);

let width = game.width, height = game.height;
