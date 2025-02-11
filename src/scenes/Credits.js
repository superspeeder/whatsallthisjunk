class CreditsScene extends Phaser.Scene {
    constructor() {
        super("credits")
    }

    create() {
        this.add.image(0, 0, TEXTURE_NAMES.MENU_BACKGROUND_2).setOrigin(0, 0);

        let textStyle = {
            fontFamily: UI_LAYOUT.TEXT.FONT_FAMILY,
            fontSize: 24,
            color: 'white',
            fixedHeight: 40,
        };

        this.add.text(width / 2, height / 8, "Credits", textStyle).setOrigin(0.5);
        textStyle.fontSize = 14;

        this.add.text(width / 2, height / 2, "This game is made by Andy Newton\nusing the Phaser 3 library.", textStyle).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 40, "This games art (visual and audio),\n is also made by Andy Newton.", textStyle).setOrigin(0.5);

        this.returnButton = new MenuButton(this, "credits-return", width - UI_LAYOUT.BUTTON.WIDTH / 2 - 8, height * 0.875, UI_LAYOUT.BUTTON.WIDTH, UI_LAYOUT.BUTTON.HEIGHT, "Back")
        this.returnButton.on('userevent.menu-button-down', () => {
            this.scene.start('mainMenu');
        })
        this.sound.stopByKey('bgm');
    }
}