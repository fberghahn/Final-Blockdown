#  Final Blockdown
Ein Multiplayer Browsergame, dass mobile Endgeräte als Controller einbindet. Gehostet wird es auf einem eigenen Vserver über apache2 und eine eigene Domain. 

## Spielprinzip
Ein Multiplayer Auto-Runner basierend auf dem Client-Servermodell welches mobile Endgeräte zur Steuerung verwendet. 

## Hosting

[Prototyp](https://florian-berghahn.de)

## Lokale Ausführung

Für die lokale Ausführung muss Node js installiert sein, damit der Server wie folgt gestartet werden kann: 
```
node index.js
```

Dann kann im Browser auf localhost:9000/ das System aufgerufen werden. Falls der Port belegt ist, kann er in der index.js Datei bei Zeile 10 angepasst werden.

Über den localhost können keine mobilen Endgeräte verbunden werden, da es auf die eigene Maschine begrenzt ist. Es können jedoch welche simuliert werden, denn das System lenkt Geräte die eine Bildschirmweite unter 700 pixel haben auf die mobile.html Seite weiter. Das wir wie folgt umgesetzt:

1. In dem Starttab kopieren Sie den Link für die lokale Ausführung mit der GameID 
2. Öffnen Sie einen neuen Tab oder ein neues Browserfenster
3. Verkleinern Sie die Weite des Fensters unter 700 pixel oder öffnen Sie die Entwicklertools und wählen eine mobile Ansicht aus


## Bugs & Probleme

- Positionen sind teilweise "hard coded", da es zu Problemen kam, diese von der Bildschirmweite abhängig zu machen und dann zum Server zu senden.  

- Man kann als Spieler den Bildschirm verlassen und ist dort sicher, hängt auch mit dem Problem der variirenden Bildschirmweite zusammen. Da die Grenzen dort gesetzt werden müssten

