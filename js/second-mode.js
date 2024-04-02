// Standard Modus des Spiels

// PixiJS-App erstellen
let app;
let neustartText;
let appWidth;
let appHeight;
let basicText;
let basicText2;
let urlParams;
window.onload = function () {

    app = new PIXI.Application(
        { background: '#02151E', resizeTo: window }
    );
    document.body.appendChild(app.view);

    appWidth = app.view.width;
    appHeight = app.view.height;
    console.log("App width: ", appWidth);

    // Grid erstellen 
    const playerWidth = 48;
    const gridWidth = appWidth / playerWidth;

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
        bg = PIXI.Sprite.from(`/images/background-city.png`);
    }
    bg.width = appWidth;
    bg.height = appHeight;

    app.stage.addChild(bg);
    bg.anchor.set(0.5);
    bg.x = appWidth / 2;
    bg.y = appHeight / 2;

    createNeustartText();
    };

// Textstyle für die PixiJs Texte festlegen
const StandardTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial', //Schriftart 
    fontSize: 36, // Größe
    fontWeight: 'bold', 
    fill: ['#ffffff', '#ff9999'], // Gradient von Weiß zu einem hellen Rot
    stroke: '#4a1850', // Dunkle Umrandung für besseren Kontrast
    strokeThickness: 5, // Dicke der Umrandung
    dropShadow: true, // Schatten für einen 3D-Effekt
    dropShadowColor: '#000000', // Schattenfarbe
    dropShadowBlur: 4, // Weichheit des Schattens
    dropShadowAngle: Math.PI / 6, // Winkel des Schattens
    dropShadowDistance: 6, // Abstand des Schattens
    wordWrap: false, //Textumbruch
    wordWrapWidth: 440 // Breite, bei der der Text umgebrochen wird
});

function createNeustartText() {
    const neustartText = new PIXI.Text('Drücken Sie die Entertaste, um neu zu starten', StandardTextStyle);
    neustartText.x = app.view.width / 2;
    neustartText.y = (app.view.height / 2) + 300;
    neustartText.anchor.set(0.5);
}

// QR-Code Canvas Element erstellen
var qrcanvas = document.getElementById("qrcode");
qrcanvas.style.display = "none";

// Spieler und Blöcke erstellen
let players = []; // Spieler array


// Get the spieleranzahl parameter
urlParams = new URLSearchParams(window.location.search);
const spielerAnzahl = urlParams.get('spieleranzahl');

let aktiveSpielerAnzahl = null;
let blocks = []; // Array für die Blöcke oder hindernisse 
let blockSpeed = 1; // Anfangsgeschwindigkeit der Blöcke
let blockInterval = 500; // Intervall, in dem neue Blöcke erzeugt werden (in Millisekunden)

function removeBlocks(blocks) {
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        app.stage.removeChild(block);
    }
}

function initiatePlayers(game, players) {
    game.clients.forEach((client, index) => {
        if (index != 0) {
            const spielerName = "Spieler " + index;
            let player = app.stage.children.find(c => c.name === spielerName);

            if (!player) {
                player = PIXI.Sprite.from(`/images/player${index}.png`);
                player.name = spielerName;
                player.anchor.set(0);
                player.x = game.Xpositionen[index];              
                player.y = appHeight / 1.2;
                app.stage.addChild(player);
                players.push(player);
            }
        }
    });
    // Here the number of active players is set, important for determining the winner
    aktiveSpielerAnzahl = players.length;
}


// Websocketverbindung zum Server herstellen
let clientId = null;
let gameId = null;
let isGameStarted = false; // Spielstatus

// Gamestate ist die X-Achsen position der Spieler 
let Xpositionen = {};

// Verbindung zur Websocket Verbindung ändern
var host = location.origin.replace(/^http/, 'ws')
// Websocket connection erstellen
var websocket = new WebSocket(host);

let qrSprite;

