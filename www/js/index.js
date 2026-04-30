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
        const email = document.querySelector(".email").value;
        const senha = document.querySelector(".senha").value;

        if (email === "admin" && senha === "admin") {
            localStorage.setItem('tipo_usuario', 'barbeiro');
            window.location.href = 'www/html/barbeiro.html';
        } else {
            localStorage.setItem('tipo_usuario', 'cliente');
            window.location.href = 'www/html/selecao.html';
        }
    });
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);