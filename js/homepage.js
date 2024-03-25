// Dropdown auswahl für Modus und Spieleranzahl
const modusSelect = document.getElementById('modus');
const spieleranzahlSelect = document.getElementById('spieleranzahl');

// Button zum Spiel erstellen
const createLobbyButton = document.getElementById('createLobby');

createLobbyButton.addEventListener('click', function() {
    // Check the selected modus
    const selectedModus = modusSelect.value;
    const selectedSpieleranzahl = spieleranzahlSelect.value;

    // Create URLSearchParams object
    const params = new URLSearchParams();
    params.append('spieleranzahl', selectedSpieleranzahl);

    // Redirect based on the selected modus
    if (selectedModus === 'modus1') {
        window.location.href = '/gamePage.html?' + params.toString();
    } else if (selectedModus === 'modus2') {
        window.location.href = '/unterseite2?' + params.toString();
    } else {
        console.log('Bitte wählen Sie einen Modus aus.');
    }
});
