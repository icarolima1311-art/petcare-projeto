// --- LÓGICA DE AUTENTICAÇÃO ---

// 1. Conexão com Supabase (vem do config.js)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Pegar os elementos do HTML
const form = document.getElementById('login-form');
const btnEntrar = document.getElementById('btn-entrar');
const btnCadastrar = document.getElementById('btn-cadastrar');
const inputEmail = document.getElementById('input-email');
const inputSenha = document.getElementById('input-senha');
const mensagemErro = document.getElementById('mensagem-erro');

// 3. Função de Cadastro (Sign Up)
async function handleCadastro(event) {
    event.preventDefault(); // Impede o formulário de recarregar a página
    mensagemErro.style.display = 'none'; // Esconde erros antigos

    const email = inputEmail.value;
    const senha = inputSenha.value;

    console.log("Tentando cadastrar usuário...");

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: senha,
    });

    if (error) {
        console.error("Erro no cadastro:", error.message);
        mensagemErro.textContent = "Erro: " + error.message;
        mensagemErro.style.display = 'block';
    } else {
        console.log("Usuário cadastrado!", data);
        // O Supabase exige confirmação por e-mail por padrão.
        // Você pode desabilitar isso no painel do Supabase para o projeto da faculdade
        // (Authentication -> Providers -> Email -> Desmarque "Confirm email")
        mensagemErro.textContent = "Cadastro realizado! Verifique seu e-mail para confirmar.";
        mensagemErro.style.display = 'block';
    }
}

// 4. Função de Login (Sign In)
async function handleLogin(event) {
    event.preventDefault(); // Impede o formulário de recarregar a página
    mensagemErro.style.display = 'none'; // Esconde erros antigos

    const email = inputEmail.value;
    const senha = inputSenha.value;

    console.log("Tentando fazer login...");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        console.error("Erro no login:", error.message);
        mensagemErro.textContent = "Erro: E-mail ou senha inválidos.";
        mensagemErro.style.display = 'block';
    } else {
        console.log("Login bem-sucedido!", data);
        // SUCESSO! Redireciona o usuário para o painel principal
        window.location.href = 'painel.html';
    }
}

// 5. Adicionar os "escutadores" de eventos nos botões
btnCadastrar.addEventListener('click', handleCadastro);
btnEntrar.addEventListener('click', handleLogin);

// Bônus: Se o usuário teclar "Enter", ele tenta fazer o login
form.addEventListener('submit', handleLogin);