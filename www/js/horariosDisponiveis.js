const DIAS_DISPONIVEIS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function getHorariosDisponiveisStorage() {
    const dados = ensureHorariosDisponiveisStorage();
    return Object.fromEntries(
        DIAS_DISPONIVEIS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []])
    );
}

function renderHorariosDisponiveisPage(dia) {
    console.log('Iniciando renderização de horários para dia:', dia);

    const container = document.getElementById('horariosDisponiveisContainer');
    if (!container) {
        console.error('Container de horários não encontrado');
        return;
    }

    const dados = getHorariosDisponiveisStorage();
    console.log('Dados do localStorage:', dados);

    const horarios = dados[dia] || [];
    console.log('Horários para', dia, ':', horarios);

    container.innerHTML = '';

    if (horarios.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Nenhum horário disponível para este dia.';
        empty.className = 'nenhum-horario';
        container.appendChild(empty);
        console.log('Nenhum horário encontrado, mostrando mensagem vazia');
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
    console.log('Horários renderizados com sucesso');
}

function selecionarHorario(horario) {
    if (!horario) return;
    localStorage.setItem('horario_selecionado', horario);
    window.location.href = '../html/confirmagenda.html';
}

function iniciarHorariosDisponiveisPage() {
    if (typeof getSelectedDia !== 'function') {
        console.error('Função getSelectedDia não encontrada. Verifique se dias-utils.js foi carregado.');
        return;
    }

    const dia = getSelectedDia();
    if (!dia || !DIAS_DISPONIVEIS.includes(dia)) {
        console.error('Dia não válido ou não encontrado:', dia);
        return;
    }

    console.log('Renderizando horários para:', dia);
    renderHorariosDisponiveisPage(dia);
}

// Removido o event listener automático para evitar conflitos
// document.addEventListener('DOMContentLoaded', iniciarHorariosDisponiveisPage);
