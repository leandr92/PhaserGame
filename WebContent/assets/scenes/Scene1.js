
// You can write more code here
var player;
var ground;
var cursors;
var playerTouchingGround;
var floor;
var hitSensor;
var hitCollision;
var enemy;
var hitEnabled;
var exit;

/* START OF COMPILED CODE */

class Scene1 extends Phaser.Scene {
	
	constructor() {
	
		super("Scene1");
		
	}
	
	_create() {
	
		var back = this.add.image(396.82578, 217.23251, "textures", "back");
		back.setScale(1.8268911, 1.0276043);
		
		var sand = this.add.sprite(59.0, 135.0, "textures", "Pad_3_3");
		sand.setScale(0.4449761, 0.24778761);
		
		var sand_1 = this.add.sprite(51.0, 16.0);
		sand_1.setScale(1.125, 0.171875);
		sand_1.setAngle(17.611183);
		
		var s_player = this.add.sprite(298.2263, 375.27847, "textures", "animation experiment x2_idle_0");
		s_player.name = "s_player";
		s_player.anims.play("idle");
		
		this.add.sprite(40.651943, 70.80307, "textures", "door");
		
		this.fSand = sand;
		this.fSand_1 = sand_1;
		this.fS_player = s_player;
		
	}
	
	
	
	
	/* START-USER-CODE */

