// Standard Mode for the game Final Blockdown 

// Modul Imports
import {  createBlocks,createHearts, moveObjects, removeObjects, kollisionstest, initiatePlayers, createStars } from './gameUtils.js';
import { StandardTextStyle, StandardTextStyle2 } from './pixiTextStyles.js';
import {SpatialHashmap} from './SpatialHashmap.js';

// PixiJS-App erstellen
let app;
let neustartText;
let appWidth;
let appHeight;
let basicText;
let basicText2;
let winnerText;
let urlParams;
window.onload = function () {

    app = new PIXI.Application(
        { background: '#02151E', resizeTo: window }
    );
    document.body.appendChild(app.view);

    appWidth = app.view.width;
    appHeight = app.view.height;
    
    // Get the URL parameters
    urlParams = new URLSearchParams(window.location.search);
    const backgroundImage = urlParams.get('background');

    let bg;

    if (backgroundImage === "1") {
        bg = PIXI.Sprite.from(`/images/spiel-backgroundimg2.png`);
    }
    else if (backgroundImage === "2") {
        bg = PIXI.Sprite.from(`/images/background-img.png`);
    }
    else if (backgroundImage === "3") {
        bg = PIXI.Sprite.from(`/images/hintergrund-img2.png`);
    }
    bg.width = appWidth;
    bg.height = appHeight;

    app.stage.addChild(bg);
    bg.anchor.set(0.5);
    bg.x = appWidth / 2;
    bg.y = appHeight / 2;

    // Create a new audio element using createElement
    let audioElement = document.createElement("audio");

    // Set the source, type, and other attributes
    let sourceElement = document.createElement("source");
    sourceElement.src = "/soundFiles/Powerful-Trap-(chosic.com).mp3";
    sourceElement.type = "audio/mp3";

    audioElement.appendChild(sourceElement);
    audioElement.id = "audio";
    audioElement.loop = true;
    audioElement.muted = true;
    audioElement.preload = "auto";

    // Append the audio element to the body (or any other container element)
    document.body.appendChild(audioElement);
    // Load the mute icon
    let muteIcon = PIXI.Sprite.from('/images/mute-icon.png');

    // Set the position of the mute icon
    muteIcon.x = appWidth - 100; // Adjust as needed
    muteIcon.y = appWidth * 0.02; 
    muteIcon.scale.set(0.1); 

    // Enable interactivity and button mode
    muteIcon.interactive = true;
    muteIcon.buttonMode = true;

    // Add a click event handler
    muteIcon.on('pointerdown', () => {
        // Toggle mute state
        audioElement.muted = !audioElement.muted;
    
        // Explicitly attempt to play the audio
        if (!audioElement.muted) {
            audioElement.play()
        }
    });

    // Add the mute icon to the stage
    app.stage.addChild(muteIcon); 

    createRestartText();
    };



function createRestartText() {
    const restartText = new PIXI.Text('Press Enter to restart the game', StandardTextStyle);
    restartText.x = app.view.width / 2;
    restartText.y = (app.view.height / 2) + 300;
    restartText.anchor.set(0.5);
}

// Getting QR-Code Canvas Element and not showing it, because it gets turned into an image and displayed with Pixijs  
var qrcanvas = document.getElementById("qrcode");
qrcanvas.style.display = "none";
let qrSprite;
let backgroundQr;

// Get the spieleranzahl parameter
urlParams = new URLSearchParams(window.location.search);
const spielerAnzahl = urlParams.get('spieleranzahl');

// Spieler und Blöcke erstellen
let players = []; // Spieler array
let activePlayerCount = null;

let hearts = []; // Array for the hearts
let blocks = []; // Array for the blocks or obstacles
let stars = []; // Array for the stars

// Create a new Map to store the game state
let gameState = new SpatialHashmap(50);

// Set the initial block speed and interval (Blockspeed also counts as the speed of the hearts)
let blockSpeed = 1; // Speed with which the blocks and hearts move
let blockInterval = 500; // Interval at which new blocks are generated (in milliseconds)

let clientId = null;
let gameId = null;
let isGameStarted = false; // Gamestate if blocks and hearts are moving

// Gamestate for the positions of the players
let Xpositions = {};

// Create the host websocket connection
var host = location.origin.replace(/^http/, 'ws')
// create the websocket connection
var websocket = new WebSocket(host);

// Score Text for how many points each player has
let scoreText = new PIXI.Text('', StandardTextStyle2);
scoreText.style.fontSize = 24;
scoreText.x = 10;
scoreText.y = 10;

