class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        this.cameras.main.setBounds(0, 0, width, height);

        let backgroundPicture = this.add.image(0, 0, "menu_background").setOrigin(0, 0);

        // background_picture.texture.setFilter(Phaser.Textures.NEAREST);

        let textStyle = {
            fontFamily: "verdana",
            fontSize: 24,
            fixedHeight: 64,
        };
        this.titleText = this.add.text(width / 2, height / 8, "What's all this junk??", textStyle);
        this.titleText.setOrigin(0.5, 0.5);
        this.titleText.setShadow(2, 1.5, "gray", 0, false, true);


        textStyle.fontSize = 14;
        this.playText = this.add.text(width / 2, height / 2, "Press Enter to play!", textStyle);
        this.playText.setOrigin(0.5, 0.5);

        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.confirm = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.confirm)) {
            this.scene.start('game');
        }
    }
}