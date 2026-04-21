# Front-end SmartSindico

Aplicacao web do SmartSindico criada com `Vue 3`, `Vite`, `TypeScript`, `Pinia`, `Vue Router` e `Tailwind CSS`.

## Requisitos

- Node.js 22+
- API do back-end rodando em `http://localhost:5053`

## Instalar dependencias

```powershell
npm install
```

## Rodar em desenvolvimento

```powershell
npm run dev
```

## Integracao com a API

O front agora aceita dois modos:

1. `Proxy do Vite`:
   sem configuracao extra, `/api` continua sendo encaminhado para `http://localhost:5053`.

2. `Acesso direto via CORS`:
   se o back-end estiver com CORS liberado para o front, crie um arquivo `.env.local` em `src/Front-end` com:

```env
VITE_API_BASE_URL=http://localhost:5053/api
```

Quando `VITE_API_BASE_URL` estiver definido, o cliente HTTP usa essa URL diretamente e o proxy do Vite vira apenas fallback para desenvolvimento.

## Build de producao

```powershell
npm run build
```

## Testes

```powershell
npm run test:run
```

## Fluxos principais

- Login com `POST /api/autenticacao/entrar`
- Home com cards adaptados por perfil
- Perfil do usuario autenticado
- Mural de avisos
- Criacao e desativacao de avisos para `Funcionario` e `Sindico`
- Telas customizadas de erro `403`, `404` e `500`
