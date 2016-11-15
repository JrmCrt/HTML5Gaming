function init() {

	var stage = new createjs.Stage("canvas");

	var game = {
		shots: [],
		enemies: [],
		score: {
			points : 0, 
			bitmap: false
		},
		livesBitmap: [],
		state: {
			pause: false,
			over: false,
		},

		start: function(){
			document.onkeydown = handleKeyDown;
			document.onkeyup = handleKeyUp;
			createjs.Ticker.addEventListener("tick", handleTick);
			createjs.Ticker.setFPS(60);
			ship.append();
			sounds.register();
			this.addScore();
			this.handleLives();
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
			//shots hit ennemies
			for(var i = 0; i < this.shots.length; i++){
				for(var j = 0; j < this.enemies.length; j++){
					var colision = ndgmr.checkPixelCollision(this.shots[i], this.enemies[j].bitmap, 0);
					if(colision)
					{
						this.createImpact(colision);

						stage.removeChild(this.shots[i]);
						this.shots.splice(i, 1);
						this.enemies[j].lives -= ship.firePower;

						if(this.enemies[j].lives <= 0)
							this.killShip(this.enemies[j], j);

						else if(this.enemies[j].damagesImg)
							if(this.enemies[j].damagesImg[this.enemies[j].lives] !== undefined)
								this.enemies[j].bitmap.image.src = 'img/' + this.enemies[j].damagesImg[this.enemies[j].lives];
					}
				}	
			}
			//colision enemy/ship
			for(var j = 0; j < this.enemies.length; j++){
				if(this.enemies[j].bitmap !== undefined)
				{
					var colisionShip = ndgmr.checkPixelCollision(ship.bitmap, this.enemies[j].bitmap, 0);
					if(colisionShip && !ship.invicible)
					{
						this.createImpact(colisionShip);
						var sound = createjs.Sound.play('lose');
						sound.volume = 1;
						ship.lives--;
						this.handleLives();
						this.killShip(this.enemies[j], j);
						ship.invicible = true;
						ship.bitmap.alpha = 0.5;
						setTimeout(function(){
							ship.invicible = false;
							ship.bitmap.alpha = 1;
						}, 750);
					}
					if(ship.lives === 0)
					{	
						console.log('game over :(');
					}
				}
				
			}
		},

		createImpact: function(colision){
			var impact = new createjs.Bitmap('img/' + imgs.fire.hit.small);
			stage.addChild(impact);
			impact.x = colision.x - (impact.image.width / 2);
			impact.y = colision.y - (impact.image.height / 2);
			setTimeout(function(){stage.removeChild(impact);}, 50);
		},

		handleLives: function(){
			if(!this.livesBitmap.length)
			{
				for(var i = 0; i < ship.lives; i++){
					var temp = new createjs.Bitmap('img/' + imgs.life);
					temp.x = 20;
				    temp.y = stage.canvas.height - 45 - (i * 40);
				    this.livesBitmap.push(temp);
				    stage.addChild(temp);
				}
			}

			for(var i = 0; i < this.livesBitmap.length; i++)
			{
				if(ship.lives < i + 1)
				{
					stage.removeChild(this.livesBitmap[i]);
					break;
				}
			}			    
		},

		addScore: function(){
			if(!this.score.bitmap)
			{
				this.score.bitmap = new createjs.Text('00000', "50px future", "#FFFFFF");			    
				this.score.bitmap.x = stage.canvas.width - 210;
			    this.score.bitmap.y = stage.canvas.height - 60;
			    stage.addChild(this.score.bitmap);
			}
			this.score.bitmap.text = '0'.repeat(5 - String(this.score.points).length) + this.score.points;
		},

		killShip: function(enemy, index){
			stage.removeChild(enemy.bitmap);
			this.score.points += enemy.points;
			this.addScore();
			this.enemies.splice(index, 1);
		}

	};

	var ship = {
		bitmap: false,
		speed: 6, 
		image: imgs.ship,
		lives: 3,
		invicible : false,
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

	for (var i = 0; i < 5; i++){
		var temp = new Enemy(imgs.enemies.alien.regular, 5, 3, imgs.fire.enemy, 100, imgs.enemies.alien.damages);
		game.addEnemy(temp);
	}

	function handleTick(event){
		for(var v in ship.direction)
			if(ship.direction[v])
				ship.move(v);

		if(ship.firing)
				ship.shoot();

		game.handleCollisions();	
		stage.update()
	}

	function handleKeyDown(e){
		//e.preventDefault();
		//alert(e.keyCode);
		var key = e.keyCode;
		for(var v of Object.keys(keys.direction))
			if(key == keys.direction[v])
				ship.direction[v] = true;

		if(keys.fire.includes(key))
			ship.firing = true;

	}

	function handleKeyUp(e){
		var key = e.keyCode;
		for(var v of Object.keys(keys.direction))
			if(key == keys.direction[v])
				ship.direction[v] = false;

		if(keys.fire.includes(key))
			ship.firing = false;	
	}

}