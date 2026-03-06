document.addEventListener("DOMContentLoaded", function() {
    // Modal equipamento
    let adicionarEquipamento = document.getElementById("adicionarEquipamento");
    let modalAdicionarEquipamento = document.getElementById("modalAdicionarEquipamento");
    let modalEditarEquipamento = document.getElementById("modalEditarEquipamento");
    let formAdicionarEquipamento = document.getElementById("formAdicionarEquipamento");
    let formEditarEquipamento = document.getElementById("formEditarEquipamento");
    let btnConfirmarAdicionar = document.getElementById("btnConfirmarAdicionar");
    let btnConfirmarEditar = document.getElementById("btnConfirmarEditar");
    let containerEquipamentos = document.getElementById("containerEquipamentos");
    const modalAdicionar = new bootstrap.Modal(modalAdicionarEquipamento);
    const modalEditar = new bootstrap.Modal(modalEditarEquipamento);
    let equipamentoIdEditando = null;

    // Função para salvar equipamentos no servidor via API
    async function salvarEquipamentos() {
        const items = containerEquipamentos.querySelectorAll('.container-item');
        const equipamentosData = [];
        
        items.forEach(item => {
            const nome = item.querySelector('h2').textContent;
            const descricao = item.querySelector('p').textContent;
            const img = item.querySelector('img')?.src || '';            
            equipamentosData.push({ nome, descricao, img });
        });
        
        try {
            await fetch('/api/equipamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(equipamentosData)
            });
            console.log('Equipamentos enviados ao servidor:', equipamentosData);
        } catch (err) {
            console.error('Erro ao salvar equipamentos no servidor', err);
        }
    }

    // Função para carregar equipamentos do servidor via API
    async function carregarEquipamentos() {
        // Limpa os items existentes (mantém apenas o botão adicionar)
        const items = containerEquipamentos.querySelectorAll('.container-item');
        items.forEach(item => item.remove());
        
        try {
            const resp = await fetch('/api/equipamentos');
            const equipamentosData = await resp.json();
            console.log('Equipamentos carregados do servidor:', equipamentosData);
                
            // Se houver equipamentos salvos, carrega eles
            if (equipamentosData && equipamentosData.length > 0) {
                equipamentosData.forEach(i => {
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
                        <button class="botaoExcluirEquipamento" onclick="excluirEquipamento('${i.id}')">EXCLUIR</button>
                        <button class="botaoEditarEquipamento" onclick="editarEquipamento('${i.id}')">EDITAR</button>
                    `;
                    containerEquipamentos.appendChild(item);
                });
            } 
                
        } catch (err) {
            console.error('Erro ao carregar equipamentos do servidor', err);
        }
    }

    if (adicionarEquipamento) {    
        // Abrir modal ao clicar em adicionar
        adicionarEquipamento.addEventListener("click", function() {
            formAdicionarEquipamento.reset(); // Limpar formulário
            modalAdicionar.show();
        });
    }

    // Configurar botão de confirmar adição separadamente
    if (btnConfirmarAdicionar) {
        btnConfirmarAdicionar.addEventListener('click', async function() {
            if (formAdicionarEquipamento.checkValidity()) {
                const equipamento = {
                    nome: document.getElementById("nomeEquipamento").value,
                    tipo: document.getElementById("tipoEquipamento").value,
                    status: document.getElementById("statusEquipamento").value,
                    descricao: document.getElementById("descricaoEquipamento").value
                };

                try {
                    const response = await fetch('/api/equipamentos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(equipamento)
                    });
                    
                    if (response.ok) {
                        await carregarEquipamentos();
                        modalAdicionar.hide();
                        formAdicionarEquipamento.reset();
                        alert("Equipamento adicionado com sucesso!");
                    } else {
                        alert('Erro ao adicionar equipamento');
                    }
                } catch (err) {
                    console.error('Erro ao adicionar equipamento ao servidor', err);
                    alert('Erro ao adicionar equipamento');
                }
            } else {
                formAdicionarEquipamento.reportValidity();
            }
        });
    }

    // Função para editar equipamento (tornar global)
    window.editarEquipamento = async function(id) {
        equipamentoIdEditando = id;
        
        try {
            // Buscar dados do equipamento específico
            const response = await fetch(`/api/equipamentos/${id}`);
            
            if (!response.ok) {
                throw new Error('Equipamento não encontrado');
            }
            
            const equipamento = await response.json();
            
            // Preencher o formulário de edição usando os IDs definidos no HTML
            document.getElementById("nomeEquipamentoEditar").value = equipamento.nome || '';
            document.getElementById("tipoEquipamentoEditar").value = equipamento.tipo || '';
            document.getElementById("statusEquipamentoEditar").value = equipamento.status || '';
            document.getElementById("descricaoEquipamentoEditar").value = equipamento.descricao || '';
            
            // Abrir modal de edição
            modalEditar.show();
            
        } catch (err) {
            console.error('Erro ao carregar dados do equipamento:', err);
            alert('Erro ao carregar dados do equipamento');
        }
    };

    // Configurar botão de confirmar edição
    if (btnConfirmarEditar) {
        btnConfirmarEditar.addEventListener('click', async function() {
            if (formEditarEquipamento.checkValidity()) {
                const equipamentoAtualizado = {
                    nome: document.getElementById("nomeEquipamentoEditar").value,
                    tipo: document.getElementById("tipoEquipamentoEditar").value,
                    status: document.getElementById("statusEquipamentoEditar").value,
                    descricao: document.getElementById("descricaoEquipamentoEditar").value,
                    id: equipamentoIdEditando
                };

                try {
                    const response = await fetch(`/api/equipamentos/${equipamentoIdEditando}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(equipamentoAtualizado)
                    });

                    if (response.ok) {
                        await carregarEquipamentos();
                        modalEditar.hide();
                        formEditarEquipamento.reset();
                        equipamentoIdEditando = null;
                        alert("Equipamento atualizado com sucesso!");
                    } else {
                        const erro = await response.json();
                        alert('Erro ao atualizar equipamento: ' + (erro.erro || 'Erro desconhecido'));
                    }
                } catch (err) {
                    console.error('Erro ao atualizar equipamento:', err);
                    alert('Erro ao atualizar equipamento');
                }
            } else {
                formEditarEquipamento.reportValidity();
            }
        });
    }

    // Limpar ID de edição quando o modal for fechado
    if (modalEditarEquipamento) {
        modalEditarEquipamento.addEventListener('hidden.bs.modal', function () {
            equipamentoIdEditando = null;
            formEditarEquipamento.reset();
        });
    }

    // Função para excluir equipamento (tornar global)
    window.excluirEquipamento = async function(id) {
        if (confirm('Tem certeza que deseja excluir este equipamento?')) {
            try {
                const response = await fetch(`/api/equipamentos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    await carregarEquipamentos();
                    alert('Equipamento excluído com sucesso!');
                } else {
                    const erro = await response.json();
                    alert('Erro ao excluir equipamento: ' + (erro.erro || 'Erro desconhecido'));
                }
            } catch (err) {
                console.error('Erro ao excluir equipamento:', err);
                alert('Erro ao excluir equipamento');
            }
        }
    };

    // Carregar equipamentos ao iniciar
    carregarEquipamentos();
});