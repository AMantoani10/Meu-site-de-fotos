const galeria = document.getElementById('galeria');

async function carregarGaleria() {
  try {
    const resposta = await fetch('https://meu-site-de-fotos.onrender.com/imagens');
    const imagens = await resposta.json();

    galeria.innerHTML = '';
    imagens.forEach(img => {
      const div = document.createElement('div');
      div.className = 'foto-box';
      div.innerHTML = `
        <img src="${img.url}" alt="foto" />
        <button class="btn-excluir" onclick="excluirImagem('${img.public_id}')">X</button>
      `;
      galeria.appendChild(div);
    });
  } catch (err) {
    console.error("Erro ao carregar galeria:", err);
  }
}

async function excluirImagem(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  await fetch('https://meu-site-de-fotos.onrender.com/excluir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_id: id })
  });
  carregarGaleria();
}

carregarGaleria();
