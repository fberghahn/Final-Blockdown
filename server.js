var WebSocketServer = require("websocket").server
var http = require("http")
var express = require("express")
var app = express()

// Port für den Vserver
var port = process.env.PORT || 8081

// Port für lokale Ausführung da auf 8081 Postgres den Port belegt
// Hier kann der Port falls nötig geändert werden
// var port = process.env.PORT || 9000

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

let appWidth;

wss.on("request", request =>{
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        //Nachricht vom client erhalten

        // methode zum Lobby erstellen
        if (result.method === "create") {
            const hostId= result.clientId
            const gameId = guid();
            appWidth = result.appWidth;

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
            let playerName = result.playerName;
            if (game.clients.length >= 5) 
            {
                //Maximale Spieleranzahl erreicht
                return;
            }
            // Spielername eindeutig machen
            if (game.clients.some(client => client.playerName === playerName)) {
                playerName += "(1)";
            }
            // Farben den spieler beim beitreten zuweisen, 0 ist immer der PC/Host
            const index = game.clients.length;
            const color =  {"1": "Red", "2": "Green", "3": "Blue", "4": "Yellow"}[index];
            game.clients.push({
                "clientId" :clientId,
                "color" : color,
                "index" : index,
                "playerName": playerName
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
            const bewegungsvariable = 48;

            // Gamestate je nach Handy input verändern
            // Hier wird geschaut in welche richtung der spieler sich beweget und die Position des Spielers geändert wenn er das Feld verlässt
            // Hier ist zu beachten, dass die XPoistionen der Spieler am linken Rand des Spielers sind, daher wird bei der appwidth (der rechten Grenze) die Bewegungsvariable abgezogen
            if (result.richtung==="links") {
                game.Xpositionen[index] -= bewegungsvariable;
                if (game.Xpositionen[index] < 0) {
                    game.Xpositionen[index] = appWidth - bewegungsvariable;
                } else if (game.Xpositionen[index] > appWidth- bewegungsvariable) {
                    game.Xpositionen[index] = 0;
                }
            } else {
                game.Xpositionen[index] += bewegungsvariable;
                if (game.Xpositionen[index] < 0) {
                    game.Xpositionen[index] = appWidth - bewegungsvariable;
                } else if (game.Xpositionen[index] >  appWidth- bewegungsvariable) {
                    game.Xpositionen[index] = 0;
                }
            };
            updateGameState();
        }
        // jump Methode einbauen
        if(result.method === "jump"){
            const game = games[result.gameId];
            // Pass on the index of the player who jumped to the host
            const payLoad = {
                "method": "jump",
                "game": game,
                "index": result.index,
            }
            // Only send this to the Host because the other players dont need this payLoad
            const hostClient = game.clients[0];
            clients[hostClient.clientId].connection.send(JSON.stringify(payLoad));
        }

        if (result.method === "reset") {
            // const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            const appWidth = result.appWidth;
            // reset the Xpositions of the players
            game.Xpositionen = [ 0, appWidth * 0.35, appWidth * 0.45, appWidth * 0.55, appWidth * 0.65]
            const payLoad = {
                "method": "restart",
                "game": game
            }
            // Only send this to the Host because the other players dont need this payLoad
            const hostClient = game.clients[0];
            clients[hostClient.clientId].connection.send(JSON.stringify(payLoad));
            updateGameState();
        }
    })
    // Create a new client and send the clientId back to the client
    const clientId= guid();
    clients[clientId] = {
        "connection": connection
    };

    const payload = {
        "method" : "connect",
        "clientId" :clientId
    }
    // send client the connect answer 
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
    //Here you could specify how often the game state is updated per second, currently it is updated with every input from the mobile devices.
    // setTimeout(updateGameState, 500);
}

// Functions for creating random IDs for client and game IDs.

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// Create a GUID by calling the S4 function four times, connecting with a hyphen, and converting to lowercase,
// This creates a 32-character, mostly random ID
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();