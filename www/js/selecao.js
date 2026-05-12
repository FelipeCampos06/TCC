let iniciado = false;

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

    exibirInformacoesAgendamento();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);