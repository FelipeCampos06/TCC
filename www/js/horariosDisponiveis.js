const DIAS_DISPONIVEIS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function getHorariosDisponiveisStorage() {
    const raw = localStorage.getItem('horarios_disponiveis');
    if (!raw) {
        return Object.fromEntries(DIAS_DISPONIVEIS.map((dia) => [dia, []]));
    }
    try {
        const dados = JSON.parse(raw);
        return Object.fromEntries(
            DIAS_DISPONIVEIS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []])
        );
    } catch (err) {
        console.error('Erro ao ler horários disponíveis:', err);
        return Object.fromEntries(DIAS_DISPONIVEIS.map((dia) => [dia, []]));
    }
}

function renderHorariosDisponiveisPage(dia) {
    const container = document.getElementById('horariosDisponiveisContainer');
    if (!container) {
        console.error('Container de horários não encontrado');
        return;
    }

    const dados = getHorariosDisponiveisStorage();
    const horarios = dados[dia] || [];
    container.innerHTML = '';

    if (horarios.length === 0) {
        const empty = document.createElement('p');
        container.appendChild(empty);
        return;
    }

    const list = document.createElement('div');
    list.className = 'time-list';

    horarios.forEach((horario) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hora';

        const button = document.createElement('button');
        button.textContent = horario;
        button.type = 'button';
        button.addEventListener('click', () => selecionarHorario(horario));

        wrapper.appendChild(button);
        list.appendChild(wrapper);
    });

    container.appendChild(list);
}

function selecionarHorario(horario) {
    if (!horario) return;
    localStorage.setItem('horario_selecionado', horario);
    if (typeof DIA_ATUAL !== 'undefined') {
        localStorage.setItem('dia_selecionado', DIA_ATUAL);
    }
    window.location.href = '../html/confirmagenda.html';
}

function iniciarHorariosDisponiveisPage() {
    if (typeof DIA_ATUAL === 'undefined' || !DIA_ATUAL) {
        console.error('DIA_ATUAL não definido na página');
        return;
    }

    renderHorariosDisponiveisPage(DIA_ATUAL);
}

document.addEventListener('DOMContentLoaded', iniciarHorariosDisponiveisPage);
