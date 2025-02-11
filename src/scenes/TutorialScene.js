class TutorialScene extends Phaser.Scene {
    constructor() {
        super('tutorial');
    }

    create() {
        this.add.image(0, 0, TEXTURE_NAMES.MENU_BACKGROUND_2).setOrigin(0, 0);

        let textStyle = {
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: 24,
            color: 'white',
            fixedHeight: 40,
        };

        this.add.text(width / 2, height / 8, "How To Play", textStyle).setOrigin(0.5);


        textStyle.fontSize = 11;
        this.add.text(width / 2, height / 4, "Use the left and right arrow keys to move to\navoid obstacles.", textStyle).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 40, "Destroy obstacles by pressing F to fire lasers.", textStyle).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 130, "Press SPACE to activate the special powerup", textStyle).setOrigin(0.5);
        this.add.text(width / 3 + 14, height / 2 + 150, "(an indicator will appear next to\nyour health bar when available).", textStyle).setOrigin(0.5);

        this.add.image(width / 3, height / 4 + 60, 'tutorial-move').setOrigin(1)
        this.add.image(width - 30, height / 4 + 120, 'tutorial-shoot').setOrigin(1)
        this.add.image(width / 2, height / 2 + 100, 'tutorial-powerup').setOrigin(1)
        // this.add.image(width / 2, height / 4 + 20, 'tutorial-move').setOrigin(0.75, 0.0)

        this.returnButton = new MenuButton(this, "tut-return", width - UI_LAYOUT.BUTTON.WIDTH / 2 - 8, height * 0.875, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Back")
        this.returnButton.on('userevent.menu-button-down', () => {
            this.scene.start('mainMenu');
        })
        this.sound.stopByKey('bgm');
    }

    update() {
    }
}