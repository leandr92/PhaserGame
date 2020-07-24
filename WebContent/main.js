
window.addEventListener('load', function() {

	var game = new Phaser.Game({
    "title": "TestGame",
    "width": 800,
    "height": 450,
    "type": Phaser.AUTO,
    "backgroundColor": "#000000",
    "parent": "game-container",
    "physics": {"default": "matter"
			,
            matter: {
                debug: {
	
	                showBody: true,
	
	                showCollisions: true,
	                collisionColor: 0xf5950c,

					}
            	}
				},
    "scale": {
        "mode": Phaser.Scale.FIT,
        "autoCenter": Phaser.Scale.CENTER_BOTH
    }
	});
	game.scene.add("Boot", Boot, true);
	
});

class Boot extends Phaser.Scene {

	preload() {
		this.load.pack("pack", "assets/pack.json");
	}

	create() {
		this.scene.start("Scene1Start");
	}

}
