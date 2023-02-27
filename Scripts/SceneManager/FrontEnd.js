class FrontEnd {
    constructor() {
        //For ez GAME_ENGINE addEntity
    }
}

class DoneLoadingScreen extends FrontEnd {
    constructor() {
        super()
        this.asset = ASSET_MANAGER.getAsset("Assets/Images/Items/Just_Cartoon_Teddy.png")
    }

    update() {
        if (GAME_ENGINE.left_click) { //has to be delayed
            this.removeFromWorld = true
            GAME_ENGINE.addEntity(new MainMenu());
        }
    }

    draw() {
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "black"
        GAME_ENGINE.ctx.globalAlpha = 1
        GAME_ENGINE.ctx.fillRect(0,0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)

        GAME_ENGINE.ctx.drawImage(
        	this.asset, //what
        	0, 0, //starting at
        	232, 340, //to
            GAME_ENGINE.ctx.canvas.width/2 - 232/2 + 250, GAME_ENGINE.ctx.canvas.height/2 - 340/2,
        	232, 340
        )

        GAME_ENGINE.ctx.font = 'bold 50px arial'
        GAME_ENGINE.ctx.fillStyle = "white"
        GAME_ENGINE.ctx.textAlign = "center"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 10
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText("Loading Completed", GAME_ENGINE.ctx.canvas.width/2 - 250, GAME_ENGINE.ctx.canvas.height/2)
        GAME_ENGINE.ctx.fillText("Click the screen to continue...", GAME_ENGINE.ctx.canvas.width/2 - 250, GAME_ENGINE.ctx.canvas.height/2 + 45)
        GAME_ENGINE.ctx.restore()
    }
}

const FE_X = 50
const FE_Y = 200
const FE_Y_BUTTON = FE_Y + 150
class MainMenu extends FrontEnd {
    constructor() {
        super();


        this.cursor = new BoundingBox(0,0, 1,1)
        this.cursor.updateSides()
        this.lastLeftClick = GAME_ENGINE.left_click

        //bottom
        this.bottomDesc = new DescriptionBottom()

        //BGM

        let optionsButton = new OptionsButton()
        optionsButton.use = () => {
            if(this.submenu != undefined) this.submenu = undefined
            else this.submenu = new OptionsMenu(this.cursor, this.bottomDesc, false)
        }
        this.buttons=[
            new PlayButton(),
            optionsButton,
            new Button(FE_Y_BUTTON + 300, "Download All Audio", "Download all sounds now, removing streaming delay (size = TODO MB)."),
        ]
        this.title = "Ye Zombie"
    }

    update() {
        //cursor
        try {
            this.cursor.x = GAME_ENGINE.mouse.x
            this.cursor.y = GAME_ENGINE.mouse.y
        } catch (e) {
            this.cursor.x = 0
            this.cursor.y = 0
        }
        this.cursor.updateSides()

        if(this.submenu != undefined) this.submenu.update();


        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update()
            if (this.cursor.collide(this.buttons[i].bb)) {
                this.buttons[i].hover1(this.bottomDesc)
                if (this.tryClick()) {
                    this.buttons[i].use()
                }
            }
        }
        this.lastLeftClick = GAME_ENGINE.left_click
    }

    draw() {
        //background
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "black"
        GAME_ENGINE.ctx.fillRect(0, 0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)
        GAME_ENGINE.ctx.strokeStyle = "white"
        GAME_ENGINE.ctx.strokeRect(0, 0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)
        GAME_ENGINE.ctx.restore()

        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "white"
        GAME_ENGINE.ctx.font = 'bold 100px arial'
        GAME_ENGINE.ctx.textAlign = "left"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 5
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText(this.title, FE_X, FE_Y)
        GAME_ENGINE.ctx.restore()

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw()
        }
    
        if(this.submenu != undefined) this.submenu.draw();


        this.bottomDesc.draw()

        this.cursor.drawBoundingBox("red")
    }

    tryClick() {
        return this.lastLeftClick == false && GAME_ENGINE.left_click
    }
}

