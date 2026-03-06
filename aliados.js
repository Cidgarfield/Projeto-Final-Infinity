document.addEventListener('DOMContentLoaded', function() {
    let conteudo = document.getElementById('conteudo');
    let aliados = document.getElementById('aliados');
    let itemEditando = null;
    let modalAliados = null;
    let eventListenersAdded = false;

    // Função para salvar aliados no servidor via API
    async function salvarAliados() {
        const items = conteudo.querySelectorAll('.container-item');
        const aliadosData = [];
        
        items.forEach(item => {
            const nome = item.querySelector('h2').textContent;
            const descricao = item.querySelector('p').textContent;
            const img = item.querySelector('img').src;            
            aliadosData.push({ nome, descricao, img });
        });
        
        try {
            await fetch('/api/aliados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aliadosData)
            });
            console.log('Aliados enviados ao servidor:', aliadosData);
        } catch (err) {
            console.error('Erro ao salvar aliados no servidor', err);
        }
    }

    // Função para carregar aliados do servidor via API
    async function carregarAliados() {
        // Limpa os items existentes (mantém apenas o botão adicionar)
        const items = conteudo.querySelectorAll('.container-item');
        items.forEach(item => item.remove());
        try {
            const resp = await fetch('/api/aliados');
            const aliadosData = await resp.json();
            console.log('Aliados carregados do servidor:', aliadosData);
                
            // Se houver aliados salvos, carrega eles
                if (aliadosData &&aliadosData.length > 0) {
                    aliadosData.forEach(i => {
                        const item = document.createElement('div');
                        item.className = 'container-item';
                        item.innerHTML = `
                            <img src="${i.img}" alt="${i.nome}">
                            <div class="container-info">
                                <h2>${i.nome}</h2>
                                <p>${i.descricao}</p>
                            </div>
                            <button class="botaoExcluirAliado">EXCLUIR</button>
                            <button class="botaoEditarAliado">EDITAR</button>
                        `;
                        conteudo.appendChild(item);
                    });
                } 
                
            } catch (err) {
                    console.error('Erro ao carregar aliados do servidor', err);
            }
        }

    aliados.addEventListener('click', function(e) {
        e.preventDefault();
        // Limpa conteúdo anterior e adiciona botão
        conteudo.innerHTML = `<button id="botaoAdicionarAliado">ADICIONAR</button>`;
        carregarAliados();
        // Cria modal de adição com ID único para aliados - apenas uma vez
        if (!modalAliados) {
            modalAliados = document.createElement('div');
            modalAliados.id = 'modalAliados';
            modalAliados.innerHTML = `
                <div class="modal-content">
                    <h3 id="modal-titulo">Adicionar Aliado</h3>
                    <label>Nome:</label>
                    <input class="modal-input" id="modal-nome-aliado" type="text" />
                    <label>Descrição:</label>
                    <input class="modal-input" id="modal-descricao-aliado" type="text" />
                    <label>Imagem:</label>
                    <input class="modal-input" id="modal-img-aliado" type="file" accept="image/*" />
                    <div id="preview-img-aliado" style="margin: 10px 0; max-width: 150px;"></div>
                    <div class="modal-actions">
                        <button id="modal-cancel-aliado" type="button">Cancelar</button>
                        <button id="modal-submit-aliado" type="button">Adicionar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalAliados);
        }
        function limparModal() {
            modalAliados.querySelector('#modal-nome-aliado').value = '';
            modalAliados.querySelector('#modal-descricao-aliado').value = '';
            modalAliados.querySelector('#modal-img-aliado').value = '';
            document.getElementById('preview-img-aliado').innerHTML = '';
            itemEditando = null;
        }
        // Adicionar event listeners apenas uma vez
        if (!eventListenersAdded) {
            // Cancelar fecha o modal
            modalAliados.querySelector('#modal-cancel-aliado').addEventListener('click', function() {
                modalAliados.classList.remove('show');
                limparModal();
            });
            // Preview da imagem selecionada
            modalAliados.querySelector('#modal-img-aliado').addEventListener('change', function(e) {
                const file = e.target.files[0];
                const previewDiv = document.getElementById('preview-img-aliado');
                
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
            modalAliados.querySelector('#modal-submit-aliado').addEventListener('click', function() {
                const nome = modalAliados.querySelector('#modal-nome-aliado').value.trim();
                const descricao = modalAliados.querySelector('#modal-descricao-aliado').value.trim();
                const fileInput = modalAliados.querySelector('#modal-img-aliado');
                
                if (!nome) return alert('Informe o nome do aliado.');
                
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
                            salvarAliados();
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    } else {
                        // Salva no localStorage se não mudou a imagem
                        salvarAliados();
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
                            <button class="botaoExcluirAliado">EXCLUIR</button>
                            <button class="botaoEditarAliado">EDITAR</button>
                        `;
                        conteudo.appendChild(item);                        
                        // Salva no localStorage após adicionar
                        salvarAliados();
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
                limparModal();
                modalAliados.classList.remove('show');
            });

            // Delegação para EDITAR e EXCLUIR
            conteudo.addEventListener('click', function(e) {
                const item = e.target.closest('.container-item');
                if (!item) return;

                if (e.target.classList.contains('botaoExcluirAliado')) {
                    if (confirm('Tem certeza que deseja excluir este aliado?')) {
                        item.remove();
                        // Salva no localStorage após excluir
                        salvarAliados();
                    }
                }
                if (e.target.classList.contains('botaoEditarAliado')) {
                    const nomeAtual = item.querySelector('h2').textContent;
                    const descricaoAtual = item.querySelector('p').textContent;
                    const imgAtual = item.querySelector('img').src;
                    modalAliados.querySelector('#modal-nome-aliado').value = nomeAtual;
                    modalAliados.querySelector('#modal-descricao-aliado').value = descricaoAtual;
                    document.getElementById('preview-img-aliado').innerHTML = `<img src="${imgAtual}" style="max-width: 100%; border-radius: 5px;">`;
                    itemEditando = item;
                    modalAliados.classList.add('show');
                }
            });
            eventListenersAdded = true;
        }
        // Botão abrir modal para adicionar
        const botaoAdicionar = document.getElementById('botaoAdicionarAliado');
        if (botaoAdicionar) {
            botaoAdicionar.addEventListener('click', function() {
                limparModal();
                itemEditando = null;
                modalAliados.classList.add('show');
                // const input = modalAliados.querySelector('#modal-nome-aliado');
                // if (input) input.focus();
            });
        }
    });
});
