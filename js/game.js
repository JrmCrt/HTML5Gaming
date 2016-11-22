function init() {

	var stage = new createjs.Stage("canvas");

	var game = {
		level: 1,
		shots: [],
		enemiesShots: [],
		enemies: [],
		bonuses: [],
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
					var temp = new Enemy(imgs.enemies.alien.regular, 5, 5, imgs.fire.enemy, 100, false,
					 enemies.alien.pattern, stage, enemies.alien.shoot, false, imgs.enemies.alien.damages);
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

						if(this.enemies[j].lives <= 0){
							this.killShip(this.enemies[j], j);
							if(rand(0, 9) > 1){
								var bonuses = Object.keys(imgs.bonus);
								var randBonus = bonuses[rand(0, bonuses.length - 1)];
								var bonus = new createjs.Bitmap('img/' + imgs.bonus[randBonus]);
								bonus.type = randBonus;
								bonus.x = colision.x;
								bonus.y = colision.y;
								this.bonuses.push(bonus);
								stage.addChild(bonus);
								createjs.Tween.get(bonus)
                					.to({y: colision.y + stage.canvas.height},
                					 3000, createjs.Ease.getPowInOut(1));
							}
						}

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
					if(colisionShip && !ship.invicible && !this.state.over )
					{
						this.createImpact(colisionShip);
						var sound = createjs.Sound.play('lose');
						sound.volume = 1;
						ship.lives--;
						this.handleLives();
						if(!this.enemies[j].boss) 
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
			for(var i = this.enemiesShots.length - 1; i >= 0 && !this.state.over ; i--)
			{
				var colisionShot = ndgmr.checkPixelCollision(ship.bitmap, this.enemiesShots[i], 0);
				if(colisionShot && !ship.invicible && !this.state.over && !ship.shield)
				{
					this.createImpact(colisionShot);
					stage.removeChild(this.enemiesShots[i]);
					this.enemiesShots.splice(i, 1);
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
				if(ship.shield){
					var colisionShield = ndgmr.checkPixelCollision(ship.shield, this.enemiesShots[i], 0);
					if(colisionShield){
						this.createImpact(colisionShield);
						stage.removeChild(this.enemiesShots[i]);
						this.enemiesShots.splice(i, 1);	
					}
				}
				if(ship.lives === 0)
					this.gameOver();
			}

			for(var i = this.bonuses.length - 1; i >= 0 && !this.state.over; i--)
			{
				var colisionBonus = ndgmr.checkPixelCollision(ship.bitmap, this.bonuses[i], 0);
				if(colisionBonus)
				{
					stage.removeChild(this.bonuses[i]);
					this.handleBonus(this.bonuses[i].type);
					stage.removeChild(this.bonuses[i]);
					this.bonuses.splice(i, 1);
					var sound = createjs.Sound.play('bonus');
					sound.volume = 2;
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
				for(var i = 0; i < ship.lives; i++){
					var temp = new createjs.Bitmap('img/' + imgs.life);
					temp.x = 20;
				    temp.y = 20 + (i * 40);
				    this.livesBitmap.push(temp);
				    stage.addChild(temp);
				}

			for(var i = 0; i < this.livesBitmap.length; i++)
				if(ship.lives < i + 1)
				{
					stage.removeChild(this.livesBitmap[i]);
					this.livesBitmap.splice(i, 1);
					break;
				}
			
			if(ship.lives > this.livesBitmap.length)
			{
				var temp = new createjs.Bitmap('img/' + imgs.life);
				temp.x = 20;
			    temp.y = 20 + (this.livesBitmap.length * 40);
			    this.livesBitmap.push(temp);
			    stage.addChild(temp);
			}		    
		},

		handleBonus: function(bonus){
			console.log(bonus + '!');
			if(bonus === 'life')
			{
				ship.lives++;
				this.handleLives();	
			}
			else if(bonus == 'shoot')
				ship.firePower++;
			else if(bonus == 'points')
			{
				this.score.points += 1000;
				this.addScore();
			}
			else if(bonus == 'speed')
			{
				ship.speed *= 1.25;
			}
			else if(bonus == 'shield')
			{
				if(!ship.shield){
	                ship.shield = new createjs.Bitmap('img/' + imgs.shield);
	                ship.shield.x = ship.bitmap.x - 22;
	                ship.shield.y = ship.bitmap.y - 35;
	                stage.addChild(ship.shield);
	                stage.update();
	                setTimeout(function(){
	                    stage.removeChild(ship.shield);
	                    ship.shield = false;
	                }, 5000);
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
			    ship.shield = false;
			    stage.removeChild(ship.shield);
			    this.state.over = true;
			}
		}

	};

	var ship = {
		bitmap: false,
		speed: 6,
		shield: false, 
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
			if(dir == 'left' && this.bitmap.x > 5){
				this.bitmap.x -= this.speed;
				this.shield.x -= this.speed;
			}
			else if(dir == 'right' && this.bitmap.x < (stage.canvas.width - this.bitmap.image.width) - 5){
				this.bitmap.x += this.speed;
				this.shield.x += this.speed;
			}
			else if(dir == 'up' && this.bitmap.y > 5){
				this.bitmap.y -= this.speed;
				this.shield.y -= this.speed;
			}
			else if(dir == 'down' && this.bitmap.y < (stage.canvas.height - this.bitmap.image.height) - 5){
				this.bitmap.y += this.speed;
				this.shield.y += this.speed;
			}
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
		stage.update()
	}

	function handleKeyDown(e){
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