class PauseMenu extends MainMenu {
    constructor() {
        super(        [
                new ExitButton()
            ],
            "Paused");
    }

    update() {
        if (GAME_ENGINE.options.paused) {
            super.update()
        }
    }
    draw() {
        if (GAME_ENGINE.options.paused) {
            GAME_ENGINE.ctx.save()
            GAME_ENGINE.ctx.fillStyle = "black"
            GAME_ENGINE.ctx.globalAlpha = 0.5
            GAME_ENGINE.ctx.fillRect(0, 0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)
            GAME_ENGINE.ctx.strokeStyle = "white"
            GAME_ENGINE.ctx.strokeRect(0, 0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)
            GAME_ENGINE.ctx.restore()


            GAME_ENGINE.ctx.save()
            //title
            GAME_ENGINE.ctx.fillStyle = "white"
            GAME_ENGINE.ctx.font = 'bold 100px arial'
            GAME_ENGINE.ctx.textAlign = "left"
            GAME_ENGINE.ctx.shadowColor = "black"
            GAME_ENGINE.ctx.shadowBlur = 5
            GAME_ENGINE.ctx.shadowOffsetX = 5;
            GAME_ENGINE.ctx.shadowOffsetY = 5;
            GAME_ENGINE.ctx.fillText(this.title, FE_X, FE_Y)

            //Stats
            let statsOffsetX = 1000
            GAME_ENGINE.ctx.textAlign = "left"
            GAME_ENGINE.ctx.fillText("Stats", FE_X + statsOffsetX, FE_Y)

            //Kills & Points
            GAME_ENGINE.ctx.font = 'bold 50px arial'
            GAME_ENGINE.ctx.fillText("Total Kills: " + GAME_ENGINE.camera.map.roundManager.scoreboard_kills, FE_X + statsOffsetX, FE_Y + 70)
            GAME_ENGINE.ctx.fillText("Points Earned: " + GAME_ENGINE.camera.map.roundManager.scoreboard_points, FE_X + statsOffsetX, FE_Y + 70 + 60)

            //Controls
            GAME_ENGINE.ctx.font = 'bold 100px arial'
            GAME_ENGINE.ctx.fillText("Controls", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150)
            GAME_ENGINE.ctx.font = 'bold 50px arial'
            GAME_ENGINE.ctx.fillText("WASD - Move", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70)
            GAME_ENGINE.ctx.fillText("MouseL - Shoot", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70 + 60)
            GAME_ENGINE.ctx.fillText("MouseR - Knife", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70 + (60*2))
            GAME_ENGINE.ctx.fillText("R - Reload", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70+ (60*3))
            GAME_ENGINE.ctx.fillText("Q - Switch Weapons", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70 + (60*4))
            GAME_ENGINE.ctx.fillText("E - Throw Grenade", FE_X + statsOffsetX, FE_Y + 70 + 60 + 150 + 70 + (60*5))

            GAME_ENGINE.ctx.restore()

            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].draw()
            }

            this.bottomDesc.draw()

            this.cursor.drawBoundingBox("red")
        }
    }
}

/**
 *  -Aspect Ratio (adjuster buttons 16:9, 21:9)
    -Zombie concurrent amount (int slider or adjuster buttons [24, 32, 48 ,56, 64])
    -always run zombie (bool button)
    -no spawn delay (bool button)
    -starting money (int slider or adjuster buttons [500, 1000, 1500, 2000, 2500, etc.])
    -starting round (int slider or adjuster buttons [1 to 250 by 1])
    -Cheats (bool button)
 */
