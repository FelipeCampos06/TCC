<<<<<<< HEAD
let iniciado = false;

function selecionarDia(dia, pagina) {
    // Armazenar o dia selecionado
    localStorage.setItem('dia_selecionado', dia);
    
    // Redirecionar para a página do dia
    window.location.href = pagina;
}

function exibirServicoSelecionado() {
    const servico = localStorage.getItem('servico_selecionado');
    const valor = localStorage.getItem('valor_servico');
    
    if (servico && valor) {
        const elemento = document.getElementById('servicoSelecionado');
        if (elemento) {
            elemento.textContent = `Serviço: ${servico} - ${valor}`;
        }
    }
=======
const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let iniciado = false;

function getHorariosDisponiveis() {
    const raw = localStorage.getItem('horarios_disponiveis');
    if (!raw) {
        return Object.fromEntries(DIAS.map((dia) => [dia, []]));
    }
    try {
        const dados = JSON.parse(raw);
        return Object.fromEntries(
            DIAS.map((dia) => [dia, dados[dia] ? [...new Set(dados[dia])] : []])
        );
    } catch (err) {
        console.error('Erro ao ler horários disponíveis:', err);
        return Object.fromEntries(DIAS.map((dia) => [dia, []]));
    }
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
>>>>>>> 10e7b10 (29/04)
}

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

<<<<<<< HEAD
    // Parte do Cordova (só roda quando existir cordova)
=======
>>>>>>> 10e7b10 (29/04)
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        const el = document.getElementById('deviceready');
        if (el) el.classList.add('ready');
    }

<<<<<<< HEAD
    console.log("App iniciado");
    
    // Exibir serviço selecionado
    exibirServicoSelecionado();
=======
    renderDisponibilidadesAgenda();
    console.log("App iniciado");
>>>>>>> 10e7b10 (29/04)
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);