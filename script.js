const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const captureBtn = document.getElementById('capture-btn');
const enviarBtn = document.getElementById('send-btn');
const retakeBtn = document.getElementById('retake-btn');

let capturedBlob = null;
let stream = null;

// Inicia câmera
async function iniciarCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = stream;
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Para a câmera (quando fecha ou muda estado)
function pararCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

// Reinicia câmera ao voltar para página
window.addEventListener('pageshow', (event) => {
  if (event.persisted || performance.navigation.type === 2) {
    iniciarCamera();
  }
});

iniciarCamera();

// Captura foto
captureBtn.addEventListener('click', () => {
  if (!stream) {
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
    pararCamera();
  }, 'image/jpeg');
});

// Retirar outra foto
retakeBtn.addEventListener('click', () => {
  preview.style.display = 'none';
  enviarBtn.style.display = 'none';
  retakeBtn.style.display = 'none';
  video.style.display = 'block';
  captureBtn.style.display = 'inline-block';
  capturedBlob = null;
  iniciarCamera();
});

// Enviar foto
enviarBtn.addEventListener('click', () => {
  if (!capturedBlob) {
    alert('Nenhuma imagem para enviar!');
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', capturedBlob, 'foto.jpg');

  fetch('https://meu-site-de-fotos.onrender.com/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.url) {
      alert("Imagem enviada com sucesso!");
      window.location.href = "galeria.html";
    } else {
      alert("Erro no envio: " + data.erro);
    }
  })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    alert("Erro ao enviar imagem.");
  });
});
