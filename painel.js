// @ts-nocheck
// (Este comentário acima desliga os erros falsos do VS Code)

// --- LÓGICA DO PAINEL (PLANO B - COMPLETO COM PESO) ---

// 1. Conexão com Supabase (vem do config.js)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Elementos da Página
const btnSair = document.getElementById('btn-sair');
const h2TituloPainel = document.getElementById('titulo-painel'); 

// ... (Elementos dos Modais Pet, Vacinas, Histórico) ...
const cardPerfilPet = document.getElementById('card-perfil-pet'); 
const modalPetOverlay = document.getElementById('modal-pet-overlay'); 
const formPet = document.getElementById('form-pet'); 
const listaPetsUl = document.getElementById('lista-pets-ul'); 
const cardCalendario = document.getElementById('card-calendario');
const modalVacinasOverlay = document.getElementById('modal-vacinas-overlay');
const tituloModalVacinas = document.getElementById('titulo-modal-vacinas');
const formVacina = document.getElementById('form-vacina');
const listaVacinasUl = document.getElementById('lista-vacinas-ul');
const cardHistorico = document.getElementById('card-historico');
const modalHistoricoOverlay = document.getElementById('modal-historico-overlay');
const tituloModalHistorico = document.getElementById('titulo-modal-historico');
const formHistorico = document.getElementById('form-historico');
const listaHistoricoUl = document.getElementById('lista-historico-ul');

// (NOVO) Elementos do Formulário Pet (para Editar)
const tituloModalPet = document.getElementById('titulo-modal-pet');
const btnSalvarPet = document.getElementById('btn-salvar-pet');
const petIdEdicao = document.getElementById('pet-id-edicao');

// Elementos do Modal Lembretes
const cardLembretes = document.getElementById('card-lembretes');
const modalLembretesOverlay = document.getElementById('modal-lembretes-overlay');
const tituloModalLembretes = document.getElementById('titulo-modal-lembretes');
const formLembrete = document.getElementById('form-lembrete');
const listaLembretesUl = document.getElementById('lista-lembretes-ul');

// (NOVO) Elementos do Modal Peso
const cardPeso = document.getElementById('card-peso');
const modalPesoOverlay = document.getElementById('modal-peso-overlay');
const tituloModalPeso = document.getElementById('titulo-modal-peso');
const formPeso = document.getElementById('form-peso');
const listaPesoUl = document.getElementById('lista-peso-ul');

// Elementos do Modal Chatbot
const cardAssistente = document.getElementById('card-assistente');
const modalChatOverlay = document.getElementById('modal-chat-overlay');
const chatJanela = document.getElementById('chat-janela');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatTitulo = document.getElementById('chat-titulo');

// Elementos do Modal Visualizador
const modalVisualizadorOverlay = document.getElementById('modal-visualizador-overlay');
const visualizadorTitulo = document.getElementById('visualizador-titulo');
const visualizadorConteudo = document.getElementById('visualizador-conteudo');

// Botões de Fechar (CLASSE)
const btnsFecharModal = document.querySelectorAll('.btn-fechar-modal');

// --- Variáveis Globais ---
let usuarioLogado = null; 
let petAtual = null; // Guarda o pet ATIVO no painel
let todosOsPets = []; // Guarda a lista de TODOS os pets
let chatContext = null; // Guarda o contexto da conversa (ex: 'aguardando_sangue_vomito')

