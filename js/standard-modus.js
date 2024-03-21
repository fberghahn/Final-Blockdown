// Standard Modus des Spiels

// PixiJS-App erstellen
let app;
window.onload = function () {

    app = new PIXI.Application(
        { background: '#1B1B1B', resizeTo: window }
    );
    document.body.appendChild(app.view);

    const bg = PIXI.Sprite.from(`images/spiel-backgroundimg2.png`);
    bg.width = app.view.width;
    bg.height = app.view.height;
    bg.opacity = 0;

    app.stage.addChild(bg);
    bg.anchor.set(0.5);
    bg.x = app.view.width / 2;
    bg.y = app.view.height / 2;
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

// Text das alle Spieler verbunden sind
const basicText = new PIXI.Text('Alle Spieler sind nun verbunden', StandardTextStyle);
basicText.x = 950;
basicText.y = 200;
basicText.anchor.set(0.5);

// Text Leertaste drücken um zu starten
const basicText2 = new PIXI.Text('Drücken Sie die Entertaste, um das Spiel zu starten', StandardTextStyle);
basicText2.x = 950;
basicText2.y = 300;
basicText2.anchor.set(0.5);

// QR-Code Canvas Element erstellen
var qrcanvas = document.getElementById("qrcode");
qrcanvas.style.display = "none";

// Spieler und Blöcke erstellen
const players = []; // Spieler array
let aktiveSpielerAnzahl = null;
const blocks = []; // Array für die Blöcke oder hindernisse 
let blockSpeed = 1; // Anfangsgeschwindigkeit der Blöcke
let blockInterval = 500; // Intervall, in dem neue Blöcke erzeugt werden (in Millisekunden)

// Websocketverbindung zum Server herstellen
let clientId = null;
let gameId = null;

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
            "clientId": clientId
        }
        websocket.send(JSON.stringify(payload));
    }

    if (response.method === "create") {

        gameId = response.game.id;
        const lobbyUrl = "https://florian-berghahn.de/mobile.html/?gameId=" + gameId;
        console.log("http://localhost:9000/mobile.html?gameId=" + gameId);
        // Text das alle Spieler verbunden sind
        // const basicText = new PIXI.Text("http://localhost:9000/mobile.html?gameId=" + gameId, StandardTextStyle);
        // basicText.x = 950;
        // basicText.y = 200;
        // basicText.anchor.set(0.5);
        // app.stage.addChild(basicText);

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
            qrSprite.y = (app.renderer.height - qrSprite.height) / 4;

            app.stage.addChild(qrSprite);
        }, 500); 
    };
    
    // wenn spieler beitreten 
    if (response.method === "join") {
        const game = response.game;
        console.log(response.game.clients.length);
        const PlayerIndex = response.index;

        game.clients.forEach((client, index) => {
            if (index != 0) {
                const spielerName = "Spieler " + index;
                let player = app.stage.children.find(c => c.name === spielerName);

                if (!player) {
                    player = PIXI.Sprite.from(`images/player${index}.png`);
                    player.name = spielerName;
                    player.anchor.set(0.5);
                    player.x = game.Xpositionen[index];              
                    player.y = 800;
                    app.stage.addChild(player);
                    players.push(player);
                }
            }
        });
        // Hier wird die Zahl der aktiven Spieler festgelegt, wichtig für die Sieger bestimmung
        aktiveSpielerAnzahl = players.length;
    };

    // Lobbystatus und Game state updaten 
    if (response.method === "update"){
        const game = response.game;
        console.log(game)
        Xpositionen = game.Xpositionen;              
        //Wenn die Lobby voll ist, hier wird Spieleranzahl festgelegt
        if (response.game.clients.length >= 3) {
            // QR-Code entfernen
            app.stage.removeChild(qrSprite);
            qrSprite = null;

            // Text das alle Spieler verbunden sind & man mit Enter starten kann
            app.stage.addChild(basicText);
            app.stage.addChild(basicText2);

            // Den Gameloop starten
            app.ticker.add(() => {
                gameLoop(players);
            });
        }  
    };


};

// Tastatur input 
document.addEventListener("keydown", handleEntertaste);
function handleEntertaste(event) {
    // Wenn Enter gedrückt wird soll das Spiel starten
    if (event.keyCode === 13 || event.key === " ") {
        app.stage.removeChild(basicText);
        app.stage.removeChild(basicText2);
        app.ticker.add(() => {
            moveBlocks(); // Blöcke bewegen
        });
        setInterval(createBlock, blockInterval);
    }
}

// Hier wird eine random position innerhalb des app views auf der xachse erzeugt
function getRandomXPosition() {
    return Math.random() * app.view.width;
}
// 
function createBlock() {
const block = PIXI.Sprite.from(`images/block.png`);
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

function gameLoop(players) {
    players.forEach((player, index) => {
        player.x = Xpositionen[index + 1];
    });

    players.forEach((player, playerIndex) => {
        blocks.forEach(block => {
            if (kollisionstest(player, block)) {
                console.log("Kollision erkannt zwischen Spieler und Block!");
                app.stage.removeChild(player);
                player.kollidiert = true;
            }
        });
    });

    // Entfernen kollidierter Spieler und Gewinnerermittlung
    const aktiveSpieler = players.filter(player => !player.kollidiert);
    aktiveSpielerAnzahl = aktiveSpieler.length;

    // wenn nnur noch ein Spieler übrig ist, ist dieser der Gewinner
    if (aktiveSpielerAnzahl === 1) {
        const gewinner = aktiveSpieler[0];
        const gewinnerText = new PIXI.Text('Der Sieger ist ' + gewinner.name, StandardTextStyle);
        gewinnerText.style.fontSize = 80;
        gewinnerText.x = app.view.width / 2;
        gewinnerText.y = (app.view.height / 2) - 300;
        gewinnerText.anchor.set(0.5);
        app.ticker.stop (() => {
                    gameLoop(players);
                    moveBlocks();
                });
        app.stage.addChild(gewinnerText);
        console.log("Der Gewinner ist: ", gewinner.name);
    }
}

