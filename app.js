// --- LÓGICA PRINCIPAL DO APP ---

// 1. As variáveis SUPABASE_URL e SUPABASE_KEY vêm do arquivo 'config.js'
//    (que é ignorado pelo Git)
// Crie o cliente com um nome de variável diferente, como 'supabaseClient'
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Teste de Conexão
async function testarConexao() {
    console.log("Tentando conectar ao Supabase...");

    // Tenta ler da tabela 'pets' (que deve estar vazia)
    let { data: pets, error } = await supabaseClient // Use o novo nome aqui
    .from('pets') 
    .select('*');

    if (error) {
        console.error("Erro ao conectar:", error.message);
        document.querySelector('p').textContent = 'Erro ao conectar. Veja o console.';
    } else {
        console.log("Conexão bem-sucedida!");
        console.log("Dados lidos (deve estar vazio):", pets);
        document.querySelector('p').textContent = 'Conexão com Supabase bem-sucedida!';
    }
}

// Roda o nosso teste de conexão
testarConexao();