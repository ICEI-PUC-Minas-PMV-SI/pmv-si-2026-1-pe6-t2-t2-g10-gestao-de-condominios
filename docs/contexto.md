# Introdução

O *SmartSíndico* é um projeto de aplicativo voltado para a modernização da gestão condominial, desenvolvido com o objetivo de centralizar e otimizar os principais processos operacionais de condomínios residenciais. Em um contexto onde a tecnologia tem transformado a forma como pessoas se organizam, muitos condomínios ainda enfrentam dificuldades relacionadas à comunicação ineficiente, falhas na segurança da portaria, processos burocráticos e controle descentralizado de informações.

## Problema
O problema identificado aparece na rotina operacional, que em muitos casos ainda é realizada por meio de processos manuais, como registros em papel, planilhas de controle de acesso na portaria e aplicativos de mensagens não estruturados. Esse modelo dificulta a organização das informações, aumenta o risco de erros na liberação de visitantes e compromete a segurança e a convivência dos moradores.

## Objetivos

Objetivo Geral:
Desenvolver um software capaz de solucionar os problemas identificados na administração de condomínios, especialmente aqueles relacionados à segurança no controle de acesso, falhas na comunicação interna, gestão de reclamações e conflitos no agendamento de áreas comuns.

Objetivos Específicos:
- Centralizar as informações de moradores e unidades em um único sistema;
- Modernizar o controle de portaria, agilizando o registro e liberação de visitantes;
- Organizar e automatizar o processo de reservas de áreas comuns;
- Formalizar o registro e acompanhamento de ocorrências e manutenções;
- Facilitar a comunicação oficial entre administração e moradores (Mural Digital).

## Justificativa

O SmartSíndico foi desenvolvido para modernizar e simplificar a administração condominial por meio da tecnologia. Muitos condomínios ainda dependem de processos manuais, como planilhas, livros de ocorrências físicos e comunicados impressos. Esse modelo tradicional gera retrabalho e dificulta a centralização das informações, o que prejudica a agilidade da administração.

Além da parte administrativa, um dos pontos mais críticos é a segurança operacional na portaria. Síndicos e zeladores ficam sobrecarregados com múltiplas funções e, sem um sistema informatizado, o controle de acesso torna-se vulnerável. O registro manual de visitantes em cadernos ou planilhas desconectadas aumenta o tempo de espera e dificulta a identificação rápida de quem está no condomínio, o que fragiliza a segurança do local.

Outro problema recorrente envolve a convivência e o uso dos espaços, como as reservas de áreas comuns (salão de festas, churrasqueira). Sem um fluxo automático, surgem conflitos de agendamento, reservas duplicadas e falta de critérios claros. Além disso, reclamações importantes muitas vezes se perdem em grupos de mensagens informais, gerando insatisfação entre os moradores e desgaste na relação com a administração.

Nesse contexto, o projeto propõe modernizar a rotina na administração do condomínio. A proposta é oferecer uma plataforma digital que centralize a gestão, agilize o controle de visitantes com segurança e organize as reservas de áreas comuns. O objetivo é garantir transparência, tornando a gestão mais prática e profissional para todos os envolvidos.


## Público-Alvo

O público alvo do sistema é variado, porém limitado ao grupo de pessoas conviventes no condomínio. eles foram separados em 3 grupos:

Grupo 1. Moradores e Condôminos (Usuários do dia a dia): É um grupo diversificado. Varia entre jovens que fazem tudo pelo celular até idosos que podem ter dificuldade para fazer login e/ou navegar em menus.

Conhecimentos prévios: Variados. Alguns dominam apps, outros precisam de ajuda e supervisão.
Relação com a tecnologia: Usam aplicativos comuns do dia a dia, como apps de entrega e redes sociais. A tecnologia age como facilitador nas demandas diárias e de relações.
Hierarquia: Serão os clientes finais do serviço.

Grupo 2. Portaria e Zeladoria (Funcionários): São profissionais que irão usar o sistema como ferramenta de trabalho. 

Conhecimentos prévios: Conhecem bem a rotina da portaria, mas podem não ter familiaridade com softwares mais complexos.
Relação com a tecnologia: Baixa/Mediana. Podem estar acostumados com o uso de celular (WhatsApp) e/ou softwares básicos de escritório, como Excel e Word.
Hierarquia: Respondem ao síndico.

Grupo 3. Síndico e Administração (Gestão): Morador eleito ou indicado. Eles conhecem as regras do condomínio (regimento interno), mas nem sempre possuem facilidade com a tecnologia.

Conhecimentos prévios: Bom conhecimento sobre gestão e softwares de escritório (planilhas/Excel).
Relação com a tecnologia: Mediana. Veem a tecnologia como um recurso facilitador de demandas. 
Hierarquia: São os tomadores de decisão. 

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir login e autenticação com perfis distintos (`Morador`, `Funcionário` e `Síndico`) | ALTA |
|RF-002| Permitir que o morador reserve áreas comuns (churrasqueira, salão) verificando disponibilidade de data/hora  | ALTA |
|RF-003| Permitir que a portaria registre a entrada e saída de visitantes (nome, CPF, AP visitado/motivo da visita) | ALTA | 
|RF-004| Permitir que o morador registre ocorrências (reclamações/manutenção) com descrição  | MÉDIA |
|RF-005| Permitir a criação, consulta e atualização de status de comunicados para o mural digital, com publicação por `Funcionário` e `Síndico` e leitura pelos usuários autenticados | MÉDIA |
RF-006 | Permitir fluxo de uso conforme o perfil do usuário (Morador, Funcionário e Síndico) | ALTA

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve exigir autenticação (login e senha) para acesso e resposta coerente para falhas de autorização |  ALTA | 
|RNF-002| O sistema deve ser responsivo para rodar em um dispositivos móvel | ALTA | 

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |


