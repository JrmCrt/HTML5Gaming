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
			1: 'spaceshooter/PNG/Lasers/laserRed07.png',
			2: 'spaceshooter/PNG/Lasers/laserRed06.png',
			missile: 'spaceExtension/PNG/Sprites/Missiles/spaceMissiles_003.png'
		},	 
		hit: {
			blue: 'spaceshooter/PNG/Lasers/laserBlue10.png', 
			red: 'spaceshooter/PNG/Lasers/laserRed10.png',
			small: 'spaceshooter/PNG/Effects/star2.png'
		}
	},
	rocks: {
		med: ['spaceshooter/PNG/Meteors/meteorBrown_med1.png',
		'spaceshooter/PNG/Meteors/meteorBrown_med3.png'], 
		big: ['spaceshooter/PNG/Meteors/meteorBrown_big3.png',
		'spaceshooter/PNG/Meteors/meteorBrown_big1.png',
		'spaceshooter/PNG/Meteors/meteorBrown_big2.png',
		'spaceshooter/PNG/Meteors/meteorBrown_big4.png'],
		small: ['spaceshooter/PNG/Meteors/meteorBrown_small1.png',
		'spaceshooter/PNG/Meteors/meteorBrown_small2.png'],

	},
	enemies: {
		0: 'spaceshooter/PNG/Enemies/enemyBlack1.png', 
		1: 'spaceshooter/PNG/Enemies/enemyBlack2.png', 
		2: 'spaceshooter/PNG/Enemies/enemyBlack3.png', 
		3: 'spaceshooter/PNG/Enemies/enemyBlack4.png', 
		4: 'spaceshooter/PNG/Enemies/enemyBlack5.png',
		alien: {
			regular: 'alien-pack/PNG/shipBlue.png',
			damages: {
				1: 'alien-pack/PNG/shipBlue_damage2.png',
				3: 'alien-pack/PNG/shipBlue_damage1.png'
			}
		}	
	},
	bosses: {
		0: 'spaceExtension/PNG/Sprites/Ships/spaceShips_008.png', 
		1: 'spaceExtension/PNG/Sprites/Rockets/spaceRockets_003_rotated.png', 
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
	shield: 'spaceshooter/PNG/Effects/shield3.png',
	speed: 'spaceExtension/PNG/Sprites/Effects/spaceEffects_006.png'
};

