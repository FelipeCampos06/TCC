const DIAS = ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIA_GENERIC_PAGE = '../html/dia.html';

function normalizeDia(dia) {
    return String(dia || '').trim();
}

function buildDayUrl(dia) {
    const normalized = normalizeDia(dia);
    return `${DIA_GENERIC_PAGE}?dia=${encodeURIComponent(normalized)}`;
}

function getSelectedDia() {
    const params = new URLSearchParams(window.location.search);
    const diaParam = params.get('dia');
    const selected = normalizeDia(diaParam || localStorage.getItem('dia_selecionado'));
    return selected;
}

function redirectToDayPage(dia) {
    const normalized = normalizeDia(dia);
    if (!normalized || !DIAS.includes(normalized)) {
        window.location.href = '../html/agenda.html';
        return;
    }
    localStorage.setItem('dia_selecionado', normalized);
    window.location.href = buildDayUrl(normalized);
}

function getDayPageUrl(dia) {
    return buildDayUrl(dia);
}

function getBackPageUrl(dia) {
    const normalized = normalizeDia(dia);
    if (normalized && DIAS.includes(normalized)) {
        return buildDayUrl(normalized);
    }
    return '../html/agenda.html';
}
