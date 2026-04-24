let iniciado = false;

function exibirDetalhesAgendamento() {
    // Recuperar o agendamento do localStorage
    const agendamento = localStorage.getItem('ultimo_agendamento');
    
    console.log('Agendamento recuperado:', agendamento);
    
    if (agendamento) {
        try {
            const dados = JSON.parse(agendamento);
            
            console.log('Dados parseados:', dados);
            
            const elServico = document.getElementById('detalhesServico');
            const elValor = document.getElementById('detalhesValor');
            const elDia = document.getElementById('detalhesDia');
            const elHorario = document.getElementById('detalhesHorario');
            const elData = document.getElementById('detalhesData');
            
            if (elServico) elServico.textContent = dados.servico || '-';
            if (elValor) elValor.textContent = dados.valor || '-';
            if (elDia) elDia.textContent = dados.dia || '-';
            if (elHorario) elHorario.textContent = dados.horario || '-';
            if (elData) elData.textContent = dados.data_confirmacao || '-';
        } catch (e) {
            console.error('Erro ao parsear agendamento:', e);
        }
    } else {
        console.warn('Nenhum agendamento encontrado no localStorage');
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

    console.log("App iniciado - Página de Confirmado");
    
    // Exibir detalhes do agendamento
    exibirDetalhesAgendamento();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);