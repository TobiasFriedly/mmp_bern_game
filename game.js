const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');




const blockSize = 50; 
const moveDuration = 250; 



let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
let offscreenCtx = offscreenCanvas.getContext('2d');



let character = {
    x: 1200,
    y: 1600,
    width: 50,
    height: 80,
    color: 'blue',
    speed: 5, 
    boostSpeed: 10,
    isMoving: false,
    moveStartTime: null,
    moveDirection: 'down', 
    currentFrame: 1,
    targetX: null,
    targetY: null,
    textures: {
        up: [new Image(), new Image(), new Image()],
        down: [new Image(), new Image(), new Image()],
        left: [new Image(), new Image(), new Image()],
        right: [new Image(), new Image(), new Image()]
    },
    continueMoving: false, 
};

character.textures.up[0].src = 'img/char_up_1.png';
character.textures.up[1].src = 'img/char_up_2.png';
character.textures.up[2].src = 'img/char_up_3.png';

character.textures.left[0].src = 'img/char_left_1.png';
character.textures.left[1].src = 'img/char_left_2.png';
character.textures.left[2].src = 'img/char_left_3.png';

character.textures.down[0].src = 'img/char_down_1.png';
character.textures.down[1].src = 'img/char_down_2.png';
character.textures.down[2].src = 'img/char_down_3.png';

character.textures.right[0].src = 'img/char_right_1.png';
character.textures.right[1].src = 'img/char_right_2.png';
character.textures.right[2].src = 'img/char_right_3.png';



let camera = {
    x: 600,
    y: 1000,
    width: canvas.width,
    height: canvas.height,
    scrollMargin: 100 
};


let map = {
    width: 2000,
    height: 2000
};

let mapImage = new Image();
mapImage.onload = function() {
 
};
mapImage.src = 'img/h8_16bit_1_zwi2_sketch2.jpg'; 

const keys = {
    right: false,
    left: false,
    up: false,
    down: false,
    shift: false, 
    space: false
};





let blocks = [
   // { x: 300, y: 300, width: 100, height: 100, color: 'red' },



    { x: 0, y: 900, width: 2000, height: 50, color: 'transparent' },
    { x: 700, y: 1150, width: 300, height: 300, color: 'transparent' },
    { x: 1300, y: 1400, width: 200, height: 50, color: 'transparent' },

    { x: 1000, y: 1400, width: 200, height: 50, color: 'transparent' },
    { x: 1450, y: 1200, width: 50, height: 200, color: 'transparent' },

    { x: 1300, y: 1150, width: 200, height: 50, color: 'transparent' },

    { x: 1000, y: 1150, width: 200, height: 50, color: 'transparent' },

    { x: 1500, y: 1450, width: 50, height: 350, color: 'transparent' },

    { x: 950, y: 1750, width: 550, height: 50, color: 'transparent' },
    { x: 950, y: 1450, width: 50, height: 350, color: 'transparent' },
    { x: 1300, y: 1550, width: 50, height: 50, color: 'transparent' },

    { x: 1650, y: 1150, width: 500, height: 50, color: 'transparent' },
    { x: 1650, y: 1200, width: 100, height: 100, color: 'transparent' },
    { x: 1950, y: 950, width: 50, height: 200, color: 'transparent' },
    { x: 1900, y: 1200, width: 50, height: 250, color: 'transparent' },
    { x: 1550, y: 1450, width: 350, height: 50, color: 'transparent' },


    { x: 0, y: 1450, width: 750, height: 50, color: 'transparent' },
    { x: 0, y: 950, width: 50, height: 500, color: 'transparent' },

    { x: 0, y: 850, width: 750, height: 50, color: 'transparent' },
    { x: 750, y: 1450, width: 50, height: 100, color: 'transparent' },
    { x: 900, y: 950, width: 150, height: 50, color: 'transparent' },

    { x: 600, y: 950, width: 50, height: 50, color: 'transparent' }, //interaktions test
    { x: 150, y: 950, width: 50, height: 50, color: 'transparent' },


    { x: 500, y: 1050, width: 50, height: 100, color: 'transparent' }, //Dozent


  //  { x: 300, y: 1150, width: 50, height: 50, color: 'blue' }, //laptop 1
   // { x: 200, y: 1150, width: 50, height: 50, color: 'blue' }, //laptop 2
    //{ x: 900, y: 950, width: 150, height: 50, color: 'blue' }, //abfallstation 



    { x: 100, y: 1150, width: 250, height: 50, color: 'transparent' },
    { x: 450, y: 1150, width: 200, height: 50, color: 'transparent' },

    { x: 100, y: 1300, width: 250, height: 50, color: 'transparent' },
    { x: 450, y: 1300, width: 200, height: 50, color: 'transparent' },

    { x: 300, y: 1100, width: 100, height: 50, color: 'transparent' },




    {  x: 0, y: 600, width: 300, height: 150, color: '#ff00002c' },
    {  x: 450, y: 600, width: 1700, height: 150, color: '#ff00002c' },
    {  x: 0, y: 0, width: 1300, height: 400, color: '#ff00002c' },
    {  x: 1300, y: 0, width: 150, height: 300, color: '#ff00002c' },

   // { x: 750, y: 850, width: 50, height: 200, color: '#ff00002c' },
];

