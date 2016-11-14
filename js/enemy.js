class Enemy {

	constructor(image, speed, lives, fireImg, damagesImg = false){
		this.image = image;
		this.speed = speed;
		this.lives = lives;
		this.fireImg = fireImg;
		this.damagesImg = damagesImg;
	}
}