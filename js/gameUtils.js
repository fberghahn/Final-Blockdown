// File description: This file contains the functions that are used in the game to create objects, move them, remove them and detect collisions.

export function initiatePlayers(game, app, players) {
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
                app.stage.addChild(player);
                players.push(player);
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
// 
export function createObject(imagePath, array, app) {
    const object = PIXI.Sprite.from(imagePath);
    object.anchor.set(0);
    object.x = getRandomXPosition(app);
    object.y = -50;
    app.stage.addChild(object);
    array.push(object);
}

export function moveObjects(array,app, blockSpeed) {
    array.forEach(object => {
        object.y += blockSpeed;
        if (object.y > app.view.height) {
            app.stage.removeChild(object);
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

export function removeObjects(objects, app) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const object = objects[i];
        app.stage.removeChild(object);
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