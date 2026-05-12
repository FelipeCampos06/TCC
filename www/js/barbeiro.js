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

function removeHorario(dia, horario) {
    const dados = getHorariosDisponiveis();
    dados[dia] = (dados[dia] || []).filter((item) => item !== horario);
    saveHorariosDisponiveis(dados);
    renderHorariosDisponiveis();
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

    console.log('App iniciado');
    renderHorariosDisponiveis();

    const addButton = document.getElementById('btnAddHorario');
    if (addButton) {
        addButton.addEventListener('click', adicionarHorario);
    }
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);