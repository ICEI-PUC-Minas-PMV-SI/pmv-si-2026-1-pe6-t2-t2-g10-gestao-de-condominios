# APIs e Web Services

O backend do projeto SmartSíndico foi planejado para centralizar as regras de negócio do sistema de gestão condominial e expor uma API REST segura para consumo pelos clientes web e mobile. Nesta etapa, a API concentra autenticação de usuários, gerenciamento básico de usuários e publicação de comunicados, servindo como base para a evolução dos módulos de reservas, visitantes e ocorrências.

## Objetivos da API

Os principais objetivos da API do SmartSíndico são:

- disponibilizar um ponto central de acesso aos dados do sistema por meio de endpoints HTTP padronizados;
- autenticar usuários com perfis distintos, gerando token JWT para proteger as demais rotas;
- aplicar validações de entrada e regras de negócio na camada de aplicação;
- controlar autorização por perfil de usuário, restringindo operações administrativas;
- persistir os dados em banco relacional PostgreSQL com apoio do Entity Framework Core;
- permitir a evolução modular da solução, mantendo separação entre API, aplicação, domínio e infraestrutura.

Na versão atual do backend, os requisitos funcionais cobertos diretamente pela API são:

- RF-001: login e autenticação com perfis distintos;
- RF-005: envio e consulta de comunicados do mural digital;
- RF-006: fluxo de uso conforme o perfil do usuário.

## Modelagem da Aplicação

<img width="940" height="558" alt="Modelagem da aplicação" src="https://github.com/user-attachments/assets/dec3da02-0198-43f4-8411-ea30c78738d7" />

A modelagem atual do backend segue um monólito modular em quatro camadas:

- `Api`: controllers, filtros, middleware global de exceções, Swagger e configuração do pipeline HTTP;
- `Application`: serviços de caso de uso, DTOs, validadores e contratos da aplicação;
- `Domain`: entidades, enums, value objects e exceções de domínio;
- `Infrastructure`: persistência com Entity Framework Core, repositórios, configuração JWT e acesso ao PostgreSQL.

Fluxo principal da requisição:

1. O cliente envia uma requisição HTTP para a API.
2. O controller recebe os dados e executa a validação inicial do modelo.
3. O serviço da camada `Application` aplica as regras de negócio.
4. Os repositórios da camada `Infrastructure` acessam o PostgreSQL.
5. A API devolve a resposta em JSON, com `ProblemDetails` ou `ValidationProblemDetails` em caso de erro.

## Tecnologias Utilizadas

As tecnologias principais utilizadas no backend são:

- `C#` e `.NET 10`: linguagem e plataforma principais da API;
- `ASP.NET Core Web API`: exposição dos endpoints REST, filtros, middleware e autenticação;
- `Entity Framework Core 10`: mapeamento objeto-relacional e migrations;
- `Npgsql.EntityFrameworkCore.PostgreSQL`: provider de acesso ao PostgreSQL;
- `PostgreSQL`: banco de dados relacional da aplicação;
- `JWT Bearer Authentication`: autenticação baseada em token;
- `Swagger / OpenAPI`: documentação e teste interativo dos endpoints;
- `xUnit`: framework de testes unitários;
- `Moq`: biblioteca de mocks para isolar dependências nos testes;
- `Postman`: apoio a testes manuais e coleções de requisições.

## API Endpoints

Os endpoints atualmente implementados estão organizados em três grupos: autenticação, comunicados e usuários.

### 1. Autenticação

#### `POST /api/autenticacao/entrar`

- Objetivo: autenticar um usuário e retornar o token JWT.
- Acesso: público.
- Corpo da requisição:

```json
{
  "email": "sindico@smartsindico.local",
  "senha": "123456"
}
```

- Resposta de sucesso (`200 OK`):

```json
{
  "token": "jwt-token",
  "expiraEmUtc": "2026-04-08T15:30:00Z",
  "usuario": {
    "id": 3,
    "nome": "Sindico Teste",
    "email": "sindico@smartsindico.local",
    "telefone": "31999990003",
    "perfil": "Sindico",
    "idApartamento": 1
  }
}
```

- Possíveis erros:
  - `400 BadRequest`: falha de validação do email ou senha;
  - `401 Unauthorized`: credenciais inválidas;
  - `403 Forbidden`: usuário inativo.

