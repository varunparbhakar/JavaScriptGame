const GAME_ENGINE = new GameEngine();
const ASSET_MANAGER = new AssetManager();
document.getElementById("gameWorld").hidden = true


var lines = [
	"Assets/Images/Characters/Boss/Panzer_Soldat.png",
"Assets/Images/Characters/Heroes/Animations/Gernade/Gernade Animation.png",
"Assets/Images/Characters/Heroes/Animations/Idle/AR/Rifle_IDLE.png",
"Assets/Images/Characters/Heroes/Animations/Idle/Pistol/idle.png",
"Assets/Images/Characters/Heroes/Animations/Idle/Shotgun/Shotgun_IDLE.png",
"Assets/Images/Characters/Heroes/Animations/Shooting/AR/AR_Shooting.png",
"Assets/Images/Characters/Heroes/Animations/Shooting/Pistol/Player_Shooting.png",
"Assets/Images/Characters/Heroes/Animations/Shooting/Shotgun/Shotgun_Shooting.png",
"Assets/Images/Characters/Heroes/Animations/knifing/Knife_Attack.png",
"Assets/Images/Characters/Heroes/Animations/moving/AR/AR_Moving.png",
"Assets/Images/Characters/Heroes/Animations/moving/Shotgun/Shotgun_Move.png",
"Assets/Images/Characters/Heroes/Animations/moving/pistol/pistolSpriteSheet.png",
"Assets/Images/Characters/Heroes/Animations/reload/AR/AR_Reload.png",
"Assets/Images/Characters/Heroes/Animations/reload/Pistol/Player_Reload.png",
"Assets/Images/Characters/Heroes/Animations/reload/Shotgun/Shotgun_Reloading.png",
"Assets/Images/Characters/Heroes/Player.png",
"Assets/Images/Characters/Heroes/Test Image.png",
"Assets/Images/Characters/Heroes/idle_spritesheet.png",
"Assets/Images/Characters/Zombies/Animations/Attacking/AttackingSpriteSheet.png",
"Assets/Images/Characters/Zombies/Animations/Idle/Zombie_Idle.png",
"Assets/Images/Characters/Zombies/Animations/Walking/ZombieWalking.png",
"Assets/Images/Characters/Zombies/Corpse0.png",
"Assets/Images/Items/Bloody_Screen.png",
	"Assets/Images/Items/Fire_Screen.png",
"Assets/Images/Items/Bullet.png",
"Assets/Images/Items/Glow.png",
"Assets/Images/Items/Grenade.png",
"Assets/Images/Items/Muzzle_Flash_Pistol.png",
"Assets/Images/Items/Muzzle_Flash_RayGun.png",
	"Assets/Images/Items/Muzzle_Flash_PaP.png",
"Assets/Images/Items/guns.png",
"Assets/Images/Items/guns_pap.png",
"Assets/Images/Items/guns_wall.png",
"Assets/Images/Items/guns_wallr.png",
"Assets/Images/Items/points_underlay.png",
"Assets/Images/Map/Barrier_Spritesheet.png",
"Assets/Images/Map/MysteryBox_Sprite.png",
"Assets/Images/Map/Pack_A_Punch.png",
"Assets/Images/Map/Pack_A_Punch_Light.png",
"Assets/Images/Map/Perks_Hud.png",
"Assets/Images/Map/PowerSwitch_Sprite.png",
"Assets/Images/Map/Zombie Dirt Spawning SpriteSheet.png",
"Assets/Images/Map/barrierLow.png",
"Assets/Images/Map/Levels/DLC1_BackOff.png",
"Assets/Images/Map/Levels/DLC1_BackOn.png",
"Assets/Images/Map/Levels/DLC1_ForeOff.png",
"Assets/Images/Map/Levels/DLC1_ForeOn.png",
	"Assets/Images/Map/Levels/DLC1_CJumpScare.jpg",
	"Assets/Images/Map/Levels/Map1.png",
	"Assets/Images/Map/Levels/Map1_roof.png",
	"Assets/Images/Map/Levels/Map1_shadow.png",
	"Assets/Images/Map/Levels/zm_vargamble.png",
	"Assets/Images/Map/Levels/zm_vargamble_door.jpg",
"Assets/Images/Map/Pack_A_Punch_part_1.png",
"Assets/Images/Map/Pack_A_Punch_part_2.png",
"Assets/Images/Map/Pack_A_Punch_part_3.png",
"Assets/Images/Map/Pack_A_Punch_part_4.png",
"Assets/Images/Items/Just_Cartoon_Teddy.png",
"Assets/Images/Map/115.png",
"Assets/Images/Map/Radio.png",
"Assets/Images/Items/blood00.png",
"Assets/Images/Items/blood01.png",
"Assets/Images/Items/blood02.png",
"Assets/Images/Items/Smoke.png",
"Assets/Images/Items/explosionBlacken.png",
"Assets/Images/Map/Door.png",
"Assets/Images/Map/Bloody School Bus.png",
"Assets/Images/Map/Tree.png",
	"Assets/Images/Map/Meterorite.png",
	"Assets/Images/Map/Horizontal Single Door.png",
	"Assets/Images/Map/Horizontal Double Doors.png",
	"Assets/Images/Map/Vertical Double Doors.png",
	"Assets/Images/Map/Vertical Single Door.png",
	"Assets/Images/Items/title.png",
	"Assets/Images/Items/Bullet_RayGun.png",
	"Assets/Images/Items/Smoke_RayGun.png"
]

for (let i = 0; i < lines.length; i++) {
	ASSET_MANAGER.queueDownload(lines[i])
}

ASSET_MANAGER.downloadAll(() => {
	document.getElementById("myBar").hidden = true
	document.getElementById("logoLoading").style.display = "none"

	const canvas = document.getElementById("gameWorld");
	canvas.hidden = false
	canvas.width = 2560
	canvas.height = 1440
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.imageSmoothingQuality = "low";
	ctx.onselectstart = () => {return false}

	GAME_ENGINE.options.debugging = false;

	//Load Objects
	GAME_ENGINE.addEntity(new DoneLoadingScreen());

	GAME_ENGINE.init(ctx);
	GAME_ENGINE.start();
});

