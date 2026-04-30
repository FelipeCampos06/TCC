function enforceBarberAccess() {
    const role = localStorage.getItem('tipo_usuario');
    if (role !== 'barbeiro') {
        window.location.href = '../index.html';
    }
}

document.addEventListener('DOMContentLoaded', enforceBarberAccess);
