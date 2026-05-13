let iniciado = false;

if (typeof DIAS === 'undefined') {
    // Carregar dias-utils se não estiver carregado
    const script = document.createElement('script');
    script.src = '../js/dias-utils.js';
    document.head.appendChild(script);
}

function voltarAnterior() {
    // Voltar para a página do dia selecionado
    const dia = localStorage.getItem('dia_selecionado');

    if (dia && DIAS.includes(dia)) {
        window.location.href = getBackPageUrl(dia);
    } else {
        window.location.href = '../html/agenda.html';
    }
}

function verificarAgendamentoExiste() {
    // Obter dados do agendamento atual do localStorage
    const servico = localStorage.getItem('servico_selecionado');
    const horario = localStorage.getItem('horario_selecionado');
    const dia = localStorage.getItem('dia_selecionado');

    // Se não tiver esses dados, não existe agendamento
    if (!servico || !horario || !dia) {
        return false;
    }

    // Verificar se ainda existe nos agendamentos confirmados
    const agendamentosConfirmados = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');
    const existe = agendamentosConfirmados.some((ag) => {
        return ag.servico === servico && ag.horario === horario && ag.dia === dia;
    });

    return existe;
}

function exibirInformacoesAgendamento() {
    const mensagem = document.getElementById('mensagemSemAgendamento');
    const conteudo = document.getElementById('conteudoAgendamento');

    // Verificar se o agendamento ainda existe
    if (!verificarAgendamentoExiste()) {
        // Mostrar mensagem de sem agendamento
        if (mensagem) mensagem.style.display = 'block';
        if (conteudo) conteudo.style.display = 'none';

        // Limpar dados do localStorage
        localStorage.removeItem('servico_selecionado');
        localStorage.removeItem('valor_servico');
        localStorage.removeItem('dia_selecionado');
        localStorage.removeItem('horario_selecionado');

        console.log('Nenhum agendamento encontrado');
        return;
    }

    // Se existe, mostrar conteúdo e esconder mensagem
    if (mensagem) mensagem.style.display = 'none';
    if (conteudo) conteudo.style.display = 'block';

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

function cancelarAgendamento() {
    // Obter dados do agendamento a ser cancelado
    const servico = localStorage.getItem('servico_selecionado');
    const horario = localStorage.getItem('horario_selecionado');
    const dia = localStorage.getItem('dia_selecionado');

    // Criar objeto do agendamento para armazenar como cancelado
    const agendamento = {
        servico: servico,
        valor: localStorage.getItem('valor_servico'),
        dia: dia,
        horario: horario,
        data_confirmacao: new Date().toLocaleString('pt-BR')
    };

    // Remover dos agendamentos confirmados
    const agendamentosConfirmados = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');
    const agendamentosFiltrados = agendamentosConfirmados.filter((ag) => {
        return !(ag.servico === servico && ag.horario === horario && ag.dia === dia);
    });

    localStorage.setItem('agendamentos_confirmados', JSON.stringify(agendamentosFiltrados));

    // Armazenar como último agendamento cancelado para exibição na página de cancelado
    localStorage.setItem('ultimo_agendamento', JSON.stringify(agendamento));
    localStorage.setItem('agendamento_cancelado', 'true');

    console.log('Agendamento cancelado:', agendamento);
    
    // Redirecionar para a página de cancelamento
    window.location.href = '../html/cancelado.html';
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