let interactionBlocks = [
    { x: 600, y: 950, width: 50, height: 50, text: "So einen modernen Bildschirm hast du noch nie gesehen! " },

    { x: 1300, y: 1550, width: 50, height: 50, text: "Möge die Macht des Nikotins mit dir sein! " },

   // Hier beginnt jedes Plastikfläschchen eine neue Reise und jedes Blatt Papier träumt von Wiedergeburt.

    //Dieser Laptop hat mehr verpasste Termine als ein Student im Erstsemester.

    //Dieser Laptop enthält mehr unfertige Digezz Projekte als das Bermuda-Dreieck Schiffe.

    { x: 900, y: 950, width: 250, height: 50, text: "Hier träumt jedes Plastikfläschchen von Wiedergeburt." },

    { x: 300, y: 1150, width: 50, height: 50, text: "Vorsicht, die Tastatur könnte Spuren von Panik enthalten! " },

    { x: 200, y: 1100, width: 50, height: 50, text: "Mehr unfertige Digezz als das Bermuda-Dreieck Schiffe."},


    { x: 500, y: 1050, width: 50, height: 100, text: "Bereit für die ultimative Prüfung?", specialInteraction: true },


    //Vorsicht, die Tastatur könnte Spuren von Panik und Pizzakrümeln enthalten!

    //Tritt ein in die 'Krypta des Kreativchaos'

];





let teleportZones = [

   // { x: 1750, y: 1250, width: 150, height: 50, color: 'red' },


    { x: 1750, y: 1250, width: 150, height: 50, targetX: 350, targetY: 600, cameraX: 50, cameraY: 50 }, 

    { x: 300, y: 700, width: 150, height: 50, targetX: 1800, targetY: 1300, cameraX: 700, cameraY: 1000 }, 

];






let isInteracting = false;
let currentText = "";

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') keys.right = true;
    if (event.key === 'ArrowLeft') keys.left = true;
    if (event.key === 'ArrowUp') keys.up = true;
    if (event.key === 'ArrowDown') keys.down = true;
    if (event.key === 'Shift') keys.shift = true;
    if (event.key === ' ') {
        if (isInteracting) {
            isInteracting = false;
            currentText = "";
            document.getElementById('interactionBox').style.display = 'none'; 
        } else {
            interactionBlocks.forEach(block => {
                if (isFacing(character, block) && isNear(character, block) && !isInteracting) {
                    startInteraction(block); // (block.text);
                }
            });
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowRight') keys.right = false;
    if (event.key === 'ArrowLeft') keys.left = false;
    if (event.key === 'ArrowUp') keys.up = false;
    if (event.key === 'ArrowDown') keys.down = false;
    if (event.key === 'Shift') keys.shift = false; 
    if (event.key === ' ') keys.space = false;
});

function isFacing(char, block) {
    const proximity = 50; 
    switch (char.moveDirection) {
        case 'up':
            return char.x < block.x + block.width &&
                   char.x + char.width > block.x &&
                   char.y - proximity < block.y + block.height &&
                   char.y > block.y;
        case 'down':
            return char.x < block.x + block.width &&
                   char.x + char.width > block.x &&
                   char.y + char.height + proximity > block.y &&
                   char.y < block.y;
        case 'left':
            return char.x - proximity < block.x + block.width &&
                   char.x > block.x &&
                   char.y < block.y + block.height &&
                   char.y + char.height > block.y;
        case 'right':
            return char.x + char.width + proximity > block.x &&
                   char.x < block.x &&
                   char.y < block.y + block.height &&
                   char.y + char.height > block.y;
        default:
            return false;
    }
}


