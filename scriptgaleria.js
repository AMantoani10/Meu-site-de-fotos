fetch('https://SEU_BACKEND.onrender.com/imagens')
  .then(res => res.json())
  .then(imagens => {
    const galeria = document.getElementById('galeria');
    imagens.forEach(img => {
      const div = document.createElement('div');
      div.className = 'foto';

      const imagem = document.createElement('img');
      imagem.src = img.url;

      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.className = 'excluir';
      btnExcluir.onclick = () => {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

        fetch('https://SEU_BACKEND.onrender.com/excluir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: img.public_id })
        })
        .then(res => res.json())
        .then(resp => {
          alert(resp.mensagem || resp.erro);
          if (resp.mensagem) div.remove();
        })
        .catch(err => {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir imagem.');
        });
      };

      div.appendChild(imagem);
      div.appendChild(btnExcluir);
      galeria.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Erro ao carregar imagens:', err);
    alert('Erro ao carregar imagens.');
  });
