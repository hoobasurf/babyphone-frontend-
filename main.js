// URL de ton serveur Railway
const SERVER_URL = "https://baby-phone-production.up.railway.app";
const socket = io(SERVER_URL);

const startButton = document.getElementById('start-micro');
const roleMsg = document.getElementById('role-msg');

let role = null;
startButton.style.display = "none"; // bouton micro caché au départ

// Choix du rôle
document.getElementById('role-baby').onclick = async () => {
    role = "b";
    roleMsg.innerText = "Mode bébé : bouton micro visible";
    startButton.style.display = "block";

    startButton.onclick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioElement = document.createElement("audio");
            audioElement.srcObject = stream;
            audioElement.autoplay = true;

            // Envoi audio au serveur en petits blobs
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                if(e.data.size > 0) socket.emit("audio-stream", e.data);
            };
            mediaRecorder.start(250); // envoie toutes les 250ms

            alert("Micro activé pour bébé !");
        } catch(err) {
            console.error("Erreur micro : ", err);
            alert("Impossible d’accéder au micro !");
        }
    };
};

document.getElementById('role-parent').onclick = () => {
    role = "p";
    roleMsg.innerText = "Mode parent : écoute uniquement";
    startButton.style.display = "none";

    // Écoute l'audio du serveur
    const audioElement = document.createElement("audio");
    audioElement.autoplay = true;

    socket.on("audio-stream", (data) => {
        const blob = new Blob([data], { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioElement.src = url;
    });

    console.log("Mode parent prêt à écouter");
};