// ===============================================
// (TREINAMENTO!) A BASE DE CONHECIMENTO DO CHATBOT
// ===============================================
const knowledgeBase = {
    // (MANTIDO O SEU TREINAMENTO ANTERIOR)
    "vomito": {
        "resposta": `Entendido. **Vômito**. Para eu te ajudar, preciso saber: Havia **sangue** no vômito? (Sim/Não)`,
        "contexto": "aguardando_sangue_vomito" 
    },
    "vomitando": {
        "resposta": `Entendido. **Vômito**. Para eu te ajudar, preciso saber: Havia **sangue** no vômito? (Sim/Não)`,
        "contexto": "aguardando_sangue_vomito"
    },
    "diarreia": {
        "resposta": "Certo, **diarreia**. É líquida ou pastosa? Tem sangue?",
        "contexto": "aguardando_sangue_diarreia"
    },
    "tosse": {
        "resposta": "Entendido, **tosse**. É uma tosse seca, como um 'engasgo', ou é uma tosse com catarro?",
        "contexto": "aguardando_tipo_tosse"
    },
    "febre": {
        "resposta": "A **febre** em pets (acima de 39.3°C) é um sinal de alerta. Pode ser infecção ou inflamação. **Nunca** medique seu pet com remédios humanos (como Paracetamol ou Dipirona) sem falar com um veterinário. Tente manter o pet hidratado e procure uma consulta.",
        "contexto": null
    },
    "doente": {
        "resposta": "Sinto muito que seu pet não parece bem. A palavra 'doente' é muito geral. Você pode me dar mais detalhes? Por favor, descreva o sintoma principal (como **vômito**, **diarreia**, **tosse** ou **apatia**).",
        "contexto": null
    },
    "doença": {
        "resposta": "Sinto muito que seu pet não parece bem. A palavra 'doente' é muito geral. Você pode me dar mais detalhes? Por favor, descreva o sintoma principal (como **vômito**, **diarreia**, **tosse** ou **apatia**).",
        "contexto": null
    },
    "apatia": {
        "resposta": "**Apatia** ou **letargia** (quando o pet está muito quieto, triste ou sem energia) é um sintoma genérico para muitas doenças. Pode ser desde uma dor leve até algo grave. Observe se há outros sintomas (como febre ou falta de apetite) e considere ligar para um veterinário.",
        "contexto": null
    },
    "letargia": {
        "resposta": "**Apatia** ou **letargia** (quando o pet está muito quieto, triste ou sem energia) é um sintoma genérico para muitas doenças. Pode ser desde uma dor leve até algo grave. Observe se há outros sintomas (como febre ou falta de apetite) e considere ligar para um veterinário.",
        "contexto": null
    },
    "apetite": {
        "resposta": "A **falta de apetite** é um sinal importante. Se o pet pular uma refeição, observe. Se ele pular 2 ou 3 refeições seguidas, ou se for um filhote, é hora de ligar para o veterinário. **Nunca** force a alimentação.",
        "contexto": null
    },
    "não quer comer": {
        "resposta": "A **falta de apetite** é um sinal importante. Se o pet pular uma refeição, observe. Se ele pular 2 ou 3 refeições seguidas, ou se for um filhote, é hora de ligar para o veterinário. **Nunca** force a alimentação.",
        "contexto": null
    },
    "coceira": {
        "resposta": "**Coceira** excessiva (prurido) geralmente é sinal de **alergia** (a pulgas, comida, ou algo no ambiente) ou **parasitas** (como pulgas ou sarna). É importante não deixar o pet se machucar de tanto coçar. Um veterinário pode identificar a causa.",
        "contexto": null
    },
    "coçando": {
        "resposta": "**Coceira** excessiva (prurido) geralmente é sinal de **alergia** (a pulgas, comida, ou algo no ambiente) ou **parasitas** (como pulgas ou sarna). É importante não deixar o pet se machucar de tanto coçar. Um veterinário pode identificar a causa.",
        "contexto": null
    },
    "espirrando": {
        "resposta": "**Espirros** ocasionais são normais. Mas se forem constantes, com coriza (catarro) ou tosse, pode ser a **Gripe Canina** (em cães) ou a **Rinotraqueíte** (em gatos). Mantenha o pet aquecido e procure um veterinário.",
        "contexto": null
    },
    "mancando": {
        "resposta": "Se o pet está **mancando**, primeiro verifique a pata com cuidado. Veja se há algo preso (espinho, caco de vidro) ou se a unha está quebrada. Se não houver nada visível, pode ser uma torção ou algo mais sério. Evite que ele corra ou pule e observe. Se persistir, procure um veterinário.",
        "contexto": null
    },
    "ofegante": {
        "resposta": "Estar **ofegante** é normal após exercícios ou se estiver calor. Mas se o pet está ofegante **mesmo em repouso**, ou se a respiração parece difícil, pode ser um sinal de dor, ansiedade, problema cardíaco ou respiratório. Isso requer atenção veterinária.",
        "contexto": null
    },
    "uva": {
        "resposta": "Não! **Uvas** (e passas) são **altamente tóxicas** para cães. Elas podem causar falência renal aguda. Mantenha-as longe do seu pet.",
        "contexto": null
    },
    "chocolate": {
        "resposta": "Não! **Chocolate** é **tóxico** para cães e gatos porque contém teobromina. Quanto mais escuro o chocolate, pior. Pode causar vômitos, diarreia e, em casos graves, ser fatal.",
        "contexto": null
    },
    "maca": {
        "resposta": "Sim, **maçã** pode! É um ótimo petisco. Apenas lembre-se de remover as **sementes** e o **caroço**, pois eles contêm pequenas quantidades de cianeto e são perigosos.",
        "contexto": null
    },
    "maçã": {
        "resposta": "Sim, **maçã** pode! É um ótimo petisco. Apenas lembre-se de remover as **sementes** e o **caroço**, pois eles contêm pequenas quantidades de cianeto e são perigosos.",
        "contexto": null
    },
    "abacate": {
        "resposta": "Não. **Abacate** contém Persina, uma toxina que é perigosa para cães e gatos, podendo causar vômitos e diarreia.",
        "contexto": null
    },
    "cebola": {
        "resposta": "Não! **Cebola** e **Alho** são extremamente tóxicos. Eles causam danos aos glóbulos vermelhos do pet, levando a um quadro de anemia grave.",
        "contexto": null
    },
    "alho": {
        "resposta": "Não! **Alho** e **Cebola** são extremamente tóxicos. Eles causam danos aos glóbulos vermelhos do pet, levando a um quadro de anemia grave.",
        "contexto": null
    },
    "queijo": {
        "resposta": "Com **moderação**. Muitos cães são intolerantes à lactose, o que pode causar gases e diarreia. Queijos brancos e sem sal (como ricota ou cottage) são opções mais seguras, mas apenas como um petisco ocasional.",
        "contexto": null
    },
    "pao": {
        "resposta": "Sim, **pão** puro (sem temperos, alho ou passas) pode ser dado em pequenas quantidades, mas não tem valor nutricional para eles. É 'caloria vazia'. Evite dar a massa crua, que é muito perigosa.",
        "contexto": null
    },
    "pão": {
        "resposta": "Sim, **pão** puro (sem temperos, alho ou passas) pode ser dado em pequenas quantidades, mas não tem valor nutricional para eles. É 'caloria vazia'. Evite dar a massa crua, que é muito perigosa.",
        "contexto": null
    },
    "leite": {
        "resposta": "Não é recomendado dar **leite** de vaca para cães ou gatos. A maioria dos pets (especialmente os adultos) é intolerante à lactose, o que pode causar diarreia e desconforto gástrico. Dê apenas água fresca.",
        "contexto": null
    },
    "osso": {
        "resposta": "Cuidado! **Nunca** dê ossos cozidos (especialmente de galinha), pois eles podem lascar e perfurar o intestino. Ossos crus *podem* ser dados, mas apenas com supervisão e se forem do tipo correto (grandes e carnudos). Ossos de couro (petiscos) também podem ser perigosos se engolidos em pedaços grandes.",
        "contexto": null
    },
    "xilitol": {
        "resposta": "**PERIGO MÁXIMO!** O **Xilitol** (um adoçante encontrado em chicletes, pastas de dente e produtos 'diet') é **extremamente fatal** para cães. Uma pequena quantidade pode causar uma queda severa de açúcar no sangue (hipoglicemia) e falência hepática. É uma emergência veterinária.",
        "contexto": null
    },
    "café": {
        "resposta": "Não! **Café** e qualquer coisa com cafeína (como chá ou energéticos) são tóxicos para pets. A cafeína acelera o coração e pode causar convulsões.",
        "contexto": null
    },
    "álcool": {
        "resposta": "Não, de jeito nenhum. **Álcool** é extremamente perigoso para pets. O sistema deles não consegue metabolizar o álcool, e pequenas quantidades podem causar vômito, desorientação, coma e morte.",
        "contexto": null
    },
    "arroz": {
        "resposta": "Sim, **arroz** cozido (sem sal, alho ou cebola) é seguro e pode até ajudar em casos de diarreia leve (para 'firmar' as fezes). Mas deve ser um complemento, não a base da dieta.",
        "contexto": null
    },
    "carne": {
        "resposta": "Sim, **carne** cozida (frango, boi, porco) sem temperos e sem ossos é um ótimo petisco. Evite dar carne crua, pelo risco de bactérias como a Salmonela.",
        "contexto": null
    },
    "frango": {
        "resposta": "Sim, **frango** cozido (sem sal, temperos ou ossos) é ótimo. **Nunca** dê ossos de frango cozidos, pois eles quebram e podem perfurar o estômago ou intestino.",
        "contexto": null
    },
    "ovo": {
        "resposta": "Sim! **Ovo** cozido (sem sal) é um excelente petisco, rico em proteínas e nutrientes. Evite dar ovo cru, pois pode conter Salmonela e afetar a absorção de vitaminas.",
        "contexto": null
    },
    "vacina": { 
        "resposta": "As vacinas são essenciais! As principais para cães são a **V10** (ou V8) e a **Antirrábica** (Raiva). Para gatos, são a **V4** (ou V5) e a **Raiva**. O calendário exato depende da idade do seu pet. Você pode registrar as vacinas dele no card 'Calendário de Vacinas'.",
        "contexto": null
    },
    "v10": {
        "resposta": "A vacina **V10** (ou V8) é uma das mais importantes para cães. Ela protege contra 10 doenças graves, como **Cinomose** e **Parvovirose**. Filhotes tomam de 3 a 4 doses, e depois recebem um reforço **anual**.",
        "contexto": null
    },
    "v8": {
        "resposta": "A vacina **V8** (ou V10) é uma das mais importantes para cães. Ela protege contra 8 doenças graves, como **Cinomose** e **Parvovirose**. Filhotes tomam de 3 a 4 doses, e depois recebem um reforço **anual**.",
        "contexto": null
    },
    "v4": {
        "resposta": "A vacina **V4** (ou V5) é a vacina essencial para **gatos**. Ela protege contra as principais doenças felinas, como a Panleucopenia, Calicivirose e Rinotraqueíte. A V5 inclui proteção contra a **FeLV** (Leucemia Felina).",
        "contexto": null
    },
    "v5": {
        "resposta": "A vacina **V5** (ou V4) é a vacina essencial para **gatos**. Ela protege contra as principais doenças felinas, como a Panleucopenia, Calicivirose e Rinotraqueíte. A V5 inclui proteção contra a **FeLV** (Leucemia Felina).",
        "contexto": null
    },
    "raiva": {
        "resposta": "A vacina **Antirrábica** (contra a Raiva) é **obrigatória por lei** para cães e gatos. A primeira dose é aplicada por volta dos 4 meses de idade e o reforço é **anual**.",
        "contexto": null
    },
    "cinomose": {
        "resposta": "A **Cinomose** é uma doença viral **extremamente grave** e muitas vezes fatal que afeta cães. Ela ataca os sistemas respiratório, gastrointestinal e nervoso. A **vacina V10** (ou V8) é a única forma de prevenção.",
        "contexto": null
    },
    "parvovirose": {
        "resposta": "A **Parvovirose** é uma doença viral **altamente contagiosa** e grave, especialmente em filhotes. Causa vômito e diarreia com sangue intensos, levando à desidratação severa. A **vacina V10** (ou V8) previne essa doença.",
        "contexto": null
    },
    "giardia": {
        "resposta": "A **Giárdia** é um protozoário (parasita) intestinal muito comum que causa diarreia (muitas vezes com muco). É transmitida pela água ou fezes contaminadas (inclusive para humanos!). Existe vacina, mas o tratamento principal é com vermífugo específico.",
        "contexto": null
    },
    "leishmaniose": {
        "resposta": "A **Leishmaniose** é uma doença grave transmitida pela picada do 'mosquito palha'. Causa problemas de pele, emagrecimento e falência de órgãos. A prevenção é feita com coleiras ou repelentes específicos e, em algumas regiões, com vacina.",
        "contexto": null
    },
    "fiv": {
        "resposta": "A **FIV** (Imunodeficiência Felina), conhecida como a 'AIDS dos gatos', é uma doença viral que ataca o sistema imunológico, deixando o gato vulnerável a outras infecções. É transmitida principalmente por mordidas profundas (brigas). Não tem cura, mas gatos com FIV podem viver muitos anos com os cuidados corretos.",
        "contexto": null
    },
    "felv": {
        "resposta": "A **FeLV** (Leucemia Felina) é uma doença viral grave em gatos. Ela suprime o sistema imunológico e pode causar câncer (linfoma). É transmitida por saliva, urina e fezes (ex: potes de comida compartilhados). Existe a vacina (V5) para prevenir!",
        "contexto": null
    },
    "piometra": {
        "resposta": "A **Piometra** é uma **infecção grave no útero** que afeta fêmeas (cadelas ou gatas) **não castradas**. É uma emergência médica que exige cirurgia. A **castração** é a única forma de prevenir 100% esta doença.",
        "contexto": null
    },
    "filhote": {
         "resposta": "Filhotes precisam de cuidados especiais! Eles precisam de um esquema vacinal completo (V10, Raiva, etc.) e vermifugação frequente. Use apenas ração para filhotes, que tem os nutrientes certos para o crescimento. Socialize seu pet com outros animais e pessoas assim que o veterinário liberar!",
         "contexto": null
    },
    "castrar": {
        "resposta": "A **castração** é um procedimento muito recomendado! Em fêmeas, previne infecção uterina (piometra) e câncer de mama. Em machos, reduz a frustração sexual, fugas e marcação de território. É um ato de saúde e responsabilidade.",
        "contexto": null
    },
    "castração": {
        "resposta": "A **castração** é um procedimento muito recomendado! Em fêmeas, previne infecção uterina (piometra) e câncer de mama. Em machos, reduz a frustração sexual, fugas e marcação de território. É um ato de saúde e responsabilidade.",
        "contexto": null
    },
    "dente": {
        "resposta": "A saúde dental é crucial! O acúmulo de **tártaro** (placa bacteriana) pode causar mau hálito, dor e até a queda de dentes. Em casos graves, as bactérias podem cair na corrente sanguínea e afetar o coração e os rins. Escove os dentes do seu pet regularmente e converse com um veterinário sobre a necessidade de uma limpeza (tartarectomia).",
        "contexto": null
    },
    "tartaro": {
        "resposta": "A saúde dental é crucial! O acúmulo de **tártaro** (placa bacteriana) pode causar mau hálito, dor e até a queda de dentes. Em casos graves, as bactérias podem cair na corrente sanguínea e afetar o coração e os rins. Escove os dentes do seu pet regularmente e converse com um veterinário sobre a necessidade de uma limpeza (tartarectomia).",
        "contexto": null
    },
    "vermifugo": {
        "resposta": "O **vermífugo** (remédio de verme) é essencial! Filhotes tomam várias doses. Adultos devem ser vermifugados, em média, a cada 3 a 6 meses, dependendo do estilo de vida (se passeiam muito na rua, etc.). Vermes podem causar diarreia, anemia e até problemas mais sérios.",
        "contexto": null
    },
    "verme": {
        "resposta": "O **vermífugo** (remédio de verme) é essencial! Filhotes tomam várias doses. Adultos devem ser vermifugados, em média, a cada 3 a 6 meses, dependendo do estilo de vida (se passeiam muito na rua, etc.). Vermes podem causar diarreia, anemia e até problemas mais sérios.",
        "contexto": null
    },
    "pulga": {
        "resposta": "Pulgas são muito irritantes! Além da coceira, elas podem transmitir vermes e causar alergias (Dermatite Alérgica à Picada de Pulga - DAPP). É essencial usar um antipulgas (pipeta, comprimido ou coleira) recomendado pelo seu veterinário.",
        "contexto": null
    },
    "carrapato": {
        "resposta": "Muito cuidado! **Carrapatos** são perigosos. Eles transmitem a **Doença do Carrapato** (Erliquiose e Babesiose), que é grave e pode ser fatal. Use um carrapaticida recomendado pelo seu veterinário e sempre verifique o pelo do seu pet após passeios.",
        "contexto": null
    },
    "sarna": {
        "resposta": "Existem dois tipos principais de **sarna**: a Sarna Sarcóptica (que coça muito e **passa para humanos**) e a Sarna Demodécica (que geralmente não coça e não é contagiosa). Ambas precisam de tratamento veterinário.",
        "contexto": null
    },
    "banho": {
        "resposta": "A frequência do **banho** depende da raça e do estilo de vida. Cães de pelo curto podem tomar banho a cada 30-60 dias. Cães de pelo longo podem precisar a cada 15 dias. Banhos em excesso removem a proteção natural da pele e podem causar problemas.",
        "contexto": null
    },
    "unha": {
        "resposta": "**Cortar as unhas** é importante. Unhas compridas podem machucar as patas e causar problemas de postura. Se você não se sentir seguro para cortar (cuidado para não cortar o 'sabugo' rosa, que sangra), peça para um veterinário ou profissional de banho e tosa fazer isso.",
        "contexto": null
    },
    "unhas": {
        "resposta": "**Cortar as unhas** é importante. Unhas compridas podem machucar as patas e causar problemas de postura. Se você não se sentir seguro para cortar (cuidado para não cortar o 'sabugo' rosa, que sangra), peça para um veterinário ou profissional de banho e tosa fazer isso.",
        "contexto": null
    },
    "remédio": {
        "resposta": "**Nunca** medique seu pet por conta própria. Remédios humanos (como Paracetamol, Dipirona ou Ibuprofeno) são **extremamente tóxicos** para eles. Use apenas medicamentos prescritos por um veterinário.",
        "contexto": null
    },
    "orelha": {
        "resposta": "A **limpeza de orelha** é importante para prevenir infecções (otite). Use apenas produtos específicos para limpeza de orelhas de pets (soluções de limpeza, nunca cotonete!). Se a orelha estiver muito vermelha, com cheiro forte ou se o pet balançar muito a cabeça, procure um veterinário.",
        "contexto": null
    },
    "ração": {
        "resposta": "Para **trocar a ração** do seu pet, faça isso de forma **gradual**! Misture a ração nova com a antiga por cerca de 7 dias, aumentando a proporção da nova a cada dia. Isso evita diarreia e vômito.",
        "contexto": null
    },
    "xixi": {
        "resposta": "Ensinar o local certo do **xixi** exige paciência! Use tapetes higiênicos ou jornais em um local fixo. Quando o pet acertar, faça **muita festa** e dê um petisco. Se ele errar, **não brigue** (ele não entende), apenas limpe com produtos que eliminam o odor (sem amônia) e tente de novo.",
        "contexto": null
    },
    "fogos": {
        "resposta": "**Medo de fogos** é muito comum. Tente abafar o som (feche janelas, ligue a TV). Crie um local seguro (uma casinha ou caixa) onde ele se sinta protegido. Existem medicamentos leves que o veterinário pode receitar para esses dias, mas nunca medique por conta própria.",
        "contexto": null
    },
    "latindo": {
        "resposta": "Cães latem por muitos motivos: tédio, ansiedade, medo ou para proteger o território. Tente identificar a causa. Certifique-se de que ele está passeando e gastando energia. Se for ansiedade de separação (latir quando fica sozinho), o processo é mais longo. **Nunca** grite, isso só piora.",
        "contexto": null
    },
    "caixa de areia": {
        "resposta": "Para **gatos**, a regra de ouro é: **uma caixa de areia por gato, mais uma extra**. (Ex: 2 gatos = 3 caixas). Mantenha a caixa limpa (remova os dejetos 1-2 vezes ao dia) e longe da comida e da água.",
        "contexto": null
    },
    "arranhador": {
        "resposta": "O **arranhador** é essencial para gatos! Afiar as unhas é um instinto natural. Ter arranhadores (de poste, de papelão) salva seus móveis. Se ele não usar, tente trocar o tipo ou o local. Borrife **catnip** no arranhador para atraí-lo.",
        "contexto": null
    },
    "envenenado": {
        "resposta": "**EMERGÊNCIA:** Se você suspeita que seu pet foi **envenenado**, ligue para o seu veterinário **IMEDIATAMENTE** e vá para a clínica. Não tente induzir o vômito ou dar leite, a menos que o veterinário mande.",
        "contexto": null
    },
    "morreu": {
        "resposta": "Eu sinto muito mesmo pela sua perda. Perder um companheiro é um momento incrivelmente difícil. 🖤",
        "contexto": null
    },
    "morrendo": {
        "resposta": "Se seu pet não está respirando bem ou parece estar morrendo, vá para a **emergência veterinária mais próxima IMEDIATAMENTE**.",
        "contexto": null
    },
    "ajuda": {
        "resposta": "Claro! Eu posso te ajudar com **Análise de Sintomas** (ex: 'meu pet está com tosse') ou **Dúvidas Gerais** (ex: 'o que é parvovirose?', 'o que é V10?', 'meu cachorro pode comer osso?').",
        "contexto": null
    },
    "o que você faz": {
        "resposta": "Eu sou o Assistente de Saúde Petcare+! Eu ajudo a analisar sintomas preliminares e tiro dúvidas sobre a saúde e o bem-estar do seu pet.",
        "contexto": null
    },
    "quem é você": {
        "resposta": "Eu sou o Assistente de Saúde Petcare+! Eu ajudo a analisar sintomas preliminares e tiro dúvidas sobre a saúde e o bem-estar do seu pet.",
        "contexto": null
    },
    "ola": {"resposta": `Olá! Como posso ajudar o ${petAtual ? petAtual.nome : 'seu pet'} hoje?`, "contexto": null},
    "oi": {"resposta": `Oi! Como posso ajudar o ${petAtual ? petAtual.nome : 'seu pet'} hoje?`, "contexto": null},
    "bom dia": {"resposta": `Bom dia! Como posso ajudar o ${petAtual ? petAtual.nome : 'seu pet'} hoje?`, "contexto": null},
    "boa tarde": {"resposta": `Boa tarde! Como posso ajudar o ${petAtual ? petAtual.nome : 'seu pet'} hoje?`, "contexto": null},
    "boa noite": {"resposta": `Boa noite! Como posso ajudar o ${petAtual ? petAtual.nome : 'seu pet'} hoje?`, "contexto": null},
    "obrigado": {"resposta": `De nada! Estou aqui para ajudar.`, "contexto": null},
    "obrigada": {"resposta": `De nada! Estou aqui para ajudar.`, "contexto": null},
    "valeu": {"resposta": `De nada! Estou aqui para ajudar.`, "contexto": null},
};
// ===============================================
// FIM DA BASE DE CONHECIMENTO
// ===============================================