const enemies = {
	alien: {
		stat:{
			image: imgs.enemies.alien.regular,
			speed: 5,
			lives: 5,
			fireImg: imgs.fire.enemy[1],
			points: 100,
			isBoss: false,
			dropBonus: true,
			isMeteor: false,
			damagesImg: imgs.enemies.alien.damages
		},

		pattern: function(game){
			if(this.alive)
			{
				this.moving = true;
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
				fire.y = this.bitmap.y + this.bitmap.image.height;
				fire.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire.image.width / 2);
				game.enemiesShots.push(fire);
				createjs.Tween.get(fire)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1500, createjs.Ease.getPowInOut(1));
		}
	},

	boss1: {
		stat:{
			image: imgs.bosses[0],
			speed: 5,
			lives: 20,
			fireImg: imgs.fire.enemy,
			points: 1000,
			isBoss: true,
			dropBonus: false,
			isMeteor: false,
			damagesImg: {}
		},

		pattern: function(game){
			if(this.alive)
			{
				this.moving = true;
				var distance = 100;
				var possibleMoves = [{x: this.bitmap.x + 100, y: this.bitmap.y}
					,{x: this.bitmap.x, y: this.bitmap.y - 100}
					,{x: this.bitmap.x, y: this.bitmap.y + 100}
					,{x: this.bitmap.x - 100, y: this.bitmap.y}
				];

				var maxX = this.stage.canvas.width - this.bitmap.image.width;
				var maxY = this.stage.canvas.height - this.bitmap.image.height - 100;

				for(var i = possibleMoves.length - 1; i >= 0; i--)
					if(possibleMoves[i].x < 0 || possibleMoves[i].x > maxX)
							possibleMoves.splice(i, 1);
					else if(possibleMoves[i].y < 0 || possibleMoves[i].y > maxY)
							possibleMoves.splice(i, 1);

				var move = rand(0, possibleMoves.length - 1);

				createjs.Tween.get(this.bitmap)
                	.to({x: possibleMoves[move].x, y: possibleMoves[move].y}, 1000, createjs.Ease.getPowInOut(1))
        			.call(this.pattern, [game], this)
        			.call(this.shoot, [game], this);
			}

		},

		shoot: function(game){
			if(!this.alive) 
				return false;

			if(rand(0, 9) < 2)
				return false;

			var fire1 = new createjs.Bitmap('img/' + imgs.fire.enemy[2]);
				this.stage.addChild(fire1);
				fire1.rotation = 180;
				fire1.y = this.bitmap.y + this.bitmap.image.height + 10;
				fire1.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire1.image.width / 2) - this.bitmap.image.width / 2 + 25;
				game.enemiesShots.push(fire1);
				createjs.Tween.get(fire1)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1000, createjs.Ease.getPowInOut(1));

            var fire2 = new createjs.Bitmap('img/' + imgs.fire.enemy[2]);
				this.stage.addChild(fire2);
				fire2.rotation = 180;
				fire2.y = this.bitmap.y + this.bitmap.image.height + 10;
				fire2.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire2.image.width / 2) + this.bitmap.image.width / 2 - 15;
				game.enemiesShots.push(fire2);
				createjs.Tween.get(fire2)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1000, createjs.Ease.getPowInOut(1));    	
		}
	},

	boss2: {
		stat:{
			image: imgs.bosses[1],
			speed: 5,
			lives: 30,
			fireImg: imgs.fire.enemy.missile,
			points: 1000,
			isBoss: true,
			dropBonus: false,
			isMeteor: false,
			damagesImg: {}
		},

		pattern: function(game){
			if(this.alive)
			{
				this.moving = true;
				var distance = 100;
				var possibleMoves = [{x: this.bitmap.x + 100, y: this.bitmap.y}
					,{x: this.bitmap.x, y: this.bitmap.y - 100}
					,{x: this.bitmap.x, y: this.bitmap.y + 100}
					,{x: this.bitmap.x - 100, y: this.bitmap.y}
				];

				var maxX = this.stage.canvas.width - this.bitmap.image.width;
				var maxY = this.stage.canvas.height - this.bitmap.image.height - 200;

				for(var i = possibleMoves.length - 1; i >= 0; i--)
					if(possibleMoves[i].x < 0 || possibleMoves[i].x > maxX)
							possibleMoves.splice(i, 1);
					else if(possibleMoves[i].y < 0 || possibleMoves[i].y > maxY)
							possibleMoves.splice(i, 1);

				var move = rand(0, possibleMoves.length - 1);

				createjs.Tween.get(this.bitmap)
                	.to({x: possibleMoves[move].x, y: possibleMoves[move].y}, 1000, createjs.Ease.getPowInOut(1))
        			.call(this.pattern, [game], this)
        			.call(this.shoot, [game], this);
			}

		},

		shoot: function(game){
			if(!this.alive) 
				return false;

			if(rand(0, 9) < 2)
				return false;

			var fire1 = new createjs.Bitmap('img/' + this.fireImg);
				this.stage.addChild(fire1);
				fire1.rotation = 180;
				fire1.y = this.bitmap.y + this.bitmap.image.height - 35;
				fire1.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire1.image.width / 2) - this.bitmap.image.width / 2 + 25;
				game.enemiesShots.push(fire1);
				createjs.Tween.get(fire1)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1200, createjs.Ease.getPowInOut(1));

            var fire2 = new createjs.Bitmap('img/' + this.fireImg);
				this.stage.addChild(fire2);
				fire2.rotation = 180;
				fire2.y = this.bitmap.y + this.bitmap.image.height - 35;
				fire2.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire2.image.width / 2) + this.bitmap.image.width / 2 - 15;
				game.enemiesShots.push(fire2);
				createjs.Tween.get(fire2)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1200, createjs.Ease.getPowInOut(1));    	
		}
	},

	enemy2: {
		stat:{
			image: imgs.enemies[2],
			speed: 5,
			lives: 8,
			fireImg: imgs.fire.enemy,
			points: 200,
			isBoss: false,
			dropBonus: true,
			isMeteor: false,
			damagesImg: {}
		},

		pattern: function(game){
			if(this.alive)
			{
				this.moving = true;
				var distance = 100;
				var possibleMoves = [{x: this.bitmap.x + 100, y: this.bitmap.y}
					,{x: this.bitmap.x, y: this.bitmap.y - 100}
					,{x: this.bitmap.x, y: this.bitmap.y + 100}
					,{x: this.bitmap.x - 100, y: this.bitmap.y}
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
                	.to({x: possibleMoves[move].x, y: possibleMoves[move].y}, 1000, createjs.Ease.getPowInOut(1))
        			.call(this.pattern, [game], this)
        			.call(this.shoot, [game], this);
			}

		},

		shoot: function(game){
			if(!this.alive) 
				return false;

			if(rand(0, 9) < 5)
				return false;

			var fire1 = new createjs.Bitmap('img/' + imgs.fire.enemy[2]);
				this.stage.addChild(fire1);
				fire1.rotation = 180;
				fire1.y = this.bitmap.y + this.bitmap.image.height + 10;
				fire1.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire1.image.width / 2) - this.bitmap.image.width / 2 + 25;
				game.enemiesShots.push(fire1);
				createjs.Tween.get(fire1)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1500, createjs.Ease.getPowInOut(1));

            var fire2 = new createjs.Bitmap('img/' + imgs.fire.enemy[2]);
				this.stage.addChild(fire2);
				fire2.rotation = 180;
				fire2.y = this.bitmap.y + this.bitmap.image.height + 10;
				fire2.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire2.image.width / 2) + this.bitmap.image.width / 2 - 15;
				game.enemiesShots.push(fire2);
				createjs.Tween.get(fire2)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height}, 1500, createjs.Ease.getPowInOut(1));    	
		}
	},

	meteor: {
		stat:{
			image: imgs.rocks.small[0],
			speed: 5,
			lives: 5,
			fireImg: imgs.fire.enemy,
			points: 10,
			isBoss: false,
			dropBonus: false,
			isMeteor: true,
			damagesImg: {}
		},

		pattern: function(game){
			if(this.alive)
			{
				this.moving = true;
				createjs.Tween.get(this.bitmap)
                	.to({y: this.bitmap.y + this.stage.canvas.height + this.bitmap.image.height * 2}, 
                		5000, createjs.Ease.getPowInOut(1));	
			}

		},

		shoot: function(){

		}
	},
};


var levels = {
	1: {
		enemies : Object.keys(Array.apply(0,Array(10))),
		boss: enemies.boss1
	},
	2: {
		enemies : Object.keys(Array.apply(0,Array(10))),
		boss: enemies.boss2
	}
};

levels[1].enemies.fill(enemies.alien, 0, 10);
levels[2].enemies.fill(enemies.alien, 0, 10);
var en2 = Object.keys(Array.apply(0,Array(10))).fill(enemies.enemy2, 0, 10);
levels[2].enemies = levels[2].enemies.concat(en2);

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}