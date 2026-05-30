# SmartSindico Mobile

Aplicativo mobile do SmartSindico criado com Expo React Native e TypeScript. Esta entrega cobre autenticacao, CRUD de usuarios e mural de avisos, consumindo a API REST existente no back-end do projeto.

## Requisitos

- Node.js 22+
- API do back-end rodando em `http://localhost:5053` ou exposta na rede local
- Expo Go no celular ou emulador Android/iOS

Para testar em um celular fisico, instale o app **Expo Go** pela Play Store ou App Store. Abrir a URL do Expo diretamente no navegador do celular normalmente nao carrega o app; quem interpreta o QR Code e executa o projeto e o Expo Go.

## Instalar dependencias

```powershell
npm install
```

## Configurar a API

Crie um arquivo `.env.local` em `src/Mobile` quando precisar apontar para outro endereco:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5053/api
```

Se a variavel nao for definida, o app usa `http://localhost:5053/api`.

Tambem e possivel informar mais de uma URL separada por virgula. O app tenta a primeira e, se houver erro de conexao, tenta a proxima:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5053/api,http://SEU_IP:5053/api
```

Use o endereco de API de acordo com o ambiente:

| Ambiente | Valor de `EXPO_PUBLIC_API_BASE_URL` |
| --- | --- |
| Navegador/PC | `http://localhost:5053/api` |
| Emulador Android | `http://10.0.2.2:5053/api` |
| Celular fisico com Expo Go | `http://SEU_IP:5053/api` |

Em emulador Android, `10.0.2.2` e o endereco especial que aponta para o `localhost` do computador:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5053/api
```

## Celular fisico com Expo Go e API local

Quando o app roda no celular, `localhost` aponta para o proprio celular, nao para o computador. Para consumir a API local do computador pelo Expo Go, use o IP da maquina na rede Wi-Fi e rode a API aceitando conexoes da rede local.

1. No computador, descubra o IP da rede:

```powershell
ipconfig
```

Procure o adaptador Wi-Fi e copie o `Endereco IPv4`. Exemplo:

```text
192.168.0.100
```

2. Crie ou atualize o arquivo `.env.local` em `src/Mobile`:

```env
EXPO_PUBLIC_API_BASE_URL=http://SEU_IP:5053/api
```

Exemplo:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.100:5053/api
```

O arquivo `.env.local` e local e nao deve ser enviado para o repositorio. Ele ja esta coberto pelo `.gitignore` do projeto mobile.

3. A partir da pasta `src`, rode a API aceitando conexoes da rede local:

```powershell
cd .\Back-end\src\Api
dotnet run --launch-profile lan
```

O perfil `lan` usa `http://0.0.0.0:5053`, permitindo que outros dispositivos da mesma rede acessem a API.

Nao use o perfil `http` para testar com celular fisico. Ele escuta apenas em `localhost` (`127.0.0.1`/`::1`), entao funciona no computador, mas o celular nao consegue acessar a API.

4. Em outro terminal, tambem a partir da pasta `src`, reinicie o app mobile limpando o cache do Expo:

```powershell
cd .\Mobile
npm start -- --clear
```

5. Abra o Expo Go no celular e escaneie o QR Code exibido no terminal.

O celular e o computador precisam estar na mesma rede Wi-Fi. Se o app nao conseguir conectar na API, teste pelo navegador do celular:

```text
http://SEU_IP:5053/
```

A tela do Swagger deste projeto fica na raiz `/`. Nao use `/swagger` para esse teste.

Nao teste o login abrindo `/api/autenticacao/entrar` no navegador. Esse endpoint e `POST` e espera email/senha em JSON; abrir pelo navegador faz uma requisicao `GET`, entao erro nesse endereco nao significa necessariamente que o login esta quebrado.

Se o navegador do celular tambem nao acessar `http://SEU_IP:5053/`, verifique se a API esta rodando com o perfil `lan` e se o Firewall do Windows liberou a porta `5053`.

Para confirmar no Windows se a API esta exposta para a rede, rode:

```powershell
Get-NetTCPConnection -LocalPort 5053
```

Para celular fisico, o resultado precisa incluir `0.0.0.0:5053` ou o IP da maquina na rede. Se aparecer apenas `127.0.0.1:5053` ou `::1:5053`, a API esta acessivel somente no computador.

## Emulador Android

Para usar um emulador criado pelo Android Studio:

1. Abra o emulador pelo Device Manager do Android Studio.
2. Configure `src/Mobile/.env.local` com:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5053/api
```

3. Rode a API no computador:

```powershell
cd .\Back-end\src\Api
dotnet run --launch-profile http
```

4. Rode o Expo:

```powershell
cd .\Mobile
npm start -- --clear
```

5. No menu do Expo, pressione `a` para abrir no Android.

## Rodar em desenvolvimento

```powershell
npm start
```

Depois, abra no Expo Go ou escolha o emulador no terminal.

## Diagnostico rapido

- `ERR_CONNECTION_REFUSED`: a API nao esta aceitando conexoes no IP/porta usados pelo app. Pare a API atual e rode novamente com `dotnet run --launch-profile lan`.
- Funciona no computador, mas nao no celular: provavelmente a API esta em `localhost` ou o firewall bloqueou a porta `5053`.
- `http://SEU_IP:5053/` abre no navegador do celular, mas o login falha: a rede esta funcionando; verifique email/senha, payload enviado pelo app ou a resposta retornada pela API.
- Depois de mudar `.env.local`, reinicie o Expo com `npm start -- --clear`.

## Testes

```powershell
npm run test:run
```

## TypeScript

```powershell
npm run typecheck
```

## Fluxos implementados

- Login com `POST /api/autenticacao/entrar`
- Restauracao de sessao com token JWT
- Perfil do usuario autenticado
- Listagem, cadastro, edicao e ativacao/desativacao de usuarios
- Listagem, detalhe, criacao, destaque e ativacao/desativacao de comunicados

## Fora do escopo desta entrega

- Visitantes
- Controle de acessos
- Apartamentos
- Reservas de areas comuns
- Ocorrencias
