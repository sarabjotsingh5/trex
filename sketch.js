//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex,trexrunning,trexcollided;
var ground,groundimage,iground;
var cloudimage;
var cloudgroup;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6 ;
var gameOver,gameOverimage, restart ,restartimage ;
var count ;   
var die , checkpoint , jump ;
localStorage["HighestScore"] = 0;

function preload() {
  trexrunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexcollided = loadImage("trex_collided.png");
  groundimage = loadImage("ground2.png");
  cloudimage =loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png") ;
  obstacle2 = loadImage("obstacle2.png") ;
  obstacle3 = loadImage("obstacle3.png") ;
  obstacle4 = loadImage("obstacle4.png") ;
  obstacle5 = loadImage("obstacle5.png") ;
  obstacle6 = loadImage("obstacle6.png") ;
  gameOverimage = loadImage("gameOver.png");
  restartimage = loadImage ("restart.png") ;
  jump = loadSound ("jump.mp3") ;
  die = loadSound ("die.mp3") ;
  checkpoint = loadSound ("checkPoint.mp3") ;
}
function setup() {
  
  createCanvas(600, 200);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trexrunning);
  trex.addAnimation("collided",trexcollided);
  trex.scale = 0.5;
  ground =createSprite(300,180,600,20);
  ground.addImage("ground",groundimage);
  ground.x = ground.width/2;
  iground = createSprite(300,190,600,10);
  iground.visible =false;
  cloudgroup =new Group() ;
  obstaclesGroup = new Group () ;
  //place gameOver and restart icon on the screen
 gameOver = createSprite(300,100);
 restart = createSprite(300,140);
gameOver.addImage(gameOverimage);
gameOver.scale = 0.5;
restart.addImage(restartimage);
restart.scale = 0.5;
count = 0 ;
gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);
  
}

function draw() {
    //set background to white
  background("white");
  //display score
  text("Score: "+ count, 500, 50);
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count + Math.round(getFrameRate()/60);
    
    if (count>0 && count%100 === 0){
      checkpoint.play () ;
    }

    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 156){
      trex.velocityY = -12 ;
      jump.play() ;
    
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
     spawncloud();
  
    //spawn obstacles
    spawnobstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      
     
      gameState = END;
     die.play () ;
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trexcollided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  
  trex.collide(iground);
 
  drawSprites() ;
}
function spawncloud() {
  if ( frameCount%60==0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudimage);
    cloud.scale =0.5;
    cloud.velocityX = -3;
    cloud.lifetime =140;
    cloud.depth = trex.depth;
    trex.depth = trex.depth +1;
    cloudgroup.add(cloud);
                         
  }
  
}


function spawnobstacles() {
  if (frameCount%60==0) {
    var obstacles = createSprite(600,165,10,40) ;
    obstacles.velocityX = -(6 +3*count/100) ;
    var rand = Math.round(random(1,6)) ;
    switch (rand) {
      case 1 :  obstacles.addImage(obstacle1) ; 
      break ;
       case 2 :  obstacles.addImage(obstacle2) ; 
      break ;
       case 3 :  obstacles.addImage(obstacle3) ; 
      break ;
       case 4 :  obstacles.addImage(obstacle4) ; 
      break ;
       case 5 :  obstacles.addImage(obstacle5) ; 
      break ;
       case 6 :  obstacles.addImage(obstacle6) ; 
      break ;
      default :
        break;
      
    }
    obstacles.scale = 0.5 ;
    obstacles.lifeTime = 300;
    obstaclesGroup.add(obstacles) ;
        
  }
}


function reset() {
  gameState = PLAY ;
  gameOver.visible = false ;
  restart.visible = false ;
  obstaclesGroup.destroyEach() ;
   cloudgroup.destroyEach() ;
  trex.changeAnimation("running" , trexrunning) ;
  if ( localStorage["HighestScore"] < count) {
    localStorage["HighestScore"] = count ;
  }
  console.log(localStorage["HighestScore"] ) ;
  count = 0 ;
  
  
}