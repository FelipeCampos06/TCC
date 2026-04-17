let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    console.log("App iniciado");

    const botao = document.getElementById("btnEntrar");

    if (!botao) {
        console.log("Botão não encontrado");
        return;
    }

    botao.addEventListener("click", () => {

        window.location.href = 'www/html/selecao.html';

    });
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);