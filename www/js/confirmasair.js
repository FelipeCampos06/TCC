let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    const btn = document.getElementById("btnConfirmar");

    if (btn) {
        btn.addEventListener("click", () => {
            window.location.href = "../../index.html";
        });
    }
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);