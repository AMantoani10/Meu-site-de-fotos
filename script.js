const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const captureBtn = document.getElementById('capture-btn');
const enviarBtn = document.getElementById('send-btn');
const retakeBtn = document.getElementById('retake-btn');

let capturedBlob = null;
let cameraAtiva = false;

function iniciarCamera() {
  if (cameraAtiva) return;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      cameraAtiva = true;
    })
    .catch(err => {
      alert("Erro ao acessar a câmera: " + err.message);
    });
}

captureBtn.addEventListener('click', () => {
  if (!cameraAtiva) {
    iniciarCamera();
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    capturedBlob = blob;
    const imageUrl = URL.createObjectURL(blob);
    preview.src = imageUrl;
    preview.style.display = 'block';
    enviarBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'inline-block';
    video.style.display = 'none';
    captureBtn.style.display = 'none';
  }, 'image/jpeg');
});

retakeBtn.addEventListener('click', () => {
  preview.style.display = 'none';
  enviarBtn.style.display = 'none';
  retakeBtn.style.display = 'none';
  video.style.display = 'block';
  captureBtn.style.display = 'inline-block';
  capturedBlob = null;
});

enviarBtn.addEventListener('click', () => {
  if (!capturedBlob) {
    alert('Nenhuma imagem para enviar!');
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', capturedBlob, 'foto.jpg');

  fetch('https://SEU-BACKEND.onrender.com/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.url) {
      alert("Imagem enviada com sucesso!");
      window.location.href = "galeria.html"; // redireciona para a galeria
    } else {
      alert("Erro no envio: " + data.erro);
    }
  })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    alert("Erro ao enviar imagem.");
  });
});
