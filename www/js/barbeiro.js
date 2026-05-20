const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let iniciado = false;

// Helper para parse de HH:MM -> minutos desde 00:00
function parseTimeToMinutes(t) {
    if (!t || typeof t !== 'string') return 0;
    const parts = t.split(':').map(Number);
    if (!parts.length) return 0;
    const h = Number.isFinite(parts[0]) ? parts[0] : 0;
    const m = Number.isFinite(parts[1]) ? parts[1] : 0;
    return h * 60 + m;
}

function getHorariosDisponiveis() {
    const dados = ensureHorariosDisponiveisStorage();
    return Object.fromEntries(DIAS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []]));
}

function saveHorariosDisponiveis(dados) {
    localStorage.setItem('horarios_disponiveis', JSON.stringify(dados));
}

function removeHorario(dia, horario) {
    const dados = getHorariosDisponiveis();
    if (!dados[dia]) return;

    dados[dia] = dados[dia].filter((h) => h !== horario);
    saveHorariosDisponiveis(dados);
    renderHorariosDisponiveis();
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
                    // small confirm using ui
                    if (window.ui && typeof window.ui.showConfirm === 'function') {
                        window.ui.showConfirm(`Remover horário ${horario} em ${dia}?`).then((ok) => {
                            if (ok) removeHorario(dia, horario);
                        });
                    } else if (confirm(`Remover horário ${horario} em ${dia}?`)) {
                        removeHorario(dia, horario);
                    }
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
    const horarioSelect = document.getElementById('horarioSelect');
    const horario = horarioSelect ? horarioSelect.value : '';
    if (!horario) {
        if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Escolha um horário para adicionar.');
        else alert('Escolha um horário para adicionar.');
        return;
    }

    // Validação: apenas horas redondas (minutos === 00) e entre 08:00 e 18:00
    const timeMatch = /^([0-9]{1,2}):([0-9]{2})$/.exec(horario);
    if (!timeMatch) {
        if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Formato de horário inválido. Use HH:MM.');
        else alert('Formato de horário inválido. Use HH:MM.');
        return;
    }
    const hh = parseInt(timeMatch[1], 10);
    const mm = parseInt(timeMatch[2], 10);
    if (mm !== 0) {
        if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Somente horas cheias (ex: 10:00).');
        else alert('Somente horas cheias (ex: 10:00).');
        return;
    }
    if (hh < 8 || hh > 18) {
        if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Horários permitidos entre 08:00 e 18:00.');
        else alert('Horários permitidos entre 08:00 e 18:00.');
        return;
    }

    const dados = getHorariosDisponiveis();
    if (!dados[dia]) {
        dados[dia] = [];
    }
    if (dados[dia].includes(horario)) {
        if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Esse horário já está disponível para o dia selecionado.');
        else alert('Esse horário já está disponível para o dia selecionado.');
        return;
    }

    dados[dia].push(horario);
    // Ordenar numericamente por hora
    dados[dia].sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    saveHorariosDisponiveis(dados);
    renderHorariosDisponiveis();
    if (document.getElementById('horarioSelect')) document.getElementById('horarioSelect').selectedIndex = 0;
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

    // Ordenar agendamentos por dia (segundo a ordem de DIAS) e por horário (HH:MM)
    const dayOrder = DIAS;
    const parseTimeToMinutes = (t) => {
        if (!t || typeof t !== 'string') return 0;
        const parts = t.split(':').map(Number);
        if (parts.length === 0) return 0;
        const h = Number.isFinite(parts[0]) ? parts[0] : 0;
        const m = Number.isFinite(parts[1]) ? parts[1] : 0;
        return h * 60 + m;
    };

    const sorted = [...agendamentos].sort((a, b) => {
        const ai = dayOrder.indexOf(a.dia);
        const bi = dayOrder.indexOf(b.dia);
        const aIndex = ai === -1 ? dayOrder.length : ai;
        const bIndex = bi === -1 ? dayOrder.length : bi;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return parseTimeToMinutes(a.horario) - parseTimeToMinutes(b.horario);
    });

    // Renderizar usando DocumentFragment para performance
    const frag = document.createDocumentFragment();
    sorted.forEach((agendamento, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `agendamento-${agendamento.id || index}`;

        const statusClass = getStatusClass(agendamento.horario);

        card.innerHTML = `
            <span class="status ${statusClass}"></span>
            <h3>Cliente</h3>
            <p class="hora-card">${agendamento.horario}</p>
            <p class="servico">${agendamento.servico}</p>
            <p class="tempo">${getTempoServico(agendamento.servico)}</p>
            <p class="dia-agendamento">${agendamento.dia}</p>
        `;

        // Botão para o barbeiro cancelar o agendamento
        const cancelarBtn = document.createElement('button');
        cancelarBtn.className = 'btn-cancelar-agendamento';
        cancelarBtn.type = 'button';
        cancelarBtn.textContent = '×';
        cancelarBtn.title = 'Cancelar este agendamento';
        cancelarBtn.addEventListener('click', () => {
            cancelarAgendamentoPorBarbeiro(agendamento);
        });

        card.appendChild(cancelarBtn);
        frag.appendChild(card);
    });

    container.appendChild(frag);

    console.log('Agendamentos renderizados:', sorted.length);
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

    // Gerar select de horários (horas cheias) entre 08:00 e 18:00
    const horarioSelectEl = document.getElementById('horarioSelect');
    if (horarioSelectEl) {
        horarioSelectEl.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Selecione horário';
        horarioSelectEl.appendChild(placeholder);
        for (let h = 8; h <= 18; h++) {
            const hh = String(h).padStart(2, '0') + ':00';
            const opt = document.createElement('option');
            opt.value = hh;
            opt.textContent = hh;
            horarioSelectEl.appendChild(opt);
        }
    }

    // Recarregar agendamentos a cada 5 segundos para refletir cancelamentos
    setInterval(renderAgendamentosConfirmados, 5000);

    // Reagir a mudanças do localStorage vindas de outra janela/webview
    window.addEventListener('storage', (e) => {
        if (!e) return;
        if (e.key === 'agendamentos_confirmados' || e.key === 'agendamentos_confirmados_last_update' || e.key === 'horarios_disponiveis') {
            renderAgendamentosConfirmados();
            renderHorariosDisponiveis();
        }
    });
}