### 2. Comunicados

#### `GET /api/comunicados`

- Objetivo: listar os comunicados ativos.
- Acesso: autenticado.
- Resposta de sucesso (`200 OK`):

```json
[
  {
    "id": 1,
    "idAutor": 3,
    "nomeAutor": "Sindico Teste",
    "titulo": "Manutenção programada",
    "conteudo": "A água será desligada amanhã.",
    "dataPublicacao": "2026-04-08T10:00:00Z",
    "ativo": true,
    "destaque": true
  }
]
```

#### `GET /api/comunicados/{id}`

- Objetivo: consultar um comunicado específico.
- Acesso: autenticado.
- Parâmetros:
  - `id`: identificador numérico do comunicado.
- Resposta de sucesso (`200 OK`): mesmo formato de `ComunicadoResponse`.
- Possíveis erros:
  - `401 Unauthorized`: token ausente ou inválido;
  - `404 NotFound`: comunicado não encontrado.

#### `POST /api/comunicados`

- Objetivo: criar um novo comunicado.
- Acesso: autenticado.
- Perfis autorizados: `Funcionario` e `Sindico`.
- Corpo da requisição:

```json
{
  "titulo": "Nova portaria",
  "conteudo": "A portaria funcionará em horário especial.",
  "destaque": true
}
```

- Resposta de sucesso (`201 Created`):

```json
{
  "id": 2,
  "idAutor": 3,
  "nomeAutor": "Sindico Teste",
  "titulo": "Nova portaria",
  "conteudo": "A portaria funcionará em horário especial.",
  "dataPublicacao": "2026-04-08T14:00:00Z",
  "ativo": true,
  "destaque": true
}
```

- Possíveis erros:
  - `400 BadRequest`: dados inválidos;
  - `401 Unauthorized`: token ausente ou inválido;
  - `403 Forbidden`: perfil sem permissão ou autor inativo;
  - `404 NotFound`: autor não encontrado.

#### `PATCH /api/comunicados/{id}/ativo`

- Objetivo: ativar ou desativar um comunicado.
- Acesso: autenticado.
- Perfis autorizados: `Funcionario` e `Sindico`.
- Parâmetros:
  - `id`: identificador numérico do comunicado.
- Corpo da requisição:

```json
{
  "ativo": false
}
```

- Resposta de sucesso (`200 OK`): retorna o comunicado atualizado.
- Possíveis erros:
  - `401 Unauthorized`: token ausente ou inválido;
  - `403 Forbidden`: perfil sem permissão;
  - `404 NotFound`: comunicado não encontrado.

### 3. Usuários

#### `POST /api/usuarios`

- Objetivo: cadastrar um novo usuário.
- Acesso: autenticado.
- Perfis autorizados: `Funcionario` e `Sindico`.
- Regra adicional: `Funcionario` pode cadastrar apenas usuários com perfil `Morador`.
- Corpo da requisição:

```json
{
  "nome": "Maria Silva",
  "email": "maria@teste.com",
  "senha": "123456",
  "cpf": "12345678901",
  "telefone": "31999999999",
  "perfil": 1,
  "idApartamento": 101
}
```

- Resposta de sucesso (`201 Created`):

```json
{
  "id": 10,
  "nome": "Maria Silva",
  "email": "maria@teste.com",
  "cpf": "12345678901",
  "telefone": "31999999999",
  "perfil": "Morador",
  "idApartamento": 101,
  "ativo": true,
  "dataCriacao": "2026-04-08T15:30:00Z",
  "dataUltimoLogin": null
}
```

- Possíveis erros:
  - `400 BadRequest`: dados inválidos;
  - `401 Unauthorized`: token ausente ou inválido;
  - `403 Forbidden`: perfil sem permissão;
  - `409 Conflict`: email ou CPF já cadastrados.

#### `GET /api/usuarios`

- Objetivo: listar usuários cadastrados.
- Acesso: autenticado.
- Perfis autorizados: `Sindico`.
- Resposta de sucesso (`200 OK`):

```json
[
  {
    "id": 1,
    "nome": "Morador Teste",
    "email": "morador@smartsindico.local",
    "cpf": "11111111111",
    "telefone": "31999990001",
    "perfil": "Morador",
    "idApartamento": 101,
    "ativo": true,
    "dataCriacao": "2026-04-01T12:00:00Z",
    "dataUltimoLogin": null
  }
]
```

