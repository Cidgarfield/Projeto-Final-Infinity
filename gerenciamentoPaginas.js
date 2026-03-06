// Elementos da página de gerenciamento
let veiculos = document.getElementById("veiculos");
let equipamentos = document.getElementById("equipamentos");
let seguranca = document.getElementById("seguranca")
let btnSair = document.getElementById("btnSair");

if (localStorage.getItem("logado") !== "true") {
    window.location.href = "/Templates/login.html";
}

// Logout
if (btnSair) {
    btnSair.addEventListener("click", function() {
        window.location.href = "index.html";
    });
}

// Navegação
if (veiculos) {
    veiculos.addEventListener("click", function() {
        window.location.href = "paginaVeiculos.html";
    });
}

if (equipamentos) {
    equipamentos.addEventListener("click", function() {
        window.location.href = "paginaEquipamentos.html";
    });
}

if (seguranca) {
    seguranca.addEventListener("click", function() {
        window.location.href = "paginaSeguranca.html";
    });
}


// Modal Veículo
let adicionarVeiculo = document.getElementById("adicionarVeiculo");
let modalAdicionarVeiculo = document.getElementById("modalAdicionarVeiculo");
let modalEditarVeiculo = document.getElementById("modalEditarVeiculo");
let btnConfirmarAdicionar = document.getElementById("btnConfirmarAdicionar");
let btnConfirmarEditar = document.getElementById("btnConfirmarEditar");
let formAdicionarVeiculo = document.getElementById("formAdicionarVeiculo");
let formEditarVeiculo = document.getElementById("formEditarVeiculo");
// Criar instância do modal Bootstrap
const modalAdicionar = new bootstrap.Modal(modalAdicionarVeiculo);
const modalEditar = new bootstrap.Modal(modalEditarVeiculo);
// Lista de veículos (carregada do localStorage)
let listaVeiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
//Elemento onde a lista será exibida
let containerVeiculos = document.getElementById("containerVeiculos");

//Função para renderizar a lista de veículos
function renderizarVeiculos() {
    if (containerVeiculos) {
        containerVeiculos.innerHTML = ""; // Limpar conteúdo anterior
        listaVeiculos.forEach((veiculo, index) => {
            let item = document.createElement("li");
            item.textContent = `${veiculo.nome} - ${veiculo.tipo} - ${veiculo.status} - ${veiculo.descricao}`;
            item.style.marginBottom = "15px";

            // Botões
            let btnExcluir = document.createElement("button");
            let btnEditar = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnEditar.textContent = "Editar";
            btnExcluir.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
            btnEditar.classList.add("btn", "btn-warning", "btn-sm", "ms-2");
            //Excluir veículo
            btnExcluir.addEventListener("click", function() {
                listaVeiculos.splice(index, 1); // Remover veículo da lista
                localStorage.setItem("veiculos", JSON.stringify(listaVeiculos)); // Atualizar localStorage
                renderizarVeiculos(); // Re-renderizar a lista
            });
            //Editar veículo
            btnEditar.addEventListener("click", function() {
                let veiculoEditar = listaVeiculos[index]; // Obter veículo para edição

                document.getElementById("nomeVeiculoEditar").value = veiculoEditar.nome;
                document.getElementById("tipoVeiculoEditar").value = veiculoEditar.tipo;
                document.getElementById("statusVeiculoEditar").value = veiculoEditar.status;
                document.getElementById("descricaoVeiculoEditar").value = veiculoEditar.descricao;
                
                modalEditar.show(); // Abrir modal para edição

                // Atualizar evento de confirmação para edição
                btnConfirmarEditar.onclick = function() {
                    if (formEditarVeiculo.checkValidity()) {
                        listaVeiculos[index] = {
                            nome: document.getElementById("nomeVeiculoEditar").value,
                            tipo: document.getElementById("tipoVeiculoEditar").value,
                            status: document.getElementById("statusVeiculoEditar").value,
                            descricao: document.getElementById("descricaoVeiculoEditar").value
                        };

                        localStorage.setItem("veiculos", JSON.stringify(listaVeiculos)); // Atualizar localStorage
                        renderizarVeiculos(); // Re-renderizar a lista
                        modalEditar.hide(); // Fechar modal de edição
                        alert("Veículo editado com sucesso!"); // Mensagem de sucesso
                    } else {
                        formEditarVeiculo.reportValidity(); // Mostrar erros de validação
                    }
                };
            });
                        
            item.appendChild(btnExcluir);
            item.appendChild(btnEditar);
            containerVeiculos.appendChild(item);
        });
    }
}

if (adicionarVeiculo) {    
    // Abrir modal ao clicar em adicionar
    adicionarVeiculo.addEventListener("click", function() {
        formAdicionarVeiculo.reset(); // Limpar formulário
        modalAdicionar.show();

        btnConfirmarAdicionar.onclick = function() {
            if (formAdicionarVeiculo.checkValidity()) {
                const veiculo = {
                    nome: document.getElementById("nomeVeiculo").value,
                    tipo: document.getElementById("tipoVeiculo").value,
                    status: document.getElementById("statusVeiculo").value,
                    descricao: document.getElementById("descricaoVeiculo").value
                };

                listaVeiculos.push(veiculo);
                localStorage.setItem("veiculos", JSON.stringify(listaVeiculos));
                renderizarVeiculos();
                formAdicionarVeiculo.reset();
                modalAdicionar.hide();
                alert("Veículo adicionado com sucesso!");
            } else {
                formAdicionarVeiculo.reportValidity();
            }
        };
    });
}

// Renderizar lista de veículos ao carregar a página
renderizarVeiculos();