//Nachrichten des Servers verarbeiten
websocket.onmessage = message => {

    // Nachricht des Servers in ein JSON Objekt umwandeln
    const response = JSON.parse(message.data);

    // connection -> GameId vom Websocketserver erhalten
    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("Client ID erhalten: " + clientId);
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
        // Warten, bis der QR-Code gerendert ist
        setTimeout(function () {
            var base64 = qrcanvas.toDataURL("image/png");
            var texture = PIXI.Texture.from(base64);
            qrSprite = new PIXI.Sprite(texture);

            qrSprite.anchor.set(0.5);
            qrSprite.x = (app.renderer.width - qrSprite.width) / 2;
            qrSprite.y = (app.renderer.height - qrSprite.height) / 4.5;

            app.stage.addChild(qrSprite);
        }, 500); 
    };
    
    // wenn spieler beitreten 
    if (response.method === "join") {
        const game = response.game;
        initiatePlayers(game, players);
        gameLoopTicker.start();
    };

    // Lobbystatus und Game state updaten 
    if (response.method === "update"){
        const game = response.game;
        console.log(game)
        Xpositionen = game.Xpositionen;              
        //Wenn die Lobby voll ist kann das Spiel gestartet werden, dafür muss die Spieleranzahl erreicht sein und das Spiel noch nicht gestartet sein
        if (response.game.clients.length >= (Number(spielerAnzahl) + 1) && !isGameStarted ) {
            // QR-Code entfernen
            app.stage.removeChild(qrSprite);
            qrSprite = null;

            // Text das alle Spieler verbunden sind & man mit Enter starten kann
            // Fontsize anpassen wegen gewinnertext und checken ob die Texte schon da sind, da die Update Response vor Spielbeginn wiederholt aufgerufen wird
            if (!app.stage.children.includes(basicText)) {
                basicText = new PIXI.Text('Alle Spieler sind nun verbunden', StandardTextStyle);
                basicText.style.fontSize = 36;
                basicText.x = appWidth / 2; 
                basicText.y = appHeight / 5; 
                basicText.anchor.set(0.5);
                app.stage.addChild(basicText);
            }
            
            if (!app.stage.children.includes(basicText2)) {
                basicText2 = new PIXI.Text('Drücken Sie die Entertaste, um das Spiel zu starten', StandardTextStyle);
                basicText2.x = appWidth / 2; 
                basicText2.y = appHeight / 3.5; 
                basicText2.anchor.set(0.5);
                app.stage.addChild(basicText2);
            }
        }  
    };
    if (response.method === "restart"){
        const game = response.game;
        console.log("Spiel wird neugestartet");
        // Alle Blöcke entfernen
        removeBlocks(blocks);
        blockSpeed = 1;
        blockInterval = 500;
        blocks=[];
        // Spieler zurücksetzen
        players.forEach(player => {
            app.stage.removeChild(player);
        });
        players = [];

        // get the winner text and remove it, done with for() because the name of the winner cant be defined beforehand
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            const child = app.stage.children[i];
            // Check if the child's text starts with 'Der Sieger ist'
            if (child.text && child.text.startsWith('Der Sieger ist')) {
                const gewinnerText = child;
                app.stage.removeChild(gewinnerText);
                break; // Exit the loop once the text is found and removed
            }
        }
        app.stage.removeChild(neustartText);
        // app.stage.addChild(basicText2);
        // basicText2.updateText();
        initiatePlayers(game, players);
        // Spielstatus zurücksetzen
        isGameStarted = false;
        gameLoopTicker.start();
    };
};

let intervalId; // Store the interval ID

// Tastatur input 
document.addEventListener("keydown", handleEntertaste);
function handleEntertaste(event) {
    // Get the current player count
    const currentPlayerCount = players.length;
    console.log("Current player count: ", currentPlayerCount);

    // Wenn Enter gedrückt wird und die gewünschte Spieleranzahl erreicht ist, soll das Spiel starten
    if ((event.keyCode === 13 || event.key === " ") && currentPlayerCount === Number(spielerAnzahl) && !isGameStarted) {
        app.stage.removeChild(basicText);
        app.stage.removeChild(basicText2);
        basicText2.updateText();
        blocks=[];
        clearInterval(intervalId);
        collisionAndWinnerTicker.start();
        moveBlocksTicker.start();
        intervalId =  setInterval(createBlock, blockInterval);
        isGameStarted = true; // Spielstatus auf gestartet setzen
    }
}

