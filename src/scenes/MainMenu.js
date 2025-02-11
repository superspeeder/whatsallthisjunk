class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        this.add.image(0, 0, TEXTURE_NAMES.MENU_BACKGROUND).setOrigin(0, 0);

        // background_picture.texture.setFilter(Phaser.Textures.NEAREST);

        let textStyle = {
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: 24,
            fixedHeight: 64,
        };
        this.titleText = this.add.text(width / 2, height / 8, "What's all this junk??", textStyle);
        this.titleText.setOrigin(0.5, 0.5);
        this.titleText.setShadow(2, 1.5, "gray", 0, false, true);


        textStyle.fontSize = 16;
        textStyle.fixedHeight = 20;
        textStyle.color = 'gold';

        let highScore = getHighScore();
        this.highScoreText = this.add.text(width / 2, height / 4, `High Score: ${highScore}`, textStyle);
        this.highScoreText.setOrigin(0.5);
        

        this.playButton = new MenuButton(this, "mm-play", width - 8 - UI_LAYOUT.BUTTON.WIDTH / 2, height / 2, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Play", 0x75ffc6);
        this.tutorialButton = new MenuButton(this, "mm-tutorial", width - 8 - UI_LAYOUT.BUTTON.WIDTH / 2, height / 2 + (UI_LAYOUT.BUTTON.HEIGHT + 4), UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Tutorial", 0xefff75)
        this.resetButton = new MenuButton(this, "mm-reset", width - 8 - UI_LAYOUT.BUTTON.WIDTH / 2, height / 2 + (UI_LAYOUT.BUTTON.HEIGHT + 4) * 2, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Reset", 0xff7775);
        this.creditsButton = new MenuButton(this, "mm-credits", width - 8 - UI_LAYOUT.BUTTON.WIDTH / 2, height / 2 + (UI_LAYOUT.BUTTON.HEIGHT + 4) * 3, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Credits", 0xaa54ff);

        this.playButton.on('userevent.menu-button-down', (key) => {
            this.scene.start('game');
        })

        this.resetButton.on('userevent.menu-button-down', () => {
            resetPersistence();
            this.highScoreText.setText(`High Score: 0`)
        })

        this.tutorialButton.on('userevent.menu-button-down', () => {
            this.scene.start('tutorial');
        })
        
        this.creditsButton.on('userevent.menu-button-down', () => {
            this.scene.start('credits');
        })

        this.sound.stopByKey('bgm');
    }

    update() {
    }
}