class OptionsMenu extends FrontEnd {
    constructor(cursor, bottomDesc) {
        super();
        this.bottomDesc = bottomDesc
        this.cursor = cursor
        
        this.labelText = [
            "Aspect Ratio:", 
            "Zombie concurrent amount:", 
            "Always run zombie:", 
            "No spawn delay:",
            "Starting money:",
            "Starting round:",
            "Cheats:"
        ]
        this.labels = []

        for(let i = 0; i < this.labelText.length; i++){
            this.labels.push(new Label(850, 260 + (i * 150), this.labelText[i]))
        }

        let aspect169 = new GeneralButton("16/9", "Set aspect ratio to 16/9", 1280, 260);
        aspect169.use = function(a) {
            console.log("b1")
            aspect169.setSelected(true)
            aspect219.setSelected(false)
        }

        let aspect219 = new GeneralButton("21/9", "Set aspect ratio to 21/9", 1450, 260);
        aspect219.use = function(a) {
             
            aspect169.setSelected(false)
            aspect219.setSelected(true)
        }


        let index = 1;
        let zombieAmountValue = GAME_ENGINE.options.mainMenu_options_zombieAmount;
        let zombieAmountPlus = new GeneralButton("+", "Increase zombie amount", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let zombieAmount = new GeneralButton(zombieAmountValue, zombieAmountValue, 850 + this.getTextSize(this.labelText[index]) + 80, 260 + (index * 150), false);
        let zombieAmountMinus = new GeneralButton("-", "Decrease zombie amount", 850 + this.getTextSize(this.labelText[index]) + 80 + this.getTextSize(zombieAmountValue) + 25, 260 + (index * 150));


        zombieAmountPlus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(zombieAmountValue).width
            zombieAmountValue += 1
            if(zombieAmountValue < 0) zombieAmountValue = 0;
            let b = GAME_ENGINE.ctx.measureText(zombieAmountValue).width

            GAME_ENGINE.options.mainMenu_options_zombieAmount = zombieAmountValue;


            zombieAmount.setTitle(zombieAmountValue)

            zombieAmountMinus.setX(b-a)
        }

        zombieAmountMinus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(zombieAmountValue).width
            zombieAmountValue -= 1
            if(zombieAmountValue < 0) zombieAmountValue = 0;
            let b = GAME_ENGINE.ctx.measureText(zombieAmountValue).width
            GAME_ENGINE.options.mainMenu_options_zombieAmount = zombieAmountValue;

            zombieAmount.setTitle(zombieAmountValue)

            zombieAmountMinus.setX(b-a)
        }

