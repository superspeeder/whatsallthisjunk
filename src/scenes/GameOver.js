class GameOverScene extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.lastScore = data.score;
        this.record = data.record;
    }

    create() {
        this.add.image(0, 0, TEXTURE_NAMES.MENU_BACKGROUND_2).setOrigin(0, 0);

        let textStyle = {
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: 24,
            color: 'white',
            fixedHeight: 40,
        };

        this.add.text(width / 2, height / 8, "Game Over", textStyle).setOrigin(0.5);

        textStyle.fontSize = 14;

        this.add.text(width / 2, height / 4, `Your score was: ${Math.floor(this.lastScore)}.` + (this.record ? ' (New Record!)' : ''), textStyle).setOrigin(0.5);

        this.playagain = new MenuButton(this, 'go-playagain', width / 2, 3 * height / 4, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Play Again", 0x75ffc6)
        this.retb = new MenuButton(this, 'go-return', width / 2, 3 * height / 4 + UI_LAYOUT.BUTTON.HEIGHT + 4, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Main Menu", 0xefff75)

        this.playagain.on('userevent.menu-button-down', () => {
            this.scene.start('game');
        })

        this.retb.on('userevent.menu-button-down', () => {
            this.scene.start('mainMenu');
        })
        this.sound.stopByKey('bgm');
    }

    update() {
    }
}