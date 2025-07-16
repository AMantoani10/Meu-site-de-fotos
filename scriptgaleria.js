const galeria = document.getElementById('galeria');

function carregarImagens() {
  fetch('https://SEU-BACKEND.onrender.com/imagens')
    .then(res => res.json())
    .then(imagens => {
      galeria.innerHTML = ''; // limpa
      imagens.forEach(img => {
        const div = document.createElement('div');
        div.classList.add('foto-box');

        const image = document.createElement('img');
        image.src = img.url;

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn-excluir');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => {
          if(confirm('Deseja excluir essa foto?')) {
            fetch('https://meu-site-de-fotos.onrender.com/excluir', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_id: img.public_id }),
            })
            .then(res => res.json())
            .then(data => {
              if (data.mensagem) {
                alert(data.mensagem);
                carregarImagens(); // recarrega após exclusão
              } else {
                alert('Erro: ' + (data.erro || 'Não foi possível excluir'));
              }
            })
            .catch(() => alert('Erro na requisição de exclusão'));
          }
        };

        div.appendChild(image);
        div.appendChild(btnExcluir);
        galeria.appendChild(div);
      });
    })
    .catch(() => alert('Erro ao carregar imagens'));
}

window.onload = carregarImagens;
