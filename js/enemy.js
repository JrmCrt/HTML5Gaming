class Enemy {

	constructor(image, speed, lives, fireImg, points, isBoss, pattern, canvas, shoot, boss, damagesImg = false){
		this.image = image;
		this.speed = speed;
		this.lives = lives;
		this.fireImg = fireImg;
		this.points = points;
		this.isBoss = isBoss;
		this.pattern = pattern;
		this.damagesImg = damagesImg;
		this.moving = false;
		this.added = false;
		this.stage = canvas;
		this.shoot = shoot;
		this.alive = true;
		this.boss = boss
	}
}