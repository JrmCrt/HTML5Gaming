function init() {
	var stage = new createjs.Stage("canvas");
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(60);

	var game = {
		shots: [],
		enemies: [],
		state: {
			pause: false,
			over: false,
		},

		start: function(){
			ship.append();
			sounds.register();
		},

		addEnemy: function(enemy){
			enemy.bitmap = new createjs.Bitmap('img/' + enemy.image);
			stage.addChild(enemy.bitmap);
			var EnemyY = rand(5, 100);
			var EnemyX = rand(5, stage.canvas.width - enemy.bitmap.image.width);
			enemy.bitmap.x = rand(5, stage.canvas.width - enemy.bitmap.image.width); 
			enemy.bitmap.y = - enemy.bitmap.image.height ;
			createjs.Tween.get(enemy.bitmap)
                .to({x: EnemyX, y: EnemyY}, 1000, createjs.Ease.getPowInOut(1));
			this.enemies.push(enemy);
		},

		handleCollisions: function(){
			for(var i = 0, shotsNb = this.shots.length; i < shotsNb; i++){
				for(var j = 0, enemiesNb = this.enemies.length; j < enemiesNb; j++){
					if(ndgmr.checkPixelCollision(this.shots[i], this.enemies[j].bitmap, 0))
					{
						stage.removeChild(this.shots[i]);
						this.shots.splice(i, 1);
						stage.removeChild(this.enemies[j].bitmap);
						this.enemies.splice(j, 1);
					}
				}	
			}
		}

	};

	var ship = {
		bitmap: false,
		speed: 6, 
		image: imgs.ship,
		lives: 3,
		canFire: true,
		firing: false,
		firePower: 1, 
		direction: {left: false, right: false, up: false, down: false},

		append: function(){
			this.bitmap = new createjs.Bitmap('img/' + this.image);
			stage.addChild(this.bitmap);
			this.bitmap.x = (stage.canvas.width / 2) - (this.bitmap.image.width / 2); 
			this.bitmap.y = stage.canvas.height - 100;
		}, 

		shoot: function(){
			if(this.canFire)
			{	
				var fire = new createjs.Bitmap('img/' + imgs.fire[this.firePower]);
				stage.addChild(fire);
				fire.y = this.bitmap.y - 35;
				fire.x = this.bitmap.x + this.bitmap.image.width / 2 - (fire.image.width / 2);
				game.shots.push(fire)
				createjs.Tween.get(fire)
                .to({y: this.bitmap.y - stage.canvas.height}, 1250, createjs.Ease.getPowInOut(1));
				var sound = createjs.Sound.play('fire');
				sound.volume = 0.3;
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

	game.start();

	for (var i = 0; i < 5; i++) {
		var temp = new Enemy(imgs.enemies.alien, 5, 3, imgs.fire.enemy, []);
		game.addEnemy(temp);
	}

	function handleTick(event) {
		for(var v in ship.direction)
			if(ship.direction[v])
				ship.move(v);

		if(ship.firing)
				ship.shoot();

		game.handleCollisions();	
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