// 4. Função de Logout
async function handleLogout() {
    console.log("Tentando fazer logout...");
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Erro ao sair:", error.message);
    } else {
        window.location.href = 'index.html';
    }
}

// 5. Verificador de Sessão (SEGURANÇA)
async function checkSession() {
    console.log("Verificando sessão...");
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        console.log("Ninguém logado. Redirecionando para login.");
        window.location.href = 'index.html';
    } else {
        console.log("Usuário logado:", session.user.email);
        usuarioLogado = session.user; 
        loadPets(); 
    }
}

// 6. Funções dos Modais (Genéricas)
function abrirModal(modalElement) {
    modalElement.classList.add('ativo'); 
}

function fecharTodosModais() {
    document.querySelectorAll('.modal-overlay.ativo').forEach(modal => {
        modal.classList.remove('ativo');
    });
    visualizadorConteudo.innerHTML = '';
}

// Funções específicas de abertura
async function abrirModalVacinas() {
    if (!petAtual) {
        alert("Cadastre um pet primeiro!");
        abrirModal(modalPetOverlay); 
        return;
    }
    tituloModalVacinas.textContent = `Calendário de Vacinas: ${petAtual.nome}`;
    await loadVacinas();
    abrirModal(modalVacinasOverlay);
}
async function abrirModalHistorico() {
    if (!petAtual) {
        alert("Cadastre um pet primeiro!");
        abrirModal(modalPetOverlay); 
        return;
    }
    tituloModalHistorico.textContent = `Histórico de Consultas: ${petAtual.nome}`;
    await loadHistorico();
    abrirModal(modalHistoricoOverlay);
}

