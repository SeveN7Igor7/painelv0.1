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

document.addEventListener("DOMContentLoaded", async function () {
    // Obtém o valor do parâmetro 'nome' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeUsuario = urlParams.get('nome');

    // Atualiza a saudação no elemento desejado
    const saudacaoElemento = document.getElementById('saudacao');
    saudacaoElemento.textContent = `Bem-vindo, ${nomeUsuario || 'visitante'}!`;
    await exibirTipoContaUsuario(nomeUsuario);
    exibirCheckers();
    exibirChat();
});

async function exibirTipoContaUsuario(nomeUsuario) {
    // Verifica se o nome de usuário foi fornecido
    if (!nomeUsuario) {
        console.error("Nome de usuário não fornecido.");
        return;
    }

    // Obtém o usuário correspondente ao nome fornecido
    const usuario = await buscarUsuarioPorNome(nomeUsuario);

    // Verifica se o usuário foi encontrado
    if (!usuario) {
        console.error("Usuário não encontrado.");
        return;
    }

    // Obtém o tipo de conta do usuário
    const tipoConta = usuario.contaEspecial;

    // Exibe o tipo de conta no site
    const tipoContaElemento = document.getElementById('tipoConta');
    if (tipoContaElemento) {
        tipoContaElemento.textContent = `Tipo de Conta: ${tipoConta}`;

        // Verifica se o usuário é ADMIN
        if (tipoConta === 'ADMIN') {
            // Adiciona botões "CRIAR USUÁRIO" e "EXCLUIR USUÁRIO"
            const botoesAdminElemento = document.getElementById('botoesAdmin');
            if (botoesAdminElemento) {
                botoesAdminElemento.innerHTML = `
                    <button onclick="criarUsuario()">CRIAR USUÁRIO</button>
                    <button onclick="excluirUsuario()">EXCLUIR USUÁRIO</button>
                `;
            }
        }
    }
}


function buscarUsuarioPorNome(nomeUsuario) {
    // Obtém a referência do nó 'usuarios' no banco de dados
    const usuariosRef = database.ref('usuarios');

    // Obtém os dados do nó 'usuarios' uma vez
    return usuariosRef.once('value')
        .then(snapshot => {
            const usuarios = snapshot.val();

            // Procura o usuário com o nome correspondente
            for (const usuarioKey in usuarios) {
                const usuario = usuarios[usuarioKey];
                if (usuario.nome === nomeUsuario) {
                    return usuario;
                }
            }

            // Retorna null se o usuário não for encontrado
            return null;
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            return null;
        });
}


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

// Função para obter o próximo ID disponível
function obterProximoId(callback) {
    const usuarios = database.ref('usuarios');

    usuarios.once('value', function (snapshot) {
        // Obtém a lista de usuários
        const listaUsuarios = snapshot.val();

        let proximoId = 1;

        // Procura pelo próximo ID disponível
        for (let id in listaUsuarios) {
            if (listaUsuarios.hasOwnProperty(id) && listaUsuarios[id].idConta >= proximoId) {
                proximoId = listaUsuarios[id].idConta + 1;
            }
        }

        // Chama o callback com o próximo ID
        callback(proximoId);
    });
}

// ...

function criarUsuario() {
    obterProximoId(function (proximoId) {
        // Coleta os dados dos prompts
        const nome = prompt("Informe o nome REAL do usuário:");
        const saldo = parseFloat(prompt("Informe o saldo do usuário:"));
        const usuario = prompt("Informe o nome de usuário:");
        const senha = prompt("Informe a senha:");
        const tipoConta = prompt("Informe o tipo de conta (ADMIN ou NORMAL):").toUpperCase();

        // Verifica se o tipo de conta é válido
        if (tipoConta !== 'ADMIN' && tipoConta !== 'NORMAL') {
            alert("Tipo de conta inválido. Use ADMIN ou NORMAL.");
            return;
        }

        // Cria o objeto do usuário
        const novoUsuario = {
            idConta: proximoId,
            nome: nome,
            saldo: saldo,
            usuario: usuario,
            senha: senha,
            contaEspecial: tipoConta
        };

        // Adiciona o novo usuário ao banco de dados
        const usuariosRef = database.ref('usuarios');
        const novoUsuarioRef = usuariosRef.child(proximoId);

        novoUsuarioRef.set(novoUsuario)
            .then(function () {
                alert("Usuário criado com sucesso!");
            })
            .catch(function (error) {
                console.error("Erro ao criar usuário:", error);
            });
    });
}

function excluirUsuario() {
    const usuariosRef = database.ref('usuarios');

    // Obtém a lista de usuários
    usuariosRef.once('value', function (snapshot) {
        const listaUsuarios = snapshot.val();

        // Verifica se há usuários no banco de dados
        if (!listaUsuarios) {
            alert("Não há usuários para excluir.");
            return;
        }

        // Exibe a lista de usuários com seus IDs
        let listaUsuariosStr = "Selecione o ID da conta para ser excluída:\n";
        for (let id in listaUsuarios) {
            if (listaUsuarios.hasOwnProperty(id)) {
                listaUsuariosStr += `ID: ${id} - Nome: ${listaUsuarios[id].nome}\n`;
            }
        }

        const idContaExcluir = prompt(listaUsuariosStr);

        // Verifica se o ID informado é válido
        if (!idContaExcluir || isNaN(idContaExcluir) || !listaUsuarios[idContaExcluir]) {
            alert("ID inválido. Informe um número válido.");
            return;
        }

        // Confirmação para excluir
        const confirmacao = confirm("Tem certeza de que deseja excluir a conta?\n\nNome: " + listaUsuarios[idContaExcluir].nome);

        if (confirmacao) {
            // Remove a conta do banco de dados
            usuariosRef.child(idContaExcluir).remove()
                .then(function () {
                    alert("Conta excluída com sucesso!");
                })
                .catch(function (error) {
                    console.error("Erro ao excluir conta:", error);
                });
        }
    });
}
