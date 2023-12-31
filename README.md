#  Final Blockdown
Dieser Spieleprototyp wurde für die Ausarbeitung des Praxisprojekts im Studiengang Medieninformatik der TH Köln erstellt. Der Titel der Projektarbeit lautet: "Mobile Endgeräte als Controller - Umsetzungsmöglichkeiten des Complementarity Patterns am Beispiel eines webbasierten geräteübergreifenden Minigames".
Das Ziel dieses Projekts war die Nutzung mobiler Endgeräte zur Steuerung eines Browsergames mit besonderem Augenmerk auf die Realisierung des Complementarity Patterns, ein für das Konzept essenzielles Multiscreen UX Designmuster.

## Spielprinzip
Der entstandene Prototyp ist ein Multiplayer Auto-Runner basierend auf dem Client-Servermodell, welches mobile Endgeräte zur Steuerung verwendet. Die Spieler steuern jeweils einen farbigen Block, der ihnen zugewiesen wurde und versuchen solange wie möglich den herabfallenden Blöcken auszuweichen. Der Spieler, der am längsten überlebt, ist der Gewinner.

## Verwendete Technologien und Programmiersprachen
- HTML, CSS und Javascript für das Userinterface
- Javascript mit nodeJS als Runtime Umgebung auf dem Server
- Websockets mit der [Websocket-Node Library](https://github.com/theturtle32/WebSocket-Node)
- Linux-Ubuntu auf dem benötigten VServer
- [Apache2](https://httpd.apache.org/) als HTTP-Server
- [PixiJS](https://pixijs.com/) für Browsergrafik und Interaktionen

## Hosting
Die Live-Version zum Testen kann man über die folgende URL erreichen:

[Prototyp](https://florian-berghahn.de)

Sie ist auf einem VServer, mit Apache2 als HTTP-Server gehostet und wird auch nach dem Projekt weiter iteriert werden.

## Lokale Ausführung

Für die lokale Ausführung muss nodeJS installiert sein, damit der Server wie folgt gestartet werden kann: 
```
node index.js
```

Dann kann im Browser auf localhost:9000/ das System aufgerufen werden. Falls der Port belegt ist, kann er in der index.js Datei bei Zeile 11 angepasst werden.
```
// Hier kann der Port falls nötig geändert werden
var port = process.env.PORT || 9000
```
Über den localhost können keine mobilen Endgeräte verbunden werden, doch sie können über den Browser simuliert werden, denn das System lenkt Geräte, die eine Bildschirmbreite unter 700 Pixel haben, auf die mobile.html Seite weiter. So können Browserfenster mit geringer Breite als mobile Endgeräte für Testzwecke genutzt werden. Das wird wie folgt umgesetzt:

1. Klicken Sie den Button "Neues Spiel"
2. Klicken Sie daraufhin den "Localhostlink kopieren" Button  
3. Öffnen Sie einen neuen Tab oder ein neues Browserfenster
4. Verkleinern Sie die Breite des Fensters unter 700 Pixel oder öffnen Sie die Entwicklertools und wählen eine mobile Ansicht aus
5. Fügen Sie dann die kopierte URL ein damit werden Sie auf die mobile Seite weitergeleitet und können der Lobby beitreten 
6. Erstellen Sie so "Spieler" bis die Lobby voll ist und wechseln Sie zum Haupttab, wo sie das Spiel nun starten können

## Quellen & Fremdcode
Als Einarbeitung in das Themengebiet wurde ein Tutorial von Hussein Nasser durchgearbeitet und der entstandene Code als Grundgerüst für eine Websocketkommunikation genutzt.

[Youtube Link zum Tutorial](https://www.youtube.com/watch?v=cXxEiWudIUY)

[Github Link des Tutorial Codes](https://github.com/hnasr/javascript_playground/tree/master/websocket-cell-game)

## Bugs & Probleme

- Positionen sind teilweise "hard coded", da es zu Problemen kam, diese von der Bildschirmweite abhängig zu machen und dann zum Server zu senden.  

- Man kann als Spieler den Bildschirm verlassen und ist dort sicher, hängt auch mit dem Problem der variierenden Bildschirmbreite zusammen. Da die Grenzen dort gesetzt werden müssten.