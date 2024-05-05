#  Finalblockdown
An open-source multiplayer cross-platform web game, where every player controls a block and needs to dodge incoming blocks or collect items. The game is played on a host PC, where the players move their blocks using their mobile device as controller. The game is built with Node.js, Express.js, PixiJS and Websockets.

## Live

You can play and test out the game [Here](https://final-blockdown.de/)

## Contributors
This Project was designed and iterated using a [Participatory Design Process](https://www.interaction-design.org/literature/topics/participatory-design), by including choosen test users into the development process.  
They gave great Feedback, had creative ideas, tested, evaluated and found lots of Bugs. My great thanks and appreciation goes out to:

[Robert Klein](https://github.com/robertKlein02)  
[Ylli Loshaj](https://github.com/yloshaj)  
Richard Semrau  
[Simon Jigalin](https://github.com/copilot-ss-test)  
[Karl Goering](https://github.com/KarlCJ)  
[Maximilian Feldmann](https://github.com/MaximilianFeldmann-test)  
Can Attila Gabes  
Elias Muradi  


## Contribution
You can be a part of Finalblockdown too! This is an Open-Source project, where we would love your input or optimization of the game.

Here is a [Guide to Contribution](https://github.com/fberghahn/Final-Blockdown/blob/main/CONTRIBUTING.md) so you know the preferred process. 
This Project is licensed under the [MIT-License](https://github.com/fberghahn/Final-Blockdown/blob/main/LICENSE.txt), feel free to reach out if you have any question regarding Contribution.

## Academic Background

This is a project developed by Florian Berghahn during his practical project and bachelor's thesis at the TH Köln in the Media Computerscience degree. Find more information about the bachelor thesis and the participatory process [Here](https://final-blockdown.de/pages/projectInfo.html)



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

- There are still some issues for some mobile devices when screen rotation is activated
