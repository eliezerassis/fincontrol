# FinControl — Contexto do Projeto

## O que é
App PWA de controle financeiro pessoal, feito em **vanilla HTML/CSS/JS** (arquivo único `portfolio-tracker.html`). Sem React, sem frameworks, sem CDN obrigatório. Tudo roda standalone no navegador.

## Stack
- HTML5 + CSS3 + JavaScript ES5 (vanilla, sem transpiler)
- localStorage para persistência (chaves separadas por módulo)
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

## Módulos do App (tabs de navegação)

### 1. Portfolio Crypto
- Múltiplas carteiras com moedas (BTC, ETH, SOL, etc.)
- Preços ao vivo via CoinGecko API
- Cotação USD/BRL via AwesomeAPI
- Cálculo de P&L, alocação por moeda

### 2. Reserva de Emergência
- Blocos de reserva com meta e valor atual
- Barra de progresso

### 3. Plano de Aportes
- Blocos de aporte mensal com distribuição por moeda

### 4. Orçamento Mensal (módulo mais complexo)
- **Navegação por mês/ano** (orcMes, orcAno)
- **Receitas** por categoria: Trabalho, Investimentos, Outros (com obs)
- **Contas Fixas** com toggle "pago" (só pagas somam no gasto real)
- **Despesas Variáveis** com categorias (alimentação, transporte, lazer, etc.) + toggle pago
- **Cartões de Crédito** — cada cartão tem gastos individuais, fatura com valor e status (aberta/fechada). Só fatura fechada soma no gasto total
- **Extras** — receitas ou despesas extraordinárias do mês
- **Parcelamentos** — global (não por mês), calcula parcela ativa por mês automaticamente
- **Meta de Economia** — alvo mensal com barra de progresso
- **Metas de Longo Prazo** — nome, valor alvo, acumulado, prazo
- **Gráfico Histórico** — barras de receita vs gasto dos últimos 6 meses
- **Resumo Anual** — totais do ano, melhor/pior mês, categoria campeã
- **Sistema de colapso** — todos os blocos começam minimizados, clicando no header expande (orcSectionOpen)
- **KPIs** — Receita, Gasto Real, Saldo, Previsto (sempre visíveis)
- **Barra de Saúde** — composição percentual do orçamento
- **Alertas** — aviso automático de gastos altos, contas pendentes, faturas abertas

## Chaves de Storage
```javascript
STORAGE_KEY = "crypto_port_v3"     // portfolio crypto
EMERG_KEY = "crypto_emerg_v1"      // reserva emergência
APORTE_KEY = "crypto_aporte_v1"    // plano aportes
ORC_KEY = "fincontrol_orc_v1"      // orçamento (objeto com chaves "M_YYYY")
PARC_KEY = "fincontrol_parc_v1"    // parcelamentos (array global)
META_LP_KEY = "fincontrol_metalp_v1" // metas longo prazo (array global)
```

## Padrões de Código
- Funções CRUD: `addX()`, `removeX(id)`, `updateX(id, field, val)`
- Cada CRUD chama `saveOrc(); render();` no final
- `migrateOrcEntry(entry)` — converte dados antigos para formato novo
- `getOrcMes(m, a)` — retorna ou cria dados do mês
- `orcKey(m, a)` — gera chave "M_YYYY"
- `fmtBRL(v)` — formata número como R$ X.XXX,XX
- `esc(s)` — escapa HTML
- `render()` — decide qual view renderizar baseado na tab ativa
- `orcToggleHtml(id, checked, fn)` — gera HTML do toggle switch

## Design
- Tema escuro (#0a0a1a base, #0f0f22 cards, #0a0a18 rows)
- Cor primária: #00e87e (verde)
- Cores de seção: #ff8800 fixas, #6c5ce7 variáveis, #e68a00 cartões, #aa66aa parcelas, #9944ff extras, #ffcc00 metas
- Layout 2 colunas (orc-2col) com cards colapsáveis
- CSS classes: orc-card, orc-row, orc-kpi, orc-toggle, orc-pill, orc-inp-val, etc.
- Responsivo: colapsa para 1 coluna em <768px

## PWA
- Service Worker com estratégia network-first
- Funciona offline
- Botão de instalar (flutuante + menu)
- Notificações de contas pendentes (a cada 6h)
- Ícone profissional FC com barras de gráfico

## Regras Importantes
- NUNCA usar React, Babel, ou frameworks
- NUNCA adicionar dependências CDN obrigatórias
- Manter tudo em UM arquivo HTML (exceto sw.js e manifest.json)
- Toggle "pago" controla se despesa entra no gasto real
- Fatura de cartão só conta quando "fechada"
- Parcelas são globais, cálculo por mês é dinâmico
- Export/Import inclui TODOS os dados (wallets, emergência, aportes, orçamento, parcelas, metas)
