const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            enableBody: true,
            debug: false
        }
    },
    scene: [StartScreen, MyGame, EndScreen]
};

const game = new Phaser.Game(config);