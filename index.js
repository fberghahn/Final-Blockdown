const http = require("http");
const app = require("express")();
app.listen(9091, ()=> console.log("Listening on http port 9091"))
app.get("/", (req,res) => res.sendFile(__dirname + "/index.html"))

// const { connect } = require("http2");
const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("listening on 9090"))

//haspmap für clients
const clients = {};
const games = {};


const wsServer = new websocketServer({
    "httpServer" : httpServer
})

wsServer.on("request", request =>{
    const connection = request.accept(null, request.origin);
    connection.on("open", ()=> console.log("opened!"))
    connection.on("close", ()=> console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        //Nachricht vom client erhalten

        // methode zum game erstellen
        if (result.method === "create") {
            const clientId= result.clientId
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "balls":20,
                "clients": []
            }
            const payload = {
                "method": "create",
                "game": games[gameId]
            }
            const con =  clients[clientId].connection;
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
            const color =  {"0": "Red", "1": "Green", "2": "Blue"}[game.clients.length]
            game.clients.push({
                "clientId" :clientId,
                "color" : color
            })

            if(game.clients.length ===3 ){
                updateGameState();
            }

            const payLoad = {
                "method": "join",
                "game": game

            }

            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad))
            });
        }

        //play Funktion
        if (result.method === "play") {
            const clientId= result.clientId;
            const gameId = result.gameId;
            const ballId = result.ballId;
            const color = result.color;

            let state = games[gameId].state;
            if(!state) state= {}
            
            state[ballId] = color;
            games[gameId].state = state;

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
    setTimeout(updateGameState, 500);
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();