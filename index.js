var WebSocketServer = require("websocket").server
var http = require("http")
var express = require("express")
var app = express()

// Port für den Vserver
// var port = process.env.PORT || 8081

// Port für lokale Ausführung da auf 8081 Postgres den Port belegt
// Hier kann der Port falls nötig geändert werden
var port = process.env.PORT || 9000

app.use(express.static(__dirname + "/"))

// http server erstellen
var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

// websocket server erstellen und an http server binden
let wss = new WebSocketServer({"httpServer": server})
console.log("websocket server created")


//JSON-Objekt für clients
const clients = {};
//JSON-Objekt für alle Spiele
const games = {};

wss.on("request", request =>{
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        //Nachricht vom client erhalten

        // methode zum Lobby erstellen
        if (result.method === "create") {
            const hostId= result.clientId
            const gameId = guid();
            const appWidth = result.appWidth;

            games[gameId] = {
                "id": gameId,
                "clients": [],
                "Xpositionen": [ 0, appWidth * 0.35, appWidth * 0.45, appWidth * 0.55, appWidth * 0.65]
            }
            // den Host am PC den Clients hinzufügen
            games[gameId].clients.push({
                "clientId" :hostId,
                "index": 0   
            })
            const payload = {
                "method": "create",
                "game": games[gameId]
            }
            const con =  clients[hostId].connection;
            con.send(JSON.stringify(payload));
        }
        // client will dem game beitreten 
        if (result.method === "join") {
            const clientId= result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length >= 5) 
            {
                //Maximale Spieleranzahl erreicht
                return;
            }
            // Farben den spieler beim beitreten zuweisen, 0 ist immer der PC/Host
            const index = game.clients.length;
            const color =  {"1": "Red", "2": "Green", "3": "Blue", "4": "Yellow"}[index];
            game.clients.push({
                "clientId" :clientId,
                "color" : color,
                "index" : index
            })
            const payLoad = {
                "method": "join",
                "game": game,
                "index": index
            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
            updateGameState();
        }
        
        //Spiel starten nach Entertaste auf dem PC
        if(result.method === "start"){
            updateGameState();
        }

        //WS Nachrichten der mobilen Endgeräte zur Richtung
        if (result.method === "play") {
            const clientId = result.clientId;
            const index= result.index;
            const gameId = result.gameId;
            const game = games[gameId];

            // soweit soll sich der spieler mit einem buttonklick auf dem handy in die gewählte Richtung bewegen
            const bewegungsvariable = 50;

            // Gamestate je nach Handy input verändern
            // Hier wird geschaut in welche richtung der spieler sich beweget
            if (result.richtung==="links") {
                game.Xpositionen[index] -= bewegungsvariable;
            } else {
                game.Xpositionen[index] += bewegungsvariable;
            };
            updateGameState();
        }
        if (result.method === "reset") {
            // const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            const appWidth = result.appWidth;
            game.Xpositionen = [ 0, appWidth * 0.35, appWidth * 0.45, appWidth * 0.55, appWidth * 0.65]
            const payLoad = {
                "method": "restart",
                "game": game
            }
            const firstClient = game.clients[0];
            clients[firstClient.clientId].connection.send(JSON.stringify(payLoad));
            updateGameState();
        }
    })
    // neue client id erzeugen
    const clientId= guid();
    clients[clientId] = {
        "connection": connection
    };

    const payload = {
        "method" : "connect",
        "clientId" :clientId
    }
    // client connect antwort senden
    connection.send(JSON.stringify(payload))
})


function updateGameState () {

    for (const g of Object.keys(games)) {
        const game = games[g]
        const payload = {
            "method": "update",
            "game": game
        }

        game.clients.forEach(c =>{
            clients[c.clientId].connection.send(JSON.stringify(payload))
        })
    }
    // Hier könnte man festlegen wie oft der Gamestate pro Sekunde geupdated wird, aktuell wird er bei jedem Input der mobilen Endgeräte updated
    // setTimeout(updateGameState, 500);
}

// Funktionen zur Random Id erstellung für Client- und Gameids  

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// Guid erstellen indem man die S4 Funktion 4 mal aufruft und mit - verbindet und in Kleinbuchstaben umwandelt,
// so wird eine 32 Zeichen lange großenteils zufällige Id erstellt
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();