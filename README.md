# nutriXpert-frontend

Aplicação frontend responsável pela interface de interação com o usuário, consumindo os serviços e APIs do projeto **nutriXpert**.

---

## 🚀 Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 18+  
- Gerenciador de pacotes (uma das opções abaixo):
  - npm  
  - pnpm  
  - yarn  
  - bun

---

## 📥 Instalando Dependências

Após clonar o projeto, acesse a pasta do frontend e execute:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

---

## ▶️ Rodando em Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento local (porta padrão `http://localhost:3000`):

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Após rodar o comando, o frontend estará disponível no navegador.

---

## ⚙️ Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, seguindo o exemplo:

```ini
VITE_API_URL=http://localhost:8080
```

Onde:

- `VITE_API_URL` → endereço da API backend do **nutriXpert**

Se estiver usando outra porta ou domínio, altere o valor conforme necessário.

---

## 🛠️ Build para Produção

Para gerar os arquivos otimizados de produção:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Os arquivos finais serão gerados na pasta `dist`.

---

## 🔍 Visualizando o Build Localmente

Para testar localmente a versão de produção:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

A aplicação será executada simulando o modo de produção.

---

## 🧪 Dicas de Desenvolvimento

- Certifique-se de que o **backend** esteja rodando antes do frontend.
- Caso esteja usando outro domínio ou porta, atualize o `.env`.
- Em ambiente de produção, configure `VITE_API_URL` para o domínio público do servidor backend.

---
