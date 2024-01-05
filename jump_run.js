
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = 1200;  
canvas.height = 800; 


let playerStartX = 50;
let playerStartY = 2050;
let player = {
    x: playerStartX,
    y: playerStartY,
    width: 50,
    height: 80,
    color: 'transparent',
    velocityY: 0,
    jumpForce: -17, // <-----                   sprungsTärke oder höhe anpassen!!!
    onGround: false,
    lastDirection: 'right',
};



let playerImages = {
    walkingLeft: new Image(),
    walkingRight: new Image(),
    standingRight: new Image(),
    standingLeft: new Image()
};


playerImages.walkingLeft.src = 'img/char_left_1.png'; 
playerImages.walkingRight.src = 'img/char_right_1.png'; 
playerImages.standingRight.src = 'img/char_right_2.png'; 
playerImages.standingLeft.src = 'img/char_left_2.png';

player.state = 'standing'; 
player.image = playerImages.standing; 


let platforms = [

    { x: 50, y: 2150, width: 400, height: 20, color: 'grey' },
    { x: 200, y: 2050, width: 70, height: 20, color: 'blue' },
    { x: 300, y: 1950, width: 70, height: 20, color: 'blue' },
    { x: 400, y: 1850, width: 70, height: 20, color: 'blue' },
    { x: 500, y: 1750, width: 70, height: 20, color: 'blue' },
    { x: 600, y: 1650, width: 70, height: 20, color: 'blue' },
    { x: 700, y: 1550, width: 70, height: 20, color: 'blue' },

    { x: 1000, y: 1550, width: 30, height: 20, color: 'blue' },


    { x: 1270, y: 1500, width: 30, height: 20, color: 'blue' },

    { x: 1470, y: 1500, width: 30, height: 20, color: 'blue' },

];


let finishBlock = { x: 1600, y: 1450, width: 100, height: 50, color: 'green' }; 



function checkFinish() {
    if (player.x < finishBlock.x + finishBlock.width &&
        player.x + player.width > finishBlock.x &&
        player.y < finishBlock.y + finishBlock.height &&
        player.y + player.height > finishBlock.y) {
        finishGame(); 
    }
}

function finishGame() {
    isFinished = true; 

  
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = 'white'; 
    ctx.font = '48px "Press Start 2P"'; 
    let text = 'Glückwunsch';
    let textWidth = ctx.measureText(text).width; 
    let xPosition = (canvas.width - textWidth) / 2; 
    let yPosition = canvas.height / 2; 

    ctx.fillText(text, xPosition, yPosition); 


    setTimeout(function() {
        window.location.href = 'index.html'; 
    }, 2000);
}






let viewport = {
    x: 0,
    y: 0
};


let maxCameraHeight = 4000; 

let isFinished = false;


function updateGame() {

    if (isFinished) return;


    requestAnimationFrame(updateGame);


    movePlayer();

    adjustCamera();

    checkFinish();



   if (player.y > canvas.height + viewport.y) {
       resetPlayer();
   }

    player.velocityY += 0.7; 
    player.y += player.velocityY;
    player.onGround = false;
    

platforms.forEach(p => {
    if (player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y) {

      
        if (player.y + player.height <= p.y + player.velocityY) {
            player.onGround = true;
            player.velocityY = 0;
            player.y = p.y - player.height;
        } else if (player.y > p.y && player.velocityY < 0) {
          
            player.velocityY = 0; 
            player.y = p.y + p.height;
        }
    }
});


platforms.forEach(p => {
    if (player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y) {

        if (player.x + player.width > p.x && player.x < p.x + p.width) {
          
            if (player.x < p.x) {
                
                player.x = p.x - player.width;
            } else if (player.x > p.x) {
                
                player.x = p.x + p.width;
            }
        }
    }
});

    

    draw();
}




function adjustCamera() {
    let middleScreenX = canvas.width / 2;
    let middleScreenY = canvas.height / 2;


   if (player.x - viewport.x > middleScreenX) {
       viewport.x = player.x - middleScreenX;
   } else if (player.x - viewport.x < middleScreenX && viewport.x > 0) {
       viewport.x = Math.max(player.x - middleScreenX, 0);
   }



    if (player.y - viewport.y < middleScreenY) {

        viewport.y = Math.min(Math.max(player.y - middleScreenY, 0), maxCameraHeight - canvas.height);
    } else if (player.y - viewport.y > middleScreenY) {
      
        viewport.y = Math.min(player.y - middleScreenY, playerStartY - middleScreenY);
    }
}




let keys = {};
window.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

function movePlayer() {
    if (keys['ArrowLeft']) {
        player.x -= 5;
        player.state = 'walkingLeft';
        player.image = playerImages.walkingLeft;
        player.lastDirection = 'left'; 
    } else if (keys['ArrowRight']) {
        player.x += 5;
        player.state = 'walkingRight';
        player.image = playerImages.walkingRight;
        player.lastDirection = 'right'; 
    } else {
        player.state = 'standing';

        if (player.lastDirection === 'left') {
            player.image = playerImages.standingLeft;
        } else {
            player.image = playerImages.standingRight;
        }
    }
    if (keys['Space'] && player.onGround) {
        player.velocityY = player.jumpForce;
    }
}



function resetPlayer() {
    player.x = playerStartX;
    player.y = playerStartY;
    player.velocityY = 0;
    viewport.x = 0; 
}



let imageYOffset = 10; 


function draw() {

    if (isFinished) return;


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - viewport.x, player.y - viewport.y, player.width, player.height);
    ctx.drawImage(player.image, player.x - viewport.x, player.y - viewport.y + imageYOffset, player.width, player.height);
    
    
 ctx.fillStyle = finishBlock.color;
    ctx.fillRect(finishBlock.x - viewport.x, finishBlock.y - viewport.y, finishBlock.width, finishBlock.height);



    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - viewport.x, p.y - viewport.y, p.width, p.height);
    });
}


updateGame();