#### `GET /api/usuarios/{id}`

- Objetivo: consultar um usuário por identificador.
- Acesso: autenticado.
- Regras de acesso:
  - `Morador`: pode consultar apenas o próprio cadastro;
  - `Funcionario`: pode consultar o próprio cadastro e cadastros com perfil `Morador`;
  - `Sindico`: pode consultar o próprio cadastro e qualquer outro usuário.
- Parâmetros:
  - `id`: identificador numérico do usuário.
- Resposta de sucesso (`200 OK`): mesmo formato de `UsuarioResponse`.
- Possíveis erros:
  - `401 Unauthorized`: token ausente ou inválido;
  - `403 Forbidden`: perfil sem permissão;
  - `404 NotFound`: usuário não encontrado.

#### `PATCH /api/usuarios/{id}/ativo`

- Objetivo: ativar ou desativar um usuário.
- Acesso: autenticado.
- Regras de acesso:
  - `Funcionario`: pode alterar o status de usuários com perfil `Morador`;
  - `Sindico`: pode alterar o próprio status e o status de usuários com perfil `Funcionario`.
- Parâmetros:
  - `id`: identificador numérico do usuário.
- Corpo da requisição:

```json
{
  "ativo": false
}
```

- Resposta de sucesso (`200 OK`): retorna o usuário atualizado.
- Possíveis erros:
  - `401 Unauthorized`: token ausente ou inválido;
  - `403 Forbidden`: perfil sem permissão;
  - `404 NotFound`: usuário não encontrado.

### Padrão de erros da API

Falhas de validação retornam `ValidationProblemDetails`:

```json
{
  "title": "Falha de validação.",
  "status": 400,
  "errors": {
    "Email": [
      "E-mail inválido."
    ]
  }
}
```

Falhas de negócio e autorização retornam `ProblemDetails`:

```json
{
  "title": "Credenciais inválidas.",
  "status": 401
}
```

## Considerações de Segurança

As principais medidas de segurança previstas e implementadas no backend são:

- autenticação com JWT Bearer, exigida em todas as rotas, exceto `POST /api/autenticacao/entrar`;
- autorização por perfil com uso de `[Authorize]` e restrições por role (`Morador`, `Funcionario` e `Sindico`);
- padrão de segurança por controller, com `[Authorize]` aplicado por padrão, `[AllowAnonymous]` apenas em rotas públicas e restrições de role declaradas na action quando a operação exige um perfil mais específico;
- regras contextuais de autorização implementadas com `policy` e `AuthorizationHandler`, especialmente nos fluxos de visualização, cadastro e atualização de status de usuários;
- hash de senha antes da persistência, evitando armazenamento de senha em texto puro;
- validação de entrada centralizada com validadores da camada `Application` e retorno padronizado em `ValidationProblemDetails`;
- tratamento centralizado de exceções por middleware, reduzindo vazamento de detalhes internos;
- uso de HTTPS no pipeline da aplicação;
- configuração tipada de JWT, exigindo `Issuer`, `Audience`, `Key` e tempo de expiração válido;
- uso de `ProblemDetails` para erros, mantendo um formato consistente de resposta;
- proteção adicional em regras de negócio, como bloqueio de login para usuário inativo e restrição de cadastro por perfil.

## Implantação

A implantação do backend do SmartSíndico em ambiente de produção exige uma infraestrutura capaz de executar a API desenvolvida em .NET e disponibilizar um banco de dados PostgreSQL para persistência das informações. Em termos de software, é necessário um ambiente com suporte à execução de aplicações ASP.NET Core, acesso ao runtime compatível com a versão utilizada no projeto e disponibilidade de um serviço de banco relacional configurado para uso externo ou interno, conforme a arquitetura adotada. Em termos de hardware, os requisitos variam conforme a carga esperada, mas para este projeto acadêmico uma instância de pequeno porte com capacidade de processamento básica, memória suficiente para a API e armazenamento para o banco já atende ao cenário inicial.

Como plataforma de hospedagem, pode-se utilizar um provedor em nuvem, como Render, Railway, Azure ou AWS, desde que permita publicar a API e configurar variáveis de ambiente com segurança. A escolha da plataforma deve considerar facilidade de deploy, integração com repositório Git, suporte ao PostgreSQL e possibilidade de escalar a aplicação futuramente. Para o contexto do projeto, uma plataforma gerenciada é mais adequada, pois reduz a complexidade operacional e facilita a publicação contínua.

