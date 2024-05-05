#  Finalblockdown
An open-source multiplayer cross-platform web game, where every player controls a block and needs to dodge incoming blocks or collect items. The game is played on a host PC, where the players move their blocks using their mobile device as controller. The game is built with Node.js, Express.js, PixiJS and Websockets.

## Live

You can play and test out the game [Here](https://final-blockdown.de/)

## Technologies, Libraries and Programming Concepts used
- HTML, CSS, and JavaScript for the user interface
- JavaScript with nodeJS as the runtime environment on the server
- Websockets with the [Websocket-Node Library](https://github.com/theturtle32/WebSocket-Node)
- Linux-Ubuntu on the required VServer
- [Apache2](https://httpd.apache.org/) as the HTTP server
- [PixiJS](https://pixijs.com/) for browser graphics and interactions
- A simple implementation of a [Spatial Hashmap](https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/spatial-hashing-r2697/) for collision detection 

## Local Execution

For local execution, nodeJS must be installed so that the server can be started as follows:
```
node server.js
```

Then, the system can be accessed in the browser at localhost:9000/. If the port is occupied, it can be adjusted in the server.js file at line 11.
```
// Here the port can be changed if necessary
var port = process.env.PORT || 9000
```
Mobile devices cannot be connected via localhost, but they can be simulated via the browser, by:

1. Opening the console
2. Clicking the printed localhost link and opening new tabs or windows for every player you wanna add
3. Input a name and join the lobby (the name input is turned, because its desinged for mobile and detects it as landscape on pc) 
4. Go to back to your main window or tab

## Academic Background



## Sources & Third-Party Code
As an introduction to the topic, a tutorial by Hussein Nasser was worked through and the resulting code was used as a basic framework for WebSocket communication.

[Youtube Link to the Tutorial](https://www.youtube.com/watch?v=cXxEiWudIUY)

[Github Link to the Tutorial Code](https://github.com/hnasr/javascript_playground/tree/master/websocket-cell-game)

The Css menu is based on the work from: 

[Alberto Hartzet](https://gist.github.com/richardmax/2301a77633e17cb16fdcf587551c4e2f)

The Background music for the game is from:

Powerful Trap Beat | Strong by Alex-Productions | https://onsound.eu/
Music promoted by https://www.chosic.com/free-music/all/
Creative Commons CC BY 3.0
https://creativecommons.org/licenses/by/3.0/

## Bugs & Problems
