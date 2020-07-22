
// You can write more code here

/* START OF COMPILED CODE */

class Scene1End extends Phaser.Scene {
	
	constructor() {
	
		super("Scene1End");
		
	}
	
	create() {
	
		this.add.image(403.0, 224.5, "textures", "cool-background");
		
		this.add.text(133.98767, 170.95062, "Это было неплохо!", {
    "fontFamily": "Times New Roman",
    "fontSize": "64px"
});
		this.cameras.main.fadeIn(1000, 0, 0, 0);	
		
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
