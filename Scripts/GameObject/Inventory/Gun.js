//******************* Animation Matrix Values ********************************
const GUN_Pistol = 0
// const GUN_Knife = 1
const GUN_AR = 2
const GUN_Shotgun = 3

//******************* gun.png coordinates ********************************
class GunPNGCoords {
    constructor() {
        this.map = new Map([
            //["Name", [xStart, yStart, width, height, isPaP]]

            //Normal
            ["M1911", [0, 0, 16, 12, false]],
            ["Olympia", [108, 36, 53, 12, false]],
            ["M16", [55, 104, 45, 16, false]],
            ["L96A1", [300, 48, 59, 19, false]],
            ["Ray Gun", [127, 0, 21, 14, false]],

            //PaP
        ])
    }
}
const GUN_TEXTURE_MAP = new GunPNGCoords()

//******************* Super ********************************

class Gun {
    constructor(name,
                damage,
                magazineSize,
                totalAmmo,
                maxFireCooldown,
                reloadTime,
                movementPenalty,
                recoilIncreasePerClick,
                recoilDecreaseRate,
                bulletSpeed,
                screenShakeLength=0.1,
                screenShakeIntensity=10,
                animationType=GUN_Pistol) {
        Object.assign(this, {
            name,
            damage,
            magazineSize,
            totalAmmo,
            maxFireCooldown,
            reloadTime,
            movementPenalty,
            recoilIncreasePerClick,
            recoilDecreaseRate,
            bulletSpeed,
            screenShakeLength,
            screenShakeIntensity,
            animationType})
        this.currentMagazineAmmo = this.magazineSize;
        this.currentFireCooldown = 0
        this.currentReloadTime = 0
        this.currentRecoil = 0
        this.currentTotalAmmo = totalAmmo
        this.isSwitching = false

        //HUD element
        let spritesheetCoords = GUN_TEXTURE_MAP.map.get(this.name)
        this.xStart = spritesheetCoords[0]
        this.yStart = spritesheetCoords[1]
        this.width = spritesheetCoords[2]
        this.height = spritesheetCoords[3]
        this.isPaP = spritesheetCoords[4]
    }

    update() {
        //fire rate cooldown
        if (this.currentFireCooldown > 0) {
            this.currentFireCooldown -= GAME_ENGINE.clockTick
        }

        //recoil cooldown
        if (this.currentRecoil > 0) {
            this.currentRecoil -= this.recoilDecreaseRate * GAME_ENGINE.clockTick
        }

        //reload cooldown
        if (this.currentReloadTime > 0) {
            this.currentReloadTime -= GAME_ENGINE.clockTick
        } else {
            this.isSwitching = false
        }
    }

    shoot(posX, posY, angle) {
        //Check FireRate
        if (this.currentFireCooldown > 0) { //still in cooldown
            return false;
        }
        //check reload
        if (this.currentReloadTime > 0) {
            return false;
        }
        this.currentFireCooldown = this.maxFireCooldown //set cooldown

        //Check Ammo
        if (this.currentMagazineAmmo === 0) return false //no ammo
        this.currentMagazineAmmo -= 1 //fire ammo

        //Shoot
        this.shoot1(posX, posY, angle)
        console.log(this.currentMagazineAmmo, "/", this.currentTotalAmmo)

        return true
    }

    //super calls this for children to inherit from
    shoot1(posX, posY, angle) {
        let tempBullet = new Bullet(posX, posY, this.getSpreadAngle(angle), this.damage, this.bulletSpeed)
        GAME_ENGINE.addEntity(tempBullet)
        GAME_ENGINE.camera.startShake(this.screenShakeLength, this.screenShakeIntensity)
        this.currentRecoil += this.recoilIncreasePerClick;
    }

    getSpreadAngle(angle) {
        return angle + this.currentRecoil * (Math.random() * 2 - 1)
    }

    reload() {
        //full or no ammo, then return
        if (this.currentMagazineAmmo === this.magazineSize || this.currentTotalAmmo <= 0) {
            return false
        }

        //otherwise, reset stats
        this.currentReloadTime = this.reloadTime
        this.currentRecoil = 0
        this.currentFireCooldown = 0

        let withdraw = Math.min(this.magazineSize - this.currentMagazineAmmo, this.currentTotalAmmo)
        this.currentMagazineAmmo += withdraw
        this.currentTotalAmmo -= withdraw
        // if (this.currentTotalAmmo < 0) this.currentTotalAmmo = 0
        return true
    }

    /**
     * Resets stats on weapon switch
     */
    equip() {
        this.isSwitching = true
        this.currentReloadTime = this.reloadTime * 0.7
        this.currentRecoil = 0
        this.currentFireCooldown = 0
    }
}

//******************* Guns Types ********************************

