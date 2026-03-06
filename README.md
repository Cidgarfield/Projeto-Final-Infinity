# 🦇 Projeto Final Sidnei — Indústrias Wayne

Sistema web inspirado no universo Batman, simulando um portal corporativo das **Indústrias Wayne** com área pública e áreas privadas de gerenciamento.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js v20+
- npm

### Instalação e Inicialização

```bash
npm install
node Script/server.js
```

O servidor estará disponível em: **http://localhost:3000**

---

## 🔐 Credenciais de Acesso

O sistema possui **dois perfis de login**, acessados pela página de login (`/Templates/index.html`):

| Perfil       | Usuário | Senha | Área de Acesso                                      | Permissões                                              |
|--------------|---------|-------|-----------------------------------------------------|---------------------------------------------------------|
| **Wayne**    | `wayne` | `1234`| `paginaGerenciamento.html` (área privada exclusiva) | Gerenciamento de inimigos, aliados, equipamentos, veículos |
| **Admin**    | `admin` | `1234`| `paginaInicial.html` (área pública com extras)      | Adicionar/editar/excluir serviços, notícias e contato   |

> ⚠️ As credenciais são validadas no front-end (`Script/main.js`) e o estado de sessão é mantido via `localStorage`.

---

## 📁 Estrutura do Projeto

```
Projeto Final Sidnei - 7/
├── Templates/               # Páginas HTML
│   ├── index.html           # Página de login
│   ├── paginaInicial.html   # Página inicial (pública)
│   ├── paginaContato.html   # Contato
│   ├── paginaNoticias.html  # Notícias
│   ├── paginaServicos.html  # Serviços
│   ├── paginaEquipamentos.html  # Equipamentos
│   ├── paginaVeiculos.html  # Veículos
│   ├── paginaSeguranca.html # Segurança: Inimigos & Aliados (privado)
│   └── paginaGerenciamento.html # Painel de gerenciamento (privado - login wayne)
├── Script/                  # Scripts JavaScript
│   ├── server.js            # Servidor Express (backend)
│   ├── main.js              # Lógica de login/logout
│   ├── paginaInicialLogin.js# Controle de estado de login
│   ├── aliados.js           # CRUD de aliados
│   ├── inimigos.js          # CRUD de inimigos
│   ├── servicos.js          # CRUD de serviços
│   ├── noticias.js          # CRUD de notícias
│   ├── contato.js           # CRUD de contato
│   └── scriptSeguranca.js   # Controle da página de segurança
├── Style/                   # Arquivos CSS
├── Image/                   # Imagens e assets
├── Fonte/                   # Fontes customizadas
├── *.json                   # Arquivos de dados (banco de dados local)
└── package.json
```

---

## 🗄️ Banco de Dados

Os dados são persistidos em arquivos **JSON** na raiz do projeto:

| Arquivo            | Conteúdo                     |
|--------------------|------------------------------|
| `inimigos.json`    | Lista de inimigos do Batman  |
| `aliados.json`     | Lista de aliados do Batman   |
| `equipamentos.json`| Equipamentos cadastrados     |
| `veiculos.json`    | Veículos cadastrados         |
| `servicos.json`    | Serviços das Indústrias Wayne|
| `noticias.json`    | Notícias publicadas          |
| `contatos.json`    | Informações de contato       |

---

## 🔌 API REST (Backend)

O servidor Express expõe os seguintes endpoints na porta **3000**:

### Inimigos
| Método | Rota            | Descrição               |
|--------|-----------------|-------------------------|
| GET    | `/api/inimigos` | Lista todos os inimigos |
| POST   | `/api/inimigos` | Salva lista de inimigos |

### Aliados
| Método | Rota           | Descrição              |
|--------|----------------|------------------------|
| GET    | `/api/aliados` | Lista todos os aliados |
| POST   | `/api/aliados` | Salva lista de aliados |

### Equipamentos
| Método | Rota                    | Descrição                    |
|--------|-------------------------|------------------------------|
| GET    | `/api/equipamentos`     | Lista todos os equipamentos  |
| GET    | `/api/equipamentos/:id` | Busca equipamento por ID     |
| POST   | `/api/equipamentos`     | Adiciona equipamento         |
| PUT    | `/api/equipamentos/:id` | Atualiza equipamento por ID  |
| DELETE | `/api/equipamentos/:id` | Remove equipamento por ID    |

### Veículos
| Método | Rota               | Descrição                 |
|--------|--------------------|---------------------------|
| GET    | `/api/veiculos`    | Lista todos os veículos   |
| GET    | `/api/veiculos/:id`| Busca veículo por ID      |
| POST   | `/api/veiculos`    | Adiciona veículo          |
| PUT    | `/api/veiculos/:id`| Atualiza veículo por ID   |
| DELETE | `/api/veiculos/:id`| Remove veículo por ID     |

### Serviços
| Método | Rota               | Descrição                 |
|--------|--------------------|---------------------------|
| GET    | `/api/servicos`    | Lista todos os serviços   |
| GET    | `/api/servicos/:id`| Busca serviço por ID      |
| POST   | `/api/servicos`    | Adiciona serviço          |
| PUT    | `/api/servicos/:id`| Atualiza serviço por ID   |
| DELETE | `/api/servicos/:id`| Remove serviço por ID     |

### Notícias
| Método | Rota               | Descrição                  |
|--------|--------------------|----------------------------|
| GET    | `/api/noticias`    | Lista todas as notícias    |
| GET    | `/api/noticias/:id`| Busca notícia por ID       |
| POST   | `/api/noticias`    | Adiciona notícia           |
| PUT    | `/api/noticias/:id`| Atualiza notícia por ID    |
| DELETE | `/api/noticias/:id`| Remove notícia por ID      |

### Contato
| Método | Rota           | Descrição                      |
|--------|----------------|--------------------------------|
| GET    | `/api/contato` | Retorna informações de contato |
| POST   | `/api/contato` | Salva informações de contato   |
| PUT    | `/api/contato` | Atualiza informações de contato|

---

## 🛠️ Stack Tecnológico

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Backend    | Node.js v20 + Express v5          |
| Frontend   | HTML5, CSS3, JavaScript (Vanilla) |
| UI Library | Bootstrap 5.3.8 (via CDN)         |
| Storage    | JSON files (sem banco de dados)   |
| CORS       | cors ^2.8.6                       |
| Upload     | multer ^2.1.1                     |

---

## 📄 Páginas e Controle de Acesso

| Página                   | Acesso    | Descrição                                              |
|--------------------------|-----------|--------------------------------------------------------|
| `index.html`             | Público   | Formulário de login                                    |
| `paginaInicial.html`     | Público   | Home com cards de navegação                            |
| `paginaNoticias.html`    | Público   | Notícias (edição apenas para `admin`)                  |
| `paginaServicos.html`    | Público   | Serviços (edição apenas para `admin`)                  |
| `paginaContato.html`     | Público   | Contato (edição apenas para `admin`)                   |
| `paginaEquipamentos.html`| Público   | Listagem de equipamentos                               |
| `paginaVeiculos.html`    | Público   | Listagem de veículos                                   |
| `paginaGerenciamento.html`| Privado  | Painel principal — requer login `wayne`                |
| `paginaSeguranca.html`   | Privado   | Gerencia inimigos e aliados — acessível via `wayne`    |
