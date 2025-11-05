// URL de ton serveur Railway
const SERVER_URL = "https://baby-phone-production.up.railway.app";
const socket = io(SERVER_URL);

// Récupérer le rôle depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role'); // "b" = bébé, "p" = parent

const startButton = document.getElementById('start-micro');
const roleMsg = document.getElementById('role-msg');

// Fonction pour envoyer l’audio bébé
async function startMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTracks = stream.getAudioTracks();
        if(audioTracks.length > 0){
            const track = audioTracks[0];
            const mediaStream = new MediaStream([track]);

            // Jouer localement (optionnel)
            const audioElement = document.createElement("audio");
            audioElement.srcObject = mediaStream;
            audioElement.play();

            // Envoi audio au serveur via Socket.io
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                if(e.data.size > 0) socket.emit("audio-stream", e.data);
            };
            mediaRecorder.start(250); // envoie toutes les 250ms
        }
    } catch (err) {
        console.error("Erreur micro : ", err);
        alert("Impossible d’accéder au micro !");
    }
}

// Fonction pour écouter l’audio côté parent
function startListening() {
    const audioElement = document.createElement("audio");
    audioElement.autoplay = true;

    socket.on("audio-stream", (data) => {
        const blob = new Blob([data], { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioElement.src = url;
    });

    console.log("Mode parent : écoute audio activée");
}

// Affichage selon le rôle
if(role === "b") {
    roleMsg.innerText = "Mode bébé : bouton micro visible";
    startButton.style.display = "block";
    startButton.addEventListener("click", startMicrophone);
} else {
    roleMsg.innerText = "Mode parent : écoute uniquement";
    startButton.style.display = "none";
    startListening();
}
