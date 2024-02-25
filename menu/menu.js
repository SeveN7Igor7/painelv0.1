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

function enviarMensagemChat() {
    const chatMessageInput = document.getElementById('chatMessage');
    const nomeUsuario = getNomeUsuario();
    
    const mensagem = chatMessageInput.value.trim();

    if (mensagem !== '' && nomeUsuario) {
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        const mensagemData = {
            mensagem: mensagem,
            nomeUsuario: nomeUsuario,
            timestamp: timestamp
        };

        // Adiciona a mensagem ao banco de dados Firebase para o chat
        database.ref('chat').push(mensagemData)
            .then(function () {
                // Limpa o campo de entrada após enviar a mensagem
                chatMessageInput.value = '';

                // Adiciona a nova mensagem ao contêiner
                exibirMensagemChatNoSite(mensagemData);
            })
            .catch(function (error) {
                console.error("Erro ao enviar mensagem do chat:", error);
            });
    }
}

function exibirMensagemChatNoSite(mensagemData) {
    const chatMessagesContainer = document.getElementById('chatMessages');

    // Cria um elemento para exibir a mensagem do chat
    const messageElement = document.createElement('div');
    messageElement.textContent = `${mensagemData.nomeUsuario}: ${mensagemData.mensagem} - ${new Date(mensagemData.timestamp).toLocaleString()}`;

    // Adiciona a mensagem ao início do contêiner (para manter a ordem correta)
    chatMessagesContainer.insertBefore(messageElement, chatMessagesContainer.firstChild);
}

function openPage(pageId) {
    // Oculta todos os conteúdos da página
    var pageContents = document.getElementsByClassName('page-content');
    for (var i = 0; i < pageContents.length; i++) {
        pageContents[i].classList.remove('active');
    }

    // Exibe apenas o conteúdo da página selecionada
    var selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

function logout() {
    // Adicione o código de logout aqui
    // Redirecione para a página de login ou execute outras ações necessárias
}

function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('opened');
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtém o valor do parâmetro 'nome' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeUsuario = urlParams.get('nome');

    // Atualiza a saudação no elemento desejado
    const saudacaoElemento = document.getElementById('saudacao');
    saudacaoElemento.textContent = `Bem-vindo, ${nomeUsuario || 'visitante'}!`;
    exibirCheckers();
    exibirChat();
});

function exibirNomeUsuario(nomeUsuario) {
    var elementoNomeUsuario = document.getElementById('nomeUsuario');
    if (elementoNomeUsuario && nomeUsuario) {
        // Aqui fazemos uma consulta ao Firebase para obter o nome
        database.ref('usuarios').orderByChild('usuario').equalTo(nomeUsuario).once('value')
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    var dadosUsuario = snapshot.val();
                    var nomeDoBancoDeDados = dadosUsuario[nomeUsuario].nome;

                    if (nomeDoBancoDeDados) {
                        elementoNomeUsuario.textContent = "Bem-vindo, " + nomeDoBancoDeDados + "!";
                    } else {
                        console.error("Nome do usuário não encontrado no banco de dados.");
                    }
                } else {
                    console.error("Usuário não encontrado no banco de dados.");
                }
            })
            .catch(function (error) {
                console.error("Erro ao consultar o banco de dados:", error);
            });
    } else {
        console.error("Nome do usuário não encontrado na URL.");
    }
}

function enviarChecker() {
    var checkerMessage = document.getElementById('checkerMessage').value;
    var nomeUsuario = getNomeUsuario();

    if (checkerMessage && nomeUsuario) {
        var timestamp = firebase.database.ServerValue.TIMESTAMP;

        database.ref('checkers').push({
            mensagem: checkerMessage,
            nomeUsuario: nomeUsuario,
            timestamp: timestamp
        });

        // Limpa o campo de mensagem após o envio
        document.getElementById('checkerMessage').value = '';
    } else {
        alert('Preencha a mensagem antes de enviar.');
    }
}

function getNomeUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('nome');
}

function exibirCheckers() {
    var checkerMessagesContainer = document.getElementById('checkerMessages');
    
    // Remove mensagens anteriores
    checkerMessagesContainer.innerHTML = '';

    database.ref('checkers').orderByChild('timestamp').on('child_added', function (snapshot) {
        var checker = snapshot.val();

        // Cria um elemento para exibir a mensagem do checker
        var messageElement = document.createElement('div');
        messageElement.textContent = `${checker.nomeUsuario}: ${checker.mensagem} - ${new Date(checker.timestamp).toLocaleString()}`;

        // Adiciona a mensagem ao contêiner
        checkerMessagesContainer.appendChild(messageElement);
    });
}

function enviarMensagemChecker() {
    var mensagemInput = document.getElementById('checkerMessage');
    var mensagem = mensagemInput.value.trim();

    if (mensagem !== '') {
        // Obtém o nome do usuário da URL
        const urlParams = new URLSearchParams(window.location.search);
        const nomeUsuario = urlParams.get('nome');

        // Adiciona a mensagem ao banco de dados Firebase
        var timestamp = firebase.database.ServerValue.TIMESTAMP;
        database.ref('checkers').push({
            mensagem: mensagem,
            nomeUsuario: nomeUsuario,
            timestamp: timestamp
        });

        // Limpa o campo de entrada após enviar a mensagem
        mensagemInput.value = '';
    }
}

function exibirChat() {
    var chatMessagesContainer = document.getElementById('chatMessages');

    // Remove mensagens anteriores
    chatMessagesContainer.innerHTML = '';

    // Obtém as mensagens do chat do banco de dados
    database.ref('chat').orderByChild('timestamp').on('child_added', function (snapshot) {
        var chatMessage = snapshot.val();

        // Cria um elemento para exibir a mensagem do chat
        var messageElement = document.createElement('div');
        messageElement.textContent = `${chatMessage.nomeUsuario}: ${chatMessage.mensagem} - ${new Date(chatMessage.timestamp).toLocaleString()}`;

        // Adiciona a mensagem ao início do contêiner (para manter a ordem correta)
        chatMessagesContainer.insertBefore(messageElement, chatMessagesContainer.firstChild);
    });
}
