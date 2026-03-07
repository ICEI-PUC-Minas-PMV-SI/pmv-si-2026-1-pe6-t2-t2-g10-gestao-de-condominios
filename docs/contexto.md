# Introdução

O **SmartSíndico** é um projeto de aplicativo voltado para a modernização da gestão condominial, desenvolvido com o propósito de centralizar e otimizar os principais processos administrativos de condomínios residenciais e comerciais. Em um contexto onde a tecnologia tem transformado a forma como pessoas e empresas se organizam, muitos condomínios ainda enfrentam dificuldades relacionadas à comunicação ineficiente, falta de transparência, processos burocráticos e controle descentralizado de informações.

## Problema
O problema identificado está na gestão administrativa de condomínios residenciais e comerciais, que em muitos casos ainda é realizada por meio de processos manuais, planilhas isoladas, registros em papel e aplicativos de mensagens não estruturados. Esse modelo de administração dificulta a organização das informações, aumenta o risco de erros e compromete a eficiência das atividades do dia a dia.

## Objetivos

Os objetivos deste trabalho estão diretamente relacionados à necessidade de melhorar a organização, a transparência e a eficiência na gestão condominial.

O objetivo geral é desenvolver um software capaz de solucionar os problemas identificados na administração de condomínios, especialmente aqueles relacionados à desorganização das informações, falhas na comunicação, dificuldades na prestação de contas e conflitos no controle de reservas de áreas comuns.

Como objetivos específicos, destacam-se:

- Centralizar as informações administrativas em um único sistema;

- Proporcionar maior transparência na prestação de contas;

- Organizar e automatizar o processo de reservas de áreas comuns;

- Facilitar a comunicação entre administração e moradores;

- Reduzir erros operacionais e retrabalho na rotina condominial.

- Dessa forma, o trabalho busca oferecer uma solução tecnológica que torne a gestão mais eficiente, organizada e confiável.

## Justificativa

A criação do **SmartSíndico** surge da necessidade de modernizar e simplificar a administração condominial por meio da tecnologia. Em muitos condomínios, a gestão ainda é realizada de forma manual ou com o uso de ferramentas pouco integradas, como planilhas, grupos de mensagens e comunicados impressos. Esse modelo tradicional pode gerar falhas na comunicação, retrabalho, desorganização e dificuldade no acompanhamento das informações, impactando diretamente a eficiência da administração e a satisfação dos moradores.

Um dos principais desafios enfrentados está na gestão geral do condomínio. Síndicos e administradores frequentemente acumulam diversas responsabilidades, atendimento a moradores, organização de assembleias e acompanhamento de manutenções. Sem uma plataforma centralizada, torna-se mais difícil manter tudo organizado e acessível, aumentando as chances de erros e atrasos.

Outro problema recorrente envolve as reservas de áreas comuns, como salão de festas, churrasqueira e quadras esportivas. A ausência de um sistema automatizado pode causar conflitos de agendamento, reservas duplicadas, falta de critérios claros e dificuldades no controle de uso. Isso gera insatisfação entre os moradores e desgaste na administração.

Diante desse cenário, o SmartSíndico foi idealizado para utilizar a tecnologia como aliada na administração do condomínio. A proposta é oferecer uma plataforma digital que centralize informações, automatize processos e facilite a comunicação e as reservas de áreas comuns. Com isso, busca-se promover mais transparência, organização e eficiência, tornando a gestão mais prática, segura e profissional para todos os envolvidos.


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
