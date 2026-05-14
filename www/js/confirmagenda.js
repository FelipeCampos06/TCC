let iniciado = false;

function voltarAnterior() {
    // Voltar para a página do dia selecionado
    const dia = localStorage.getItem('dia_selecionado');

    if (dia && DIAS.includes(dia)) {
        window.location.href = getBackPageUrl(dia);
    } else {
        window.location.href = '../html/agenda.html';
    }
}

function exibirInformacoesAgendamento() {
    // Recuperar os dados do localStorage
    let servico = localStorage.getItem('servico_selecionado');
    let valor = localStorage.getItem('valor_servico');
    let dia = localStorage.getItem('dia_selecionado');
    let horario = localStorage.getItem('horario_selecionado');
    
    // Debug no console
    console.log('Dados do localStorage:');
    console.log('Serviço:', servico);
    console.log('Valor:', valor);
    console.log('Dia:', dia);
    console.log('Horário:', horario);
    
    // Se não houver dados, usar valores padrão
    servico = servico || 'Não selecionado';
    valor = valor || 'Não disponível';
    dia = dia || 'Não selecionado';
    horario = horario || 'Não selecionado';
    
    // Exibir as informações na página
    const elServico = document.getElementById('infoServico');
    const elValor = document.getElementById('infoValor');
    const elDia = document.getElementById('infoDia');
    const elHorario = document.getElementById('infoHorario');
    
    if (elServico) elServico.textContent = servico;
    if (elValor) elValor.textContent = valor;
    if (elDia) elDia.textContent = dia;
    if (elHorario) elHorario.textContent = horario;
}

function confirmarAgendamento() {
    const dia = localStorage.getItem('dia_selecionado');
    const horario = localStorage.getItem('horario_selecionado');

    if (!dia || !horario) {
        alert('Não foi possível confirmar o agendamento. Dia ou horário não encontrados.');
        return;
    }

    removeHorarioDisponivel(dia, horario);

    // Armazenar o agendamento confirmado
    const agendamento = {
        id: Date.now(), // ID único baseado no timestamp
        servico: localStorage.getItem('servico_selecionado'),
        valor: localStorage.getItem('valor_servico'),
        dia,
        horario,
        data_confirmacao: new Date().toLocaleString('pt-BR'),
        status: 'confirmado' // Status do agendamento
    };

    // Salvar como último agendamento (compatibilidade)
    localStorage.setItem('ultimo_agendamento', JSON.stringify(agendamento));

    // Adicionar aos agendamentos confirmados
    const agendamentosAtuais = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');
    agendamentosAtuais.push(agendamento);
    localStorage.setItem('agendamentos_confirmados', JSON.stringify(agendamentosAtuais));

    // Redirecionar para a página de confirmação
    window.location.href = '../html/confirmado.html';
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

    console.log("App iniciado - Página de Confirmação");
    
    // Exibir as informações do agendamento
    exibirInformacoesAgendamento();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);