function atualizarPaginaDia() {
    console.log('Iniciando atualização da página do dia');

    if (typeof getSelectedDia !== 'function') {
        console.error('Função getSelectedDia não encontrada. Verifique se dias-utils.js foi carregado.');
        return;
    }

    const dia = getSelectedDia();
    console.log('Dia selecionado:', dia);

    if (!dia || !DIAS.includes(dia)) {
        console.error('Dia inválido, redirecionando para agenda:', dia);
        window.location.href = '../html/agenda.html';
        return;
    }

    localStorage.setItem('dia_selecionado', dia);

    const titulo = document.getElementById('diaTitulo');
    if (titulo) {
        titulo.textContent = dia + (dia === 'Sábado' ? '' : ' - Feira');
        console.log('Título atualizado para:', titulo.textContent);
    }

    document.title = `${dia} - Feira`;

    // Garantir que DIA_ATUAL esteja disponível para compatibilidade
    window.DIA_ATUAL = dia;
    console.log('DIA_ATUAL definido como:', window.DIA_ATUAL);
}

document.addEventListener('DOMContentLoaded', atualizarPaginaDia);
