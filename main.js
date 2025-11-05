// URL de ton serveur Railway
const SERVER_URL = "https://baby-phone-production.up.railway.app";
const socket = io(SERVER_URL);

// Récupérer le rôle depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role'); // "b" pour bébé, "p" pour parent

// Bouton micro
const startButton = document.getElementById('start-micro');

if(role === "b") {
    // Bébé : bouton visible et fonctionnel
    startButton.style.display = "block";

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioElement = document.createElement("audio");
                audioElement.srcObject = stream;
                audioElement.play();
                console.log("Micro activé pour bébé");
                // TODO : envoyer le flux au serveur via WebRTC ou Socket.io
            })
            .catch(err => console.error("Erreur micro : ", err));
    });
} else {
    // Parent : bouton caché
    startButton.style.display = "none";
    console.log("Mode parent : prêt à écouter");
}
