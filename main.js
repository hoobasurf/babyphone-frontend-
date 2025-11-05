// ================================
// Babyphone Frontend main.js
// ================================

// Remplace cette URL par ton serveur Railway public
const SERVER_URL = "https://baby-phone-production.up.railway.app";

// Connexion au serveur Socket.io
const socket = io(SERVER_URL);

// Récupérer le paramètre "role" dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role'); // "b" pour bébé, "p" pour parent

// Sélection du bouton micro (assure-toi que l'ID correspond)
const startButton = document.getElementById('start-micro');

// Fonction pour démarrer le micro (bébé)
function startMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Envoi du flux audio au serveur
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                const track = audioTracks[0];
                const mediaStream = new MediaStream([track]);

                const audioElement = document.createElement("audio");
                audioElement.srcObject = mediaStream;
                audioElement.play();

                // Ici tu peux envoyer le flux via Socket.io ou WebRTC
                // Exemple simple : socket.emit("audio-stream", stream)
                console.log("Microphone démarré pour bébé");
            }
        })
        .catch(err => console.error("Erreur micro : ", err));
}

// Fonction pour écouter l'audio (parent)
function startListening() {
    // Ici tu reçois le flux audio du serveur
    // Exemple WebRTC simplifié :
    const audioElement = document.createElement("audio");
    audioElement.autoplay = true;

    socket.on("audio-stream", (stream) => {
        audioElement.srcObject = stream;
    });

    console.log("Mode parent : écoute audio activée");
}

// ================================
// Affichage selon le rôle
// ================================

if (role === "b") {
    // Bébé : afficher bouton micro
    startButton.style.display = "block";
    startButton.addEventListener("click", startMicrophone);
} else {
    // Parent : cacher bouton micro et démarrer l'écoute
    startButton.style.display = "none";
    startListening();
}
