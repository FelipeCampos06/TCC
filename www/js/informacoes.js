let iniciado = false;

function verificarAgendamentoExiste() {
    const servico = localStorage.getItem('servico_selecionado');
    const horario = localStorage.getItem('horario_selecionado');
    const dia = localStorage.getItem('dia_selecionado');

    if (!servico || !horario || !dia) {
        return false;
    }

    const agendamentosConfirmados = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');
    return agendamentosConfirmados.some((ag) => {
        return ag.servico === servico && ag.horario === horario && ag.dia === dia;
    });
}

function exibirInformacoesAgendamento() {
    const mensagem = document.getElementById('mensagemSemAgendamento');
    const conteudo = document.getElementById('conteudoInformacoes');

    if (!verificarAgendamentoExiste()) {
        if (mensagem) mensagem.style.display = 'block';
        if (conteudo) conteudo.style.display = 'none';
        return;
    }

    if (mensagem) mensagem.style.display = 'none';
    if (conteudo) conteudo.style.display = 'block';

    const servico = localStorage.getItem('servico_selecionado') || 'Não selecionado';
    const valor = localStorage.getItem('valor_servico') || 'Não disponível';
    const dia = localStorage.getItem('dia_selecionado') || 'Não selecionado';
    const horario = localStorage.getItem('horario_selecionado') || 'Não selecionado';

    const elServico = document.getElementById('infoServico');
    const elValor = document.getElementById('infoValor');
    const elDia = document.getElementById('infoDia');
    const elHorario = document.getElementById('infoHorario');

    if (elServico) elServico.textContent = servico;
    if (elValor) elValor.textContent = valor;
    if (elDia) elDia.textContent = dia;
    if (elHorario) elHorario.textContent = horario;
}

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

    console.log('App iniciado - Página de Informações');
    exibirInformacoesAgendamento();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);