async function abrirModalLembretes() {
    if (!petAtual) {
        alert("Cadastre um pet primeiro!");
        abrirModal(modalPetOverlay); 
        return;
    }
    tituloModalLembretes.textContent = `Lembretes: ${petAtual.nome}`;
    await loadLembretes();
    abrirModal(modalLembretesOverlay);
}

// (NOVO) Abrir Modal de Peso
async function abrirModalPeso() {
    if (!petAtual) {
        alert("Cadastre um pet primeiro!");
        abrirModal(modalPetOverlay); 
        return;
    }
    tituloModalPeso.textContent = `Controle de Peso: ${petAtual.nome}`;
    await loadPeso();
    abrirModal(modalPesoOverlay);
}

function abrirModalChat() {
    if (!petAtual) {
        alert("Cadastre um pet primeiro!");
        abrirModal(modalPetOverlay); 
        return;
    }
    const nomePet = petAtual ? petAtual.nome : "seu pet";
    chatTitulo.textContent = `Assistente de Saúde: ${nomePet}`;
    
    // Limpa o chat e adiciona a primeira mensagem
    chatJanela.innerHTML = '';
    chatContext = null; // Reseta o contexto
    adicionarMensagemChat(`Olá! Sou o assistente do ${nomePet}. Posso ajudar com duas coisas:
    1.  **Análise de Sintomas** (Ex: "meu cachorro está com vômito")
    2.  **Dúvidas Gerais** (Ex: "meu cachorro pode comer uva?")
    
    Sobre o que você quer falar?`, 'bot');
    
    abrirModal(modalChatOverlay);
    chatInput.focus();
}

