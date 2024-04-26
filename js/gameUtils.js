// File description: This file contains the functions that are used in the game to create objects, move them, remove them and detect collisions.

import {SpatialHashmap} from './SpatialHashmap.js';

export function initiatePlayers(game, app, players, gameState) {
    game.clients.forEach((client, index) => {
        if (index != 0) {
            const spielerName = client.playerName;
            let player = app.stage.children.find(c => c.name === spielerName);

            if (!player) {
                player = PIXI.Sprite.from(`/images/player${index}.png`);
                player.name = spielerName;
                player.anchor.set(0);
                player.x = game.Xpositionen[index];              
                player.y = app.view.height / 1.2;
                player.score = 0;
                player.lives = 0;
                player.type = 'player';
                app.stage.addChild(player);
                players.push(player);
                // Add the player's position to the game state
                gameState.addObject(player);
            }
        }
    });
    // Here the number of active players is set, important for determining the winner
    return players.length;
}

// Hier wird eine random position innerhalb des app views auf der xachse erzeugt
export function getRandomXPosition(app) {
    // Get the maximum multiple of 48 that fits within app.view.width
    var maxMultiple = Math.floor(app.view.width / 48);

    // Get a random multiple of 48
    var randomMultiple = Math.floor(Math.random() * maxMultiple);

    // Return the random multiple of 48
    return randomMultiple * 48;
}

export function createObject(imagePath, array, app, gameState) {
    const object = PIXI.Sprite.from(imagePath);
    object.anchor.set(0);
    object.x = getRandomXPosition(app);
    object.y = -50;
    app.stage.addChild(object);
    array.push(object);

    // Use the name of the array plus its length as the key
    let key = array.name + array.length.toString();

    // Add the object's position to the game state
    gameState.set(key, { x: object.x, y: object.y });
}
let blockCounter = 0;
export function createBlocks(imagePath, blocks, app,gameState) {
    const object = PIXI.Sprite.from(imagePath);
    object.anchor.set(0);
    object.x = getRandomXPosition(app);
    object.y = -50;
    object.type = 'block';
    app.stage.addChild(object);
    // Key for the hashmap and name of the object
    let key = 'block' + blockCounter;
    blockCounter++;
    object.name = key;
    blocks.push(object);

    // Add the object's position to the game state
    gameState.addObject(object);
}
let heartCounter = 0;
export function createHearts(imagePath, hearts, app, gameState) {
    const object = PIXI.Sprite.from(imagePath);
    object.anchor.set(0);
    object.x = getRandomXPosition(app);
    object.y = -50;
    object.type = 'heart';
    app.stage.addChild(object);
    // Use the name of the array plus its length as the key
    let key = 'heart' + heartCounter;
    object.name = key;
    heartCounter++;
    hearts.push(object);
    // Add the object's position to the game state
    gameState.addObject(object);
}


let starCounter = 0;
export function createStars(imagePath, stars, app, gameState) {
    const object = PIXI.Sprite.from(imagePath);
    object.anchor.set(0);
    object.x = getRandomXPosition(app);
    object.y = -50;
    object.type = 'star';
    app.stage.addChild(object);
    // Use the name of the array plus its length as the key
    let key = 'star' + heartCounter;
    object.name = key;
    starCounter++;
    stars.push(object);
    // Add the object's position to the game state
    gameState.addObject(object);
}



export function moveObjects(array, app, blockSpeed, gameState) {
    array.forEach(object => {
        let oldX = object.x;
        let oldY = object.y;
        object.y += blockSpeed;
        gameState.updateObjectPosition(object, oldX, oldY, gameState);

        if (object.y > app.view.height) {
            app.stage.removeChild(object);
            //Remove the object from the game state
            gameState.removeObject(object);
            const index = array.indexOf(object);
            if (index !== -1) {
                array.splice(index, 1);
            }
        }
    });
    blockSpeed += 0.0025;
    // Hier wird die Geschwindigkeit der Blöcke zurückgegeben um sie im jeweiligen Modus zu speichern
    return blockSpeed;
}

export function removeObjects(objects, app, gameState) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const object = objects[i];
        app.stage.removeChild(object);
        gameState.removeObject(object);
    }
}

// Kolisionserkennungsfunktion gibt true oder false zurück
export function kollisionstest(player, block) {
    let playerBox = player.getBounds();
    let blockBox = block.getBounds();
        return playerBox.x + playerBox.width > blockBox.x &&
                playerBox.x < blockBox.x + blockBox.width &&
                playerBox.y + playerBox.height > blockBox.y &&
                playerBox.y < blockBox.y + blockBox.height;
}

export function collisionTest(playerName, objectName, gameState) {
    // Get the player and object data from the game state
    let playerPosition = gameState.get(playerName);
    let objectPosition = gameState.get(objectName);

    return playerPosition.x + 48 > objectPosition.x &&
    playerPosition.x < objectPosition.x + 48 &&
    playerPosition.y + 48 > objectPosition.y &&
    playerPosition.y < objectPosition.y + 48;
}
