const input = document.getElementById('upload');
const preview = document.getElementById('preview');
const enviarBtn = document.getElementById('send-btn');
let selectedFile = null;

input.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    selectedFile = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      enviarBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(selectedFile);
  }
});

enviarBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert('Nenhuma imagem selecionada!');
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', selectedFile, selectedFile.name);

  fetch('https://meu-site-de-fotos.onrender.com/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.url) {
      alert("Imagem enviada com sucesso!");
      window.location.href = "galeria.html"; // Redireciona
    } else {
      alert("Erro no envio: " + data.erro);
    }
  })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    alert("Erro ao enviar imagem.");
  });
});