function isNear(char, block) {
    const interactionDistance = 50; 
    return Math.abs(char.x - block.x) <= interactionDistance && Math.abs(char.y - block.y) <= interactionDistance;
}



function startInteraction(block) {
    isInteracting = true;
    currentText = block.text;

    if (block.specialInteraction) {
 
        document.getElementById('interactionText').innerText = block.text;
        document.getElementById('interactionBox').style.display = 'block';
    } else {

    }
}




function handleSpecialInteraction(answer) {
    if (answer === 'yes') {

        window.open('jump_run.html', '_self');
    } else if (answer === 'no') {

        document.getElementById('interactionBox').style.display = 'none';
    }

    isInteracting = false;
    currentText = "";
}




function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}




function startMove(direction) {
    if (character.isMoving || isInteracting) return; 

    let targetX = character.x;
    let targetY = character.y;

    switch (direction) {
        case 'right':
            targetX += blockSize;
            break;
        case 'left':
            targetX -= blockSize;
            break;
        case 'up':
            targetY -= blockSize;
            break;
        case 'down':
            targetY += blockSize;
            break;
    }

    if (targetX < 0 || targetX > map.width - character.width || 
        targetY < 0 || targetY > map.height - character.height ||
        blocks.some(block => isColliding({ x: targetX, y: targetY, width: character.width, height: character.height }, block))) {
        return; 
    }

    character.targetX = targetX;
    character.targetY = targetY;
    character.isMoving = true;
    character.moveDirection = direction;


    let adjustedMoveDuration = keys.shift ? 150 : moveDuration;
    character.moveStartTime = Date.now();

    if (character.continueMoving) {
        character.currentFrame = (character.currentFrame === 2) ? 0 : 2;
    } else {
        character.currentFrame = 1; 
    }
}





function update() {

    const currentSpeed = keys.shift ? character.boostSpeed : character.speed;

    if (character.isMoving) {
        let elapsedTime = Date.now() - character.moveStartTime;
        let adjustedMoveDuration = keys.shift ? 150 : moveDuration;  
        let moveProgress = elapsedTime / adjustedMoveDuration;

        if (moveProgress >= 1) {
            character.isMoving = false;
            character.x = character.targetX;
            character.y = character.targetY;
            character.continueMoving = false;
            character.currentFrame = 1; 
        } else {
            let distance = moveProgress * blockSize;
            switch (character.moveDirection) {
                case 'right':
                    character.x = character.targetX - blockSize + distance;
                    break;
                case 'left':
                    character.x = character.targetX + blockSize - distance;
                    break;
                case 'up':
                    character.y = character.targetY + blockSize - distance;
                    break;
                case 'down':
                    character.y = character.targetY - blockSize + distance;
                    break;
            }

            if (elapsedTime % (adjustedMoveDuration / 1) < (adjustedMoveDuration / 2)) {
                character.currentFrame = 0;
            } else {
                character.currentFrame = 2;
            }
        }
    } else {
        if (keys.right || keys.left || keys.up || keys.down) {
            character.continueMoving = true;
            character.currentFrame = 0;
        } else {
            character.continueMoving = false;
            character.currentFrame = 1;
        }

        if (keys.right) startMove('right');
        if (keys.left) startMove('left');
        if (keys.up) startMove('up');
        if (keys.down) startMove('down');
    }



    teleportZones.forEach(zone => {
        if (isColliding(character, zone)) {
            teleportCharacter(zone.targetX, zone.targetY, zone.cameraX, zone.cameraY);
        }
    });





    if (character.x > camera.x + camera.width - camera.scrollMargin) {
        camera.x = Math.min(map.width - camera.width, camera.x + currentSpeed);
    } else if (character.x < camera.x + camera.scrollMargin) {
        camera.x = Math.max(0, camera.x - currentSpeed);
    }

    if (character.y > camera.y + camera.height - camera.scrollMargin) {
        camera.y = Math.min(map.height - camera.height, camera.y + currentSpeed);
    } else if (character.y < camera.y + camera.scrollMargin) {
        camera.y = Math.max(0, camera.y - currentSpeed);
    }

 
        if (isInteracting) return;
}





