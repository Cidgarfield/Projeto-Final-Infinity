document.addEventListener('DOMContentLoaded', function() {
    let voltar = document.getElementById('voltar');

    if (voltar) {
        voltar.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'paginaGerenciamento.html';
        });
    }
});