function abrirModalVisualizador(url, titulo) {
    visualizadorTitulo.textContent = titulo;
    visualizadorConteudo.innerHTML = '';

    if (url.toLowerCase().endsWith('.pdf')) {
        const embed = document.createElement('embed');
        embed.src = url;
        embed.type = 'application/pdf';
        visualizadorConteudo.appendChild(embed);
    } else if (url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg') || url.toLowerCase().endsWith('.webp')) {
        const img = document.createElement('img');
        img.src = url;
        visualizadorConteudo.appendChild(img);
    } else {
        visualizadorConteudo.innerHTML = `<p>Não é possível pré-visualizar este arquivo. <a href="${url}" target="_blank">Clique aqui para baixar</a>.</p>`;
    }
    
    abrirModal(modalVisualizadorOverlay);
}


// 7. (ATUALIZADO) Função de Carregar Pets
async function loadPets() {
    if (!usuarioLogado) return; 

    console.log("Carregando pets...");
    
    let { data: pets, error } = await supabaseClient
        .from('pets') 
        .select('*') 
        .eq('owner_id', usuarioLogado.id); 

    if (error) {
        console.error("Erro ao carregar pets:", error.message);
        return;
    }

    console.log("Pets carregados:", pets);
    todosOsPets = pets; 
    listaPetsUl.innerHTML = ''; 
    
    if (pets.length > 0) {
        let petAtivoEncontrado = pets.find(p => petAtual && p.id === petAtual.id);
        if (!petAtivoEncontrado) {
            petAtual = pets[0];
        }
        
        h2TituloPainel.textContent = `Painel do ${petAtual.nome}`;

        pets.forEach(pet => {
            const li = document.createElement('li');
            li.className = 'lista-pets-item'; 
            
            if (pet.id === petAtual.id) {
                li.classList.add('ativo');
            }
            
            const span = document.createElement('span');
            span.textContent = `${pet.nome} (${pet.especie} - ${pet.raca || 'SRD'})`;
            span.className = 'pet-nome-clicavel'; 
            span.dataset.petId = pet.id; 
            li.appendChild(span);

            const divIcones = document.createElement('div');
            const iconEdit = document.createElement('i');
            iconEdit.className = 'fa-solid fa-pencil lapis-pet-editar'; 
            iconEdit.dataset.petId = pet.id;
            divIcones.appendChild(iconEdit);

            const iconDelete = document.createElement('i');
            iconDelete.className = 'fa-solid fa-trash lixeira-pet'; 
            iconDelete.dataset.petId = pet.id; 
            divIcones.appendChild(iconDelete);

            li.appendChild(divIcones);
            listaPetsUl.appendChild(li);
        });
        
    } else {
        petAtual = null; 
        h2TituloPainel.textContent = 'Painel de Pets';
        listaPetsUl.innerHTML = '<li>Nenhum pet cadastrado ainda.</li>';
    }
    
    // (ATUALIZADO) Carrega dados do pet atual se os modais estiverem abertos
    if (document.getElementById('modal-lembretes-overlay').classList.contains('ativo')) {
        loadLembretes();
    }
    // (NOVO)
    if (document.getElementById('modal-peso-overlay').classList.contains('ativo')) {
        loadPeso();
    }
}

// 8. Função de Salvar Pet
async function handleSalvarPet(event) {
    event.preventDefault(); 
    const nome = document.getElementById('pet-nome').value;
    const especie = document.getElementById('pet-especie').value;
    const raca = document.getElementById('pet-raca').value;
    const nascimento = document.getElementById('pet-nascimento').value;
    const petId = document.getElementById('pet-id-edicao').value;
    
    if (!usuarioLogado) {
        alert("Erro: Usuário não está logado.");
        return;
    }

    let error;

    if (petId) {
        console.log(`Atualizando pet com ID: ${petId}`);
        const { error: updateError } = await supabaseClient
            .from('pets')
            .update({ 
                nome: nome,
                especie: especie,
                raca: raca,
                data_nascimento: nascimento
            })
            .eq('id', petId)
            .eq('owner_id', usuarioLogado.id);
        error = updateError;
        
    } else {
        console.log("Salvando novo pet...");
        const { error: insertError } = await supabaseClient
            .from('pets')
            .insert([{ 
                owner_id: usuarioLogado.id, 
                nome: nome,
                especie: especie,
                raca: raca,
                data_nascimento: nascimento
            }]);
        error = insertError;
    }
        
    if (error) {
        console.error("Erro ao salvar pet:", error.message);
        alert("Erro ao salvar: " + error.message);
    } else {
        console.log("Pet salvo com sucesso!");
        formPet.reset(); 
        fecharTodosModais(); 
        loadPets(); 
    }
}

