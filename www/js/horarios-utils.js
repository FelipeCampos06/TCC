const DIAS_HORARIOS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const HORARIOS_PADRAO = {
    
};

function getDefaultHorariosDisponiveis() {
    return Object.fromEntries(
        DIAS_HORARIOS.map((dia) => [dia, HORARIOS_PADRAO[dia] ? [...HORARIOS_PADRAO[dia]] : []])
    );
}

function normalizeHorariosStorage(raw) {
    if (!raw) return getDefaultHorariosDisponiveis();

    try {
        const dados = JSON.parse(raw);
        return Object.fromEntries(
            DIAS_HORARIOS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : [...HORARIOS_PADRAO[dia] || []]])
        );
    } catch (err) {
        console.error('Erro ao analisar horários disponíveis:', err);
        return getDefaultHorariosDisponiveis();
    }
}

function ensureHorariosDisponiveisStorage() {
    const raw = localStorage.getItem('horarios_disponiveis');
    const dados = normalizeHorariosStorage(raw);

    if (!raw) {
        localStorage.setItem('horarios_disponiveis', JSON.stringify(dados));
    }

    return dados;
}

function saveHorariosDisponiveisStorage(dados) {
    localStorage.setItem('horarios_disponiveis', JSON.stringify(dados));
}
