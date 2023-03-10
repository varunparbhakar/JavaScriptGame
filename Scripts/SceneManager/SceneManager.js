/**
 * (WARNING) All World-based drawing to render canvas must subtract by this (GAME_ENGINE.camera) posXOriginal & posYOriginal.
 */
class SceneManager {
    //TODO Round Manager
    //TODO Scoreboard

    constructor(levelString="dlc1") {
        //Camera
        GAME_ENGINE.camera = this;
        this.posX = 0;
        this.posY = 0;
        this.shake_current = 0
        this.shake_intensity = 0
        this.isTrackingPlayer = true

        //Map
        this.changeLevel(levelString) //TODO TITLE
    }

    /**
     * Moves Camera to midpoint between Player World Pos & Mouse World Pos
     */
    update() {
        if (this.isTrackingPlayer) {
            if (this.player == null) return
            //Moved Up and Left by (GAME_ENGINE.ctx.canvas.[width/height] / 2) for centering
            this.posX = ((this.player.posX + GAME_ENGINE.getMouseWorldPosX()) / 2) - (GAME_ENGINE.ctx.canvas.width / 2)
            this.posY = ((this.player.posY + GAME_ENGINE.getMouseWorldPosY()) / 2) - (GAME_ENGINE.ctx.canvas.height / 2)
        }
        //shakeHandler
        if (this.shake_current > 0) {
            this.posX += ((Math.random() * 2) - 1) * this.shake_intensity * (this.shake_current/this.shake_max)
            this.posY += ((Math.random() * 2) - 1) * this.shake_intensity * (this.shake_current/this.shake_max)
            this.shake_current -= GAME_ENGINE.clockTick
        } else {
            this.shake_current = 0
            this.shake_max = 0
            this.shake_intensity = 0
        }
    }

    draw() {

    }

    /**
     *
     */
    changeLevel(level) {
        GAME_ENGINE.clearWorld()
        switch (level) {
            case "dlc1":
                this.map = new WorldMap(0,0, "dlc1")
                this.player = this.map.player
                GAME_ENGINE.addEntity(new PauseMenu())
                break;
            case "proto":
                this.map = new WorldMap(0,0, "proto")
                this.player = this.map.player
                GAME_ENGINE.addEntity(new PauseMenu())
                break
            case "zm_vargamble":
                this.map = new WorldMap(0,0, "zm_vargamble")
                this.player = this.map.player
                GAME_ENGINE.addEntity(new PauseMenu())
                break;
        }
        GAME_ENGINE.unpressKeys()
    }

    startShake(length, intensity) {
        this.shake_current += length
        this.shake_max = Math.max(this.shake_max, length)
        this.shake_intensity = Math.max(this.shake_intensity, intensity)
    }

    resetShake() {
        this.shake_current = 0
    }
}