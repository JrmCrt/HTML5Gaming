const keys = {
	direction: {
		left: 37,
		right: 39,
		up: 38,
		down: 40 
	},
	fire: [32, 18, 17],
	escape: 27,
	enter: 13
};

const sounds = {
	fire: 'spaceshooter/Bonus/sfx_laser2.ogg',
	lose: 'spaceshooter/Bonus/sfx_lose.ogg',
	bonus: 'spaceshooter/Bonus/sfx_shieldUp.ogg',
	shieldDown: 'spaceshooter/Bonus/sfx_shieldDown.ogg',

	register: function(){
		for(var v of Object.keys(this))
			if(typeof this[v] !== 'function')
				createjs.Sound.registerSound('img/' + this[v], v);
	}
};

const img = {
	ship: 'spaceshooter/PNG/playerShip1_orange.png',    
	fire: {
		1: 'spaceshooter/PNG/Lasers/laserBlue07.png', 
		2: 'spaceshooter/PNG/Lasers/laserBlue06.png', 
		3: 'spaceshooter/PNG/Lasers/laserBlue16.png', 
		4: 'spaceshooter/PNG/Lasers/laserBlue16.png', 
		enemie: 'spaceshooter/PNG/Lasers/laserRed07.png', 
		hit: {
			blue: 'spaceshooter/PNG/Lasers/laserBlue10.png', 
			red: 'spaceshooter/PNG/Lasers/laserBlue10.png'
		}
	},
	rocks: {
		small: 'spaceshooter/PNG/Meteors/meteorBrown_med1.png', 
		big: 'spaceshooter/PNG/Meteors/meteorBrown_big3.png'
	},
	enemies: {
		0: 'spaceshooter/PNG/Enemies/enemyBlue1.png', 
		1: 'spaceshooter/PNG/Enemies/enemyBlue2.png', 
		2: 'spaceshooter/PNG/Enemies/enemyBlue3.png', 
		3: 'spaceshooter/PNG/Enemies/enemyBlue4.png', 
		4: 'spaceshooter/PNG/Enemies/enemyBlue5.png'
	},
	bosses: {
		0: 'spaceshooter/PNG/Enemies/enemyBlack5.png', 
		1: 'spaceshooter/PNG/Enemies/enemyBlack4.png', 
		2: 'spaceshooter/PNG/Enemies/enemyBlack3.png', 
		3: 'spaceshooter/PNG/Enemies/enemyBlack2.png', 
		4: 'spaceshooter/PNG/Enemies/enemyBlack1.png'
	}, 
	bonus: {
		life: 'spaceshooter/PNG/Power-ups/pill_yellow.png', 
		shoot: 'spaceshooter/PNG/Power-ups/bolt_gold.png', 
		points: 'spaceshooter/PNG/Power-ups/star_gold.png', 
		speed: 'spaceshooter/PNG/Power-ups/powerupYellow_star.png', shield: 'spaceshooter/PNG/Power-ups/shield_gold.png'
	},
	life: 'spaceshooter/PNG/UI/playerLife1_orange.png',
	shield: 'spaceshooter/PNG/Effects/shield3.png'
};