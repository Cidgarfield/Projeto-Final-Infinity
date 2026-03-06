window.onload = function() {
    let usuario = localStorage.getItem('usuarioLogado');
    let botaoLogin = document.getElementById("botaoLogin");
    let botaoLogout = document.getElementById("botaoLogout");
    if (usuario) {
        if (botaoLogin) botaoLogin.style.display = "none";
        if (botaoLogout) botaoLogout.style.display = "inline-block";
    } else {
        if (botaoLogin) botaoLogin.style.display = "inline-block";
        if (botaoLogout) botaoLogout.style.display = "none";
    }
};