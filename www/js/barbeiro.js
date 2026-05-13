const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let iniciado = false;

function getHorariosDisponiveis() {
    const dados = ensureHorariosDisponiveisStorage();
    return Object.fromEntries(DIAS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []]));
}

function saveHorariosDisponiveis(dados) {
    localStorage.setItem('horarios_disponiveis', JSON.stringify(dados));
}

function renderHorariosDisponiveis() {
    const container = document.getElementById('availabilityList');
    if (!container) return;

    const dados = getHorariosDisponiveis();
    container.innerHTML = '';

    DIAS.forEach((dia) => {
        const dayBlock = document.createElement('div');
        dayBlock.className = 'availability-day';

        const title = document.createElement('h4');
        title.textContent = dia;
        dayBlock.appendChild(title);

        const timeList = document.createElement('div');
        timeList.className = 'time-list';

        const horarios = dados[dia] || [];
        if (horarios.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'nenhum-horario';
            empty.textContent = 'Nenhum horário disponível.';
            dayBlock.appendChild(empty);
        } else {
            horarios.forEach((horario) => {
                const chip = document.createElement('div');
                chip.className = 'time-chip';
                chip.textContent = horario;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-time';
                removeBtn.type = 'button';
                removeBtn.textContent = '×';
                removeBtn.title = `Remover ${horario}`;
                removeBtn.addEventListener('click', () => {
                    removeHorario(dia, horario);
                });

                chip.appendChild(removeBtn);
                timeList.appendChild(chip);
            });
            dayBlock.appendChild(timeList);
        }

        container.appendChild(dayBlock);
    });
}

function adicionarHorario() {
    const dia = document.getElementById('diaSelect').value;
    const horario = document.getElementById('horarioInput').value;
    if (!horario) {
        alert('Escolha um horário para adicionar.');
        return;
    }

    const dados = getHorariosDisponiveis();
    if (!dados[dia]) {
        dados[dia] = [];
    }
    if (dados[dia].includes(horario)) {
        alert('Esse horário já está disponível para o dia selecionado.');
        return;
    }

    dados[dia].push(horario);
    dados[dia].sort();
    saveHorariosDisponiveis(dados);
    renderHorariosDisponiveis();
    document.getElementById('horarioInput').value = '';
}

function renderAgendamentosConfirmados() {
    const container = document.getElementById('agendamentosContainer');
    if (!container) return;

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');

    // Limpar container
    container.innerHTML = '';

    if (agendamentos.length === 0) {
        container.innerHTML = '<p class="nenhum-agendamento">Nenhum agendamento confirmado</p>';
        return;
    }

    // Renderizar cada agendamento como um card
    agendamentos.forEach((agendamento, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `agendamento-${agendamento.id || index}`;

        // Status baseado no horário (simulação)
        const statusClass = getStatusClass(agendamento.horario);

        card.innerHTML = `
            <span class="status ${statusClass}"></span>
            <h3>Cliente</h3>
            <p class="hora-card">${agendamento.horario}</p>
            <p class="servico">${agendamento.servico}</p>
            <p class="tempo">${getTempoServico(agendamento.servico)}</p>
            <p class="dia-agendamento">${agendamento.dia}</p>
        `;

        container.appendChild(card);
    });

    console.log('Agendamentos renderizados:', agendamentos.length);
}

function getStatusClass(horario) {
    const agora = new Date();
    const [hora, minuto] = horario.split(':').map(Number);
    const horarioAgendamento = new Date();
    horarioAgendamento.setHours(hora, minuto, 0, 0);

    const diffHoras = (horarioAgendamento - agora) / (1000 * 60 * 60);

    if (diffHoras < 0) return 'vermelho'; // Já passou
    if (diffHoras <= 1) return 'amarelo'; // Próximo
    return 'verde'; // Futuro
}

function getTempoServico(servico) {
    const servicoStr = (servico || '').toLowerCase();
    if (servicoStr.includes('corte') && servicoStr.includes('barba')) return '1hr';
    if (servicoStr.includes('corte') || servicoStr.includes('barba')) return '30min';
    return '30min'; // Default
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

    console.log('App iniciado - Página Barbeiro');
    
    // Sincronizar dados de agendamentos
    renderHorariosDisponiveis();
    renderAgendamentosConfirmados();

    const addButton = document.getElementById('btnAddHorario');
    if (addButton) {
        addButton.addEventListener('click', adicionarHorario);
    }

    // Recarregar agendamentos a cada 5 segundos para refletir cancelamentos
    setInterval(renderAgendamentosConfirmados, 5000);
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);