A configuração do ambiente de implantação deve incluir a definição da string de conexão com o banco de dados PostgreSQL, chave JWT, emissor, audiência e demais parâmetros necessários para autenticação e execução da API. Essas configurações não devem ficar fixas no código-fonte, devendo ser fornecidas por variáveis de ambiente ou mecanismos seguros da plataforma escolhida. Também é necessário garantir que as dependências da aplicação estejam instaladas e que o banco de dados esteja acessível antes do início da execução da API.

O processo de deploy consiste em publicar a aplicação no ambiente escolhido, aplicar as configurações necessárias, executar as migrations do banco de dados e iniciar a API em modo de produção. Após a publicação, devem ser realizados testes para validar o funcionamento da aplicação, incluindo autenticação, acesso aos endpoints protegidos, integração com o banco de dados e respostas corretas da API em cenários de sucesso e erro. Dessa forma, garante-se que a aplicação esteja operacional, segura e pronta para uso em ambiente produtivo.

## Testes

A estratégia de testes do backend combina validação manual dos endpoints com automação de testes unitários e testes de integração.

### Testes unitários

Os testes unitários já implementados utilizam `xUnit` e `Moq` para isolar as dependências dos serviços de aplicação. A suíte atual cobre:

- `AutenticacaoService`: validação do login, autenticação com sucesso, credenciais inválidas e bloqueio de usuário inativo;
- `ComunicadoService`: validação de criação, bloqueio de autor inativo, criação com sucesso e tentativa de atualizar comunicado inexistente;
- `UsuarioService`: validação de cadastro, conflito por email, cadastro com sucesso, retorno `NotFound` para usuário inexistente e atualização de status com sucesso;
- `ComunicadoController`: exigência de usuário autenticado para criação, publicação com autor identificado e validação das anotações de autorização das rotas;
- `UsuarioController`: contrato HTTP das ações protegidas e integração com o serviço de autorização;
- `AuthorizationHandlers` de usuários: regras contextuais de cadastro, visualização e atualização de status conforme o perfil autenticado.

Esses testes garantem a cobertura inicial das regras de negócio mais importantes relacionadas a:


- RF-001: autenticação e controle básico de acesso;
- RF-005: criação e consulta de comunicados;
- RF-006: fluxo de uso conforme o perfil do usuário, incluindo as permissões administrativas hoje implementadas para usuários;
- RNF-001: exigência de autenticação e resposta coerente para falhas de autorização.

Além dos serviços, os testes de controller reforçam o contrato HTTP da API e a configuração de acesso por perfil declarada com `[Authorize]` e `[AllowAnonymous]`.

### Testes de integração

Os testes de integração já implementados utilizam `WebApplicationFactory` com banco em memória para validar:

- login com geração real de JWT;
- exigência de autenticação nas rotas protegidas;
- autorização por perfil no pipeline HTTP completo;
- integração entre controllers, middleware, autenticação, autorização, aplicação e persistência.

Os cenários automatizados atualmente cobrem:

- login com credenciais válidas;
- bloqueio de acesso sem token;
- restrição de cadastro de usuário quando `Funcionario` tenta criar perfil não permitido;
- bloqueio de consulta de usuário fora da regra de acesso do `Morador`;
- atualização de status de `Morador` por `Funcionario`;
- bloqueio de criação de comunicado por `Morador`.

### Testes manuais e exploratórios

Durante o desenvolvimento, os endpoints podem ser validados com:

- `Swagger/OpenAPI`, disponível no ambiente de desenvolvimento;
- coleções `Postman`, para verificação de fluxos autenticados e regressão manual.

## Referências

- ASP.NET Core Documentation. Disponível em: <https://learn.microsoft.com/aspnet/core>.
- Entity Framework Core Documentation. Disponível em: <https://learn.microsoft.com/ef/core>.
- PostgreSQL Documentation. Disponível em: <https://www.postgresql.org/docs/>.
- Swagger OpenAPI Documentation. Disponível em: <https://swagger.io/specification/>.
- xUnit Documentation. Disponível em: <https://xunit.net/>.
- Moq Documentation. Disponível em: <https://github.com/moq/moq>.
