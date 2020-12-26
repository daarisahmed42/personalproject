var player, playerImage;
var background, backgroundImg;
var obstaclesGroup
var obstacle1, obstacle2, obstacle3;
var groundImg
var invisibleGround
var bullet, bulletImg;
var climber, climberImg
var stone, stoneImg

var PLAY = 1;
var END = 0;

var score = 0;
var life = 3
var gameState = PLAY
var restart, gameOver
var player_collided

function preload() {
  playerImage = loadAnimation("pic2.png", "pic3.png", "pic4.png", "pic5.png", "pic6.png", "pic7.png", "pic8.png", "pic9.png", "pic10.png", "pic11.png", "pic12.png");
  backgroundImg = loadImage("background.png");
  player_collided = loadImage("pic1.png")
  stoneImg = loadImage("obstacle.png")
  obstacle1 = loadImage("monster1.png");
  obstacle2 = loadImage("monster3.png");
  obstacle3 = loadImage("monster6.png");
  climberImg = loadImage("climber.png")
  groundImg = loadImage("ground.png")
  bulletImg = loadImage("bullet.png")
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  background = createSprite(300, 300, windowWidth, windowHeight);
  background.addImage(backgroundImg)
  background.scale = 10
  //background(22

  player = createSprite(50,height-70,20,50)
  player.addAnimation("running", playerImage)
  player.addAnimation("collide", player_collided)
  player.scale = 2


  ground = createSprite(width/2,height-40,width,20);
  ground.x = ground.width / 2;
  ground.addImage(groundImg);

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = true;

  player.setCollider("rectangle", 0, 0, 30, 30);
  player.debug = true

  score = 0;

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  restart.scale = 0.5;

  restart.visible = false;
  obstaclesGroup = createGroup();
  bulletGroup = createGroup();
  stonesGroup = createGroup();
  climbersGroup = createGroup();
}

function draw() {

  if (gameState === PLAY) {
    // score = score + Math.round(getFrameRate()/60);

    if (keyDown("space") && player.y >= 139) {
      player.velocityY = -15;
    }

    player.velocityY = player.velocityY + 0.8

    if (ground.x < 800) {
      ground.x = ground.width / 2;
    }
    ground.velocityX = -6 - score
    player.collide(ground);

    ground.depth = player.depth;
    player.depth = player.depth + 1;

    player.collide(invisibleGround);

    if (keyWentDown("S")) {
      createBullet();

    }
    spawnObstacles();
    spawnClimbers();
    spawnStones();

    if (obstaclesGroup.isTouching(player)) {
      life = life - 1;
      gameState = END;

    }
    if (stonesGroup.isTouching(player)) {
      life = life - 1;
      gameState = END;
       bulletGroup.destroyEach();


    }
    if (climbersGroup.isTouching(player)) {
      life = life - 1;
      gameState = END;

    }
    if (obstaclesGroup.isTouching(bulletGroup)) {
      score = score + 10;

      obstaclesGroup[0].destroy();
      bulletGroup.destroyEach();

    }
  } else if (gameState === END) {
     gameOver.visible = true;
    restart.visible = true;
    
    text("restart", 280, 170);
    player.addAnimation("collided", player_collided);


    //set velcity of each game object to 0
    ground.velocityX = 0;
    player.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    stonesGroup.setVelocityXEach(0);
    climbersGroup.setVelocityXEach(0);

    //change the trex animation
    player.changeAnimation("collided", player_collided);
    //player.scale = 0.35;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    stonesGroup.setLifetimeEach(-1);
    climbersGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      if (life > 0) {
        reset();
      }

    }

  }

  drawSprites();
  textSize(20);
  fill(255);
  text("Score: " + score, 500, 40);
  text("Life: " + life, 500, 60);
}


function spawnObstacles() {
  if (frameCount % 200 === 0) {
    var obstacle = createSprite(width,height-120,width,20);
    obstacle.velocityX = -26;
    //generate random obstacles
   
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;

      default:
        break;

    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1.25;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }


}

function createBullet() {
  var bullet = createSprite(100, 100, 60, 10);
  bullet.addImage(bulletImg);
  bullet.x = player.x;
  bullet.y = player.y;
  bullet.velocityX = 4;
  bullet.lifetime = 100000;
  bullet.scale = 0.01;
  bulletGroup.add(bullet);

}


function spawnStones() {
  if (frameCount % 85 === 0) {
    var stone = createSprite(width,height-90,width,20)
    stone.addImage(stoneImg);
    stone.velocityX = -6 - score;
    //generate random obstacles

    //assign scale and lifetime to the obstacle           
    stone.scale = 0.1
    stone.lifetime = 300;

    //add each obstacle to the group
    stonesGroup.add(stone);
  }
}

function spawnClimbers() {
  if (frameCount % 220 === 0) {
    var climber = createSprite(width,height-900,40,10);
    climber.y = Math.round(random(300, 400));
    climber.addImage(climberImg);
    climber.velocityX = -6 - score;
    //generate random obstacles

    //assign scale and lifetime to the obstacle           
    climber.scale = 1
    climber.lifetime = 10000;

    //add each obstacle to the group
    climbersGroup.add(climber);
  }
}

function reset() {

  gameState = PLAY;
   gameOver.visible = false;
    restart.visible = false;
    

  obstaclesGroup.destroyEach();
  climbersGroup.destroyEach();
  stonesGroup.destroyEach()

  player.changeAnimation("running", playerImage)

  score = 0;

}