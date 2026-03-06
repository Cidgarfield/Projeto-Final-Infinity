
function validarLogin() {
    let usuario = document.getElementById("usuario").value;
    let senha = document.getElementById("senha").value;
    let btnAdicionar = document.getElementById("btnAdicionar");
    
    if (usuario === "wayne" && senha === "1234") {
        alert("Login realizado com sucesso!");
        localStorage.setItem("logado", "true");
        window.location.href = "../Templates/paginaGerenciamento.html";
    } 
    else if (usuario === "admin" && senha === "1234") {
        alert("Login realizado com sucesso!");
        localStorage.setItem('usuarioLogado', 'admin');
        window.location.href = "../Templates/paginaInicial.html";
        btnAdicionar.style.visibility = 'visible';
    } 
    else {
        alert("Usuário ou senha incorretos!");
    }
}

function fazerLogin() {
    let botaoLogin = document.getElementById("botaoLogin");
    botaoLogin.style.display = "none";
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    let botaoLogin = document.getElementById("botaoLogin");
    let botaoLogout = document.getElementById("botaoLogout");
    if (botaoLogin) botaoLogin.style.display = "inline-block";
    if (botaoLogout) botaoLogout.style.display = "none";
    alert("Logout realizado com sucesso!");
    window.location.href = "../Templates/paginaInicial.html";
}