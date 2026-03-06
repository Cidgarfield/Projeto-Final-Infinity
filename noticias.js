window.onload = function () {

    let usuarioLogado = localStorage.getItem('usuarioLogado');
    let btnAdicionar = document.getElementById('btnAdicionar');

    if (usuarioLogado === 'admin') {
        btnAdicionar.style.visibility = 'visible';
    } else {
        btnAdicionar.style.visibility = 'hidden';
    }
    carregarNoticias();
};

const modalAdicionar = new bootstrap.Modal(document.getElementById('modalNoticia'));
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
const formAdicionarNoticia = document.getElementById('formNoticia');
const formEditarNoticia = document.getElementById('formEditarNoticia');
const btnConfirmarAdicionar = document.getElementById('btnConfirmarAdicionar');
const btnConfirmarEditar = document.getElementById('btnConfirmarEditar');
let noticiaIdEditando = null;

async function carregarNoticias() {
    // Limpa os items existentes
    const listaNoticia= document.getElementById('listaNoticias');
    listaNoticia.innerHTML = '';
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const admin = usuarioLogado === 'admin';
        
    try {
        const resp = await fetch('/api/noticias');
        const noticiasData = await resp.json();
        console.log('Noticias carregadas:', noticiasData);
            
        noticiasData.forEach(i => {
            const item = document.createElement('div');
            item.className = 'container-item';
            const botoesAdmin = admin ? `
                <button class="botaoExcluirNoticia" onclick="excluirNoticia('${i.id}')">EXCLUIR</button>
                <button class="botaoEditarNoticia" onclick="editarNoticia('${i.id}')">EDITAR</button>
            ` : '';
            item.innerHTML = `
                <div class="container-info">
                    <h2>${i.nome}</h2>
                    <p>Data: ${i.data}</p>
                    <p>${i.descricao}</p>
                    ${i.imagem ? `<img src="${i.imagem}" alt="${i.nome}" style="max-width: 100px;">` : ''}
                    ${botoesAdmin}
                </div>
            `;
            listaNoticia.appendChild(item);
        });
    } catch (err) {
        console.error('Erro ao carregar notícias:', err);
    }
}

// Configurar botão de adicionar
document.getElementById('btnAdicionar').addEventListener('click', function() {
    formAdicionarNoticia.reset();
    modalAdicionar.show();
});

// Configurar botão de confirmar adição
btnConfirmarAdicionar.addEventListener('click', async function() {
    if (formAdicionarNoticia.checkValidity()) {
        const noticia = {
            nome: document.getElementById("tituloNoticia").value,
            data: document.getElementById("dataNoticia").value,
            descricao: document.getElementById("conteudoNoticia").value,
            imagem: document.getElementById("imagemNoticia").value,
        };

        try {
            const response = await fetch('/api/noticias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noticia)
            });
            
            if (response.ok) {
                await carregarNoticias();
                modalAdicionar.hide();
                formAdicionarNoticia.reset();
                alert("Notícia adicionada com sucesso!");
            } else {
                alert('Erro ao adicionar notícia');
            }
        } catch (err) {
            console.error('Erro ao adicionar noticia:', err);
            alert('Erro ao adicionar noticia');
        }
    } else {
        formAdicionarNoticia.reportValidity();
    }
});

// Função para editar notícia
window.editarNoticia = async function(id) {
    noticiaIdEditando = id;
    
    try {
        const response = await fetch(`/api/noticias/${id}`);
        
        if (!response.ok) {
            throw new Error('Noticia não encontrada');
        }
        
        const noticia = await response.json();
        
        document.getElementById("tituloNoticiaEditar").value = noticia.nome || '';
        document.getElementById("conteudoNoticiaEditar").value = noticia.descricao || '';
        document.getElementById("imagemNoticiaEditar").value = noticia.imagem || '';
        document.getElementById("dataNoticiaEditar").value = noticia.data || '';
        modalEditar.show();
        
    } catch (err) {
        console.error('Erro ao carregar dados do serviço:', err);
        alert('Erro ao carregar dados do serviço');
    }
};

// Configurar botão de confirmar edição
btnConfirmarEditar.addEventListener('click', async function() {
    if (formEditarNoticia.checkValidity()) {
        const noticiaAtualizada = {
            nome: document.getElementById("tituloNoticiaEditar").value,
            data: document.getElementById("dataNoticiaEditar").value,
            descricao: document.getElementById("conteudoNoticiaEditar").value,
            imagem: document.getElementById("imagemNoticiaEditar").value,
        };

        try {
            const response = await fetch(`/api/noticias/${noticiaIdEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noticiaAtualizada)
            });

            if (response.ok) {
                await carregarNoticias();
                modalEditar.hide();
                formEditarNoticia.reset();
                noticiaIdEditando = null;
                alert("Noticia atualizada com sucesso!");
            } else {
                alert('Erro ao atualizar noticia');
            }
        } catch (err) {
            console.error('Erro ao atualizar noticia:', err);
            alert('Erro ao atualizar noticia');
        }
    } else {
        formEditarNoticia.reportValidity();
    }
});

// Limpar ID de edição quando o modal for fechado
document.getElementById('modalEditar').addEventListener('hidden.bs.modal', function () {
    noticiaIdEditando = null;
    formEditarNoticia.reset();
});

// Função para excluir noticia
window.excluirNoticia = async function(id) {
    if (confirm('Tem certeza que deseja excluir esta noticia?')) {
        try {
            const response = await fetch(`/api/noticias/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await carregarNoticias();
                alert('Noticia excluída com sucesso!');
            } else {
                alert('Erro ao excluir noticia');
            }
        } catch (err) {
            console.error('Erro ao excluir noticia:', err);
            alert('Erro ao excluir noticia');
        }
    }
};