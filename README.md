# LifeRank

**LifeRank** é uma plataforma de gamificação de produtividade: transforma hábitos e atividades do dia a dia (estudo, academia, leitura, trabalho, projetos pessoais...) em uma experiência parecida com um jogo. Os usuários registram atividades, acumulam pontos e XP, sobem de nível, mantêm streaks (sequências de dias consecutivos), desbloqueiam conquistas e disputam rankings — sozinhos ou dentro de clubes.

A interface segue uma identidade visual premium/esportiva (tipografia condensada em caixa alta, blocos de cor sólidos, azul vívido como cor de marca), fugindo do visual tradicional de painel administrativo.

## Funcionalidades

- **Autenticação** — cadastro, login e logout com credenciais (Auth.js/NextAuth v5), incluindo uma etapa opcional de foto de perfil logo após o cadastro.
- **Dashboard** — nível e XP em destaque, streak atual, badges desbloqueados, gráfico de evolução de pontos, atividades recentes e mini ranking do clube.
- **Atividades** — registro de atividades por categoria (com pontuação e XP configuráveis por categoria) e histórico completo com filtros.
- **Gamificação** — pontos, XP, níveis, streaks (atual e melhor) e conquistas desbloqueadas automaticamente por marcos (primeira atividade, pontos acumulados, dias seguidos, etc.).
- **Clubes** — criação de clubes (públicos ou privados) com código de convite único, entrada via código, página de detalhe com ranking do clube e feed de fotos dos membros. Participantes podem sair do clube a qualquer momento; o dono não pode sair — só tem a opção de excluir o clube permanentemente (o que remove todos os membros).
- **Ranking global** — classificação geral de todos os usuários por XP, com pódio para o top 3.
- **Perfil** — estatísticas do usuário, edição de dados e troca de foto.

## Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui (estilo `base-nova` sobre Base UI), Framer Motion, Recharts, Lucide Icons
- **Formulários/validação**: React Hook Form + Zod
- **Dados**: React Query (client), Server Actions (mutações)
- **Auth**: Auth.js (NextAuth) v5, credenciais com hash via bcrypt
- **Banco de dados**: PostgreSQL, Prisma ORM

## Arquitetura

O projeto segue uma separação por responsabilidade dentro de `src/`:

```
src/
  app/             # Rotas (App Router): (auth), (app), api
  components/      # Componentes de UI organizados por domínio/feature
  server/actions/  # Server Actions (mutações chamadas pelo client)
  services/        # Regras de negócio (gamificação, ranking, clubes...)
  repositories/    # Acesso a dados via Prisma
  utils/validators/# Schemas Zod
  lib/             # Utilitários e clientes (Prisma, ícones, etc.)
```

Fluxo padrão: página (Server Component) busca dados via `repositories`/`services` → renderiza um componente de conteúdo → formulários client-side chamam `server/actions`, que validam com Zod, executam a regra de negócio no `service` e revalidam a rota.

## Modelo de dados

Principais entidades (Prisma): `User`, `Category`, `Activity`, `Achievement`/`UserAchievement`, `Club`/`ClubMembership`.
