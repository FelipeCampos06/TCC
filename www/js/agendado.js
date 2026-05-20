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
    (async function(){
        // Obter dados do agendamento a ser cancelado
        const servico = localStorage.getItem('servico_selecionado');
        const horario = localStorage.getItem('horario_selecionado');
        const dia = localStorage.getItem('dia_selecionado');

        const msg = `Deseja realmente cancelar seu agendamento de ${servico} em ${dia} às ${horario}?`;
        let confirmado = false;
        if (window.ui && typeof window.ui.showConfirm === 'function') {
            confirmado = await window.ui.showConfirm(msg, { okText: 'Sim, cancelar', cancelText: 'Não' });
        } else {
            confirmado = confirm(msg);
        }
        if (!confirmado) return;

        // Criar objeto do agendamento para armazenar como cancelado
        const agendamento = {
            servico: servico,
            valor: localStorage.getItem('valor_servico'),
            dia: dia,
            horario: horario,
            data_confirmacao: new Date().toLocaleString('pt-BR')
        };

        // Remover dos agendamentos confirmados (usar id se disponível)
        const agendamentosConfirmados = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');
        let agendamentosFiltrados;
        // se o agendamento atual tiver id salvo no storage (possível fluxo anterior), use id
        const currentId = localStorage.getItem('agendamento_id');
        if (currentId) {
            agendamentosFiltrados = agendamentosConfirmados.filter((ag) => String(ag.id) !== String(currentId));
        } else {
            agendamentosFiltrados = agendamentosConfirmados.filter((ag) => {
                return !(ag.servico === servico && ag.horario === horario && ag.dia === dia);
            });
        }

        localStorage.setItem('agendamentos_confirmados', JSON.stringify(agendamentosFiltrados));

        // Armazenar como último agendamento cancelado para exibição na página de cancelado
        localStorage.setItem('ultimo_agendamento', JSON.stringify(agendamento));
        localStorage.setItem('agendamento_cancelado', 'true');

        // Opcional: limpar seleção do cliente
        localStorage.removeItem('servico_selecionado');
        localStorage.removeItem('valor_servico');
        localStorage.removeItem('dia_selecionado');
        localStorage.removeItem('horario_selecionado');
        localStorage.removeItem('agendamento_id');

        // Forçar atualização para outras telas (alguns webviews não disparam storage events): regravando a chave
        localStorage.setItem('agendamentos_confirmados_last_update', new Date().toISOString());

        // Redirecionar para a página de cancelamento
        window.location.href = '../html/cancelado.html';
    })();
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
    
    // Se houve cancelamento (pelo cliente ou pelo barbeiro), redirecionar para cancelado
    // somente se o cancelamento corresponder ao agendamento que o cliente está visualizando.
    try {
        const flag = localStorage.getItem('agendamento_cancelado');
        const ultimo = localStorage.getItem('ultimo_agendamento');
        const servicoSel = localStorage.getItem('servico_selecionado');
        const horarioSel = localStorage.getItem('horario_selecionado');
        const diaSel = localStorage.getItem('dia_selecionado');
        const currentId = localStorage.getItem('agendamento_id');

        if (flag === 'true' && ultimo) {
            const dados = JSON.parse(ultimo);
            let match = false;

            // Prefer match por id quando disponível
            if (dados.id && currentId) {
                match = String(dados.id) === String(currentId);
            }

            // Fallback: comparar dia/horario/servico se id não estiver presente
            if (!match) {
                if (dados.dia && dados.horario && dados.servico && servicoSel && horarioSel && diaSel) {
                    match = (dados.dia === diaSel && dados.horario === horarioSel && dados.servico === servicoSel);
                }
            }

            if (match) {
                window.location.href = '../html/cancelado.html';
                return;
            }
        }
    } catch (e) {
        // Se qualquer erro, não redirecionar automaticamente
        console.warn('Erro ao avaliar flag de cancelamento:', e);
    }

    // Exibir as informações do agendamento
    exibirInformacoesAgendamento();
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);