class Gun_T_Shotgun extends Gun { //ABSTRACT
    constructor(name="Shotgun Generic", damage, magazineSize, totalAmmo, maxFireCooldown, reloadTime, movementPenalty, recoilIncreasePerClick, recoilDecreaseRate, bulletSpeed, shotgunSpread=0.4, shotgunSpreadShots=5, screenShakeLength=0.1, screenShakeIntensity=10, animationType=GUN_Shotgun) {
        super (
            name,
            damage,
            magazineSize,
            totalAmmo,
            maxFireCooldown,
            reloadTime,
            movementPenalty,
            recoilIncreasePerClick,
            recoilDecreaseRate,
            bulletSpeed,
            screenShakeLength=0.1,
            screenShakeIntensity=10,
            animationType
        )
        Object.assign(this, {shotgunSpread, shotgunSpreadShots})
    }

    shoot1(posX, posY, angle) {
        GAME_ENGINE.camera.startShake(this.screenShakeLength, this.screenShakeIntensity)
        for (let i = 0; i < this.shotgunSpreadShots; i++) {
            GAME_ENGINE.addEntity(new Bullet(posX, posY, this.getSpreadAngle(angle), this.damage, this.bulletSpeed))
        }
        this.currentRecoil += this.recoilIncreasePerClick;
    }

    getSpreadAngle(angle) {
        return angle + ((this.shotgunSpread + this.currentRecoil) * (Math.random() * 2 - 1))
    }
}

class Gun_T_Pierce extends Gun {
    constructor(name="Sniper_Generic", damage, magazineSize, totalAmmo, maxFireCooldown, reloadTime, movementPenalty, recoilIncreasePerClick, recoilDecreaseRate, bulletSpeed, pierceCount=3, screenShakeLength=0.1, screenShakeIntensity=10, animationType=GUN_AR) {
        super(
            name,
            damage, //dmg
            magazineSize, //mag size
            totalAmmo, //total ammo
            maxFireCooldown, //fire cooldown
            reloadTime, //reload time
            movementPenalty, //movement penalty
            recoilIncreasePerClick, //increase per fire
            recoilDecreaseRate, //recoil decrease rate
            bulletSpeed, //bullets speedTerminal
            screenShakeLength,screenShakeIntensity,
            animationType
        );
        this.pierceCount = pierceCount
    }

    shoot1(posX, posY, angle) {
        GAME_ENGINE.camera.startShake(this.screenShakeLength, this.screenShakeIntensity)
        GAME_ENGINE.addEntity(new BulletPierce(posX, posY, this.getSpreadAngle(angle), this.damage, this.bulletSpeed, 3))
        this.currentRecoil += this.recoilIncreasePerClick;
    }
}

class Gun_T_Burst extends Gun {
    constructor(name="Burst_Generic",
                damage,
                magazineSize,
                totalAmmo,
                maxFireCooldown,
                reloadTime,
                movementPenalty,
                recoilIncreasePerClick,
                recoilDecreaseRate,
                bulletSpeed,
                burstCooldown=0.13,
                burstBulletCount=3,
                screenShakeLength=0.1,
                screenShakeIntensity=10,
                animationType=GUN_AR) {
        super(
            name,
            damage, //dmg
            magazineSize, //mag size
            totalAmmo, //total ammo
            maxFireCooldown, //fire cooldown
            reloadTime, //reload time
            movementPenalty, //movement penalty
            recoilIncreasePerClick, //increase per fire
            recoilDecreaseRate, //recoil decrease rate
            bulletSpeed, //bullets speedTerminal
            screenShakeLength,screenShakeIntensity,
            animationType
        )
        /**
         * time between shots
         * @type {number}
         */
        this.burstCooldown = burstCooldown
        this.curr_burstCooldown = 0 //timer down
        this.burstBulletCount = burstBulletCount
        this.curr_burstBulletCount = 0 //counts up
        this.firing = false
    }

    update() {
        //fire rate cooldown
        if (this.currentFireCooldown > 0) {
            this.currentFireCooldown -= GAME_ENGINE.clockTick
        }

        //recoil cooldown
        if (this.currentRecoil > 0) {
            this.currentRecoil -= this.recoilDecreaseRate * GAME_ENGINE.clockTick
        }

        //reload cooldown
        if (this.currentReloadTime > 0) {
            this.currentReloadTime -= GAME_ENGINE.clockTick
        } else {
            this.isSwitching = false
        }

        //burst fire cooldown
        if (this.currentburstCooldown > 0) {
            this.currentburstCooldown -= GAME_ENGINE.clockTick
        }

        if (this.firing) {
            if (this.currentMagazineAmmo === 0) { //no ammo
                this.curr_burstCooldown = 0
                this.curr_burstBulletCount = 0
                this.firing = false
            } else { //fire burst
                if (this.curr_burstCooldown > 0) {
                    this.curr_burstCooldown -= GAME_ENGINE.clockTick
                } else if (this.curr_burstBulletCount < this.burstBulletCount) {
                    this.curr_burstBulletCount++
                    this.curr_burstCooldown = this.burstCooldown
                    this.currentMagazineAmmo--
                    console.log(this.currentMagazineAmmo, "/", this.currentTotalAmmo)
                    this.shoot1(GAME_ENGINE.ent_Player.posX, GAME_ENGINE.ent_Player.posY, GAME_ENGINE.ent_Player.angle)
                    this.currentRecoil += this.recoilIncreasePerClick / 3
                } else {
                    this.firing = false
                }
            }
        }
    }

