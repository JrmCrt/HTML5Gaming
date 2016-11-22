class Enemy {

	constructor(stat, pattern, canvas, shoot){
		console.table(stat);
		this.image = stat.image;
		this.speed = stat.speed;
		this.lives = stat.lives;
		this.fireImg = stat.fireImg;
		this.points = stat.points;
		this.isBoss = stat.isBoss;
		this.damagesImg = stat.damagesImg;
		this.boss = stat.boss
		this.pattern = pattern;
		this.moving = false;
		this.added = false;
		this.stage = canvas;
		this.shoot = shoot;
		this.alive = true;
	}
}