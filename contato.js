window.onload = function () {

    let usuarioLogado = localStorage.getItem('usuarioLogado');
    let btnEditar = document.getElementById('btnEditar');

    if (usuarioLogado === 'admin') {
        btnEditar.style.visibility = 'visible';
    } else {
        btnEditar.style.visibility = 'hidden';
    }

    carregarContato();
};

async function salvarContato() {
    
    let telefone = document.getElementById('telefoneContato').value;
    let email = document.getElementById('emailContato').value;
    let endereco = document.getElementById('enderecoContato').value;

    const contato = {telefone, email, endereco};

    try {
        const response = await fetch('/api/contato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });

        if (response.ok) {
            await carregarContato();

            document.getElementById('formContato').reset();
            let modalElement = document.getElementById('modalContato');
            let modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            alert('Contato salvo com sucesso!');
        } else {
            alert('Erro ao salvar contato.');
        }
    } catch (err) {
        alert('Erro ao salvar contato:', err);
    }

};

async function carregarContato() {
    try {
        const response = await fetch('/api/contato');
        if (!response.ok) {
            throw new Error('Erro ao carregar contato');
        }
        const contato = await response.json();
        
        let telefone = contato.telefone || 'Não informado';
        let email = contato.email || 'Não informado';
        let endereco = contato.endereco || 'Não informado';
        let lista = document.getElementById('listaContato');
    
        lista.innerHTML = `
                <div class="card bg-secondary text-white mb-3">
                    <div class="card-body">
                        <p><i class="bi bi-telephone-fill me-2"></i>${telefone}</p>
                        <p><i class="bi bi-envelope-fill me-2"></i>${email}</p>
                        <p><i class="bi bi-geo-alt-fill me-2"></i>${endereco}</p>
                    </div>
                </div>
            `;
    } catch (err) {
        console.error('Erro ao carregar contato:', err);
    }
}

async function atualizarContato() {
    let telefone = document.getElementById('telefoneContato').value;
    let email = document.getElementById('emailContato').value;
    let endereco = document.getElementById('enderecoContato').value;

    const contato = { telefone, email, endereco };

    try {
        const response = await fetch('/api/contato', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });

        if (response.ok) {
            await carregarContato();
            let modalElement = document.getElementById('modalContato');
            let modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            
            alert('Contato atualizado com sucesso!');
        } else {
            const erro = await response.json();
            alert('Erro ao atualizar contato: ' + (erro.erro || 'Erro desconhecido'));
        }
    } catch (err) {
        console.error('Erro ao atualizar contato:', err);
        alert('Erro ao atualizar contato: ' + err.message);
    }
}
    

