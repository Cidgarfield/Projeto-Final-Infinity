document.addEventListener('DOMContentLoaded', function() {
    let conteudo = document.getElementById('conteudo');
    let inimigos = document.getElementById('inimigos');
    let itemEditando = null;
    let modalInimigos = null;
    let eventListenersAdded = false;

    // Função para salvar inimigos no servidor via API
    async function salvarInimigos() {
        const items = conteudo.querySelectorAll('.container-item');
        const inimigosData = [];
        
        items.forEach(item => {
            const nome = item.querySelector('h2').textContent;
            const descricao = item.querySelector('p').textContent;
            const img = item.querySelector('img').src;
            inimigosData.push({ nome, descricao, img });
        });

        try {
            await fetch('/api/inimigos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inimigosData)
            });
            console.log('Inimigos enviados ao servidor:', inimigosData);
        } catch (err) {
            console.error('Erro ao salvar inimigos no servidor', err);
        }
    }

    // Função para carregar inimigos do servidor via API
    async function carregarInimigos() {
        // Limpa os items existentes (mantém apenas o botão adicionar)
        const items = conteudo.querySelectorAll('.container-item');
        items.forEach(item => item.remove());

        try {
            const resp = await fetch('/api/inimigos');
            const inimigosData = await resp.json();
            console.log('Inimigos carregados do servidor:', inimigosData);

                if (inimigosData && inimigosData.length > 0) {
                    inimigosData.forEach(i => {
                        const item = document.createElement('div');
                        item.className = 'container-item';
                        item.innerHTML = `
                            <img src="${i.img}" alt="${i.nome}">
                            <div class="container-info">
                                <h2>${i.nome}</h2>
                                <p>${i.descricao}</p>
                            </div>
                            <button class="botaoExcluir">EXCLUIR</button>
                            <button class="botaoEditar">EDITAR</button>
                        `;
                        conteudo.appendChild(item);
                    });
                }
            } catch (err) {
                console.error('Erro ao carregar inimigos do servidor', err);
            }
        }

    inimigos.addEventListener('click', function(e) {
        e.preventDefault();
        // Limpa conteúdo anterior e adiciona botão
        conteudo.innerHTML = `<button id="botaoAdicionarInimigo">ADICIONAR</button>`;
        // Carrega inimigos salvos do localStorage
        carregarInimigos();
        // Cria modal de adição com ID único para inimigos - apenas uma vez
        if (!modalInimigos) {
            modalInimigos = document.createElement('div');
            modalInimigos.id = 'modalInimigos';
            modalInimigos.innerHTML = `
                <div class="modal-content">
                    <h3 id="modal-titulo">Adicionar Inimigo</h3>
                    <label>Nome:</label>
                    <input class="modal-input" id="modal-nome-inimigo" type="text" />
                    <label>Descrição:</label>
                    <input class="modal-input" id="modal-descricao-inimigo" type="text" />
                    <label>Imagem:</label>
                    <input class="modal-input" id="modal-img-inimigo" type="file" accept="image/*" />
                    <div id="preview-img-inimigo" style="margin: 10px 0; max-width: 150px;"></div>
                    <div class="modal-actions">
                        <button id="modal-cancel-inimigo" type="button">Cancelar</button>
                        <button id="modal-submit-inimigo" type="button">Adicionar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalInimigos);
        }
        function limparModal() {
            modalInimigos.querySelector('#modal-nome-inimigo').value = '';
            modalInimigos.querySelector('#modal-descricao-inimigo').value = '';
            modalInimigos.querySelector('#modal-img-inimigo').value = '';
            document.getElementById('preview-img-inimigo').innerHTML = '';
            itemEditando = null;
        }
        // Adicionar event listeners apenas uma vez
        if (!eventListenersAdded) {
            // Cancelar fecha o modal
            modalInimigos.querySelector('#modal-cancel-inimigo').addEventListener('click', function() {
                modalInimigos.classList.remove('show');
                limparModal();
            });
            // Preview da imagem selecionada
            modalInimigos.querySelector('#modal-img-inimigo').addEventListener('change', function(e) {
                const file = e.target.files[0];
                const previewDiv = document.getElementById('preview-img-inimigo');
                
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        previewDiv.innerHTML = `<img src="${event.target.result}" style="max-width: 100%; border-radius: 5px;">`;
                    };
                    reader.readAsDataURL(file);
                } else {
                    previewDiv.innerHTML = '';
                }
            });
            // Envio do formulário do modal
            modalInimigos.querySelector('#modal-submit-inimigo').addEventListener('click', function() {
                const nome = modalInimigos.querySelector('#modal-nome-inimigo').value.trim();
                const descricao = modalInimigos.querySelector('#modal-descricao-inimigo').value.trim();
                const fileInput = modalInimigos.querySelector('#modal-img-inimigo');
                
                if (!nome) return alert('Informe o nome do inimigo.');
                
                if (itemEditando) {
                    // Modo edição
                    itemEditando.querySelector('h2').textContent = nome;
                    itemEditando.querySelector('p').textContent = descricao;
                    if (fileInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            itemEditando.querySelector('img').src = event.target.result;
                            itemEditando.querySelector('img').alt = nome;
                            // Salva no localStorage após atualizar a imagem
                            salvarInimigos();
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    } else {
                        // Salva no localStorage se não mudou a imagem
                        salvarInimigos();
                    }
                } else {
                    // Modo adicionar
                    if (!fileInput.files[0]) return alert('Selecione uma imagem.');
                    
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = event.target.result;
                        const item = document.createElement('div');
                        item.className = 'container-item';
                        item.innerHTML = `
                            <img src="${img}" alt="${nome}">
                            <div class="container-info">
                                <h2>${nome}</h2>
                                <p>${descricao}</p>
                            </div>
                            <button class="botaoExcluir">EXCLUIR</button>
                            <button class="botaoEditar">EDITAR</button>
                        `;
                        conteudo.appendChild(item);
                        salvarInimigos();
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
                limparModal();
                modalInimigos.classList.remove('show');
            });

            // Delegação para EDITAR e EXCLUIR
            conteudo.addEventListener('click', function(e) {
                const item = e.target.closest('.container-item');
                if (!item) return;

                if (e.target.classList.contains('botaoExcluir')) {
                    if (confirm('Tem certeza que deseja excluir este inimigo?')) {
                        item.remove();
                        // Salva no localStorage após excluir
                        salvarInimigos();
                    }
                }
                if (e.target.classList.contains('botaoEditar')) {
                    const nomeAtual = item.querySelector('h2').textContent;
                    const descricaoAtual = item.querySelector('p').textContent;
                    const imgAtual = item.querySelector('img').src;
                    modalInimigos.querySelector('#modal-nome-inimigo').value = nomeAtual;
                    modalInimigos.querySelector('#modal-descricao-inimigo').value = descricaoAtual;
                    document.getElementById('preview-img-inimigo').innerHTML = `<img src="${imgAtual}" style="max-width: 100%; border-radius: 5px;">`;
                    itemEditando = item;
                    modalInimigos.classList.add('show');
                }
            });
            eventListenersAdded = true;
        }
        // Botão abrir modal para adicionar
        const botaoAdicionar = document.getElementById('botaoAdicionarInimigo');
        if (botaoAdicionar) {
            botaoAdicionar.addEventListener('click', function() {
                limparModal();
                itemEditando = null;
                modalInimigos.classList.add('show');
                // const input = modalAliados.querySelector('#modal-nome-aliado');
                // if (input) input.focus();
            });
        }
    });
});