window.onload = function () {

    let usuarioLogado = localStorage.getItem('usuarioLogado');
    let btnAdicionar = document.getElementById('btnAdicionar');

    if (usuarioLogado === 'admin') {
        btnAdicionar.style.visibility = 'visible';
    } else {
        btnAdicionar.style.visibility = 'hidden';
    }

    carregarServicos();
};

const modalAdicionar = new bootstrap.Modal(document.getElementById('modalServico'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const formAdicionarServicos = document.getElementById('formServico');
const formEditarServico = document.getElementById('formEditarServico');
const btnConfirmarAdicionar = document.getElementById('btnConfirmarAdicionar');
const btnConfirmarEditar = document.getElementById('btnConfirmarEditar');
let servicoIdEditando = null;

async function carregarServicos() {
    // Limpa os items existentes
    const listaServico = document.getElementById('listaServico');
    listaServico.innerHTML = '';
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const admin = usuarioLogado === 'admin';
        
    try {
        const resp = await fetch('/api/servicos');
        const servicosData = await resp.json();
        console.log('Serviços carregados:', servicosData);
            
        servicosData.forEach(i => {
            const item = document.createElement('div');
            item.className = 'container-item';
            const botoesAdmin = admin ? `
                <button class="botaoExcluirServico" onclick="excluirServico('${i.id}')">EXCLUIR</button>
                <button class="botaoEditarservico" onclick="editarServico('${i.id}')">EDITAR</button>
            ` : '';
            item.innerHTML = `
                <div class="container-info">
                    <h2>${i.nome}</h2>
                    <p>${i.descricao}</p>
                    ${i.imagem ? `<img src="${i.imagem}" alt="${i.nome}" style="max-width: 100px;">` : ''}
                </div>
                ${botoesAdmin}
            `;
            listaServico.appendChild(item);
        });
    } catch (err) {
        console.error('Erro ao carregar serviços:', err);
    }
}

// Configurar botão de adicionar
document.getElementById('btnAdicionar').addEventListener('click', function() {
    formAdicionarServicos.reset();
    modalAdicionar.show();
});

// Configurar botão de confirmar adição
btnConfirmarAdicionar.addEventListener('click', async function() {
    if (formAdicionarServicos.checkValidity()) {
        const servico = {
            nome: document.getElementById("tituloServico").value,
            descricao: document.getElementById("conteudoServico").value,
            imagem: document.getElementById("imagemServico").value,
        };

        try {
            const response = await fetch('/api/servicos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servico)
            });
            
            if (response.ok) {
                await carregarServicos();
                modalAdicionar.hide();
                formAdicionarServicos.reset();
                alert("Serviço adicionado com sucesso!");
            } else {
                alert('Erro ao adicionar serviço');
            }
        } catch (err) {
            console.error('Erro ao adicionar serviço:', err);
            alert('Erro ao adicionar serviço');
        }
    } else {
        formAdicionarServicos.reportValidity();
    }
});

// Função para editar serviço
window.editarServico = async function(id) {
    servicoIdEditando = id;
    
    try {
        const response = await fetch(`/api/servicos/${id}`);
        
        if (!response.ok) {
            throw new Error('Serviço não encontrado');
        }
        
        const servico = await response.json();
        
        document.getElementById("tituloServicoEditar").value = servico.nome || '';
        document.getElementById("conteudoServicoEditar").value = servico.descricao || '';
        document.getElementById("imagemServicoEditar").value = servico.imagem || '';
        
        modalEditar.show();
        
    } catch (err) {
        console.error('Erro ao carregar dados do serviço:', err);
        alert('Erro ao carregar dados do serviço');
    }
};

// Configurar botão de confirmar edição
btnConfirmarEditar.addEventListener('click', async function() {
    if (formEditarServico.checkValidity()) {
        const servicoAtualizado = {
            nome: document.getElementById("tituloServicoEditar").value,
            descricao: document.getElementById("conteudoServicoEditar").value,
            imagem: document.getElementById("imagemServicoEditar").value,
        };

        try {
            const response = await fetch(`/api/servicos/${servicoIdEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoAtualizado)
            });

            if (response.ok) {
                await carregarServicos();
                modalEditar.hide();
                formEditarServico.reset();
                servicoIdEditando = null;
                alert("Serviço atualizado com sucesso!");
            } else {
                alert('Erro ao atualizar serviço');
            }
        } catch (err) {
            console.error('Erro ao atualizar serviço:', err);
            alert('Erro ao atualizar serviço');
        }
    } else {
        formEditarServico.reportValidity();
    }
});

// Limpar ID de edição quando o modal for fechado
document.getElementById('modalEditar').addEventListener('hidden.bs.modal', function () {
    servicoIdEditando = null;
    formEditarServico.reset();
});

// Função para excluir serviço
window.excluirServico = async function(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            const response = await fetch(`/api/servicos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await carregarServicos();
                alert('Serviço excluído com sucesso!');
            } else {
                alert('Erro ao excluir serviço');
            }
        } catch (err) {
            console.error('Erro ao excluir serviço:', err);
            alert('Erro ao excluir serviço');
        }
    }
};