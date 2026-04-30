let iniciado = false;

function iniciarApp() {
    if (iniciado) return;
    iniciado = true;

    console.log("App iniciado");

    const botao = document.getElementById("btnEntrar");

    if (!botao) {
        console.log("Botão não encontrado");
        return;
    }

    botao.addEventListener("click", () => {
<<<<<<< HEAD
        window.location.href = '../html/selecao.html';
    });

    const botaogoogle = document.getElementById("btnGoogle");
    
    if (!botaogoogle) {
        console.log("Botão não encontrado");
        return;
    }

    botaogoogle.addEventListener("click", () => {
        window.location.href = '../html/cadastro.html';
    });

    const botaocad = document.getElementById("btnCad");

    if (!botaocad) {
        console.log("Botão não encontrado");
        return;
    }

    botaocad.addEventListener("click", () => {
        window.location.href = '../html/cadastro.html';
    });

=======
        const email = document.querySelector(".email").value;
        const senha = document.querySelector(".senha").value;

        if (email === "admin" && senha === "admin") {
            localStorage.setItem('tipo_usuario', 'barbeiro');
            window.location.href = 'www/html/barbeiro.html';
        } else {
            localStorage.setItem('tipo_usuario', 'cliente');
            window.location.href = 'www/html/selecao.html';
        }
    });
>>>>>>> 10e7b10 (29/04)
}

// Navegador
document.addEventListener('DOMContentLoaded', iniciarApp);

// Cordova
document.addEventListener('deviceready', iniciarApp);