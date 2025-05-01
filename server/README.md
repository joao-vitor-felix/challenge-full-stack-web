# Backend

## 📖 Requisitos

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- Gerenciador de pacotes de sua escolha (npm ou pnpm)

## ⚙️ Variáveis de Ambiente

Para rodar esse projeto localmente, é necessário adicionar as variáveis do `.env.example` no arquivo `.env` na raiz do projeto.

## 💻 Rodando localmente

Clone o projeto

```bash
git clone git@github.com:joao-vitor-felix/challenge-full-stack-web.git && cd challenge-full-stack-web/server
```

Instale as dependências com seu pacoter gerenciador favorito, como o `npm` ou `pnpm`

```bash
npm install
```

```bash
pnpm install
```

Incie o banco de dados

```
docker compose up -d
```

Inicie o servidor

```bash
npm run dev
```

```bash
pnpm dev
```

O servidor estará rodando em `http://localhost:3000`.

## 🔍 Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm test
```

```bash
  pnpm test
```
