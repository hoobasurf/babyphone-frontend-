<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Babyphone Test iPhone</title>
</head>
<body>
<h1>Babyphone Test</h1>
<p id="role-msg"></p>
<button id="start-micro">Démarrer micro</button>

<script>
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role'); // "b" ou "p"
const startButton = document.getElementById('start-micro');
const roleMsg = document.getElementById('role-msg');

if(role === "b") {
    roleMsg.innerText = "Mode bébé : bouton visible";
    startButton.style.display = "block";
    startButton.onclick = () => alert("Micro activé pour bébé !");
} else {
    roleMsg.innerText = "Mode parent : pas de bouton";
    startButton.style.display = "none";
}
</script>
</body>
</html>
