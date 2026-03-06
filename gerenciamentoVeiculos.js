document.addEventListener("DOMContentLoaded", function() {
    // Modal equipamento
    let adicionarVeiculo = document.getElementById("adicionarVeiculo");
    let modalAdicionarVeiculo = document.getElementById("modalAdicionarVeiculo");
    let modalEditarVeiculo = document.getElementById("modalEditarVeiculo");
    let formAdicionarVeiculo = document.getElementById("formAdicionarVeiculo");
    let formEditarVeiculo = document.getElementById("formEditarVeiculo");
    let btnConfirmarAdicionar = document.getElementById("btnConfirmarAdicionar");
    let btnConfirmarEditar = document.getElementById("btnConfirmarEditar");
    let containerVeiculos = document.getElementById("containerVeiculos");
    const modalAdicionar = new bootstrap.Modal(modalAdicionarVeiculo);
    const modalEditar = new bootstrap.Modal(modalEditarVeiculo);
    let veiculoIdEditando = null;

    // Função para salvar veículos no servidor via API
    async function salvarVeiculos() {
        const items = containerVeiculos.querySelectorAll('.container-item');
        const veiculosData = [];
        
        items.forEach(item => {
            const nome = item.querySelector('h2').textContent;
            const descricao = item.querySelector('p').textContent;
            const img = item.querySelector('img')?.src || '';            
            veiculosData.push({ nome, descricao, img });
        });
        
        try {
            await fetch('/api/veiculos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(veiculosData)
            });
            console.log('Veículos enviados ao servidor:', veiculosData);
        } catch (err) {
            console.error('Erro ao salvar veículos no servidor', err);
        }
    }

    // Função para carregar veículos do servidor via API
    async function carregarVeiculos() {
        // Limpa os items existentes (mantém apenas o botão adicionar)
        const items = containerVeiculos.querySelectorAll('.container-item');
        items.forEach(item => item.remove());
        
        try {
            const resp = await fetch('/api/veiculos');
            const veiculosData = await resp.json();
            console.log('Veículos carregados do servidor:', veiculosData);
                
            // Se houver veículos salvos, carrega eles
            if (veiculosData && veiculosData.length > 0) {
                veiculosData.forEach(i => {
                    const item = document.createElement('div');
                    item.className = 'container-item';
                    item.dataset.id = i.id; // Armazenar ID no dataset
                    
                    // CONSTRUIR HTML COM OS BOTÕES CORRETOS (com onclick)
                    item.innerHTML = `
                        <div class="container-info">
                            <h2>${i.nome}</h2>
                            <p>${i.descricao}</p>
                            ${i.tipo ? `<p><strong>Tipo:</strong> ${i.tipo}</p>` : ''}
                            ${i.status ? `<p><strong>Status:</strong> ${i.status}</p>` : ''}
                        </div>
                        <button class="botaoExcluirVeiculo" onclick="excluirVeiculo('${i.id}')">EXCLUIR</button>
                        <button class="botaoEditarVeiculo" onclick="editarVeiculo('${i.id}')">EDITAR</button>
                    `;
                    containerVeiculos.appendChild(item);
                });
            } 
                
        } catch (err) {
            console.error('Erro ao carregar veículos do servidor', err);
        }
    }

    if (adicionarVeiculo) {    
        // Abrir modal ao clicar em adicionar
        adicionarVeiculo.addEventListener("click", function() {
            formAdicionarVeiculo.reset(); // Limpar formulário
            modalAdicionar.show();
        });
    }

    // Configurar botão de confirmar adição separadamente
    if (btnConfirmarAdicionar) {
        btnConfirmarAdicionar.addEventListener('click', async function() {
            if (formAdicionarVeiculo.checkValidity()) {
                const veiculo = {
                    nome: document.getElementById("nomeVeiculo").value,
                    tipo: document.getElementById("tipoVeiculo").value,
                    status: document.getElementById("statusVeiculo").value,
                    descricao: document.getElementById("descricaoVeiculo").value
                };

                try {
                    const response = await fetch('/api/veiculos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(veiculo)
                    });
                    
                    if (response.ok) {
                        await carregarVeiculos();
                        modalAdicionar.hide();
                        formAdicionarVeiculo.reset();
                        alert("Veículo adicionado com sucesso!");
                    } else {
                        alert('Erro ao adicionar veículo');
                    }
                } catch (err) {
                    console.error('Erro ao adicionar veículo ao servidor', err);
                    alert('Erro ao adicionar veículo');
                }
            } else {
                formAdicionarVeiculo.reportValidity();
            }
        });
    }

    // Função para editar veículo (tornar global)
    window.editarVeiculo = async function(id) {
        veiculoIdEditando = id;
        
        try {
            // Buscar dados do veículo específico
            const response = await fetch(`/api/veiculos/${id}`);
            
            if (!response.ok) {
                throw new Error('Veículo não encontrado');
            }
            
            const veiculo = await response.json();
            
            // Preencher o formulário de edição usando os IDs definidos no HTML
            document.getElementById("nomeVeiculoEditar").value = veiculo.nome || '';
            document.getElementById("tipoVeiculoEditar").value = veiculo.tipo || '';
            document.getElementById("statusVeiculoEditar").value = veiculo.status || '';
            document.getElementById("descricaoVeiculoEditar").value = veiculo.descricao || '';
            
            // Abrir modal de edição
            modalEditar.show();
            
        } catch (err) {
            console.error('Erro ao carregar dados do veículo:', err);
            alert('Erro ao carregar dados do veículo');
        }
    };

    // Configurar botão de confirmar edição
    if (btnConfirmarEditar) {
        btnConfirmarEditar.addEventListener('click', async function() {
            if (formEditarVeiculo.checkValidity()) {
                const veiculoAtualizado = {
                    nome: document.getElementById("nomeVeiculoEditar").value,
                    tipo: document.getElementById("tipoVeiculoEditar").value,
                    status: document.getElementById("statusVeiculoEditar").value,
                    descricao: document.getElementById("descricaoVeiculoEditar").value,
                    id: veiculoIdEditando
                };

                try {
                    const response = await fetch(`/api/veiculos/${veiculoIdEditando}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(veiculoAtualizado)
                    });

                    if (response.ok) {
                        await carregarVeiculos();
                        modalEditar.hide();
                        formEditarVeiculo.reset();
                        veiculoIdEditando = null;
                        alert("Veículo atualizado com sucesso!");
                    } else {
                        const erro = await response.json();
                        alert('Erro ao atualizar veículo: ' + (erro.erro || 'Erro desconhecido'));
                    }
                } catch (err) {
                    console.error('Erro ao atualizar veículo:', err);
                    alert('Erro ao atualizar veículo');
                }
            } else {
                formEditarVeiculo.reportValidity();
            }
        });
    }

    // Limpar ID de edição quando o modal for fechado
    if (modalEditarVeiculo) {
        modalEditarVeiculo.addEventListener('hidden.bs.modal', function () {
            veiculoIdEditando = null;
            formEditarVeiculo.reset();
        });
    }

    // Função para excluir veículo (tornar global)
    window.excluirVeiculo = async function(id) {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                const response = await fetch(`/api/veiculos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    await carregarVeiculos();
                    alert('Veículo excluído com sucesso!');
                } else {
                    const erro = await response.json();
                    alert('Erro ao excluir veículo: ' + (erro.erro || 'Erro desconhecido'));
                }
            } catch (err) {
                console.error('Erro ao excluir veículo:', err);
                alert('Erro ao excluir veículo');
            }
        }
    };

    // Carregar veículos ao iniciar
    carregarVeiculos();
});