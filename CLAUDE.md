# FinControl — Contexto do Projeto

## O que é
App PWA focado **exclusivamente em investimentos**, feito em **vanilla HTML/CSS/JS** (arquivo único `portfolio-tracker.html`). Sem React, sem frameworks, sem CDN obrigatório. Tudo roda standalone no navegador.

**Escopo:** portfolio crypto, aportes, reserva de emergência. Metas de patrimônio.
**Fora de escopo:** orçamento mensal, contas fixas, cartões de crédito, despesas variáveis — esses ficam no app Controle Paessoa.

## Stack
- HTML5 + CSS3 + JavaScript ES5 (vanilla, sem transpiler)
- localStorage + Supabase (auth + sync multi-device via tabela `user_data`)
- PWA: manifest.json + sw.js + ícones em /icons/
- APIs externas: CoinGecko (preços crypto), AwesomeAPI (cotação USD)

## Estrutura de Arquivos
```
portfolio-tracker.html  ← arquivo principal (todo o app)
manifest.json           ← config PWA
sw.js                   ← Service Worker (cache offline + push)
icons/                  ← ícones PNG 72-512px + SVG
CLAUDE.md               ← este arquivo
```

## Módulos do App

### 1. Dashboard (Home)
- Hero com patrimônio total + sparkline 30d + delta 7d
- Pill flutuante de ações (estilo Apple Control Center)
- Alertas contextuais (alvos atingidos, reserva pendente, últimos aportes)
- 3 stats: Aportado, Líquido pós-emergencial, Ativos/Carteiras
- Previews: Top Ativos, Emergenciais, Aportes recentes

### 2. Portfolio Crypto (Carteiras)
- Múltiplas carteiras (BTC, ETH, SOL, etc.)
- Preços ao vivo via CoinGecko API
- Cotação USD/BRL via AwesomeAPI
- P&L por ativo, alocação percentual
- Realizações (sell) com cálculo de P&L realizado

### 3. Reserva Emergencial
- Blocos de reserva com itens
- Conversão R$ ↔ $ bidirecional automática

### 4. Plano de Aportes
- Blocos mensais com itens (data, moeda, qtd, PM, via)
- Auto-cálculo em cascata: edita qualquer campo, os outros se ajustam (qtd × PM = Total R$, ÷ cotação = Total $)

## Chaves de Storage
```javascript
STORAGE_KEY = "crypto_port_v3"        // wallets
EMERG_KEY = "crypto_emerg_v1"         // reserva emergência
APORTE_KEY = "crypto_aporte_v1"       // aportes
META_LP_KEY = "fincontrol_metalp_v1"  // metas longo prazo
SNAP_KEY = "fincontrol_snapshots_v1"  // snapshots históricos
```

Todas sincronizam via Supabase (tabela `user_data`, RLS por `user_id`).

## Sync (Supabase)
- Debounce de 2s após edição local → upload
- `visibilitychange` / `pagehide` disparam flush imediato
- Proteção contra overwrite: se local tem edições não sincronizadas (mtime > syncedAt), pull não sobrescreve
- Auto-sync periódico: cada 120s enquanto logado

## Padrões de Código
- Funções CRUD: `addX()`, `removeX(id)`, `updateX(id, field, val)`
- Cada CRUD chama `saveX(); render();` no final
- `fmtBRL(v)` — formata R$ X.XXX,XX
- `fmt$(v)` — formata $ X,XXX.XX
- `esc(s)` — escapa HTML
- `render()` — despacha para view ativa (dashboard, consolidated, wallet, emergencial, aporte)

## Design
- Tema escuro (#0a0a14 base, #12122a cards)
- Cor primária: #7b61ff (roxo), #00e87e (verde)
- Tabelas responsivas com padrão `.mobi-stack` (viram cards empilhados em ≤768px)
- Pill flutuante glass com `backdrop-filter: blur`

## PWA
- Service Worker network-first
- Funciona offline
- Botão de instalar (menu)
- Ícone profissional FC

## Regras Importantes
- NUNCA usar React, Babel, ou frameworks
- NUNCA adicionar dependências CDN obrigatórias
- Manter tudo em UM arquivo HTML (exceto sw.js e manifest.json)
- NUNCA adicionar funcionalidades de orçamento mensal, contas fixas, cartões de crédito ou despesas — esses ficam no Controle Paessoa
- Export/Import inclui TODOS os dados de investimento (wallets, emergência, aportes, metas, snapshots)