// Manage Messages from the server
websocket.onmessage = message => {

    // Convert the server message into a JSON object
    const response = JSON.parse(message.data);

    // connection -> GameId recievied from the server
    if (response.method === "connect") {
        clientId = response.clientId;
        const payload = {
            "method": "create",
            "clientId": clientId,
            "appWidth": appWidth
        }
        websocket.send(JSON.stringify(payload));
    }

    if (response.method === "create") {

        gameId = response.game.id;
        const lobbyUrl = "https://final-blockdown.de/mobile.html?gameId=" + gameId;
        console.log("http://localhost:9000/mobile.html?gameId=" + gameId);
        console.log("https://final-blockdown.de/mobile.html?gameId=" + gameId);

        var qrcode = new QRious({
            element: document.getElementById("qrcode"),
            background: '#ffffff',
            backgroundAlpha: 1,
            foreground: '#000000',
            foregroundAlpha: 1,
            level: 'H',
            padding: 0,
            size: 256,
            value: lobbyUrl
        });
        // Wait till the QR-Code is generated and then convert it to an image and display it with PixiJS
        setTimeout(function () {
            var base64 = qrcanvas.toDataURL("image/png");
            var texture = PIXI.Texture.from(base64);
            qrSprite = new PIXI.Sprite(texture);

            qrSprite.anchor.set(0.5);
            qrSprite.x = (app.renderer.width - qrSprite.width) / 2;
            qrSprite.y = (app.renderer.height - qrSprite.height) / 4.5;            
            
            // Create a white background behind the Qr-Code, so that the code can be scanned better on dark backgrounds
            // the height and widht of the background is 270px, because the QR-Code is 256px 
            backgroundQr = new PIXI.Graphics();
            backgroundQr.beginFill(0xFFFFFF) // White color
                .drawRect((app.renderer.width / 2) -140, (app.renderer.height/4.5)-140 , 270 , 270)
                .endFill();

            // Add the background, border and QR code to the stage
            app.stage.addChild(backgroundQr);
            app.stage.addChild(qrSprite);
        }, 500); 
    };
    
    // when a player joins the game 
    if (response.method === "join") {
        const game = response.game;
        activePlayerCount = initiatePlayers(game, app, players,gameState);
        // Add the score text to the stage
        app.stage.addChild(scoreText);
        gameLoopTicker.start();
    };

// Updates the state of the game by setting thew new X-positions of the players and checking if the game can be started
    if (response.method === "update"){
        const game = response.game;
        Xpositions = game.Xpositionen;
        console.log(gameState);
        //If the lobby is full, the game can be started. For this, the number of players must be reached and the game must not have started yet
        if (activePlayerCount >= Number(spielerAnzahl) && !isGameStarted ) {
            // remove QR-Code
            app.stage.removeChild(qrSprite);
            app.stage.removeChild(backgroundQr);
            qrSprite = null;

             // Text that all players are connected & can start with Enter
            // Adjust fontsize because of winning text and check if the texts are already there, as the update response is called repeatedly before the game starts
            if (!app.stage.children.includes(basicText)) {
                basicText = new PIXI.Text('All players are now connected', StandardTextStyle);
                basicText.style.fontSize = 36;
                basicText.x = appWidth / 2; 
                basicText.y = appHeight / 5; 
                basicText.anchor.set(0.5);
                app.stage.addChild(basicText);
            }
            
            if (!app.stage.children.includes(basicText2)) {
                basicText2 = new PIXI.Text('Press Enter to start the game', StandardTextStyle);
                basicText2.x = appWidth / 2; 
                basicText2.y = appHeight / 3.5; 
                basicText2.anchor.set(0.5);
                app.stage.addChild(basicText2);
            }
        }  
    };
    if (response.method === "jump") {
        let index = response.index;
        // Minus 1 because the index is adjusted on the serverside for having the host at index 0, but thats not the case for the  players array
        const player = players[index-1];
        player.jumping = true;
        
    }
    // Restart the game, on server request
    if (response.method === "restart"){
        const game = response.game;
        // Remove blocks and hearts
        removeObjects(blocks, app,gameState);
        removeObjects(hearts, app,gameState);
        removeObjects(stars, app,gameState);
        gameState = new SpatialHashmap(50);
        // Reset the Speed and Spwan Interval
        blockSpeed = 1;
        blockInterval = 500;
        blocks=[];
        // Remove the players
        players.forEach(player => {
            app.stage.removeChild(player);
        });
        players = [];
        app.stage.removeChild(winnerText);
        app.stage.removeChild(neustartText);
        // initiate the players again and set the active player count
        activePlayerCount = initiatePlayers(game, app, players,gameState);
        gameLoopTicker.start();
    };
};

let intervalIdBlocks; // Store the interval ID
let intervalIdHearts; // Store the interval ID
let intervalIdStars; // Store the interval ID

// Keyboard input for the Enter key to start the game 
document.addEventListener("keydown", handleEnterKey);
function handleEnterKey(event) {

    // When Enter is pressed and the desired number of players is reached, the game starts
    if ((event.keyCode === 13 || event.key === " ") && activePlayerCount === Number(spielerAnzahl) && !isGameStarted) {
        app.stage.removeChild(basicText);
        app.stage.removeChild(basicText2);
        basicText2.updateText();
        blocks=[];
        hearts=[];
        stars=[];
        clearInterval(intervalIdBlocks);
        clearInterval(intervalIdHearts);
        clearInterval(intervalIdStars);
        collisionAndWinnerTicker.start();
        moveBlocksTicker.start();
        intervalIdBlocks = setInterval(function() {
            createBlocks(`/images/block.png`, blocks, app, gameState);
        }, blockInterval);
        intervalIdHearts = setInterval(function() {
            createHearts(`/images/heart-block.png`, hearts, app, gameState);
        }, blockInterval * 5);
        intervalIdStars = setInterval(function() {
            createStars(`/images/star-block.png`, stars, app, gameState);
        }, blockInterval * 20);
        isGameStarted = true; // Set the game state to started
    }
}

