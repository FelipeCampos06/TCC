(function () {
    // showConfirm: retorna Promise<boolean>
    function showConfirm(message, opts = {}) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-overlay';

            const box = document.createElement('div');
            box.className = 'confirm-box';

            const msg = document.createElement('div');
            msg.className = 'confirm-message';
            msg.textContent = message;

            const actions = document.createElement('div');
            actions.className = 'confirm-actions';

            const btnCancel = document.createElement('button');
            btnCancel.className = 'confirm-cancel';
            btnCancel.textContent = opts.cancelText || 'Cancelar';
            btnCancel.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });

            const btnOk = document.createElement('button');
            btnOk.className = 'confirm-ok';
            btnOk.textContent = opts.okText || 'Confirmar';
            btnOk.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(true);
            });

            actions.appendChild(btnCancel);
            actions.appendChild(btnOk);

            box.appendChild(msg);
            box.appendChild(actions);
            overlay.appendChild(box);

            // Dismiss on overlay click (but not when clicking inside box)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            });

            document.body.appendChild(overlay);
            // Autofocus
            setTimeout(() => btnCancel.focus(), 10);
        });
    }

    // showToast: mensagem curta
    function showToast(message, ms = 2200) {
        const t = document.createElement('div');
        t.className = 'ui-toast';
        t.textContent = message;
        document.body.appendChild(t);
        // force reflow
        void t.offsetWidth;
        t.classList.add('show');
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => {
                if (t.parentNode) t.parentNode.removeChild(t);
            }, 180);
        }, ms);
    }

    window.ui = {
        showConfirm,
        showToast
    };
})();
