function init() {

	var stage = new createjs.Stage("canvas");

	var game = {
		level: 1,
		shots: [],
		enemiesShots: [],
		enemies: [],
		score: {
			points: 0, 
			bitmap: false
		},
		text: {
			score: false,
			gameOver: false,
			start: false
		},
		livesBitmap: [],
		state: {
			pause: false,
			over: false,
			started: false,
			moving: false
		},

		startScreen: function(){
			stage.enableMouseOver(10);
			this.text.start = new createjs.Text("START", "50px Future", "#FFFFFF");
		    this.text.start.x = stage.canvas.width/2 - this.text.start.getMeasuredWidth()/2;
		    this.text.start.y = stage.canvas.height/2 - this.text.start.getMeasuredHeight()/2;
		    var hit = new createjs.Shape();
			hit.graphics.beginFill("#000").drawRect(0, 0, this.text.start.getMeasuredWidth(), this.text.start.getMeasuredHeight());
			this.text.start.hitArea = hit;
			this.text.start.alpha = 0.7;
			this.text.start.on("mouseover", function(event) { game.text.start.alpha = 1; });
			this.text.start.on("mouseout", function(event) { game.text.start.alpha = 0.7; });
			this.text.start.addEventListener("click", function(event) { game.state.started = true;game.start(); })
		    stage.addChild(this.text.start);
		    stage.update();
		},

		start: function(){
			if(!this.state.started)
			{
				stage.enableMouseOver(0);
				this.startScreen();
				document.onkeydown = handleKeyDown;
				document.onkeyup = handleKeyUp;
				createjs.Ticker.addEventListener("tick", handleTick);
				createjs.Ticker.setFPS(60);
				sounds.register();
			}
			else{
				ship.append();
				stage.removeChild(this.text.start);
				this.addScore();
				this.handleLives();
				//adding enemies...just for now
				for (var i = 0; i < 5; i++){
					var temp = new Enemy(imgs.enemies.alien.regular, 5, 5, imgs.fire.enemy, 100, false, enemies.alien.pattern, stage, enemies.alien.shoot, imgs.enemies.alien.damages);
					this.addEnemy(temp);
				}
				setTimeout(function(){
						game.moveEnemies();
				}, 1000);
			}
		},

		addEnemy: function(enemy){
			enemy.bitmap = new createjs.Bitmap('img/' + enemy.image);
			stage.addChild(enemy.bitmap);
			var EnemyY = rand(5, 100);
			var EnemyX = rand(5, stage.canvas.width - enemy.bitmap.image.width);
			enemy.bitmap.x = rand(5, stage.canvas.width - enemy.bitmap.image.width); 
			enemy.bitmap.y = - enemy.bitmap.image.height ;
			enemy.added = false;
			createjs.Tween.get(enemy.bitmap)
                .to({x: EnemyX, y: EnemyY}, 1000, createjs.Ease.getPowInOut(1))
                .call(function(){enemy.added = true;});
			this.enemies.push(enemy);
		},

		handleCollisions: function(){
			//shots hit enemies
			for(var i = this.shots.length - 1; i >= 0; i--){
				for(var j = this.enemies.length - 1; j >= 0; j--){
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
			for(var j = this.enemies.length - 1; j >= 0 && !this.state.over; j--){
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
						}, 1000);
					}
					if(ship.lives === 0)
						this.gameOver();
				}
			}
			//colision enemies shots/ship	
			for(var i = this.enemiesShots.length - 1; i >= 0; i--)
			{
				console.log(this.enemiesShots[i].x);
				var colisionShot = ndgmr.checkPixelCollision(ship.bitmap, this.enemiesShots[i], 0);
				if(colisionShot && !ship.invicible)
					{
						this.createImpact(colisionShot);
						var sound = createjs.Sound.play('lose');
						sound.volume = 1;
						ship.lives--;
						this.handleLives();
						ship.invicible = true;
						ship.bitmap.alpha = 0.5;
						setTimeout(function(){
							ship.invicible = false;
							ship.bitmap.alpha = 1;
						}, 1000);
					}
					if(ship.lives === 0)
						this.gameOver();
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
				    temp.y = 20 + (i * 40);
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
			    this.score.bitmap.y =  20;
			    stage.addChild(this.score.bitmap);
			}
			this.score.bitmap.text = '0'.repeat(5 - String(this.score.points).length) + this.score.points;
		},

		killShip: function(enemy, index){
			stage.removeChild(enemy.bitmap);
			this.score.points += enemy.points;
			this.addScore();
			enemy.alive = false;
			this.enemies.splice(index, 1);
		},

		moveEnemies: function(){
			if(!this.state.moving)
				for(var v of this.enemies)
				{	
					v.pattern(this);
				}
			
			this.state.moving = true;
		},

		gameOver: function(){
			if(!this.text.gameOver)
			{
				this.text.gameOver = new createjs.Text('GAME OVER', "70px future", "#FFFFFF");
				this.text.gameOver.x = stage.canvas.width / 2 - this.text.gameOver.getMeasuredWidth() / 2;
				this.text.gameOver.y =  250;
				stage.addChild(this.text.gameOver);

				this.text.score = new createjs.Text(this.score.bitmap.text + " POINTS", "55px future", "#FFFFFF");			    
				this.text.score.x = stage.canvas.width / 2 - this.text.score.getMeasuredWidth() / 2;
			    this.text.score.y =  350;
			    stage.addChild(this.text.score);

			    stage.removeChild(this.score.bitmap);
			    stage.removeChild(ship.bitmap);
			    this.state.over = true;
			}
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
			if(!game.state.started)
				return false;
			if(this.canFire && !game.state.over)
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
			if(!game.state.started || game.state.over)
				return false;
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

	function handleTick(event){
		for(var v in ship.direction)
			if(ship.direction[v])
				ship.move(v);

		if(ship.firing)
				ship.shoot();

		game.handleCollisions();	
		console.log(game.enemiesShots.length);
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