function teleportCharacter(targetX, targetY, cameraX, cameraY) {
   
    character.x = targetX;
    character.y = targetY;
    
   
    character.isMoving = false;


    if (cameraX !== undefined && cameraY !== undefined) {
        camera.x = cameraX;
        camera.y = cameraY;
    } else {
        centerCameraOnCharacter();
    }
}


function centerCameraOnCharacter() {
    camera.x = Math.max(0, Math.min(map.width - camera.width, character.x - (camera.width / 2)));
    camera.y = Math.max(0, Math.min(map.height - camera.height, character.y - (camera.height / 2)));
}


//{ x: 950, y: 1450, width: 550, height: 350, color: 'blue' },


let specialArea = {
    x: 950, 
    y: 1450,
    width: 550,
    height: 350
};


let specialMapImage = new Image();
specialMapImage.src = 'img/h8_16bit_1_overlay_new.jpg'; 


let currentMapImage = mapImage;
let previousMapImage = null;


function isInSpecialArea() {
    return character.x > specialArea.x &&
           character.x < specialArea.x + specialArea.width &&
           character.y > specialArea.y &&
           character.y < specialArea.y + specialArea.height;
}








function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    if (isInSpecialArea()) {
        if (currentMapImage !== specialMapImage) {
            previousMapImage = currentMapImage;
            currentMapImage = specialMapImage;
            startFade();
        }
    } else {
        if (currentMapImage !== mapImage) {
            previousMapImage = currentMapImage;
            currentMapImage = mapImage;
            startFade();
        }
    }


    if (currentMapImage.complete) {
        offscreenCtx.globalAlpha = 1; 
        offscreenCtx.drawImage(currentMapImage, -camera.x, -camera.y, map.width, map.height);
    }

    if (isFading && previousMapImage) {
        offscreenCtx.globalAlpha = 1 - fadeAlpha;
        offscreenCtx.drawImage(previousMapImage, -camera.x, -camera.y, map.width, map.height);
    }


    ctx.drawImage(offscreenCanvas, 0, 0);

    offscreenCtx.globalAlpha = 1;


    blocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x - camera.x, block.y - camera.y, block.width, block.height);
    });


    if (character.textures[character.moveDirection]) {
        let texture = character.textures[character.moveDirection][character.currentFrame];
        ctx.drawImage(texture, character.x - camera.x, character.y - camera.y, character.width, character.height);
    } else {
        ctx.fillStyle = character.color;
        ctx.fillRect(character.x - camera.x, character.y - camera.y, character.width, character.height);
    }


    ctx.globalAlpha = 1;

    if (isInteracting) {
        drawTextBox(currentText);
    }


}

function drawTextBox(text) {
    const padding = 20; 
    const borderThickness = 3;

    const boxWidth = canvas.width - 200;
    const boxHeight = 100;
    const boxX = 100;
    const boxY = canvas.height - 150;


    ctx.fillStyle = 'white';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);


    ctx.strokeStyle = 'black';
    ctx.lineWidth = borderThickness;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);


    ctx.font = '16px "Press Start 2P"'; 
    ctx.fillStyle = 'black';

    const textX = boxX + padding;
    const textY = boxY + (boxHeight / 2) + (padding / 2);

    ctx.fillText(text, textX, textY);
}



let fadeAlpha = 0;
let isFading = false;

function startFade() {
    fadeAlpha = 0;
    isFading = true;
}




function gameLoop() {
    update();

    if (isFading) {
        fadeAlpha += 0.02; 
        if (fadeAlpha >= 1) {
            isFading = false;
            fadeAlpha = 1;
        }
    }

    if (isFading && previousMapImage) {
        offscreenCtx.globalAlpha = 1 - fadeAlpha;
        offscreenCtx.drawImage(previousMapImage, -camera.x, -camera.y, map.width, map.height);
    }

    render();
    requestAnimationFrame(gameLoop);
}



window.onload = function() {

    const savedX = localStorage.getItem('characterX');
    const savedY = localStorage.getItem('characterY');
    if (savedX && savedY) {
        character.x = parseInt(savedX);
        character.y = parseInt(savedY);
    }
    gameLoop(); 
};


window.onbeforeunload = function() {

    const gridX = Math.round(character.x / blockSize) * blockSize;
    const gridY = Math.round(character.y / blockSize) * blockSize;

    localStorage.setItem('characterX', gridX);
    localStorage.setItem('characterY', gridY);
};


gameLoop();

