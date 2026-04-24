let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    // Parte do Cordova (mantida)
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

    console.log("App iniciado");

    // =========================
    // 👉 SEU CÓDIGO ADICIONADO
    // =========================

    const opcoes = document.querySelectorAll(".opcao");
    const perfil = document.querySelector(".perfil");

    if (opcoes.length < 2 || !perfil) {
        console.log("Elementos não encontrados");
        return;
    }

    // Agendamento
    opcoes[0].addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Ir para serviços");
        window.location.href = "../html/servicos.html";
    });

    // Cancelamento
    opcoes[1].addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Ir para cancelamento");
        window.location.href = "agendado.html";
    });

    // Perfil
    perfil.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Ir para perfil");
        window.location.href = "perfil.html";
    });
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);