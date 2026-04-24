let iniciado = false;

function selecionarHorario(horario) {
    // Armazenar o horário selecionado
    localStorage.setItem('horario_selecionado', horario);
    
    // Redirecionar para a página de confirmação
    window.location.href = '../html/confirmagenda.html';
}

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

    // 👉 Seu código aqui
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);