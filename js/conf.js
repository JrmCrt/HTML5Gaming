const keys = {
	direction: {
		left: 37,
		right: 39,
		up: 38,
		down: 40 
	},
	fire: [32, 17],
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

const imgs = {
	ship: 'spaceshooter/PNG/playerShip1_orange.png',    
	fire: {
		1: 'spaceshooter/PNG/Lasers/laserBlue07.png', 
		2: 'spaceshooter/PNG/Lasers/laserBlue06.png', 
		3: 'spaceshooter/PNG/Lasers/laserBlue16.png', 
		4: 'spaceExtension/PNG/Sprites/Missiles/spaceMissiles_001.png', 
		enemy: {
			1:'spaceshooter/PNG/Lasers/laserRed07.png'
		},	 
		hit: {
			blue: 'spaceshooter/PNG/Lasers/laserBlue10.png', 
			red: 'spaceshooter/PNG/Lasers/laserRed10.png',
			small: 'spaceshooter/PNG/Effects/star2.png'
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
		4: 'spaceshooter/PNG/Enemies/enemyBlue5.png',
		alien: {
			regular: 'alien-pack/PNG/shipBlue.png',
			damages: {
				1: 'alien-pack/PNG/shipBlue_damage2.png',
				3: 'alien-pack/PNG/shipBlue_damage1.png'
			}
		}	
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
		speed: 'spaceshooter/PNG/Power-ups/powerupYellow_star.png', 
		shield: 'spaceshooter/PNG/Power-ups/shield_gold.png'
	},
	life: 'spaceshooter/PNG/UI/playerLife1_orange.png',
	shield: 'spaceshooter/PNG/Effects/shield3.png'
};

const enemies = {
	alien: {
		pattern: function(game){
			if(this.alive)
			{
				var distance = 100;
				var possibleMoves = [{x: this.bitmap.x + 100, y: this.bitmap.y + 100}
					,{x: this.bitmap.x + 100, y: this.bitmap.y - 100}
					,{x: this.bitmap.x - 100, y: this.bitmap.y + 100}
					,{x: this.bitmap.x - 100, y: this.bitmap.y - 100}
				];

				var maxX = this.stage.canvas.width - this.bitmap.image.width;
				var maxY = this.stage.canvas.height - this.bitmap.image.height;

				for(var i = possibleMoves.length - 1; i >= 0; i--)
					if(possibleMoves[i].x < 0 || possibleMoves[i].x > maxX)
							possibleMoves.splice(i, 1);
					else if(possibleMoves[i].y < 0 || possibleMoves[i].y > maxY)
							possibleMoves.splice(i, 1);

				var move = rand(0, possibleMoves.length - 1);

				createjs.Tween.get(this.bitmap)
                	.to({x: possibleMoves[move].x, y: possibleMoves[move].y}, rand(800, 1200), createjs.Ease.getPowInOut(1))
        			.call(this.pattern, [game], this)
        			.call(this.shoot, [game], this);
			}

		},

		shoot: function(game){
			if(!this.alive) 
				return false;

			if(rand(0, 9) < 5)
				return false;

			var fire = new createjs.Bitmap('img/' + imgs.fire.enemy[1]);
				this.stage.addChild(fire);
				fire.rotation = 180;
				fire.y = this.bitmap.y + 35;
				fire.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire.image.width / 2);
				game.enemiesShots.push(fire);
				createjs.Tween.get(fire)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1500, createjs.Ease.getPowInOut(1));
		}
	}
};

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}