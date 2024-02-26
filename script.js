var firebaseConfig = {
    apiKey: "AIzaSyBzCVbI3t6Cb8qQSlOp1xdcoyIov8VDcWA",
    authDomain: "painel-ef580.firebaseapp.com",
    projectId: "painel-ef580",
    storageBucket: "painel-ef580.appspot.com",
    messagingSenderId: "942535580975",
    appId: "1:942535580975:web:2415019ca7a48a818695da",
    measurementId: "G-Q46MW48X8E"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        // Obtém os valores do formulário
        var nomeUsuario = form.querySelector('input[name="nome"]').value;
        var senha = form.querySelector('input[name="senha"]').value;

        database.ref('usuarios').orderByChild('usuario').equalTo(nomeUsuario).once('value')
            .then(function (snapshot) {
                var usuarioEncontrado = false;

                snapshot.forEach(function (childSnapshot) {
                    var usuario = childSnapshot.val();

                    // Verifica a senha
                    if (usuario.senha === senha) {
                        usuarioEncontrado = true;

                        // Redireciona para o menu com o nome de usuário
                        var nomeUsuarioParam = encodeURIComponent(usuario.nome);
                        window.location.href = "/menu/menu.html?nome=" + nomeUsuarioParam;
                    }
                });

                // Se usuário não encontrado ou senha incorreta
                if (!usuarioEncontrado) {
                    alert("Credenciais inválidas. Por favor, tente novamente.");
                }
            })
            .catch(function (error) {
                console.error("Erro ao verificar as credenciais:", error);
            });
    });
});