    shoot(posX, posY, angle) {
        if (!this.firing) {
            //Check FireRate
            if (this.currentFireCooldown > 0) { //still in cooldown
                return false;
            }
            //check reload
            if (this.currentReloadTime > 0) {
                return false;
            }
            this.currentFireCooldown = this.maxFireCooldown //set cooldown

            //Check Ammo
            if (this.currentMagazineAmmo === 0) return false //no ammo

            //Shoot
            GAME_ENGINE.camera.startShake(this.screenShakeLength, this.screenShakeIntensity)
            this.firing = true
            this.curr_burstCooldown = 0
            this.curr_burstBulletCount = 0

            return true
        }
    }

    equip() {
        super.equip();
        this.firing = false
        this.curr_burstCooldown = 0
        this.curr_burstBulletCount = 0
    }
}

class Gun_T_Explode extends Gun {
    constructor(name="Explosive_Generic", damage, magazineSize, totalAmmo, maxFireCooldown, reloadTime, movementPenalty, recoilIncreasePerClick, recoilDecreaseRate, bulletSpeed, splashRadius=200, screenShakeLength=0.1, screenShakeIntensity=10, animationType=GUN_AR) {
        super(
            name,
            damage, //dmg
            magazineSize, //mag size
            totalAmmo, //total ammo
            maxFireCooldown, //fire cooldown
            reloadTime, //reload time
            movementPenalty, //movement penalty
            recoilIncreasePerClick, //increase per fire
            recoilDecreaseRate, //recoil decrease rate
            bulletSpeed, //bullets speedTerminal
            screenShakeLength,screenShakeIntensity,
            animationType
        );
        this.splashRadius = splashRadius
    }

    shoot1(posX, posY, angle) {
        GAME_ENGINE.camera.startShake(this.screenShakeLength, this.screenShakeIntensity)
        GAME_ENGINE.addEntity(new Explosive(posX, posY, this.getSpreadAngle(angle), this.damage, this.bulletSpeed, this.splashRadius))
        this.currentRecoil += this.recoilIncreasePerClick;
    }
}

//GUN (DONE)
    //PaP dmg increase
    //Burst fire
//Pistol (DONE)
    //same as gun (DONE)
//MG, SMG, LMG (DONE)
    //same as gun (DONE)
    //Burst fire
//Shotguns (DONE)
    //multiple bullets at once (DONE)
//Sniper, Slow fire (DONE)
    //piercing bullets that stop after passing multiple zombies (DONE)
//Launchers
    //projectile explosions
    //Raygun is one too
    //flamethrower
        //explosive stays on the ground
//Monkey?

//******************* Unique Guns ********************************

class Gun_M1911 extends Gun {
    constructor() {
        super(
            "M1911",
            45, //dmg
            7, //mag size
            60, //total ammo
            0.15, //fire cooldown
            1, //reload time
            1, //movement penalty
            0.14, //recoil increase per fire
            0.6, //recoil decrease rate
            2000, //bullets speedTerminal
            0.1,2.5,
            GUN_Pistol //animation type
        );

    }
}

class Gun_Olympia extends Gun_T_Shotgun {
    constructor() {
        super(
            "Olympia",
            80, //dmg
            2, //mag size
            38, //total ammo
            0.2, //fire cooldown
            3.3, //reload time
            1, //movement penalty
            0.15, //recoil increase per fire
            0.3, //recoil decrease rate
            2000, //bullets speedTerminal
            0.2, //shotgunSpread
            8, //shotgun bullets
            0.1, 3.5, //shake length and
            GUN_Shotgun //animation type //TODO fix
        );
    }
}

class Gun_M16 extends Gun_T_Burst {
    constructor() {
        super(
            "M16",
            100, //dmg
            30, //mag size
            120, //total ammo
            0.5, //fire cooldown
            2.03, //reload time
            1, //movement penalty
            0.15, //recoil increase per fire
            1.25, //recoil decrease rate
            2000, //bullets speedTerminal
            0.1, //burst fire cooldown interval (multiplying by burst fire bullet count must < 0.5)
            3, //burst fire bullet count
            0.1, //shake length
            2.5, //shake intensity
            GUN_AR
        )
    }
}

class Gun_L96A1 extends Gun_T_Pierce {
    constructor() {
        super(
            "L96A1",
            1000, //dmg
            5, //mag size
            50, //total ammo
            1, //fire cooldown
            2, //reload time
            1, //movement penalty
            1.1, //recoil increase per fire
            1, //recoil decrease rate
            2000, //bullets speedTerminal
            3, //pierce count
            0.1,10
        )
    }
}

class Gun_RayGun extends Gun_T_Explode {
    constructor() {
        super(
            "Ray Gun",
            1800, //dmg
            20, //mag size
            160, //total ammo
            0.4, //fire cooldown
            3, //reload time
            1, //movement penalty
            0.26, //recoil increase per fire
            0.6, //recoil decrease rate
            2000, //bullets speedTerminal
            150, //splash radius
            0.1,2.5,
            GUN_Pistol
        )
    }
}