let iniciado = false;

function selecionarDia(dia, pagina) {
    // Armazenar o dia selecionado
    localStorage.setItem('dia_selecionado', dia);
    
    // Redirecionar para a página do dia
    window.location.href = pagina;
}

function exibirServicoSelecionado() {
    const servico = localStorage.getItem('servico_selecionado');
    const valor = localStorage.getItem('valor_servico');
    
    if (servico && valor) {
        const elemento = document.getElementById('servicoSelecionado');
        if (elemento) {
            elemento.textContent = `Serviço: ${servico} - ${valor}`;
        }
    }
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
    
    // Exibir serviço selecionado
    exibirServicoSelecionado();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);