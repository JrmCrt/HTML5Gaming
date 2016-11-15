class Enemy {

	constructor(image, speed, lives, fireImg, points, damagesImg = false){
		this.image = image;
		this.speed = speed;
		this.lives = lives;
		this.fireImg = fireImg;
		this.points = points;
		this.damagesImg = damagesImg;
	}
}