	create() {
		this._create();
		
		exit = false;
		
		this.cameras.main.fadeIn(1500, 0, 0, 0);
		
		this.matter.world.setBounds(0, 0, 800, 450, 64, true, false, false, true);
		
		var Bodies = Phaser.Physics.Matter.Matter.Bodies;
		
		player = this.matter.add.gameObject(this.fS_player);
		player.setPosition(100, 300);
		player.setMass(30);
		
		
		var exit = this.matter.add.sprite(40.65, 70,"textures","door", {isStatic: true, isSensor: true});
		exit.depth = 0;
		exit.body.label = "exit";
		
		hitEnabled = true;
		
		var snd_body = Bodies.rectangle(59, 135, 186, 28);
		snd_body.isStatic = true;		
		var snd = this.matter.add.gameObject(this.fSand);
		
		snd.setExistingBody(snd_body);
		snd.setScale(0.4,0.2);
		//snd.setAngle(17);
		
		var snd1_body = Bodies.rectangle(51, 16, 144, 20);
		snd1_body.isStatic = true;

		var snd1 =  this.matter.add.gameObject(this.fSand_1);
		
		snd1.setExistingBody(snd1_body);
		snd1.setAngle(17);
		snd1.setScale(1,0.2);
		snd1.depth = 1;
		
		
		var sprite_body = Bodies.rectangle(player.body.position.x, player.body.position.y, 30, 70);
		//console.log("123");
		hitSensor = Bodies.circle(player.body.position.x, player.body.position.y, 34, { isSensor: true, label: 'hitSensor'});
		
		var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
			parts: [sprite_body, hitSensor]
		});
		
		player.setExistingBody(compoundBody);
		player.setFixedRotation();
		
		player.body.label = "player";
		player.depth = 1;
		
		hitSensor.position.x = player.body.position.x + 20;
		
		
		player.onFloor = true;

		cursors = this.input.keyboard.createCursorKeys();

		this.cameras.main.once('camerafadeoutcomplete', function (camera) {
		
			if (exit) {
				this.scene.start('Scene1End');
			}
			
		}, this);
		
		

		// проверяем касание игрока нижней границей коллайдера
		this.matter.world.on('collisionactive', (event) => {
			
			// позиция касания поверхности
			player.onFloor = event.pairs
				.filter(
					pair => [pair.bodyA.parent, pair.bodyB.parent].includes(player.body)
				)
				.map(
					pair => pair.collision.normal.x
				)
				.some(
					x => x > -0.5 && x < 0.5
				);
				
			// удар по коробке
			
			var pairs = event.pairs;
			
			for (var i = 0; i < pairs.length; i++)
        {
            var bodyA = pairs[i].bodyA;
            var bodyB = pairs[i].bodyB;

            //  ищем только сенсоры
            if (pairs[i].isSensor)
            {
                var boxBody;
                var sensorBody;

                if (bodyA.isSensor)
                {
                    boxBody = bodyB;
                    sensorBody = bodyA;
                }

				else if (bodyB.isSensor)
                {
                    boxBody = bodyA;
                    sensorBody = bodyB;
                }
				
				var boxBodySprite = boxBody.gameObject;
				var sensorBodySprite = sensorBody.gameObject;
				
				if (boxBodySprite != null && sensorBodySprite != null){
				
					if (boxBodySprite.body.label == "box" && sensorBodySprite.body.label == "player"){
					
						if (boxBodySprite.hittable){
							enemy = boxBodySprite;
							hitCollision = true;	
						}
						
					}
					else if (boxBodySprite.body.label == "player" && sensorBodySprite.body.label == "exit")
					{
						this.matter.pause();
						this.cameras.main.fadeOut(1000, 0, 0, 0);
						exit = true;						
						
					}
					
				}
				
            }
			
        }
				
		});
		
	}

	update() {

		if (exit){
			return;		
		}	

		this.movement();

		this.hit();

		if (Phaser.Math.Between(1, 100) % 30 == 0) {
			this.dropBoxes();
		}
		
		this.deleteObjectsOutOfScene();
		this.endScene();
		
	}
	
	// удаляем коробки вылетевшие за сцену
	deleteObjectsOutOfScene(){
		
		this.matter.world.localWorld.bodies.forEach((body) => { 
			
			if (body.label == "box")
                {
	                 if (body.position.y > this.matter.world.walls.bottom.position.y){
						body.gameObject.destroy();
					}   
                }
			
		 }, this)
		
	}
	
	// удаляем коробки вылетевшие за сцену
	endScene(){
		
		this.matter.world.localWorld.bodies.forEach((body) => { 
			
			if (body.label == "player")
                {
	                 if (body.position.y > this.matter.world.walls.bottom.position.y){
						this.scene.start('Scene1Fail');
					}   
                }
			
		 }, this)
		
	}
	
	movement() {

		if (cursors.left.isDown) {
			if (player.onFloor) {

				player.setVelocityX(-4);

				if (player.anims.currentAnim.key != "run") {
					player.anims.play("run");
				}
			}
			else {
				if (player.body.velocity.x >= -4) {
					player.setVelocityX(player.body.velocity.x - 0.2);
				}
			}

			if (!player.flipX) {
				player.toggleFlipX();
				hitSensor.position.x = player.body.position.x - 20;
			}
		}
		else if (cursors.right.isDown) {
			if (player.onFloor) {
				player.setVelocityX(4);

				if (player.anims.currentAnim.key != "run") {
					player.anims.play("run");
				}
			}
			else {
				if (player.body.velocity.x <= 4) {
					player.setVelocityX(player.body.velocity.x + 0.2);
				}
			}
			if (player.flipX) {
				player.toggleFlipX();
				hitSensor.position.x = player.body.position.x + 20;
			}
		}
		else {

			if (!this.importantAnims().includes(player.anims.currentAnim.key) && player.onFloor) {
				player.anims.play("idle");
			}

		}

		if (cursors.up.isDown && player.onFloor) {
			player.anims.play("jump");

			player.setVelocityY(-10);

			player.onFloor = false;
		}

	}

	importantAnims() {

		return ["idle", "hit"];

	}

	dropBoxes() {

		var boxCount = 9;

		for (var i = 0; i <= boxCount; i++) {

			var box = this.add.sprite(Phaser.Math.Between(50, 800), Phaser.Math.Between(-100, 0), "textures", "box");

			var boxObject = this.matter.add.gameObject(box);
			boxObject.body.label = "box";
			boxObject.setScale(0.2 + Phaser.Math.Between(-0.1, 0.4), 0.3 + Phaser.Math.Between(-0.1, 0.4));
	
			boxObject.hitPoints = 3;
			boxObject.hittable = true;

			boxObject.setBounce(0.7);
			boxObject.setMass(25);
			
		}

	}

	hit() {

		if (cursors.space.isDown) {

			player.anims.play("hit");

			if (hitCollision && hitEnabled){
				
				enemy.hitPoints -= 1;
				
				if (enemy.hitPoints <= 0){
					
					enemy.destroy();
					
				}
				
				var hitDelayTime = 10;
				hitEnabled = false;
				
				this.time.delayedCall(hitDelayTime, this.enableHitting, [], this);
			}
			

		}
		
	}
	
	enableHitting(){
		
		hitEnabled =true;
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */