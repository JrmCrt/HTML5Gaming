function init() {
	var stage = new createjs.Stage("canvas");
	
	var keys = {
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

	const img = {
		ship: 'spaceshooter/PNG/playerShip1_orange.png',    
		fire: {1: 'spaceExtension/PNG/Sprites/Missiles/spaceMissiles_001.png', 2: 'spaceshooter/PNG/Lasers/laserBlue06.png', 3: 'spaceshooter/PNG/Lasers/laserBlue16.png', 4: 'spaceshooter/PNG/Lasers/laserBlue16.png', 
		enemie: 'spaceshooter/PNG/Lasers/laserRed07.png', hit: {blue: 'spaceshooter/PNG/Lasers/laserBlue10.png', red: 'spaceshooter/PNG/Lasers/laserBlue10.png'}},
		rocks: {small: 'spaceshooter/PNG/Meteors/meteorBrown_med1.png', big: 'spaceshooter/PNG/Meteors/meteorBrown_big3.png'},
		enemies: {0: 'spaceshooter/PNG/Enemies/enemyBlue1.png', 1: 'spaceshooter/PNG/Enemies/enemyBlue2.png', 2: 'spaceshooter/PNG/Enemies/enemyBlue3.png', 3: 'spaceshooter/PNG/Enemies/enemyBlue4.png', 4: 'spaceshooter/PNG/Enemies/enemyBlue5.png'},
		bosses: {0: 'spaceshooter/PNG/Enemies/enemyBlack5.png', 1: 'spaceshooter/PNG/Enemies/enemyBlack4.png', 2: 'spaceshooter/PNG/Enemies/enemyBlack3.png', 3: 'spaceshooter/PNG/Enemies/enemyBlack2.png', 4: 'spaceshooter/PNG/Enemies/enemyBlack1.png'}, 
		bonus: {life: 'spaceshooter/PNG/Power-ups/pill_yellow.png', shoot: 'spaceshooter/PNG/Power-ups/bolt_gold.png', points: 'spaceshooter/PNG/Power-ups/star_gold.png', 
		speed: 'spaceshooter/PNG/Power-ups/powerupYellow_star.png', shield: 'spaceshooter/PNG/Power-ups/shield_gold.png'},
		life: 'spaceshooter/PNG/UI/playerLife1_orange.png',
		shield: 'spaceshooter/PNG/Effects/shield3.png'
	};
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(60);

	var ship = {
		bitmap: false,
		speed: 6, 
		image: img.ship,
		lives: 3,
		canFire: true,
		firing: false, 
		direction: {left: false, right: false, up: false, down: false},

		append: function(){
			this.bitmap = new createjs.Bitmap('img/' + this.image);
			stage.addChild(this.bitmap);
			this.bitmap.x = (stage.canvas.width / 2) - (this.bitmap.image.width / 2); 
			this.bitmap.y = stage.canvas.height - 100;
			//stage.update();
		}, 

		shoot: function(){
			if(this.canFire)
			{	
				var fire = new createjs.Bitmap('img/' + img.fire[1]);
				stage.addChild(fire);
				fire.y = this.bitmap.y - 35;
				fire.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire.image.width / 2);
				createjs.Tween.get(fire)
                .to({y: this.bitmap.y - stage.canvas.height}, 1250, createjs.Ease.getPowInOut(1));
				this.canFire = false;
				setTimeout(function(){ship.canFire = true}, 250);   
			}

		},

		move: function(dir){
			if(dir == 'left' && this.bitmap.x > 5)
				this.bitmap.x -= this.speed;
			if(dir == 'right' && this.bitmap.x < (stage.canvas.width - this.bitmap.image.width) - 5)
				this.bitmap.x += this.speed;
			if(dir == 'up' && this.bitmap.y > 5)
				this.bitmap.y -= this.speed;
			if(dir == 'down' && this.bitmap.y < (stage.canvas.height - this.bitmap.image.height) - 5)
				this.bitmap.y += this.speed;
		}

	};

	ship.append();

	function handleTick(event) {
		for(var v in ship.direction)
			if(ship.direction[v])
				ship.move(v);

			if(ship.firing)
				ship.shoot();

			stage.update()
		}

		function handleKeyDown(e) {
		//e.preventDefault();
		//alert(e.keyCode);
		var key = e.keyCode;
		for(var v of Object.keys(keys.direction))
			if(key == keys.direction[v])
				ship.direction[v] = true;

			if(keys.fire.includes(key))
				ship.firing = true;

		}

		function handleKeyUp(e) {
			var key = e.keyCode;
			for(var v of Object.keys(keys.direction))
				if(key == keys.direction[v])
					ship.direction[v] = false;

				if(keys.fire.includes(key))
					ship.firing = false;	
			}

		}