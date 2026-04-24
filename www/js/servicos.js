let iniciado = false;

function selecionarServico(servico, valor) {
    // Armazenar o serviço e valor selecionado
    localStorage.setItem('servico_selecionado', servico);
    localStorage.setItem('valor_servico', valor);
    
    // Redirecionar para a página de agenda
    window.location.href = '../html/agenda.html';
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