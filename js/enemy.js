class Enemy {

	constructor(stat, pattern, canvas, shoot){
		this.image = stat.image;
		this.speed = stat.speed;
		this.lives = stat.lives;
		this.fireImg = stat.fireImg;
		this.points = stat.points;
		this.isBoss = stat.isBoss;
		this.damagesImg = stat.damagesImg;
		this.isBoss = stat.isBoss
		this.dropBonus = stat.dropBonus
		this.pattern = pattern;
		this.moving = false;
		this.added = false;
		this.stage = canvas;
		this.shoot = shoot;
		this.alive = true;
	}
}