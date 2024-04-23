// Dropdown auswahl für Modus und Spieleranzahl
const modusSelect = document.getElementById('modus');
const spieleranzahlSelect = document.getElementById('spieleranzahl');
const imageSelect = document.getElementById('background');

// Button zum Spiel erstellen
const createLobbyButton = document.getElementById('createLobby');

createLobbyButton.addEventListener('click', function () {
    // Check the selected modus
    const selectedModus = modusSelect.value;
    const selectedSpieleranzahl = spieleranzahlSelect.value;
    const selectedBackground = imageSelect.value;

    // Create URLSearchParams object
    const params = new URLSearchParams();
    params.append('spieleranzahl', selectedSpieleranzahl);
    params.append('background', selectedBackground);

    // Redirect based on the selected modus
    if (selectedModus === 'modus1') {
        window.location.href = '/gamePages/firstGamePage.html?' + params.toString();
    } else if (selectedModus === 'modus2') {
        window.location.href = '/gamePages/secondGamePage.html?' + params.toString();
    }  else if (selectedModus === 'modus3') {
        window.location.href = '/gamePages/thirdGamePage.html?' + params.toString();
    } else {
        console.log('Bitte wählen Sie einen Modus aus.');
    }
});
