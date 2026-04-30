let iniciado = false;

<<<<<<< HEAD
=======
function exibirDetalhesAgendamento() {
    const agendamento = localStorage.getItem('ultimo_agendamento');

    console.log('Agendamento recuperado (cancelado):', agendamento);

    if (agendamento) {
        try {
            const dados = JSON.parse(agendamento);
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
            console.error('Erro ao parsear agendamento cancelado:', e);
        }
    } else {
        console.warn('Nenhum agendamento encontrado no localStorage para cancelado');
    }
}

>>>>>>> 10e7b10 (29/04)
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

<<<<<<< HEAD
    // 👉 Seu código aqui
=======
    exibirDetalhesAgendamento();
>>>>>>> 10e7b10 (29/04)
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);