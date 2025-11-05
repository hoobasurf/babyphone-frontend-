const socket = io("https://baby-phone-production.up.railway.app"); // URL du serveur Railway
const startBtn = document.getElementById("start");
const remoteAudio = document.getElementById("remoteAudio");

let pc;
let localStream;
let room = "babyphone-room";

startBtn.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  pc = new RTCPeerConnection();

  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.ontrack = event => {
    remoteAudio.srcObject = event.streams[0];
  };

  pc.onicecandidate = event => {
    if (event.candidate) socket.emit("ice-candidate", { candidate: event.candidate, target: "parent" });
  };

  socket.emit("join", room);

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("offer", { sdp: offer, target: "parent" });
};

socket.on("offer", async data => {
  await pc.setRemoteDescription(data.sdp);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { sdp: answer, target: data.from });
});

socket.on("answer", async data => await pc.setRemoteDescription(data.sdp));
socket.on("ice-candidate", async data => { try { await pc.addIceCandidate(data.candidate); } catch(e){console.error(e);} });
