class EndScreen extends Phaser.Scene {
    constructor() {
        super("EndScreen")
    }

    create() {
        this.add.text(300, 200, "Game Over", { fontSize: "32px", fill: "#000000" })
        this.add.text(300, 400, "Click to Start Over", { fontSize: "18px", fill: "#000000" })
        this.add.text(300, 500, `Score: ${totalScore}`, { fontSize: "18px", fill: "#000000" })
        totalScore = 0

        this.input.on("pointerup", () => {
            this.scene.stop("EndScreen")
            this.scene.start("MyGame")
        })
    }
}