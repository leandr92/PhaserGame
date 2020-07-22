
// You can write more code here

/* START OF COMPILED CODE */

class Scene1Start extends Phaser.Scene {
	
	constructor() {
	
		super("Scene1Start");
		
	}
	
	create() {

	   	this.cameras.main.fadeIn(2000, 0,0,0);
	
		this.add.image(398.01236, 225.76543, "textures", "cool-background");
		
		this.add.text(265.9136, 176.38272, "1. Лавина", {
    "fontFamily": "Times New Roman",
    "fontSize": "64px"
});
		
	this.cameras.main.once('camerafadeoutcomplete', function (camera) {

        this.scene.start("Scene1");

    }, this);


	this.cameras.main.once('camerafadeincomplete', function (camera) {

        camera.fadeOut(2000, 0,0,0);

    }, this);
		
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
