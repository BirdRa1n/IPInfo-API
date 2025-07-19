# IPInfo API

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)

Uma API utilizando nodejs para obter informações de geolocalização baseadas em endereços IP, com autenticação de usuário, gerenciamento de chaves de API e controle de limites de requisição por plano.

## 📋 Tabela de Conteúdos

*   [Visão Geral](#-visão-geral)
*   [Funcionalidades](#-funcionalidades)
*   [Tecnologias Utilizadas](#-tecnologias-utilizadas)
*   [Configuração do Projeto](#-configuração-do-projeto)
    *   [Pré-requisitos](#pré-requisitos)
    *   [Variáveis de Ambiente](#variáveis-de-ambiente)
    *   [Instalação](#instalação)
    *   [Executando a Aplicação](#executando-a-aplicação)
*   [Estrutura do Projeto](#-estrutura-do-projeto)
*   [Endpoints da API](#-endpoints-da-api)
    *   [Autenticação de Usuário](#autenticação-de-usuário)
    *   [Gerenciamento de Chaves de API](#gerenciamento-de-chaves-de-api)
    *   [Informações de Localização por IP](#informações-de-localização-por-ip)
*   [Modelos de Banco de Dados](#-modelos-de-banco-de-dados)
*   [Middleware](#-middleware)
*   [Utilitários](#-utilitários)
*   [Licença](#-licença)
*   [Contribuição](#-contribuição)
*   [Contato](#-contato)

## 💡 Visão Geral

A IPInfo API oferece um serviço de geolocalização de IPs, permitindo que usuários autenticados gerenciem suas próprias chaves de API e consultem dados de localização. A API inclui um sistema de planos (Free e Unlimited) para controlar os limites de requisição e o número de chaves de API que um usuário pode criar.

## ✨ Funcionalidades

*   **Autenticação de Usuário:** Registro e login de usuários com JWT e cookies HTTP-only.
*   **Gerenciamento de Chaves de API:**
    *   Criação de chaves de API com nomes personalizados e datas de expiração opcionais.
    *   Listagem de chaves de API com detalhes de uso (requisições totais, diárias, mensais, anuais).
    *   Exclusão de chaves de API.
*   **Geolocalização por IP:** Consulta de informações detalhadas de localização para um endereço IP específico, utilizando o banco de dados MaxMind GeoLite2-City.
*   **Controle de Limites:** Implementação de limites de requisição (total, diário, mensal, anual) e de chaves de API com base no plano do usuário.
*   **Log de Requisições:** Registro detalhado de todas as requisições de API (sucesso/falha, IP, endpoint, chave de API, usuário).
*   **Configuração Inicial:** Criação automática de planos padrão ("Free" e "Unlimited") e um usuário administrador na inicialização.

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Node.js, Express.js
*   **Linguagem:** TypeScript
*   **Banco de Dados:** PostgreSQL
*   **ORM:** Sequelize
*   **Autenticação:** JWT, bcrypt
*   **Geolocalização:** MaxMind (GeoLite2-City)
*   **Outros:** `dotenv`, `cookie-parser`, `cors`, `axios`, `uuid`

## 🚀 Configuração do Projeto

Siga os passos abaixo para configurar e executar a API em seu ambiente local.

### Pré-requisitos

*   Node.js (versão 18 ou superior)
*   npm (gerenciador de pacotes do Node.js)
*   PostgreSQL (servidor de banco de dados)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt_aqui # Use uma string longa e aleatória
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=senha_segura_admin

DB_DATABASE=ipinfo_db
DB_USER=seu_usuario_db
DB_PASSWORD=sua_senha_db
DB_HOST=localhost
DB_PORT=5432
```

**Observações:**

*   `JWT_SECRET`: Essencial para a segurança dos tokens de autenticação. Gere uma string complexa.
*   `ADMIN_EMAIL` e `ADMIN_PASSWORD`: Credenciais para o usuário administrador que será criado automaticamente na inicialização.
*   As variáveis `DB_` são para a conexão com o banco de dados PostgreSQL.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/BirdRa1n/IPInfo.git
    cd IPInfo
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Compile o código TypeScript:**
    ```bash
    npm run build
    ```

### Executando a Aplicação

*   **Modo de Desenvolvimento (com `nodemon` para recarga automática):**
    ```bash
    npm run dev
    ```
*   **Modo de Produção (após `npm run build`):**
    ```bash
    npm start
    ```

A API estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

Na primeira execução, o banco de dados será sincronizado, os planos "Free" e "Unlimited" serão criados, e um usuário administrador será provisionado com as credenciais definidas no `.env`. O banco de dados GeoLite2-City.mmdb também será baixado automaticamente.

## 📁 Estrutura do Projeto

```
.
├── dist/                     # Saída dos arquivos TypeScript compilados
├── src/
│   ├── controllers/          # Lógica de negócio para cada endpoint
│   │   ├── keys/             # Operações CRUD para chaves de API
│   │   ├── location/         # Lógica para geolocalização
│   │   └── user/             # Autenticação e gerenciamento de usuário
│   ├── database/
│   │   ├── models/           # Definições dos modelos Sequelize
│   │   ├── database.ts       # Configuração da conexão com o banco de dados
│   │   └── GeoLite2-City.mmdb # Banco de dados MaxMind (baixado automaticamente)
│   ├── middleware/           # Funções de middleware (autenticação, validação)
│   ├── routes/               # Definição das rotas da API
│   ├── utils/                # Funções utilitárias (download DB, geolocalização)
│   └── index.ts              # Ponto de entrada da aplicação
├── .env.example              # Exemplo de arquivo de variáveis de ambiente
├── package.json              # Metadados do projeto e dependências
├── package-lock.json         # Bloqueio de dependências
└── tsconfig.json             # Configurações do TypeScript
```

## ⚡ Endpoints da API

A API utiliza autenticação baseada em cookies para rotas de usuário e chaves de API (Bearer Token) para rotas de serviço.

### Autenticação de Usuário

*   **`POST /api/user/singup`**
    *   **Descrição:** Registra um novo usuário com o plano "Free" padrão.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
            "name": "Nome do Usuário",
            "email": "email@example.com",
            "password": "senha_segura_aqui"
        }
        ```
    *   **Respostas:**
        *   `201 Created`: `{ "message": "Account created successfully", "user": { "name": "...", "email": "..." } }`
        *   `400 Bad Request`: `{ "error": "..." }` (e.g., email já em uso, senha fraca)
        *   `500 Internal Server Error`

*   **`POST /api/user/auth`**
    *   **Descrição:** Autentica um usuário e retorna um cookie `token` HTTP-only.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
            "email": "email@example.com",
            "password": "senha_segura_aqui"
        }
        ```
    *   **Respostas:**
        *   `200 OK`: `{ "message": "Authentication successful" }` (com cookie `token` setado)
        *   `400 Bad Request`: `{ "message": "Email and password are required" }`
        *   `401 Unauthorized`: `{ "message": "Invalid password" }`
        *   `404 Not Found`: `{ "message": "User not found" }`
        *   `500 Internal Server Error`

*   **`GET /api/user`**
    *   **Descrição:** Obtém os detalhes do usuário autenticado, incluindo suas chaves de API e informações do plano. Requer o cookie `token`.
    *   **Respostas:**
        *   `200 OK`: Retorna o objeto `User` com `ApiKeys` e `Plan` associados.
        *   `401 Unauthorized`: `{ "message": "Unauthorized" }`
        *   `404 Not Found`: `{ "message": "User not found" }`
        *   `500 Internal Server Error`

### Gerenciamento de Chaves de API

Todas as rotas abaixo requerem que o usuário esteja autenticado via cookie `token`.

*   **`POST /api/keys`**
    *   **Descrição:** Cria uma nova chave de API para o usuário autenticado.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
            "name": "Minha Chave de Teste",
            "expiresInDays": 30  // Opcional: número de dias para expiração. Se omitido, não expira.
        }
        ```
    *   **Respostas:**
        *   `201 Created`: `{ "message": "API Key created successfully", "apiKey": { "id": "...", "name": "...", "createdAt": "...", "expiresAt": "...", "preview": "...", "fullKey": "..." (apenas em dev) }, "limits": { "total": "...", "remaining": "..." } }`
        *   `400 Bad Request`: `{ "message": "API Key name is required...", "field": "name" }`
        *   `401 Unauthorized`: `{ "message": "User authentication required" }`
        *   `403 Forbidden`: `{ "message": "Maximum API keys limit reached...", "limit": "...", "current": "..." }`
        *   `500 Internal Server Error`

*   **`GET /api/keys`**
    *   **Descrição:** Lista todas as chaves de API do usuário autenticado, incluindo o uso atual e os limites do plano.
    *   **Respostas:**
        *   `200 OK`: `[ { "key": "...", "createdAt": "...", "limits": { "total": { "current": "...", "max": "..." }, "perDay": { "current": "...", "max": "..." }, "perMonth": { "current": "...", "max": "..." }, "perYear": { "current": "...", "max": "..." } } } ]`
        *   `200 OK`: `{ "message": "No API Keys found for this user", "apiKeys": [] }`
        *   `401 Unauthorized`: `{ "message": "User authentication required" }`
        *   `500 Internal Server Error`

*   **`DELETE /api/keys/:key`**
    *   **Descrição:** Deleta uma chave de API específica do usuário autenticado.
    *   **Parâmetros de Rota:**
        *   `:key` (string): A chave de API a ser deletada.
    *   **Respostas:**
        *   `200 OK`: `{ "message": "API Key deleted successfully." }`
        *   `401 Unauthorized`: `{ "message": "User authentication required" }`
        *   `404 Not Found`: `{ "message": "API Key not found or does not belong to the authenticated user." }`
        *   `500 Internal Server Error`

### Informações de Localização por IP

*   **`GET /api/location/:ip`**
    *   **Descrição:** Retorna informações de geolocalização para o endereço IP fornecido. Requer autenticação via `Bearer Token` (chave de API).
    *   **Cabeçalhos da Requisição:**
        *   `Authorization: Bearer SEU_API_KEY`
    *   **Parâmetros de Rota:**
        *   `:ip` (string): O endereço IP a ser consultado.
    *   **Respostas:**
        *   `200 OK`: Retorna um objeto JSON com os dados de localização (e.g., `{ "city": { "names": { "en": "..." } }, "country": { "names": { "en": "..." } }, ... }`).
        *   `401 Unauthorized`: `{ "message": "API Key is required" }`, `{ "message": "Malformed authorization header..." }`, `{ "message": "Invalid or revoked API Key" }`, `{ "message": "API Key has expired" }`
        *   `429 Too Many Requests`: `{ "message": "Daily/Monthly request limit exceeded", "limit": "...", "remaining": "..." }`
        *   `500 Internal Server Error`

## 🗄️ Modelos de Banco de Dados

Os modelos Sequelize definem a estrutura das tabelas no banco de dados:

*   **`User`**: Informações do usuário (nome, email, hash da senha, plano).
*   **`Plan`**: Detalhes dos planos de serviço (nome, preço, limites de requisição e chaves de API).
*   **`ApiKey`**: Chaves de API geradas pelos usuários (chave, status, usuário associado, data de criação/expiração).
*   **`Session`**: Sessões de login do usuário (token JWT, ID do usuário).
*   **`Admin`**: Tabela para identificar usuários administradores.
*   **`RequestLog`**: Registros de todas as requisições feitas à API (chave de API, usuário, IP, endpoint, sucesso/falha, mensagem de erro).

## 🧩 Middleware

*   **`authenticateUser.ts`**: Verifica a autenticação do usuário via cookie JWT. Anexa o objeto `User` à requisição.
*   **`authenticateApiKey.ts`**: Verifica a autenticação via `Bearer Token` (chave de API). Valida a chave, verifica a expiração e os limites de requisição do plano do usuário. Anexa o objeto `ApiKey` e `User` (associado à chave) à requisição e registra a requisição no `RequestLog`.

## 🔧 Utilitários

*   **`downloadDatabase.ts`**: Baixa e descompacta o banco de dados GeoLite2-City.mmdb da MaxMind, se ainda não existir.
*   **`getLocationByIp.ts`**: Utiliza o banco de dados MaxMind para obter informações de geolocalização para um IP.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues para bugs ou sugestões, ou enviar pull requests.

## 📧 Contato

Para dúvidas ou suporte, entre em contato com Dário Jr:

*   GitHub: [@BirdRa1n](https://github.com/BirdRa1n)
*   Email: birdra1n@proton.me