        index++
        let alwaysRunT = new GeneralButton("True", "Zombies will always run", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let alwaysRunF = new GeneralButton("False", "Zombies wont always run", 850 + this.getTextSize(this.labelText[index]) + this.getTextSize("True") + 60, 260 + (index * 150));

        alwaysRunT.setSelected(GAME_ENGINE.options.mainMenu_options_zombiesAlwaysRun)
        alwaysRunF.setSelected(!GAME_ENGINE.options.mainMenu_options_zombiesAlwaysRun)
        alwaysRunT.use = function(a) {
             
            alwaysRunT.setSelected(true)
            alwaysRunF.setSelected(false)

            GAME_ENGINE.options.mainMenu_options_zombiesAlwaysRun = true;

        }

        alwaysRunF.use = function(a) {
             
            alwaysRunT.setSelected(false)
            alwaysRunF.setSelected(true)

            GAME_ENGINE.options.mainMenu_options_zombiesAlwaysRun = false;
        }

        index++
        let spawnDelayT = new GeneralButton("True", "Zombies will spawn delayed", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let spawnDelayF = new GeneralButton("False", "Zombies wont spawn delayed", 850 + this.getTextSize(this.labelText[index]) + this.getTextSize("True") + 60, 260 + (index * 150));

        spawnDelayT.setSelected(GAME_ENGINE.options.mainMenu_options_zombiesSpawnDelay)
        spawnDelayF.setSelected(!GAME_ENGINE.options.mainMenu_options_zombiesSpawnDelay)
        spawnDelayT.use = function(a) {
             
            spawnDelayT.setSelected(true)
            spawnDelayF.setSelected(false)

            GAME_ENGINE.options.mainMenu_options_zombiesSpawnDelay = true;
        }

        spawnDelayF.use = function(a) {
             
            spawnDelayT.setSelected(false)
            spawnDelayF.setSelected(true)

            GAME_ENGINE.options.mainMenu_options_zombiesSpawnDelay = false;
        }


        index++
        let startingMoneyValue = GAME_ENGINE.options.mainMenu_options_startingMoney;
        let startingMoneyPlus = new GeneralButton("+", "Increase starting money amount", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let startingMoney = new GeneralButton(startingMoneyValue, startingMoneyValue, 850 + this.getTextSize(this.labelText[index]) + 80, 260 + (index * 150), false);
        let startingMoneyMinus = new GeneralButton("-", "Increase starting money amount", 850 + this.getTextSize(this.labelText[index]) + 80 + this.getTextSize(startingMoneyValue) + 25, 260 + (index * 150));


        startingMoneyPlus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(startingMoneyValue).width
            startingMoneyValue += 500
            if(startingMoneyValue < 0) startingMoneyValue = 0;
            let b = GAME_ENGINE.ctx.measureText(startingMoneyValue).width

            GAME_ENGINE.options.mainMenu_options_startingMoney = startingMoneyValue;
            
            startingMoney.setTitle(startingMoneyValue)
            startingMoneyMinus.setX(b-a)
        }

        startingMoneyMinus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(startingMoneyValue).width
            startingMoneyValue -= 500
            if(startingMoneyValue < 0) startingMoneyValue = 0;
            let b = GAME_ENGINE.ctx.measureText(startingMoneyValue).width

            GAME_ENGINE.options.mainMenu_options_startingMoney = startingMoneyValue;

            startingMoney.setTitle(startingMoneyValue)
            startingMoneyMinus.setX(b-a)
        }


        index++
        let startingRoundValue = GAME_ENGINE.options.mainMenu_options_zombiesStartingRound;
        let startingRoundPlus = new GeneralButton("+", "Increase starting round", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let startingRound = new GeneralButton(startingRoundValue, startingRoundValue, 850 + this.getTextSize(this.labelText[index]) + 80, 260 + (index * 150), false);
        let startingRoundMinus = new GeneralButton("-", "Decrease starting round", 850 + this.getTextSize(this.labelText[index]) + 80 + this.getTextSize(startingRoundValue) + 25, 260 + (index * 150));


        startingRoundPlus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(startingRoundValue).width
            startingRoundValue += 1
            if(startingRoundValue == 0) startingRoundValue = 1;
            let b = GAME_ENGINE.ctx.measureText(startingRoundValue).width


            GAME_ENGINE.options.mainMenu_options_zombiesStartingRound = startingRoundValue;

            startingRound.setTitle(startingRoundValue)
            startingRoundMinus.setX(b-a)
        }

        startingRoundMinus.use = function() {
            GAME_ENGINE.ctx.font = 'bold 60px arial'
            let a = GAME_ENGINE.ctx.measureText(startingRoundValue).width
            startingRoundValue -= 1
            if(startingRoundValue < 0) startingRoundValue = 0;
            let b = GAME_ENGINE.ctx.measureText(startingRoundValue).width

            GAME_ENGINE.options.mainMenu_options_zombiesStartingRound = startingRoundValue;

            startingRound.setTitle(startingRoundValue)
            startingRoundMinus.setX(b-a)
        }


        index++
        let cheatsT = new GeneralButton("True", "Cheats enabled", 850 + this.getTextSize(this.labelText[index]) + 20, 260 + (index * 150));
        let cheatsF = new GeneralButton("False", "Cheats disabled", 850 + this.getTextSize(this.labelText[index]) + this.getTextSize("True") + 60, 260 + (index * 150));

        cheatsT.setSelected(GAME_ENGINE.options.mainMenu_options_cheats)
        cheatsF.setSelected(!GAME_ENGINE.options.mainMenu_options_cheats)
        cheatsT.use = function(a) {
             
            cheatsT.setSelected(true)
            cheatsF.setSelected(false)
            
            GAME_ENGINE.options.mainMenu_options_cheats = true;
        }

        cheatsF.use = function(a) {
             
            cheatsT.setSelected(false)
            cheatsF.setSelected(true)
            
            GAME_ENGINE.options.mainMenu_options_cheats = false;
        }
        
        this.buttons=[
            aspect169,
            aspect219,

            zombieAmountPlus,
            zombieAmount,
            zombieAmountMinus,

            alwaysRunT,
            alwaysRunF,

            spawnDelayT,
            spawnDelayF,

            startingMoneyPlus,
            startingMoney,
            startingMoneyMinus,

            startingRoundPlus,
            startingRound,
            startingRoundMinus,

            cheatsT,
            cheatsF
        ]

        this.backGroundPanel = new Panel(800, 180, 1400, 1050)
    }

