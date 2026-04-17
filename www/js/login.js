let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    // Parte do Cordova
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

    console.log("App iniciado");

    // 👉 PEGANDO elementos do HTML
    const botao = document.getElementById("btnEntrar");
    const email = document.querySelector(".email");
    const senha = document.querySelector(".senha");

    // 👉 EVENTO DO BOTÃO
    botao.addEventListener("click", () => {

        alert("Entrou!");

        // 👉 APLICANDO CSS PELO JS
        email.classList.add("oculto");   // esconde email
        senha.classList.add("oculto");   // esconde senha

        botao.classList.add("botao-ok"); // muda cor do botão
    });
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);