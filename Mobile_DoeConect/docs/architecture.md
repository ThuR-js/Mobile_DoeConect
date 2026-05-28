# Arquitetura DoeConect

## Visão Geral

O projeto segue uma arquitetura **feature-first** com separação clara entre navegação e lógica de negócio.

## Estrutura de Pastas

```
app/          → Apenas rotas do Expo Router (thin layer)
src/          → Todo o código da aplicação
assets/       → Recursos estáticos organizados por tipo
docs/         → Documentação
tests/        → Testes automatizados
```

## Regras Arquiteturais

| Regra | Descrição |
|-------|-----------|
| `app/` é thin | Arquivos de rota apenas re-exportam screens de `src/features/` |
| Alias `@/*` | Aponta para `src/` — use sempre em vez de caminhos relativos |
| `@/assets/*` | Aponta para `assets/` |
| Features isoladas | Cada feature tem seus próprios components, hooks, services, types e screens |
| Hooks globais | Em `src/hooks/` — usados por múltiplas features |
| Hooks de feature | Em `src/features/<feature>/hooks/` — específicos da feature |

## Features

| Feature | Responsabilidade |
|---------|-----------------|
| `auth` | Login, registro, recuperação de senha |
| `donations` | Listagem, criação e gestão de doações |
| `ngos` | Exploração e detalhes de ONGs parceiras |
| `profile` | Perfil do usuário, configurações |
| `notifications` | Central de notificações |

## Preparação para Escala

- **Zustand**: adicionar stores em `src/features/<feature>/store/` ou `src/store/`
- **Firebase/Supabase**: substituir `src/services/api.ts` pelo SDK correspondente
- **React Query**: wrapping dos services em hooks dentro de `src/features/<feature>/hooks/`
