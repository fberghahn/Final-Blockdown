// This is the second game mode of the game Finalbockdown
// Modul Imports
import { createStars, createBlocks,createHearts, moveObjects, removeObjects, kollisionstest, initiatePlayers, collisionTest } from './gameUtils.js';
import { StandardTextStyle, StandardTextStyle2 } from './pixiTextStyles.js';
import {SpatialHashmap} from './SpatialHashmap.js';

// PixiJS-App erstellen
let app;
let appWidth;
let appHeight;
let basicText;
let basicText2;
let winnerText;
let resetText;
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
    };

// Getting QR-Code Canvas Element and not showing it, because it gets turned into an image and displayed with Pixijs  
var qrcanvas = document.getElementById("qrcode");
qrcanvas.style.display = "none";
let qrSprite;
let backgroundQr;

// Get the spieleranzahl parameter
urlParams = new URLSearchParams(window.location.search);
const spielerAnzahl = urlParams.get('spieleranzahl');


// Create the arrays for the players, hearts and blocks 
let players = []; // Player array
let activePlayerCount = null;
let hearts = []; // Array for the heart objects
let blocks = []; // Array for the block objects
let stars = []; // Array for the  star objects

// Create a new SpatialHasmap to store the game objects and improve collsion detection
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
            var baseTexture = PIXI.BaseTexture.from(base64);
            var texture = new PIXI.Texture(baseTexture);
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
        gameLoopTicker.start();
    };

    // Updates the state of the game by setting thew new X-positions of the players and checking if the game can be started
    if (response.method === "update"){
        const game = response.game;
        console.log(game)
        Xpositions = game.Xpositionen;              
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
        stars = [];
        hearts=[];
        // Remove the players
        players.forEach(player => {
            app.stage.removeChild(player);
        });
        players = [];
        app.stage.removeChild(winnerText);
        app.stage.removeChild(resetText);
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
        isGameStarted = true; //  Set the game state to started
    }
}

// Game loop function where the player positions are updated, is added to the ticker and started as soon as the first player joins.
function gameLoop(players) {
    const jumpHeight = app.view.height * 0.2; // The height of the jump as 20% of the app height
    const jumpSpeed = 5; // The speed of the jump in pixels per frame
    const startYPosition = app.view.height / 1.2; //  Standard Y-Positions for the players

    // Clear previous scores from the stage
    app.stage.children.forEach(child => {
        if (child.isScoreText) {
            app.stage.removeChild(child);
        }
    });

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

        // Determine the color based on the kollidiert property
        const color = player.kollidiert ? 'grey' : 'white';

        // Create a text style for this player
        const playerStyle = new PIXI.TextStyle({
            ...StandardTextStyle,
            fontSize: 24,
            fill: color, // Set color based on kollidiert status
        });
    
        // Create the text object for this player
        const playerText = new PIXI.Text(`${player.name}: ${player.score}`, playerStyle);
        playerText.y = index * 40; // Position each player's score 30 pixels apart vertically
        playerText.x = 10; // Horizontal positioning
        playerText.isScoreText = true; // Custom property to identify score texts for removal

        // Add to the stage
        app.stage.addChild(playerText);
    });
}

// Add a keydown for "N" event listener to the document
document.addEventListener('keydown', function(event) {
    if ((event.key === 'R' || event.key === 'r') && !isGameStarted) {
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
    moveObjects(blocks, app, blockSpeed, gameState );
    blockSpeed = moveObjects(hearts, app, blockSpeed, gameState );
    moveObjects(stars, app, blockSpeed, gameState);
});

const collisionAndWinnerTicker = new PIXI.Ticker();

collisionAndWinnerTicker.add(() => {
    // Collision test and player removal
    players.forEach((player) => {
        // If the player has collided, skip the collision check
        if (player.kollidiert) {
            return;
        }
        if (player.cooldown > 0) {
            player.cooldown -= 1; // Decrease the player's cooldown
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
                    app.stage.removeChild(player);
                    player.kollidiert = true;
                    gameState.removeObject(player);
                } else if (object.type === 'heart') {
                    gameState.removeObject(object);
                    player.score += 1;
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

    // End the game if there are no active players left
    if (activePlayerCount === 0 ) {

        const highestScore = Math.max(...players.map(player => player.score));
        const topPlayers = players.filter(player => player.score === highestScore);

        if (topPlayers.length > 1) {
            winnerText = new PIXI.Text("That's a draw", StandardTextStyle);
          } else {
            winnerText = new PIXI.Text('The winner of hearts ❤ is ' + topPlayers[0].name + '\n  with a score of ' + topPlayers[0].score, StandardTextStyle);
        }
        winnerText.style.fontSize = 80;
        winnerText.style.align = 'center';
        winnerText.style.wordWrap = true;
        winnerText.style.wordWrapWidth = app.view.width - 100;
        winnerText.x = app.view.width / 2;
        winnerText.y = (app.view.height / 2) - 200;
        winnerText.anchor.set(0.5);
        app.stage.addChild(winnerText);

        resetText = new PIXI.Text('Press "R" to reset', StandardTextStyle);
        resetText.x = app.view.width / 2;
        resetText.y = (app.view.height / 2) + 100;
        resetText.anchor.set(0.5);
        app.stage.addChild(resetText);

        moveBlocksTicker.stop();
        gameLoopTicker.stop();
        collisionAndWinnerTicker.stop();
        isGameStarted = false;
    }
});