    getTextSize(text) {
        GAME_ENGINE.ctx.font = 'bold 60px arial'
        return  GAME_ENGINE.ctx.measureText(text).width
    }

    update() {

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update()
            if (this.cursor.collide(this.buttons[i].bb)) {
                this.buttons[i].hover1(this.bottomDesc)
                if (this.tryClick()) {
                    this.buttons[i].use()
                }
            }
        }
        this.lastLeftClick = GAME_ENGINE.left_click
    }

    draw() {
        this.backGroundPanel.draw()

        for (let i = 0; i < this.labels.length; i++) {
            this.labels[i].draw()
        }

        //background
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw()
        }
    }

    tryClick() {
        return this.lastLeftClick == false && GAME_ENGINE.left_click
    }
}

class Panel extends FrontEnd {
    constructor(posX, posY, width, height) {
        super();
        Object.assign(this, {posX, posY})

        this.width = width;
        this.height = height
    }

    draw() {
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "green";
        GAME_ENGINE.ctx.fillRect(this.posX, this.posY, this.width, this.height);
        GAME_ENGINE.ctx.restore()
    }


}

class Button extends FrontEnd {
    constructor(posY, text, description, posX=FE_X) {
        super();
        Object.assign(this, {posX, posY, text, description})
        this.bb = new BoundingBox(posX, posY - 50, 600, 60)
        this.hover = false
    }

    update() {

    }

    draw() {
        let width = GAME_ENGINE.ctx.canvas.width
        let height = GAME_ENGINE.ctx.canvas.height
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.font = 'bold 60px arial'
        GAME_ENGINE.ctx.fillStyle = this.hover ? "yellow" : "white"
        this.hover = false
        GAME_ENGINE.ctx.textAlign = "left"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 5
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText(this.text, this.posX, this.posY)
        GAME_ENGINE.ctx.restore()

        
        this.bb.drawBoundingBox()
    }

    use() {
        console.log(this.text, "clicked")
    }

    hover1(bottomDesc) {
        this.hover = true
        bottomDesc.hudText(this.description)
    }
}

class Label extends FrontEnd {
    constructor(posX, posY, text) {
        super();
        Object.assign(this, {posX, posY, text})
    }

    update() {

    }

    draw() {
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.font = 'bold 60px arial'
        GAME_ENGINE.ctx.fillStyle = "white"

        GAME_ENGINE.ctx.textAlign = "left"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 5
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText(this.text, this.posX, this.posY)
        GAME_ENGINE.ctx.restore()

    }

}

class GeneralButton extends FrontEnd {
    constructor(title, hud, x, y, hoverIsOn = true, selected = false) {
        super();
        Object.assign(this, {title, hud, x, y, hoverIsOn, selected})
        
        this.bb = new BoundingBox(x, y - 50, 600, 60)
        this.hover = false
    }

    update() {

    }