// 9. Função de DELETAR Pet
async function handleDeletarPet(petId) {
    if (!confirm("Tem certeza que quer excluir este pet? Esta ação não pode ser desfeita e vai apagar TODAS as vacinas e históricos ligados a ele.")) {
        return;
    }
    
    console.log(`Deletando pet com ID: ${petId}`);

    const { error } = await supabaseClient
        .from('pets')
        .delete()
        .eq('id', petId);
        
    if (error) {
        console.error("Erro ao deletar pet:", error.message);
        alert("Erro ao deletar o pet: " + error.message);
    } else {
        console.log("Pet deletado com sucesso.");
        if (petAtual && petAtual.id == petId) {
            petAtual = null;
        }
        loadPets(); 
    }
}

// 10. Função de SELECIONAR Pet
function handleSelecionarPet(petId) {
    const petIdNum = parseInt(petId, 10);
    const petSelecionado = todosOsPets.find(p => p.id === petIdNum);

    if (petSelecionado) {
        petAtual = petSelecionado; 
        h2TituloPainel.textContent = `Painel do ${petAtual.nome}`; 
        console.log(`Pet ativo mudado para: ${petAtual.nome}`);
        loadPets(); 
        fecharTodosModais(); 
    }
}

// 11. Função de EDITAR Pet
function handleEditarPet(petId) {
    const petIdNum = parseInt(petId, 10);
    const petParaEditar = todosOsPets.find(p => p.id === petIdNum);

    if (petParaEditar) {
        console.log("Editando pet:", petParaEditar.nome);
        document.getElementById('pet-nome').value = petParaEditar.nome;
        document.getElementById('pet-especie').value = petParaEditar.especie;
        document.getElementById('pet-raca').value = petParaEditar.raca;
        document.getElementById('pet-nascimento').value = petParaEditar.data_nascimento;
        petIdEdicao.value = petParaEditar.id;
        tituloModalPet.textContent = `Editando: ${petParaEditar.nome}`;
        btnSalvarPet.textContent = 'Atualizar Pet';
    }
}

function resetarFormPet() {
    formPet.reset();
    petIdEdicao.value = ''; 
    tituloModalPet.textContent = 'Adicionar Novo Pet';
    btnSalvarPet.textContent = 'Salvar Pet';
}


