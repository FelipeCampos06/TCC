let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    // Parte do Cordova (só roda quando existir cordova)
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

    console.log("App iniciado");

    // =========================
    // 👉 SEU CÓDIGO AQUI
    // =========================

    // Botão cancelar
    const btnCancelar = document.getElementById("btnCancelar");

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            console.log("Ir para cancelamento");
            window.location.href = "cancelamento.html";
        });
    } else {
        console.log("Botão cancelar não encontrado");
    }

    // Botão voltar (seta)
    const btnVoltar = document.querySelector(".voltar a");

    if (btnVoltar) {
        btnVoltar.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Voltando para seleção");
            window.location.href = "../html/selecao.html";
        });
    }
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);