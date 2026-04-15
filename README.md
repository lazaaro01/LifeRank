# LifeRank

LifeRank e um MVP de gamificacao de produtividade construido com `Next.js`, `TypeScript` e `TailwindCSS`. A proposta do app e transformar atividades do dia a dia em pontos, permitindo que o usuario acompanhe sua evolucao e dispute posicoes em um ranking dentro de um grupo.

Este projeto foi pensado para validacao rapida da ideia, sem backend e sem banco de dados. Toda a persistencia acontece no navegador via `LocalStorage`.

## Visao geral

O usuario cria um perfil, entra ou cria um grupo e passa a registrar atividades diarias. Cada atividade gera pontos, o ranking e recalculado dinamicamente e o app oferece uma leitura simples da rotina por dashboard, feed, calendario e leaderboard.

## Stack

- `Next.js` com `App Router`
- `TypeScript`
- `TailwindCSS`
- `LocalStorage` para persistencia local

## Funcionalidades do MVP

- Criacao e edicao de perfil com:
  - nome
  - telefone
  - foto por URL ou upload convertido para base64
- Login automatico quando ja existe perfil salvo no navegador
- Criacao de grupo local
- Entrada em grupo via codigo ficticio
- Registro de atividades com pontuacao
- Ranking dinamico por grupo
- Calendario mensal com atividades e pontos por dia
- Feed simples de atividades recentes
- Sistema de streak
- Sistema basico de conquistas
- Simulacao de reset mensal

## Regras de pontuacao

- `Estudo`: `10 pontos por hora`
- `Academia`: `10 pontos`
- `Bicicleta`: `10 pontos`
- `Igreja`: `10 pontos`
- `Leitura`: `10 pontos`
- `Atividade personalizada`: `10 pontos`

## Fluxo principal

1. O usuario acessa o app.
2. Se nao houver perfil salvo, ele e direcionado para `/profile`.
3. Depois de salvar o perfil, pode criar ou entrar em um grupo.
4. Com grupo ativo, o usuario registra atividades em `/activities`.
5. O dashboard mostra pontos, streak, feed e conquistas.
6. O calendario e o ranking refletem os dados salvos no navegador.

## Rotas da aplicacao

- `/` redireciona para perfil ou dashboard
- `/profile` cadastro e edicao do perfil
- `/dashboard` resumo geral do progresso
- `/activities` criacao de atividades
- `/calendar` visualizacao mensal
- `/ranking` leaderboard do grupo
- `/group` criacao e entrada em grupo

## Persistencia de dados

Os dados sao armazenados em `LocalStorage` com a chave:

```txt
liferank.storage.v1
```

Estrutura principal persistida:

```ts
type StorageShape = {
  profile: UserProfile | null;
  group: GroupData | null;
  activities: Activity[];
  monthlyResetAt: string | null;
};
```

O projeto mantem localmente:

- perfil do usuario
- grupo atual
- lista de atividades
- dados usados para ranking
- data da ultima simulacao de reset mensal

## Estrutura do projeto

```txt
app/
  activities/
  calendar/
  dashboard/
  group/
  profile/
  ranking/
components/
  layout/
  pages/
  providers/
  ui/
hooks/
lib/
```

### Organizacao

- `app/`: rotas do Next.js App Router
- `components/pages/`: conteudo principal de cada pagina
- `components/layout/`: shell e navegacao compartilhada
- `components/providers/`: contexto global da aplicacao
- `hooks/`: estado e regras de manipulacao do app
- `lib/`: tipos, constantes, utilitarios e camada de persistencia

## Arquitetura

O estado principal do app e centralizado em um hook customizado:

- `hooks/use-liferank-store.ts`

Esse hook:

- le os dados do `LocalStorage`
- hidrata o estado da aplicacao no cliente
- grava automaticamente as alteracoes
- calcula ranking, streak, stats e conquistas
- expõe as acoes de perfil, grupo e atividades

O provider global fica em:

- `components/providers/life-rank-provider.tsx`

## Como executar o projeto

### Requisitos

- `Node.js` 18 ou superior
- `npm`

### Instalar dependencias

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Gerar build de producao

```bash
npm run build
```

### Rodar lint

```bash
npm run lint
```

## Decisoes de produto e implementacao

- Sem backend:
  - ideal para validacao rapida da experiencia e da proposta do produto
- Sem banco de dados:
  - reduz complexidade e acelera iteracao inicial
- Ranking local:
  - como nao existe sincronizacao entre dispositivos, a competicao e simulada no navegador
- Grupo com codigo ficticio:
  - permite validar o fluxo de entrada em grupo antes de implementar servidor
- Membros demo:
  - alguns membros e atividades de exemplo sao usados para deixar o ranking mais tangivel no MVP

## Limitacoes atuais

- Os dados existem apenas no navegador atual
- Nao ha autenticacao real
- Nao ha sincronizacao entre usuarios ou dispositivos
- O codigo do grupo nao consulta servidor
- O reset mensal e apenas visual e simulado

## Proximos passos sugeridos

- Adicionar backend para grupos reais e ranking compartilhado
- Implementar autenticacao
- Criar historico por meses
- Adicionar filtros no calendario e no feed
- Evoluir conquistas e metas pessoais
- Criar convites reais para grupos

## Status

Projeto MVP funcional para validacao da ideia.
