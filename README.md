# 🐾 Petcare+ | Saúde Animal Proativa

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-brightgreen) ![Tecnologia](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue) ![Backend](https://img.shields.io/badge/Backend-Supabase-emerald)

> **"Do cuidado reativo ao proativo."**

O **Petcare+** é uma plataforma web completa para gestão de saúde de animais de estimação. O objetivo é centralizar o histórico médico, vacinas e rotina do pet em um único lugar, substituindo as antigas carteirinhas de papel e evitando a perda de informações cruciais.

---

## 📱 Funcionalidades

O sistema conta com um **Painel de Controle Dinâmico** que se adapta ao pet selecionado, oferecendo 6 módulos principais:

### 1. 🏥 Gestão de Pets (CRUD)
- Cadastro completo de múltiplos pets.
- Edição de dados (com ícone de lápis) e exclusão de perfis (lixeira).
- Seleção inteligente: ao clicar no nome do pet, todo o painel carrega os dados *daquele* animal específico.

### 2. 💉 Calendário de Vacinas
- Registro de vacinas aplicadas e datas de revacinação.
- Visualização rápida das próximas doses.

### 3. 📂 Histórico Médico com Upload
- Registro de consultas, exames e cirurgias.
- **Upload de Arquivos:** Permite anexar PDFs ou imagens de exames diretamente no histórico (armazenado no Supabase Storage).
- **Visualizador Integrado:** Visualização dos exames dentro da própria plataforma em um modal exclusivo, sem necessidade de download.

### 4. 🔔 Lembretes Personalizados
- Criação de alertas para medicamentos, banho, tosa, etc.
- Sistema de exclusão rápida.

### 5. ⚖️ Controle de Peso
- Monitoramento da evolução do peso do animal.
- Histórico de pesagens com data, permitindo acompanhar o crescimento ou dieta.



### 6. 🤖 Assistente de Saúde (Chatbot)
- Um bot inteligente treinado com uma base de conhecimento veterinária interna (sem APIs externas).
- Responde a dezenas de dúvidas sobre **sintomas** (vômito, febre, apatia), **alimentos proibidos** (uva, chocolate, xilitol) e **cuidados gerais**.
- Capaz de identificar palavras-chave, entender contexto e orientar o tutor sobre quando procurar um veterinário.

### 🌟 Extras
- **Páginas Institucionais:** "Quem Somos" (com a história e equipe) e "Dicas de Saúde".
- **Design Responsivo:** Interface amigável, pensada na experiência do usuário.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3 (Layout Grid/Flexbox), JavaScript (Vanilla ES6+).
* **Back-end & Database:** [Supabase](https://supabase.com/) (PostgreSQL).
* **Armazenamento (Storage):** Supabase Storage (para arquivos de exames).
* **Autenticação:** Supabase Auth (E-mail/Senha).
* **Ícones:** FontAwesome.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Uma conta no [Supabase](https://supabase.com/).
- Navegador moderno.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/petcare-projeto.git](https://github.com/SEU-USUARIO/petcare-projeto.git)
    ```
2.  **Configure o Supabase:**
    - Crie um projeto no Supabase.
    - Execute os scripts SQL para criar as tabelas: `pets`, `historico_saude`, `lembretes`, `peso_log`, `nutricao_log`.
    - Crie os Buckets de Storage públicos chamados `exames` e `fotos-pets`.
3.  **Configure as Chaves:**
    - Crie um arquivo `config.js` na raiz do projeto.
    - Adicione suas chaves do Supabase:
    ```javascript
    const SUPABASE_URL = 'SUA_URL_AQUI';
    const SUPABASE_KEY = 'SUA_KEY_ANON_AQUI';
    ```
4.  **Execute:**
    - Abra o arquivo `index.html` no seu navegador (ou use uma extensão como *Live Server* no VS Code).

---

## Projeto On
https://petcare-projeto.vercel.app/

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido para a Feira de Tecnologia.

* **Amanda de Oliveira** - CEO & Founder/Desenvolvedora
* **Micaelly Borges** - Desenvolvedora
* **Icaro Oliveira** - Desenvolvedor
* **Eduardo** - Desenvolvedor


---

## 📄 Licença

Este projeto é de uso acadêmico.
