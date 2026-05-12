const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let iniciado = false;

function getHorariosDisponiveis() {
    const dados = ensureHorariosDisponiveisStorage();
    return Object.fromEntries(
        DIAS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []])
    );
}

function selecionarDia(dia, pagina) {
    localStorage.setItem('dia_selecionado', dia);
    window.location.href = pagina;
}

function renderDisponibilidadesAgenda() {
    const dados = getHorariosDisponiveis();
    const mapping = {
        'Terça': 'horarios-terca',
        'Quarta': 'horarios-quarta',
        'Quinta': 'horarios-quinta',
        'Sexta': 'horarios-sexta',
        'Sábado': 'horarios-sabado'
    };

    DIAS.forEach((dia) => {
        const container = document.getElementById(mapping[dia]);
        if (!container) return;

        const horarios = dados[dia] || [];
        if (horarios.length === 0) {
            container.innerHTML = '<span class="sem-horarios">Nenhum horário disponível</span>';
            return;
        }

        container.innerHTML = horarios
            .map((horario) => `<span class="horario-badge">${horario}</span>`)
            .join('');
    });
}

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

    renderDisponibilidadesAgenda();
    console.log("App iniciado");
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);