// Game loop function where the player positions are updated, is added to the ticker and started as soon as the first player joins.
function gameLoop(players) {
    const jumpHeight = app.view.height * 0.2; // The height of the jump as 20% of the app height
    const jumpSpeed = 5; // The speed of the jump in pixels per frame
    //  Standard Y-Positions for the players
    const startYPosition = app.view.height / 1.2;

    players.forEach((player, index) => {
        let oldX = player.x;
        let oldY = player.y;
        // If the player is jumping, move them up until they reach the peak of their jump
        if (player.jumping && player.y > startYPosition - jumpHeight) {
            player.y -= jumpSpeed;
        }
        // If the player has reached the peak of their jump, move them back down
        else if (player.jumping && player.y <= startYPosition - jumpHeight) {
            player.jumping = false;
        }
        // If the player is not jumping and they are not on the ground, move them down
        else if (!player.jumping && player.y < startYPosition) {
            player.y += jumpSpeed;
        }
        player.x = Xpositions[index + 1];
        // Update the player's position in the game state
        gameState.updateObjectPosition(player, oldX, oldY);
    });

    scoreText.text = 'Scores:\n' + players.map(player => `${player.name}: ${player.score}, Lives: ${player.lives}`).join('\n');
    app.stage.setChildIndex(scoreText, app.stage.children.length - 1);
}

// Add a keydown for "N" event listener for sending the reset message to the server
document.addEventListener('keydown', function(event) {
    if ((event.key === 'N' || event.key === 'n') && !isGameStarted) {
        const payLoad = {
            "method": "reset",
            "gameId": gameId,
            "appWidth": appWidth
        }
        websocket.send(JSON.stringify(payLoad));
    }
});

// Ticker for player movement, separated from the movement of other objects, as players can already move before the start
const gameLoopTicker = new PIXI.Ticker();
            
gameLoopTicker.add(() => {
    gameLoop(players);
});

const moveBlocksTicker = new PIXI.Ticker();
            
moveBlocksTicker.add(() => {
    // Set the block speed in this way here, so that the function from gameUtils.js can return the value and it can be used here
    moveObjects(blocks, app, blockSpeed, gameState);
    blockSpeed = moveObjects(hearts, app, blockSpeed, gameState);
    moveObjects(stars, app, blockSpeed, gameState);
});

const collisionAndWinnerTicker = new PIXI.Ticker();

collisionAndWinnerTicker.add(() => {
    // Collision test and player removal
    players.forEach((player) => {
        // Skip collision checks if the player has already collided or is on cooldown
        if (player.kollidiert) {
            return;
        }
        if (player.cooldown > 0) {
            player.cooldown -= 1; // Decrease the cooldown
        }
        if (player.cooldown === 0) {
            player.alpha = 1; // Reset the player's opacity
        }
    
        // Retrieve potential collisions from the spatial hashmap
        const potentialCollisions = gameState.getPotentialCollisions(player);

        // Check for collisions
        potentialCollisions.forEach(object => {
            if (kollisionstest(player, object)) {
                if (object.type === 'block') {
                    if (player.lives > 0) {
                        player.lives -= 1; // Remove a life
                        player.cooldown = 60; // Set cooldown
                        player.alpha = 0.5; // Decrease opacity
                    } else {
                        app.stage.removeChild(player);
                        player.kollidiert = true;
                        gameState.removeObject(player);
                    }
                } else if (object.type === 'heart') {
                    gameState.removeObject(object);
                    player.score += 1;
                    if (player.score % 2 === 0) {
                        player.lives += 1; // Add a life if the new score is even
                    }
                    app.stage.removeChild(object);
                    const index = hearts.indexOf(object);
                    if (index !== -1) {
                        hearts.splice(index, 1);
                    }
                } else if (object.type === 'star') {
                    gameState.removeObject(object);
                    app.stage.removeChild(object);
                    player.cooldown = 120; // Set cooldown to 120
                    player.alpha = 0.5; // Decrease opacity
                    const index = stars.indexOf(object);
                    if (index !== -1) {
                        stars.splice(index, 1);
                    }
                }
            }
        });
    });

    // active Players for winner determination and game ending 
    const activePlayers = players.filter(player => !player.kollidiert);
    activePlayerCount = activePlayers.length;

    // If only one player is left, they are the winner
    if (activePlayerCount <= 1) {
        const gewinner = activePlayers[0];
        winnerText = new PIXI.Text('The winner is ' + gewinner.name, StandardTextStyle);
        winnerText.style.fontSize = 80;
        winnerText.x = app.view.width / 2;
        winnerText.y = (app.view.height / 2) - 300;
        winnerText.anchor.set(0.5);
        app.stage.addChild(winnerText);

        moveBlocksTicker.stop();
        gameLoopTicker.stop();
        collisionAndWinnerTicker.stop();
        isGameStarted = false;
    }
});