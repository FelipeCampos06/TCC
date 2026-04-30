function enforceUserAccess() {
    const role = localStorage.getItem('tipo_usuario');
    if (!role) {
        localStorage.setItem('tipo_usuario', 'cliente');
        return;
    }

    if (role === 'barbeiro') {
        window.location.href = '../html/barbeiro.html';
    }
}

document.addEventListener('DOMContentLoaded', enforceUserAccess);
