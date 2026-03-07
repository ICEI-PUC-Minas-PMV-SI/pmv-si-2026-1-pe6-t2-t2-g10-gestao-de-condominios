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
|RF-001| Permitir login e autenticação com perfis distintos (Morador, Porteiro, Síndico) | ALTA | 
|RF-002| Permitir que o morador reserve áreas comuns (churrasqueira, salão) verificando disponibilidade de data/hora  | ALTA |
|RF-003| Permitir que a portaria registre a entrada e saída de visitantes (nome, CPF, AP visitado/motivo da visita) | ALTA | 
|RF-004| Permitir que o morador registre ocorrências (reclamações/manutenção) com descrição  | MÉDIA |
|RF-005| Permitir que o síndico envie comunicados gerais (Mural de Avisos) para os moradores e funcionários | MÉDIA | 

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve exigir autenticação (login e senha) para acesso |  ALTA | 
|RNF-002| O sistema deve ser responsivo para rodar em um dispositivos móvel | ALTA | 
|RNF-003| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
