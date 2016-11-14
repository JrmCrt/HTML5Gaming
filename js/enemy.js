class Enemy {

	constructor(image, speed, lives, fireImg, damagesImg){
		this.image = image;
		this.speed = speed;
		this.lives = lives;
		this.fireImg = fireImg;
		this.damagesImg = damagesImg.length ? damagesImg : false;
	}
}