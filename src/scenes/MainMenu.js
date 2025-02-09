class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        this.cameras.main.setBounds(0, 0, width / 2, height / 2);

        let background_picture = this.add.image(0, 0, "menu_background").setScale(2).setOrigin(0, 0);

        let textStyle = {
            fontFamily: "verdana",
            fontSize: 36,
        };
        this.titleText = this.add.text(width / 2, height / 8, "What's all this junk??", textStyle).setOrigin(0.5, 0.5);
    }

    update() {

    }
}