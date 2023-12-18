#  Final Blockdown
Dieser Spieleprototyp wurde für die Ausarbeitung des Praxisprojekts, im Studiengang Medieninformatik der TH Köln, erstellt. Der Titel der Projektarbeit lautet: "Mobile Endgeräte als Controller - Umsetzungsmöglichkeiten des Complementarity Patterns am Beispiel eines webbasierten geräteübergreifenden Minigames".
Die Ziel dieses Projekts war die Nutzung mobiler Endgeräte zur Steuerung eines Browsergames, mit besonderem Augenmerk auf die Realisierung des Complementarity Patterns, ein für das Konzept essenzielle Multiscreen UX Designmuster.

## Spielprinzip
Der enstandene Prototyp ist ein Multiplayer Auto-Runner basierend auf dem Client-Servermodell welches mobile Endgeräte zur Steuerung verwendet. Die Spieler steuern jeweils einen farbigen Block der ihnen zugewiesen wurde und versuchen solange wie möglich den herabfallenden Blöcken auszuweichen. Der Spieler der am längsten überlebt ist der Gewinner. 

## Verwendete Technologien und Programmiersprachen
- HTML, CSS und Javascript für das Userinterface
- Javascript mit nodeJS als Runtime Umgebung auf dem Server
- Websockets mit der [Websocket-Node Library](https://github.com/theturtle32/WebSocket-Node)
- Linux-Ubuntu auf dem benötigten VServer
- Apache2 als HTTP-Server
- PixiJS für Browsergrafik und Interaktionen

## Hosting
Die Live-Version zum testen kann man über die folgende URL erreichen:

[Prototyp](https://florian-berghahn.de)

Sie ist auf einem VServer, mit Apache2 als HTTP-Server gehostet und wird auch nach dem Projekt weiter iteriert werden.

## Lokale Ausführung

Für die lokale Ausführung muss Node js installiert sein, damit der Server wie folgt gestartet werden kann: 
```
node index.js
```

Dann kann im Browser auf localhost:9000/ das System aufgerufen werden. Falls der Port belegt ist, kann er in der index.js Datei bei Zeile 11 angepasst werden.
```
// Hier kann der Port falls nötig geändert werden
var port = process.env.PORT || 9000
```
Über den localhost können keine mobilen Endgeräte verbunden werden, doch sie können über den Browser simuliert werden, denn das System lenkt Geräte die eine Bildschirmweite unter 700 pixel haben auf die mobile.html Seite weiter. So können Browserfenster mit geringer Breite als mobile Endgeräte für Testzwecke genutzt werden. Das wird wie folgt umgesetzt:

1. Klicken Sie den Button  "Neues Spiel"
2. Klicken Sie darauf den "Localhostlink kopieren" button  
3. Öffnen Sie einen neuen Tab oder ein neues Browserfenster
4. Verkleinern Sie die Weite des Fensters unter 700 pixel oder öffnen Sie die Entwicklertools und wählen eine mobile Ansicht aus
5. Erstellen Sie somit 3  "Spieler" und wechseln Sie zum Haupttab, wo sie das Spiel nun starten können

## Quellen & Fremdcode
Als Einarbeitung in das Themengebiet wurde ein Tutorial von Hussein Nasser durchgearbeitet und der enstandene Code als Grundgerüst für eine Websocketkommunikation genutzt.

[Youtube Link zum Tutorial](https://www.youtube.com/watch?v=cXxEiWudIUY)
[Github Link des Tutorial Codes](https://github.com/hnasr/javascript_playground/tree/master/websocket-cell-game)

## Bugs & Probleme

- Positionen sind teilweise "hard coded", da es zu Problemen kam, diese von der Bildschirmweite abhängig zu machen und dann zum Server zu senden.  

- Man kann als Spieler den Bildschirm verlassen und ist dort sicher, hängt auch mit dem Problem der variirenden Bildschirmweite zusammen. Da die Grenzen dort gesetzt werden müssten.

