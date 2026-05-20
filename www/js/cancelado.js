let iniciado = false;

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

function limparDadosCancelamento() {
    // Remover a flag de cancelamento após exibir
    localStorage.removeItem('agendamento_cancelado');
    localStorage.removeItem('ultimo_agendamento');
    localStorage.removeItem('servico_selecionado');
    localStorage.removeItem('valor_servico');
    localStorage.removeItem('dia_selecionado');
    localStorage.removeItem('horario_selecionado');
    // Sinalizar atualização para outras views
    localStorage.setItem('agendamentos_confirmados_last_update', new Date().toISOString());
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

    console.log("App iniciado - Cancelamento confirmado");

    exibirDetalhesAgendamento();

    // Ligar botão OK para limpar dados e voltar para tela de agendamento (sem agendamento)
    const btn = document.getElementById('btnOkCancelado');
    if (btn) {
        btn.addEventListener('click', () => {
            limparDadosCancelamento();
            // Redirecionar para página onde o cliente verifica agendamento
            window.location.href = '../html/agendado.html';
        });
    }
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);