    draw() {
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.font = 'bold 60px arial'
        GAME_ENGINE.ctx.fillStyle = this.selected ? "red" : this.hover && this.hoverIsOn ? "yellow" : "white"
        GAME_ENGINE.ctx.textAlign = "left"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 5
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText(this.title, this.x, this.y)

        const textWidth = GAME_ENGINE.ctx.measureText(this.title).width;
        const textHeight = 60;

        const x = this.x - 5;
        const y = this.y - 60;
        const width = textWidth + 15;
        const height = textHeight + 15;
        
        GAME_ENGINE.ctx.strokeStyle = this.selected ? "red" : this.hover && this.hoverIsOn ? "yellow" : "white"
        GAME_ENGINE.ctx.lineWidth = 3;
        GAME_ENGINE.ctx.strokeRect(x, y, width, height);
        this.hover = false

        GAME_ENGINE.ctx.restore()

        this.bb = new BoundingBox(x, y, width, height)
        this.bb.drawBoundingBox()
    }

    use() {
    }

    setTitle(title) {
        this.title = title;
    }

    setX(x) {
        this.x += x;
    }

    setSelected(bool) {
        this.selected = bool;
    }

    hover1(bottomDesc) {
        this.hover = true
        bottomDesc.hudText(this.hud)
    }

}


class OptionsButton extends Button {
    constructor() {
        super(FE_Y_BUTTON + 100, "Options", "Configure options of gameplay.");
    }

    use() {
        console.log("YO")
        console.log("Y2O")
    }
}

class PlayButton extends Button {
    constructor() {
        super(FE_Y_BUTTON, "Play", "Choose the map and play.");
    }

    use() {
        GAME_ENGINE.dontUpdatePlayerThisTick = true
        GAME_ENGINE.addEntity(new SceneManager())
        GAME_ENGINE.options.paused = false
    }
}

// class RestartButton extends Button {
//     constructor() {
//         super(FE_Y_BUTTON, "Restart", "Restart current game. (WARNING: This feature break game sound atm)");
//     }
//
//     use() {
//         GAME_ENGINE.clearWorld(true)
//         GAME_ENGINE.dontUpdatePlayerThisTick = true
//         GAME_ENGINE.addEntity(new RestartScreen())
//         GAME_ENGINE.options.paused = false
//     }
// }

class ExitButton extends Button {
    constructor() {
        super(FE_Y_BUTTON, "End Game", "Return to main menu.");
    }

    use() {
        GAME_ENGINE.ent_Player.takeDamage(GAME_ENGINE.ent_Player.hp)
        GAME_ENGINE.options.paused = false
    }
}

class DescriptionBottom extends FrontEnd {
    constructor() {
        super();
        this.text = null
    }

    update() {

    }

    draw() {
        let width = GAME_ENGINE.ctx.canvas.width
        let height = GAME_ENGINE.ctx.canvas.height
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "white"
        GAME_ENGINE.ctx.fillRect(FE_X, GAME_ENGINE.ctx.canvas.height - 100, width - FE_X * 2, 2)
        if (this.text != null) {
            GAME_ENGINE.ctx.font = 'bold 40px arial' //TODO
            GAME_ENGINE.ctx.textAlign = "left"
            GAME_ENGINE.ctx.shadowColor = "black"
            GAME_ENGINE.ctx.shadowBlur = 5
            GAME_ENGINE.ctx.shadowOffsetX = 5;
            GAME_ENGINE.ctx.shadowOffsetY = 5;
            GAME_ENGINE.ctx.fillText(this.text, FE_X, GAME_ENGINE.ctx.canvas.height - 50)

        }
        GAME_ENGINE.ctx.restore()
        this.text = null
    }

    hudText(text) {
        this.text = text
    }
}