async function cancelarAgendamentoPorBarbeiro(agendamento) {
    const msg = `Deseja realmente cancelar o agendamento de ${agendamento.servico} em ${agendamento.dia} às ${agendamento.horario}?`;
    let confirmado = false;
    if (window.ui && typeof window.ui.showConfirm === 'function') {
        confirmado = await window.ui.showConfirm(msg, { okText: 'Sim, cancelar', cancelText: 'Não' });
    } else {
        confirmado = confirm(msg);
    }
    if (!confirmado) return;

    const agendamentosAtuais = JSON.parse(localStorage.getItem('agendamentos_confirmados') || '[]');

    let filtrados;
    if (agendamento.id !== undefined && agendamento.id !== null) {
        filtrados = agendamentosAtuais.filter((a) => a.id !== agendamento.id);
    } else {
        filtrados = agendamentosAtuais.filter((a) => !(a.dia === agendamento.dia && a.horario === agendamento.horario && a.servico === agendamento.servico));
    }

    localStorage.setItem('agendamentos_confirmados', JSON.stringify(filtrados));

    const payload = Object.assign({}, agendamento, { data_confirmacao: new Date().toLocaleString('pt-BR'), cancelled_by: 'barbeiro' });
    localStorage.setItem('ultimo_agendamento', JSON.stringify(payload));
    localStorage.setItem('agendamento_cancelado', 'true');

    // Atualizar a UI
    renderAgendamentosConfirmados();
    renderHorariosDisponiveis();

    if (window.ui && typeof window.ui.showToast === 'function') window.ui.showToast('Agendamento cancelado. Cliente notificado.');
    else alert('Agendamento cancelado com sucesso. O cliente será notificado.');
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);