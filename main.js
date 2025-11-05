// Serveur Railway
const SERVER_URL = "https://baby-phone-production.up.railway.app";
const socket = io(SERVER_URL);

const startButton = document.getElementById('start-micro');
const roleMsg = document.getElementById('role-msg');

let role = null;
startButton.style.display = "none";

// ===== Choix du rôle =====
document.getElementById('role-baby').onclick = async () => {
    role = "b";
    roleMsg.innerText = "Mode bébé : bouton micro visible (écran allumé obligatoire)";
    startButton.style.display = "block";

    startButton.onclick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Jouer localement pour tester
            const audioElement = document.createElement("audio");
            audioElement.srcObject = stream;
            audioElement.autoplay = true;

            // Envoyer audio au serveur via Socket.io
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                if(e.data.size > 0) socket.emit("audio-stream", e.data);
            };
            mediaRecorder.start(250); // envoie toutes les 250ms

            alert("Micro activé pour bébé ! Écran doit rester allumé");
        } catch(err) {
            console.error("Erreur micro : ", err);
            alert("Impossible d’accéder au micro !");
        }
    };
};

document.getElementById('role-parent').onclick = () => {
    role = "p";
    roleMsg.innerText = "Mode parent : écoute audio activée, fonctionne même écran verrouillé";
    startButton.style.display = "none";

    const audioElement = document.createElement("audio");
    audioElement.autoplay = true;
    audioElement.controls = false; // pas de contrôle

    // Lire l’audio reçu du serveur
    socket.on("audio-stream", (data) => {
        const blob = new Blob([data], { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioElement.src = url;
    });
};
