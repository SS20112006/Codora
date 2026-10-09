# Codora
> **O Idle/Sim Game de Desenvolvimento de Software Alimentado por Foco Real**

---

## 1. Visão Geral do Produto

O **Codora** é um jogo de simulação e progressão estilo *Idle / Tycoon* (inspirado na dinâmica de progressão e personalização de sala de jogos como *PewDiePie's Tuber Simulator* e *Game Dev Tycoon*), mas onde a moeda de "mineração" e o motor de evolução do jogo é o **foco e produtividade no mundo real (Pomodoro)**.

O objetivo é transformar blocos de estudo e trabalho de programação num ciclo de jogo viciante, gratificante e com consequências reais, desenhado para ser **100% gratuito (custo zero)**, **open-source** e uma peça de destaque num **portfólio de engenharia de software**.

---

## 2. O Core Loop (Ciclo de Jogo)

O ciclo principal divide-se em duas fases contínuas e integradas no mesmo ecrã:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ESCOLHA DO PROJETO / SPRINT                              │
│    • Escolher duração (Preset ou Custom)                   │
│    • Fazer o "Staking" / Investimento de moedas            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SESSÃO DE FOCO (POMODORO ATIVO)                          │
│    • Avatar escreve código no computador animado            │
│    • Contador integrado no cenário da sala                  │
│    • Se desistir a meio: o projeto falha e perdes as moedas │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CONCLUSÃO & ENTREGA DO PROJETO                           │
│    • Recompensas: DevCoins + XP de Carreira + Novos Users   │
│    • Ativação de Combos (Flow State se encadear sessões)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. FASE DE PAUSA & GESTÃO DA SALA (3 a 5 min)               │
│    • Comprar equipamento e mobília na Loja                  │
│    • Subir níveis e desbloquear novos cargos/cargos         │
│    • Investir em Side Projects ou Skill Tree                │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Mecânicas Principais

### A. Mecânica de Investimento / Staking (Risco & Recompensa)
* Para iniciar uma sessão de Pomodoro, o jogador tem de **investir DevCoins**.
* Sessões iniciais (Estudante) são gratuitas ou quase simbólicas.
* Projetos de maior envergadura exigem maior investimento, mas pagam retornos exponenciais.
* **Aversão à perda:** Se o utilizador abandonar a sessão a meio, o projeto falha e o investimento é perdido. Isto cria disciplina psicológica real para manter o foco.

### B. Cálculo Dinâmico de Retorno (ROI)
* **Presets:** 25 min, 45 min, 60 min.
* **Customizável:** Slider para escolher qualquer número de minutos.
* O jogo calcula antes do arranque:
  $$\text{Retorno} = \text{Base}(\text{Tempo}) \times (1 + \text{Multiplicadores Hardware} + \text{Multiplicadores Software} + \text{Multiplicador Cargo} + \text{Bónus Streak})$$

### C. Sistema de Combos & Sprints Encadeados
* **Sessão Única (25m):** Retorno padrão (1.0x).
* **Sprint Duplo (25m foco $\rightarrow$ 5m pausa $\rightarrow$ 25m foco):** Ativa o multiplicador **Flow State** (ex: 1.3x).
* **Maratona de Estudo (4 blocos de 25m):** Ativa **Deep Work Transcendental** (ex: 2.0x) + hipótese de obter um item raro/lendário para a sala.

### D. Economia de Três Moedas
1. 💰 **DevCoins:** Moeda líquida para investir em projetos e comprar mobília/setup.
2. ⚡ **Dev XP:** Pontos de experiência para subir de cargo (Estudante $\rightarrow$ Estagiário $\rightarrow$ Júnior $\rightarrow$ Pleno $\rightarrow$ Sénior $\rightarrow$ Tech Lead $\rightarrow$ Indie Founder).
3. 👥 **Users Ativos (Reach Acumulado):** Métricas de público dos teus softwares lançados, gerando pequenos rendimentos passivos contínuos.

---

## 4. O Sistema de Upgrades & Progressão

### 1. Hardware & Mobília (Impacto Visual no Quarto)
* **Secretária:** Tábua improvisada $\rightarrow$ Secretária simples de madeira $\rightarrow$ Secretária elevatória com LEDs RGB.
* **Computador:** Portátil antigo com ecrã pequeno $\rightarrow$ Torre Desktop gamer $\rightarrow$ Setup multi-monitor / ultrawide.
* **Periféricos:** Teclado de membrana $\rightarrow$ Teclado mecânico $\rightarrow$ Teclado custom.
* **Cadeira:** Banco de cozinha $\rightarrow$ Cadeira de escritório $\rightarrow$ Cadeira ergonómica de topo.

### 2. Software & Ferramentas (Upgrades de Eficiência)
* **Sistema Operativo:** SO básico $\rightarrow$ Linux Ubuntu $\rightarrow$ Arch Linux / macOS Pro.
* **Editor de Código:** Bloco de Notas $\rightarrow$ VS Code $\rightarrow$ Neovim otimizado.
* **Cloud/Infra:** Hospedagem partilhada lenta $\rightarrow$ Servidores Cloud dedicados.

### 3. Ambientes (Evolução de Mapa / Cenário)
À medida que sobes de cargo (ex: 15-20 níveis por título):
1. **Dormitório da Universidade / Quarto dos Pais:** Humilde, cabos espalhados, luz de candeeiro.
2. **Apartamento Alugado:** Primeiro estúdio próprio, espaço mais arrumado.
3. **Escritório de Startup:** Paredes de vidro, café expresso, ambiente moderno.
4. **Tech Studio / Penthouse de Founder:** Espaço de luxo com vista panorâmica da cidade e setup de sonho.

---

## 5. Direção Visual & Pipeline de Assets (Zero Custos / Sem Desenho Manual)

* **Estilo Visual:** Ilustração vetorial 2D / 2.5D moderna, limpa e minimalista (longe do pixel art tradicional).
* **Personagem Modular:** Estrutura vetorial SVG (baseada em kits open-source como *Open Peeps* ou *Humaaans*), permitindo customizar género, cabelo e roupa sem desenhar à mão.
* **Animações em CSS/SVG:** Em vez de desenhar centenas de frames, a animação de teclar, o fumo do café, o piscar do cursor e o balanço do avatar são feitos via transformações e keyframes CSS.
* **Itens do Quarto:** Assets vetoriais organizados numa grelha/slots com controlo de camadas ($z$-index).

---

## 6. Arquitetura Técnica & Destaque de Portfólio

| Módulo | Tecnologia | Propósito no Portfólio |
| :--- | :--- | :--- |
| **Framework Web** | React + TypeScript + Vite | Aplicação ultra rápida, tipagem estrita e DX moderna |
| **Estilização** | Tailwind CSS + Framer Motion | Interface elegante, menus suaves e responsividade |
| **Cenário & Render** | SVG Dinâmico / React DOM Canvas | Gráficos vetoriais nítidos em qualquer ecrã e retina display |
| **Engine de Tempo** | Web Workers | Temporizador sem *drift*, imune a abas minimizadas ou suspensas |
| **Engine de Economia** | Módulos TypeScript Puros (TDD) | Fórmulas matemáticas de balanceamento 100% testadas com Vitest |
| **Gestão de Estado** | Zustand | Estado global reativo e leve para inventário, moedas e loja |
| **Persistência** | IndexedDB / LocalStorage | Offline-first, sem servidor, com exportação/importação de save em JSON |
| **Deployment** | Vercel / Cloudflare Pages / GitHub Pages | Custo 0€ vitalício com CI/CD contínuo |
| **Desktop Nativo (Futuro)** | Tauri | Opção de compilar para `.dmg` (Mac) e `.exe` (Windows) com apenas ~5MB |

---

## 7. Roadmap Inicial de Desenvolvimento

1. **Sprint 1 — Core Time & Economy:**
   * Motor de temporizador com Web Worker.
   * Sistema de moedas, staking de projetos e cálculo de recompensa ao concluir.
   * Testes unitários para as fórmulas de cálculo.
2. **Sprint 2 — O Palco Visual (A Sala):**
   * Componente SVG da sala vetorial com slots para mesa, cadeira e computador.
   * Avatar com animação CSS de digitação durante o foco e animação de descanso na pausa.
3. **Sprint 3 — A Loja & Inventário:**
   * Catálogo de itens de setup e mobília.
   * Sistema de compra, equipar e aplicação de multiplicadores passivos.
4. **Sprint 4 — Carreira, Níveis & Ambientes:**
   * Árvore de cargos e transição de cenários (Dormitório $\rightarrow$ Apartamento $\rightarrow$ Escritório).
   * Sistema de save/load local e exportação JSON.