// 12. Funções de Vacinas
async function loadVacinas() {
    if (!petAtual) return; 
    console.log(`Carregando vacinas para o pet_id: ${petAtual.id}`);
    let { data: vacinas, error } = await supabaseClient
        .from('historico_saude') 
        .select('*')
        .eq('pet_id', petAtual.id) 
        .eq('tipo_evento', 'Vacina') 
        .order('data_vencimento', { ascending: true }); 
    if (error) {
        console.error("Erro ao carregar vacinas:", error.message);
        return;
    }
    console.log("Vacinas carregadas:", vacinas);
    listaVacinasUl.innerHTML = ''; 
    if (vacinas.length > 0) {
        vacinas.forEach(vacina => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${vacina.nome_evento}</strong>
                <span>Vence em: ${new Date(vacina.data_vencimento).toLocaleDateString('pt-BR')}</span>
            `;
            listaVacinasUl.appendChild(li);
        });
    } else {
        listaVacinasUl.innerHTML = '<li>Nenhuma vacina registrada para este pet.</li>';
    }
}

async function handleSalvarVacina(event) {
    event.preventDefault();
    if (!petAtual) {
        alert("Erro: Nenhum pet selecionado.");
        return;
    }
    const nome = document.getElementById('vacina-nome').value;
    const dataAplicacao = document.getElementById('vacina-data-aplicacao').value;
    const dataVencimento = document.getElementById('vacina-data-vencimento').value;
    console.log("Salvando vacina...");
    const { data, error } = await supabaseClient
        .from('historico_saude')
        .insert([{
            pet_id: petAtual.id,
            tipo_evento: 'Vacina', 
            nome_evento: nome,
            data_aplicacao: dataAplicacao,
            data_vencimento: dataVencimento
        }]);
    if (error) {
        console.error("Erro ao salvar vacina:", error.message);
        alert("Erro ao salvar: " + error.message);
    } else {
        console.log("Vacina salva!", data);
        formVacina.reset(); 
        loadVacinas(); 
    }
}

// 13. Funções de Histórico
async function loadHistorico() {
    if (!petAtual) return;
    console.log(`Carregando histórico para o pet_id: ${petAtual.id}`);
    let { data: historico, error } = await supabaseClient
        .from('historico_saude') 
        .select('*')
        .eq('pet_id', petAtual.id) 
        .neq('tipo_evento', 'Vacina') 
        .order('data_aplicacao', { ascending: false }); 
    if (error) {
        console.error("Erro ao carregar histórico:", error.message);
        return;
    }

    console.log("Histórico carregado:", historico);
    listaHistoricoUl.innerHTML = ''; 
    if (historico.length > 0) {
        historico.forEach(item => {
            const li = document.createElement('li');
            const divInfo = document.createElement('div');
            divInfo.className = 'historico-info';
            divInfo.innerHTML = `
                <strong>${item.tipo_evento}: ${item.nome_evento}</strong>
                <span>Data: ${new Date(item.data_aplicacao).toLocaleDateString('pt-BR')}</span>
            `;
            li.appendChild(divInfo);
            if (item.arquivo_url) {
                const linkExame = document.createElement('a');
                linkExame.href = item.arquivo_url;
                linkExame.textContent = 'Ver Exame';
                linkExame.className = 'link-exame';
                linkExame.dataset.titulo = `${item.tipo_evento}: ${item.nome_evento}`; 
                li.appendChild(linkExame);
            }
            listaHistoricoUl.appendChild(li);
        });
    } else {
        listaHistoricoUl.innerHTML = '<li>Nenhum registro (consulta, exame, etc.) encontrado.</li>';
    }
}

async function handleSalvarHistorico(event) {
    event.preventDefault();
    if (!petAtual) {
        alert("Erro: Nenhum pet selecionado.");
        return;
    }
    const tipo = document.getElementById('historico-tipo').value;
    const nome = document.getElementById('historico-nome').value;
    const dataAplicacao = document.getElementById('historico-data').value;
    const arquivo = document.getElementById('historico-arquivo').files[0];
    let urlDoArquivo = null;

    console.log("Salvando registro de histórico...");
    
    try {
        if (arquivo) {
            console.log("Fazendo upload do arquivo...");
            const nomeArquivo = `${usuarioLogado.id}/${petAtual.nome}-${Date.now()}.${arquivo.name.split('.').pop()}`;
            const { data: uploadData, error: uploadError } = await supabaseClient.storage.from('exames').upload(nomeArquivo, arquivo);
            if (uploadError) throw uploadError; 
            const { data: urlData } = supabaseClient.storage.from('exames').getPublicUrl(uploadData.path);
            urlDoArquivo = urlData.publicUrl;
            console.log("Upload bem-sucedido:", urlDoArquivo);
        }
        const { data, error } = await supabaseClient.from('historico_saude').insert([{
            pet_id: petAtual.id,
            tipo_evento: tipo, 
            nome_evento: nome, 
            data_aplicacao: dataAplicacao,
            arquivo_url: urlDoArquivo 
        }]);
        if (error) throw error; 
        console.log("Registro salvo!", data);
        formHistorico.reset(); 
        loadHistorico(); 
    } catch (error) {
        console.error("Erro ao salvar histórico (upload ou DB):", error.message);
        alert("Erro ao salvar: " + error.message);
    }
}

// 14. Funções de Lembretes
async function loadLembretes() {
    if (!petAtual) {
        listaLembretesUl.innerHTML = '<li>Nenhum pet selecionado.</li>';
        return;
    } 
    console.log(`Carregando lembretes para o pet_id: ${petAtual.id}`);
    let { data: lembretes, error } = await supabaseClient
        .from('lembretes') 
        .select('*')
        .eq('pet_id', petAtual.id) 
        .eq('concluido', false) 
        .order('data_lembrete', { ascending: true }); 

    if (error) {
        console.error("Erro ao carregar lembretes:", error.message);
        return;
    }
    console.log("Lembretes carregados:", lembretes);
    listaLembretesUl.innerHTML = ''; 
    if (lembretes.length > 0) {
        lembretes.forEach(item => {
            const li = document.createElement('li');
            const divInfo = document.createElement('div');
            divInfo.className = 'lembrete-info';
            const spanTitulo = document.createElement('strong');
            spanTitulo.textContent = item.titulo;
            const spanData = document.createElement('span');
            spanData.className = 'lembrete-data';
            const dataFormatada = new Date(item.data_lembrete).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            spanData.textContent = `Data: ${dataFormatada}`;
            divInfo.appendChild(spanTitulo);
            divInfo.appendChild(spanData);
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-trash lixeira-lembrete'; 
            icon.dataset.lembreteId = item.id; 
            li.appendChild(divInfo);
            li.appendChild(icon);
            listaLembretesUl.appendChild(li);
        });
    } else {
        listaLembretesUl.innerHTML = '<li>Nenhum lembrete pendente.</li>';
    }
}

async function handleSalvarLembrete(event) {
    event.preventDefault();
    if (!petAtual) {
        alert("Erro: Nenhum pet selecionado.");
        return;
    }
    const dataLembreteInput = document.getElementById('lembrete-data').value;
    const dataLembrete = new Date(dataLembreteInput).toISOString(); 
    const titulo = document.getElementById('lembrete-titulo').value;
    console.log("Salvando lembrete...");
    const { data, error } = await supabaseClient.from('lembretes').insert([{
        pet_id: petAtual.id,
        titulo: titulo,
        data_lembrete: dataLembrete 
    }]);
    if (error) {
        console.error("Erro ao salvar lembrete:", error.message);
        alert("Erro ao salvar: " + error.message);
    } else {
        console.log("Lembrete salvo!", data);
        formLembrete.reset(); 
        loadLembretes(); 
    }
}

async function handleDeletarLembrete(lembreteId) {
    if (!confirm("Tem certeza que quer excluir este lembrete?")) {
        return;
    }
    console.log(`Deletando lembrete com ID: ${lembreteId}`);
    const { error } = await supabaseClient.from('lembretes').delete().eq('id', lembreteId);
    if (error) {
        console.error("Erro ao deletar lembrete:", error.message);
        alert("Erro ao deletar: " + error.message);
    } else {
        console.log("Lembrete deletado.");
        loadLembretes(); 
    }
}

// (NOVO) --- Funções de Controle de Peso ---
async function loadPeso() {
    if (!petAtual) {
        listaPesoUl.innerHTML = '<li>Nenhum pet selecionado.</li>';
        return;
    }
    console.log(`Carregando peso para o pet_id: ${petAtual.id}`);
    let { data: pesos, error } = await supabaseClient
        .from('peso_log')
        .select('*')
        .eq('pet_id', petAtual.id)
        .order('data_medicao', { ascending: false }); // Mais recente primeiro

    if (error) {
        console.error("Erro ao carregar pesos:", error.message);
        return;
    }

    listaPesoUl.innerHTML = '';
    if (pesos && pesos.length > 0) {
        pesos.forEach(p => {
            const li = document.createElement('li');
            
            const divInfo = document.createElement('div');
            divInfo.className = 'lembrete-info'; // Reusa o estilo
            
            const spanPeso = document.createElement('strong');
            spanPeso.textContent = `${p.peso_kg} kg`;
            
            const spanData = document.createElement('span');
            spanData.className = 'lembrete-data';
            // Ajuste simples de data (YYYY-MM-DD)
            const dataFormatada = p.data_medicao.split('T')[0].split('-').reverse().join('/');
            spanData.textContent = `Data: ${dataFormatada}`;
            
            divInfo.appendChild(spanPeso);
            divInfo.appendChild(spanData);
            
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-trash lixeira-peso';
            icon.dataset.pesoId = p.id;
            
            li.appendChild(divInfo);
            li.appendChild(icon);
            listaPesoUl.appendChild(li);
        });
    } else {
        listaPesoUl.innerHTML = '<li>Nenhum registro de peso.</li>';
    }
}

async function handleSalvarPeso(event) {
    event.preventDefault();
    if (!petAtual) return alert("Selecione um pet!");
    
    const peso = document.getElementById('peso-kg').value;
    const data = document.getElementById('peso-data').value;

    const { error } = await supabaseClient.from('peso_log').insert([{
        pet_id: petAtual.id,
        peso_kg: peso,
        data_medicao: data
    }]);

    if (error) {
        console.error("Erro ao salvar peso:", error.message);
        alert("Erro ao salvar.");
    } else {
        formPeso.reset();
        loadPeso();
    }
}

async function handleDeletarPeso(id) {
    if (!confirm("Excluir registro?")) return;
    const { error } = await supabaseClient.from('peso_log').delete().eq('id', id);
    if (error) alert("Erro ao deletar.");
    else loadPeso();
}


// 15. Funções do Chatbot (PLANO B)
function adicionarMensagemChat(mensagem, tipo, classesExtras = '') {
    const div = document.createElement('div');
    mensagem = mensagem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    div.innerHTML = mensagem; 
    div.classList.add('chat-msg'); 
    div.classList.add(tipo === 'user' ? 'chat-msg-user' : 'chat-msg-bot'); 
    if (classesExtras) div.classList.add(classesExtras);
    chatJanela.appendChild(div);
    chatJanela.scrollTop = chatJanela.scrollHeight;
}

function handleEnvioChat(event) {
    event.preventDefault();
    const mensagem = chatInput.value;
    if (mensagem.trim() === '') return; 
    adicionarMensagemChat(mensagem, 'user');
    chatInput.value = ''; 
    const resposta = handleChatBot(mensagem);
    setTimeout(() => { adicionarMensagemChat(resposta, 'bot'); }, 500);
}

function handleChatBot(mensagem) {
    const msgLower = mensagem.toLowerCase();
    let resposta = `Desculpe, não entendi. Tente descrever um sintoma (como 'vômito') ou uma dúvida (como 'uva'). Digite 'ajuda' para ver a lista de tópicos.`;
    let respostaEncontrada = false;
    if (chatContext) {
        if (chatContext === 'aguardando_sangue_vomito') {
            if (msgLower.includes("sim")) {
                resposta = "**ATENÇÃO:** Vômito com sangue é uma emergência. Por favor, procure um veterinário **imediatamente**.";
                chatContext = null; 
                respostaEncontrada = true;
            } else if (msgLower.includes("nao") || msgLower.includes("não")) {
                resposta = "Ok, sem sangue. Isso é bom. O vômito aconteceu mais de uma vez?";
                chatContext = null; 
                respostaEncontrada = true;
            } else {
                resposta = "Por favor, responda **Sim** ou **Não**. Havia sangue no vômito?";
                respostaEncontrada = true; 
            }
        }
    }
    if (!respostaEncontrada) {
        const todasAsChaves = Object.keys(knowledgeBase);
        for (const chave of todasAsChaves) {
            if (msgLower.includes(chave)) {
                const info = knowledgeBase[chave];
                resposta = info.resposta;
                chatContext = info.contexto; 
                respostaEncontrada = true;
                break; 
            }
        }
    }
    return resposta;
}


// 16. Adicionar os "escutadores" de eventos
checkSession(); 
btnSair.addEventListener('click', handleLogout);

// Modal de Pet
cardPerfilPet.addEventListener('click', () => {
    resetarFormPet();
    abrirModal(modalPetOverlay);
}); 
formPet.addEventListener('submit', handleSalvarPet); 
listaPetsUl.addEventListener('click', (event) => {
    if (event.target.classList.contains('lixeira-pet')) {
        handleDeletarPet(event.target.dataset.petId);
    }
    if (event.target.classList.contains('pet-nome-clicavel')) {
        handleSelecionarPet(event.target.dataset.petId);
    }
    if (event.target.classList.contains('lapis-pet-editar')) {
        handleEditarPet(event.target.dataset.petId);
    }
});

// Modal de Vacinas
cardCalendario.addEventListener('click', abrirModalVacinas);
formVacina.addEventListener('submit', handleSalvarVacina);

// Modal de Histórico
cardHistorico.addEventListener('click', abrirModalHistorico);
formHistorico.addEventListener('submit', handleSalvarHistorico);
listaHistoricoUl.addEventListener('click', (event) => {
    if (event.target.classList.contains('link-exame')) {
        event.preventDefault(); 
        const url = event.target.href;
        const titulo = event.target.dataset.titulo;
        abrirModalVisualizador(url, titulo);
    }
});

// Modal de Lembretes
cardLembretes.addEventListener('click', abrirModalLembretes);
formLembrete.addEventListener('submit', handleSalvarLembrete);
listaLembretesUl.addEventListener('click', (event) => {
    if (event.target.classList.contains('lixeira-lembrete')) {
        handleDeletarLembrete(event.target.dataset.lembreteId);
    }
});

// (NOVO) Modal de Peso
cardPeso.addEventListener('click', abrirModalPeso);
formPeso.addEventListener('submit', handleSalvarPeso);
listaPesoUl.addEventListener('click', (event) => {
    if (event.target.classList.contains('lixeira-peso')) {
        handleDeletarPeso(event.target.dataset.pesoId);
    }
});

// Modal de Chat
cardAssistente.addEventListener('click', abrirModalChat);
chatForm.addEventListener('submit', handleEnvioChat);


// Fechar Modais
btnsFecharModal.forEach(btn => {
    btn.addEventListener('click', fecharTodosModais);
});
[modalPetOverlay, modalVacinasOverlay, modalHistoricoOverlay, modalChatOverlay, modalLembretesOverlay, modalVisualizadorOverlay, modalPesoOverlay].forEach(modal => { 
    modal.addEventListener('click', (event) => {
        if (event.target === modal) { 
            fecharTodosModais();
        }
    });
});

// --- LÓGICA DO CHATBOT ---

// Intents e respostas do chatbot
const chatbotIntents = [
    {
        intent: "saudacao",
        examples: ["oi", "olá", "e aí", "bom dia"],
        response: "Olá! Como posso ajudar você e seu pet hoje? 😊"
    },
    {
        intent: "vacina",
        examples: ["vacina", "calendário de vacinas", "quando vacinar"],
        response: (petName) => `A próxima vacina do ${petName} está agendada para [data]. Verifique o calendário para mais detalhes.`
    },
    {
        intent: "brincadeira",
        examples: ["piada", "conta uma piada", "fala algo engraçado"],
        response: "Por que o cachorro não gosta de computador? Porque ele prefere um OSso! 🦴😂"
    },
    {
        intent: "alimentacao",
        examples: ["comida", "ração", "o que meu pet pode comer"],
        response: "Evite chocolate, cebola e uva! Para dicas personalizadas, consulte o histórico de alimentação do seu pet."
    },
    {
        intent: "despedida",
        examples: ["tchau", "adeus", "até logo"],
        response: "Até logo! Cuide bem do seu pet! 🐾"
    }
];

// Função para processar a mensagem do usuário
function processUserMessage(message, petName) {
    const normalizedMessage = message.toLowerCase();
    
    // Busca a intent correspondente
    const intent = chatbotIntents.find(intent =>
        intent.examples.some(example => normalizedMessage.includes(example))
    );
    
    if (intent) {
        return typeof intent.response === 'function' ? intent.response(petName) : intent.response;
    } else {
        return "Não entendi. Pode repetir ou tentar perguntar de outra forma?";
    }
}

// Função para buscar dados de vacinas no Supabase
async function fetchPetVaccineSchedule(petId) {
    try {
        const { data, error } = await supabaseClient
            .from('vacinas')
            .select('data_proxima')
            .eq('pet_id', petId)
            .single();

        if (error) throw error;
        return data.data_proxima;
    } catch (error) {
        console.error("Erro ao buscar vacinas:", error);
        return "[data não disponível]";
    }
}

// Função para exibir a resposta do chatbot
function displayChatbotResponse(response) {
    const chatbotResponseDiv = document.getElementById('chatbot-responses');
    if (chatbotResponseDiv) {
        chatbotResponseDiv.innerHTML += `<p><strong>Chatbot:</strong> ${response}</p>`;
    }
}

// Evento para processar a entrada do usuário
document.getElementById('chatbot-input')?.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const message = e.target.value;
        const petName = "Ceni"; // Substitua pela variável dinâmica do seu pet
        let response = processUserMessage(message, petName);

        // Se a resposta exigir dados do Supabase
        if (message.toLowerCase().includes("vacina")) {
            const nextVaccine = await fetchPetVaccineSchedule("ID_DO_PET"); // Substitua pelo ID real
            response = response.replace("[data]", nextVaccine);
        }

        displayChatbotResponse(response);
        e.target.value = "";
    }
});
