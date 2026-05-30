# Instruções de utilização

Este diretório contém as três frentes de implementação do SmartSíndico:

- `Back-end`: API REST em ASP.NET Core.
- `Front-end`: aplicação web em Vue 3.
- `Mobile`: aplicativo Expo React Native.

## Back-end

```powershell
cd .\Back-end
dotnet run --project src\Api\Api.csproj --launch-profile http
```

A API local fica disponível em `http://localhost:5053`.

## Front-end Web

```powershell
cd .\Front-end
npm install
npm run dev
```

## Front-end Mobile

```powershell
cd .\Mobile
npm install
npm start
```

O app mobile usa `EXPO_PUBLIC_API_BASE_URL` para localizar a API. Consulte `src/Mobile/README.md` para detalhes de execução em celular físico ou emulador.

## Histórico de versões

### [0.2.0] - 30/05/2026

#### Adicionado

- Aplicativo mobile em Expo React Native com autenticação, usuários e mural de avisos.
