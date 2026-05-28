# Plano de Desenvolvimento - DoeConect Mobile

## Contexto do Projeto
- **Web (TCCpc):** Plataforma onde Doadores criam contas e anunciam itens para doação
- **Mobile (DoeConect):** App para Donatários visualizarem anúncios e demonstrarem interesse
- **Back-End:** Spring Boot + SQL Server (somee.com) rodando na porta 8080

---

## Fluxo Principal
1. Doador cria conta e anúncio no **web**
2. Donatário faz login no **mobile** (conta criada no web)
3. Donatário vê os anúncios disponíveis no feed do mobile
4. Donatário demonstra interesse em um anúncio (cria uma Solicitação)
5. Doador vê as solicitações no web e aceita/recusa

---

## Status do Projeto

### Back-End (Spring Boot) — PENDENTE
- [ ] Criar rota `POST /api/v1/usuario/login` (recebe email+senha, retorna usuário)
- [ ] Criar Controller, Service e Repository de **Anuncio**
- [ ] Criar Controller, Service e Repository de **Solicitacao**
- [ ] Criar Controller, Service e Repository de **Doador**
- [ ] Criar Controller, Service e Repository de **Categoria**
- [ ] Relacionar entidades (Anuncio → Doador, Solicitacao → Usuario + Anuncio)
- [ ] Rota `GET /api/v1/anuncio` — listar anúncios ativos (usado pelo mobile)
- [ ] Rota `POST /api/v1/solicitacao` — donatário demonstra interesse (usado pelo mobile)

### Front Web (TCCpc) — PENDENTE
- [ ] Terminar CRUDs pendentes
- [ ] Tela de criação de anúncio pelo Doador
- [ ] Tela de visualização de solicitações recebidas

### Mobile (DoeConect) — AGUARDANDO BACK-END
- [ ] Tela de Login (consome `POST /usuario/login`)
- [ ] Feed de Anúncios (consome `GET /anuncio`)
- [ ] Detalhe do Anúncio + botão "Tenho Interesse" (cria Solicitação)
- [ ] Tela Minhas Solicitações
- [ ] Tela de Perfil do Donatário

---

## Entidades do Back-End (mapeadas)

### Usuario
- id, nome, email, senha, nivelAcesso, statusUsuario, dataCadastro

### Anuncio
- id, nome, descricao, tamanho, condicao, caminhoFoto, statusAnuncio, dataCadastro
- (falta relacionar: doador_id, categoria_id)

### Doador
- id, nome, dataNascimento, cpf, cep, statusDoador, dataCadastro
- (falta relacionar: usuario_id)

### Solicitacao
- id, dataCadastro, statusSolicitacao
- (falta relacionar: usuario_id, anuncio_id)

### Categoria
- id, nome, statusCategoria

---

## Metodologia de Conexão Mobile ↔ Back-End
- API Base URL: `http://localhost:8080/api/v1` (dev) → trocar por IP real quando testar no celular
- Sem JWT por enquanto — login retorna objeto do usuário, salvo com AsyncStorage
- Mobile só acessa: login, listagem de anúncios ativos e criação de solicitação

---

## Ordem de Execução
1. ✅ Analisar back-end e front web
2. 🔄 Terminar back-end (CRUDs + rota de login + relacionamentos)
3. 🔄 Terminar front web
4. ⏳ Construir mobile com conexões prontas