class DieScreen extends FrontEnd {
    constructor() {
        super();
        this.timer = 0
        this.roundDiedOn = GAME_ENGINE.camera.map.roundManager.curr_Round
        GAME_ENGINE.addEntity(new Sound("Assets/Audio/BGM/dieScreen1.mp3", MIXER_MUSIC_VOL))
        GAME_ENGINE.camera.map.bgmPlayer.duckAmbForSec(100)

        this.atSwitch = () => {
            GAME_ENGINE.camera.map.hud.fullscreenFlash.flash(3, "black")
            GAME_ENGINE.camera.resetShake()

            this.atSwitch = null
        }
    }

    draw() {
        let width = GAME_ENGINE.ctx.canvas.width
        let height = GAME_ENGINE.ctx.canvas.height
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.font = 'bold 100px arial'
        GAME_ENGINE.ctx.fillStyle = this.hover ? "yellow" : "white"
        this.hover = false
        GAME_ENGINE.ctx.textAlign = "center"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 5
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText("GAME OVER", width/2, height/2 - 10)

        GAME_ENGINE.ctx.font = 'bold 60px arial'
        GAME_ENGINE.ctx.fillText("You Survived " + this.roundDiedOn + " Rounds", width/2, height/2 + 50)

        if (this.timer > 1.35) {
            if (this.atSwitch != null) {this.atSwitch()}
            GAME_ENGINE.camera.isTrackingPlayer = false
            GAME_ENGINE.ctx.font = 'bold 40px arial'
            GAME_ENGINE.ctx.fillText("Total Kills: " + GAME_ENGINE.camera.map.roundManager.scoreboard_kills, width/2, height/2 + 150)
            GAME_ENGINE.ctx.fillText("Points Earned: " + GAME_ENGINE.camera.map.roundManager.scoreboard_points, width/2, height/2 + 190)

            let songTime = 26.426
            GAME_ENGINE.camera.posX = (500 + ((this.timer / songTime) * 300)) * GAME_ENGINE.camera.map.scale
            GAME_ENGINE.camera.posY = (300 + ((this.timer / songTime) * 1000)) * GAME_ENGINE.camera.map.scale

            if (this.timer > songTime) {
                GAME_ENGINE.clearWorld(true)
                GAME_ENGINE.addEntity(new ReturnScreen())
            }
        }

        GAME_ENGINE.ctx.restore()
    }

    update() {
        this.timer += GAME_ENGINE.clockTick
    }
}

class ReturnScreen extends FrontEnd {
    constructor() {
        super()
        this.timer = 5
        this.removeFromWorld = false
    }

    update() {
        if (this.timer > 0) {
            this.timer -= GAME_ENGINE.clockTick
        } else {
            this.removeFromWorld = true
            this.onTimerComplete()
        }
    }

    draw() {
        GAME_ENGINE.ctx.save()
        GAME_ENGINE.ctx.fillStyle = "black"
        GAME_ENGINE.ctx.globalAlpha = 1
        GAME_ENGINE.ctx.fillRect(0,0, GAME_ENGINE.ctx.canvas.width, GAME_ENGINE.ctx.canvas.height)

        GAME_ENGINE.ctx.font = 'bold 50px arial'
        GAME_ENGINE.ctx.fillStyle = "white"
        GAME_ENGINE.ctx.textAlign = "center"
        GAME_ENGINE.ctx.shadowColor = "black"
        GAME_ENGINE.ctx.shadowBlur = 10
        GAME_ENGINE.ctx.shadowOffsetX = 5;
        GAME_ENGINE.ctx.shadowOffsetY = 5;
        GAME_ENGINE.ctx.fillText("Unloading Sounds: " + Math.ceil(this.timer), GAME_ENGINE.ctx.canvas.width/2, GAME_ENGINE.ctx.canvas.height/2)
        GAME_ENGINE.ctx.restore()
    }

    onTimerComplete() {
        GAME_ENGINE.addEntity(new MainMenu());
    }
}

class RestartScreen extends ReturnScreen {
    onTimerComplete() {
        GAME_ENGINE.addEntity(new SceneManager());
    }
}