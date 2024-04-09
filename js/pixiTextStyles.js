// Textstyle für die PixiJs Texte festlegen
export const StandardTextStyle = new PIXI.TextStyle({
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

export const StandardTextStyle2 = StandardTextStyle.clone();