// Hier wird eine random position innerhalb des app views auf der xachse erzeugt
function getRandomXPosition() {
    return Math.random() * app.view.width;
}
// 
function createBlock() {
const block = PIXI.Sprite.from(`/images/block.png`);
block.anchor.set(0.5);
block.x = getRandomXPosition(); // Zufällige X-Position für den Block
block.y = -50; // Startposition oben außerhalb des Sichtbereichs
app.stage.addChild(block);
blocks.push(block);
}
function moveBlocks() {
    blocks.forEach(block => {
        block.y += blockSpeed;
        if (block.y > app.view.height) {
            // Block außerhalb des Sichtbereichs, entfernen
            app.stage.removeChild(block);
            const index = blocks.indexOf(block);
            if (index !== -1) {
                blocks.splice(index, 1);
            }
        }
    });
    // Blockgeschwindigkeit erhöhen
    blockSpeed += 0.005;
}

// Kolisionserkennungsfunktion gibt true oder false zurück
function kollisionstest(player, block) {
    let playerBox = player.getBounds();
    let blockBox = block.getBounds();
        return playerBox.x + playerBox.width > blockBox.x &&
                playerBox.x < blockBox.x + blockBox.width &&
                playerBox.y + playerBox.height > blockBox.y &&
                playerBox.y < blockBox.y + blockBox.height;
}

// Game Loop Funktion in der die Spielerpositionen aktualisiert werden, wird dem Ticker hinzugefügt und gestartet sobald der erste Spieler beitritt
function gameLoop(players) {
    players.forEach((player, index) => {
        player.x = Xpositionen[index + 1];
    });
}

// Add a keydown event listener to the document
document.addEventListener('keydown', function(event) {
    if (event.key === 'N' || event.key === 'n') {
        resetGame();
    }
});

// Create a function for the button's functionality
function resetGame() {
    console.log('Button clicked!');
    const payLoad = {
        "method": "reset",
        "gameId": gameId,
        "appWidth": appWidth
    }
    websocket.send(JSON.stringify(payLoad));
    // removeBlocks(blocks);
}

const gameLoopTicker = new PIXI.Ticker();
            
gameLoopTicker.add(() => {
    gameLoop(players);
});

const moveBlocksTicker = new PIXI.Ticker();
            
moveBlocksTicker.add(() => {
    moveBlocks();
});

const collisionAndWinnerTicker = new PIXI.Ticker();

collisionAndWinnerTicker.add(() => {
    // Collision test and player removal
    players.forEach((player, playerIndex) => {
        blocks.forEach(block => {
            if (kollisionstest(player, block)) {
                console.log("Kollision erkannt zwischen Spieler und Block!");
                app.stage.removeChild(player);
                player.kollidiert = true;
            }
        });
    });

    // Winner determination
    const aktiveSpieler = players.filter(player => !player.kollidiert);
    aktiveSpielerAnzahl = aktiveSpieler.length;

    // If only one player is left, they are the winner
    if (aktiveSpielerAnzahl === 1) {
        const gewinner = aktiveSpieler[0];
        const gewinnerText = new PIXI.Text('Der Sieger ist ' + gewinner.name, StandardTextStyle);
        gewinnerText.style.fontSize = 80;
        gewinnerText.x = app.view.width / 2;
        gewinnerText.y = (app.view.height / 2) - 300;
        gewinnerText.anchor.set(0.5);
        app.stage.addChild(gewinnerText);
        console.log("Der Gewinner ist: ", gewinner.name);

        moveBlocksTicker.stop();
        gameLoopTicker.stop();
        collisionAndWinnerTicker.stop();
    }
});