# Catálogo de Serviços

O sistema SmartSíndico disponibilizará um conjunto de serviços digitais voltados à modernização da gestão condominial, centralizando processos administrativos, operacionais e de comunicação em uma única plataforma.

## 1. Serviço de Autenticação e Controle de Acesso

Permite que usuários (moradores, funcionários e administradores) acessem o sistema por meio de login e senha. O serviço realiza a validação das credenciais, geração de token JWT e controle de permissões conforme o perfil do usuário. Inclui também funcionalidades de logout e proteção das rotas da aplicação.

## 2. Serviço de Gestão de Moradores

Permite o cadastro, edição, consulta e exclusão de moradores e suas respectivas unidades. Esse serviço serve como base para outras funcionalidades do sistema, como controle de visitantes e registro de ocorrências.

## 3. Serviço de Controle de Visitantes

Permite que a portaria registre a entrada e saída de visitantes, informando dados como nome, documento, unidade visitada e horário de acesso. O sistema mantém um histórico completo para fins de auditoria e segurança.

## 4. Serviço de Reservas de Áreas Comuns

Permite que moradores consultem a disponibilidade e realizem reservas de espaços compartilhados, como salão de festas e churrasqueira. O sistema valida automaticamente conflitos de horário e mantém histórico das reservas realizadas.

## 5. Serviço de Registro de Ocorrências

Permite que moradores registrem reclamações, solicitações ou incidentes relacionados ao condomínio. O sistema possibilita o acompanhamento do status da ocorrência até sua resolução.

## 6. Serviço de Comunicados e Mural Digital

Permite que a administração publique avisos e comunicados oficiais para moradores e funcionários, centralizando a comunicação institucional em um único canal.

## 7. Serviço de Consulta e Acompanhamento

Permite aos usuários consultar reservas, ocorrências, visitantes e comunicados registrados, garantindo maior transparência e organização das informações.

---

# Arquitetura da Solução

A solução será estruturada em arquitetura distribuída do tipo cliente-servidor, com separação entre frontend e backend.

O frontend será desenvolvido em Vue e será responsável pela interface do usuário, incluindo navegação, formulários e consumo dos serviços da aplicação por meio de requisições HTTP.

O backend será desenvolvido em ASP.NET Core Web API, concentrando as regras de negócio, autenticação, validações e acesso ao banco de dados. O backend será estruturado como um monólito modular, organizado internamente em camadas (controllers, services e repositories).

A persistência dos dados será realizada em banco de dados relacional PostgreSQL, responsável pelo armazenamento de informações como usuários, moradores, visitantes, reservas, ocorrências e comunicados.

Essa arquitetura permite clara separação de responsabilidades entre as camadas, facilita a manutenção e evidencia a comunicação entre componentes distribuídos por meio de rede.

## Componentes da Solução

- Frontend (Vue)  
- API REST (ASP.NET Core)  
- Banco de Dados (PostgreSQL)

## Fluxo de Funcionamento

- O usuário acessa o sistema por meio do navegador.  
- O frontend envia requisições HTTP para a API.  
- O backend processa as regras de negócio.  
- O backend acessa o banco PostgreSQL.  
- A resposta retorna em formato JSON ao frontend.  
- O frontend apresenta o resultado ao usuário.  

<img width="1536" height="1024" alt="Arquitetura da Solução" src="https://github.com/user-attachments/assets/b7746934-be30-4932-bbf9-196104c3f918" />

---

# Tecnologias Utilizadas

O desenvolvimento do sistema utilizará tecnologias modernas e gratuitas, adequadas à construção de aplicações web distribuídas.

## Frontend

Será utilizado Vue 3 com JavaScript, responsável pela construção da interface do usuário. O Vue foi escolhido por apresentar curva de aprendizado reduzida, simplicidade de implementação e boa integração com APIs REST.

## Backend

Será utilizado C# com ASP.NET Core Web API, responsável pelas regras de negócio, autenticação, validações e comunicação com o banco de dados.

## Banco de Dados

Será utilizado PostgreSQL, escolhido por ser gratuito, confiável e adequado ao armazenamento estruturado de dados relacionais do sistema.

## Autenticação e Segurança

Será utilizada autenticação baseada em JWT (JSON Web Token), garantindo segurança nas requisições e controle de acesso por perfil.

## Comunicação entre Camadas

A comunicação entre frontend e backend será realizada por meio de API REST, utilizando protocolo HTTP/HTTPS e dados no formato JSON.

## Ferramentas de Desenvolvimento

- Visual Studio / Visual Studio Code  
- Git  
- GitHub  
- Postman  
- Swagger/OpenAPI  

---

# Hospedagem

O código-fonte do sistema será versionado no GitHub, permitindo controle de versão e colaboração entre os desenvolvedores.

A aplicação será hospedada integralmente na plataforma Render, utilizando seus serviços gratuitos para publicação do sistema.

O frontend, desenvolvido em Vue, será hospedado como Static Site, sendo responsável pela interface e interação com os usuários.

O backend, desenvolvido em ASP.NET Core Web API, será hospedado como Web Service, responsável pelas regras de negócio, autenticação e acesso aos dados.

O banco de dados PostgreSQL será provisionado diretamente na plataforma Render, garantindo integração simplificada com o backend.

O processo de deploy será realizado por integração com o GitHub, permitindo atualizações contínuas durante o desenvolvimento e facilitando a manutenção da aplicação.
