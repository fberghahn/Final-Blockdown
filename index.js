var WebSocketServer = require("websocket").server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 8081
// app.get("/", (req,res) => res.sendFile(__dirname + "/index.html"))

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

let wss = new WebSocketServer({"httpServer": server})
console.log("websocket server created")


//hashpmap für clients
const clients = {};
//hashpmap für alle Spiele
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
            games[gameId] = {
                "id": gameId,
                "clients": [],
                "Xpositionen": Xpositionen=[700,850,1000]
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
            if (game.clients.length >= 3) 
            {
                //sorry max players reach
                return;
            }
            // Farben den spieler beim beitreten zuweisen, 0 ist immer der PC
            const color =  {"0": "Red", "1": "Green", "2": "Blue"}[game.clients.length];
            const index = game.clients.length;
            game.clients.push({
                "clientId" :clientId,
                "color" : color,
                "index" : index
            })
            const payLoad = {
                "method": "join",
                "game": game,
                "index" : index
            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
            updateLobby();
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

            // Gamestate erzeuegn 
            // let Xpositionen = game.Xpositionen;
            // if(!Xpositionen) Xpositionen= {}
            // Hier wird geschaut in welche richtung der spieler sich beweget
            if (result.richtung==="links") {
                game.Xpositionen[index] -= bewegungsvariable;
            } else {
                game.Xpositionen[index] += bewegungsvariable;
            };
            const payLoad = {
                "method": "test",
                "game": game,
                "Xpositionen": Xpositionen,
                "index": index
            };

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
            // state[ballId] = color;
            // games[gameId].Xpositionen = Xpositionen;
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
    // setTimeout(updateGameState, 500);
}

function updateLobby () {

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
    // setTimeout(updateGameState, 500);
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();