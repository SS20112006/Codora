# Codora — Especificação Técnica e de Produto Detalhada

> Documento vivo de alinhamento, decisões de design, mecânicas de jogo e backlog funcional.
> Todas as decisões são validadas iterativamente com o utilizador antes do início da implementação.

---

## 1. Identidade do Projeto
* **Nome Oficial:** Codora
* **Gênero:** Idle / Dev Sim / Pomodoro Gamificado
* **Proposta de Valor:** Transformar tempo de foco e estudo de programação em progressão viciante num simulador de carreira e quarto de desenvolvedor.
* **Licença & Custo:** Open-source, 100% gratuito (custo zero de infraestrutura).

---

## 2. Decisões Fechadas & Validadas
* [x] **Nome do Projeto:** Codora (sem sufixos ou nomes secundários).
* [x] **Processo de Alinhamento:** Perguntas sequenciais, uma a uma, cobrindo todos os detalhes visuais, mecânicos e arquiteturais antes de avançar para código.
* [x] **Perspetiva Visual do Cenário:** **Vista Frontal / Corte Lateral 2D (Side-view Flat / Estilo Lofi Girl)**. O quarto é visto de perfil, com linhas horizontais/verticais limpas, avatar de perfil/semi-perfil a programar na secretária, janela de fundo com ciclo de luz e parede modular para prateleiras/posters. Facilita a responsividade perfeita entre resoluções.
* [x] **Modo de Foco & Tolerância a Pausas:** **Configurável pelo Utilizador**. O utilizador decide antes do sprint ou nas preferências se prefere jogar no modo estrito/sem pausas (*Hardcore*) ou no modo com direito a *Pausa de Emergência* cronometrada (ex: 3 a 5 min para imprevistos). O jogo não impõe um único formato rígido, adaptando-se à rotina de cada pessoa.
* [x] **Economia Inicial & Proteção Anti-Falência:** **Projetos de Custo Zero (Free Tier / Exercícios & Bugfixes)**.
  * O jogador novo começa a zeros (ou saldo inicial mínimo) e tem sempre acesso a projetos sem investimento prévio (0 DevCoins).
  * **Balanceamento anti-spam para jogadores avançados:** O retorno do projeto gratuito é fixo e modesto (ex: 10-15 DevCoins por 25m, XP básico), não escalando exponencialmente com os multiplicadores de carreira avançada.
  * Para um novato ou jogador falido, serve perfeitamente para reerguer a banca inicial. Para um jogador avançado (com mobílias e custos na ordem das centenas/milhares), o custo de oportunidade torna o projeto de custo 0 ineficiente, incentivando naturalmente o *staking* de projetos de maior escala.
* [x] **Estrutura de Layout & HUD:** **Cenário Fullscreen Vivo (Jogo em Tela Cheia) com HUDs Flutuantes**.
  * O quarto ocupa **100% da viewport em tela cheia (`100vw` $\times$ `100vh`)**, eliminando completamente o layout tradicional de documento web (sem rodapés estáticos soltos, sem caixas de vídeo com molduras, sem barras de rolagem).
  * A barra superior (Top HUD Bar) flutua de forma translúcida no topo do ecrã com informações de moeda, nível, XP e streak.
  * O relógio Pomodoro e o cartão de estado do projeto flutuam suavemente na parte inferior sobre o chão da sala.
  * Todos os menus de gestão (Seleção de Contratos, Loja de Mobília/Setup, Conquistas, Configurações) abrem como **drawers translúcidos laterais (*glassmorphism/blur*)** ou modais integrados, mantendo a imersão viva e contínua do quarto no fundo sem sair do jogo.
* [x] **Motor Gráfico & Renderização 2D (Transição de Formas Geométricas para Game Engine):**
  * As formas geométricas procedurais SVG (`<rect>`, `<circle>`, `<path>`) utilizadas inicialmente serviram como prova de conceito e scaffolding modular de layouts.
  * Para entregar uma estética de jogo autêntica e altamente polida (estilo *Tuber Simulator*, *Game Dev Tycoon* e *Lofi Girl*), a arquitetura adota **PixiJS (`pixi.js` + `@pixi/react`)** / **Canvas 2D com Spritesheets** acelerado por WebGL/WebGPU.
  * Isto viabiliza a introdução de texturas de madeira reais, computadores ilustrados com reflexos e shaders, iluminação volumétrica dinâmica da janela (dia/pôr do sol/noite) e animação de sprites detalhada do avatar em vez de figuras geométricas simplistas.
* [x] **Avatar Dinâmico por Fase & Acessórios Equipáveis:**
  * **Vestuário Evolutivo por Patamar de Carreira:** O guarda-roupa do avatar atualiza-se organicamente consoante o nível e o cenário (ex: fase inicial de estudante = hoodies, calças casuais; fases profissionais avançadas = camisas, polo, smart-casual).
  * **Cenários / Mapas Transitáveis:** Slots da sala mantêm a consistência posicional, mas ao completar um ciclo de carreira, o cenário muda por completo (ex: Quarto de Estudante $\rightarrow$ Apartamento Próprio $\rightarrow$ Escritório de Startup $\rightarrow$ Tech Studio).
  * **Acessórios Visíveis na Loja:** Itens comprados refletem-se visual e imediatamente no ecrã — acessórios pessoais no avatar (ex: headphones na cabeça) e melhorias de hardware no setup (ex: adicionar segundo monitor, caneca na mesa, lâmpada de monitor), concedendo bónus de rendimento e XP.
* [x] **Sistema de Contratos & Projetos (Estilo Tuber Simulator):**
  * **Projetos Pré-Definidos Sem Atrito:** O utilizador não precisa de digitar texto; o jogo apresenta uma seleção dinâmica de projetos prontos a escolher, mantendo o fluxo rápido e gamificado.
  * **Contextualização com o Nível/Fase Atual:** Os projetos refletem a realidade da fase do jogador. Na fase de Universidade: trabalhos académicos, scripts de automação simples, pequenos bicos de freelance para amigos. Fases mais avançadas desbloqueiam MVPs de startups, sistemas de alta disponibilidade, contratos corporativos internacionais.
  * **Tomada de Decisão Estratégica (Mercado Dinâmico):** Os projetos disponíveis variam em duração, custo de entrada e rentabilidade (alguns com excelente ROI, outros de menor risco), dando ao jogador o poder de escolher a melhor oportunidade de investimento de tempo e moedas.
* [x] **Ecossistema de Áudio Completo com Painel de Controlo Granular:**
  * **Módulos Incluídos:** Música de Foco (Lo-Fi Beats relaxantes), Sons de Ambiente (chuva, café, teclado mecânico suave), Efeitos Sonoros de Interface (moedas, level up, cliques táteis) e Alerta Sonoro de Conclusão de Pomodoro.
  * **Mixer de Controlo Total pelo Utilizador:** Painel de áudio acessível onde o utilizador pode ligar/desligar de forma 100% independente qualquer um dos canais (ex: desligar a música mas manter a chuva; desligar os alertas; silenciar tudo com um único clique para quem já usa Spotify ou prefere silêncio absoluto).
* [x] **Mecânica Idle & Rendimento Passivo Offline:** **Opção A — Idle Clássico com Teto Máximo**.
  * Projetos concluídos e lançados geram uma base acumulada de "Users Ativos / Servidores", produzindo um fluxo passivo de DevCoins ao longo do tempo.
  * **Retorno Offline ("Welcome Back"):** Ao fechar o navegador e regressar mais tarde, o jogador é recebido com uma janela com o resumo dos ganhos offline acumulados.
  * **Teto Máximo de Proteção:** Limite de tempo de ausência acumulável (ex: teto máximo de 8h a 12h) para preservar o equilíbrio da economia e garantir que o Pomodoro ativo continua a ser o motor de progressão essencial.
* [x] **Arquitetura de Dados & Persistência:** **Opção B — Local-First com Abstração Pronta para Nuvem**.
  * **Fase V1 (Custo Zero & Zero Atrito):** Persistência no navegador via `IndexedDB` / `LocalStorage`. Sem necessidade de registo prévio, arranque imediato, privacidade total, com exportação e importação manual de ficheiros de save em JSON.
  * **Design Cloud-Ready:** A camada de persistência utiliza o padrão *Repository/Storage Adapter*, permitindo no futuro conectar um backend com autenticação e sincronização na cloud (ex: Supabase / Firebase / Postgres) sem necessidade de refatorar a lógica interna do jogo.
* [x] **Direção Artística dos 4 Grandes Cenários & Progressão por XP:**
  * **Fase 1 — Quarto Universitário (Ref: Mark Zuckerberg em *The Social Network* / Dormitório de Harvard):**
    * *Vibe:* Época de exames universitária, foco total a altas horas da noite.
    * *Cenário vivo/fulfilled:* Mesa simples de estudo, portátil de arranque, caixa de pizza no chão, lata de refrigerante/Coca-Cola, notas adesivas na parede, cabos à vista.
    * *Visual do Avatar:* Hoodies largos, calças de ganga ou calças de pijama; calçado: sneakers básicos, chinelos com meia ou crocs.
  * **Fase 2 — Primeiro Home Office Digno / Espaço Alugado (Estagiário / Dev Júnior):**
    * *Vibe:* Low-budget mas organizado; transição de estudante para trabalhador júnior formal.
    * *Cenário:* Local específico e limpo de trabalho, secretária mais espaçosa, cadeira de escritório melhor, estante com livros de engenharia, candeeiro de secretária.
    * *Visual do Avatar:* T-shirts limpas, calças casuais/chinos, ténis arrumados.
  * **Fase 3 — Co-working / Escritório de Startup (Dev Pleno / Dev Sénior):**
    * *Vibe:* Ambiente profissional de alta tecnologia, projetos de escala e arquitetura.
    * *Cenário:* Divisórias modernas de vidro, plantas de interior decorativas, máquina de café expresso, setup multi-ecrã.
    * *Visual do Avatar:* Smart-casual (camisas de manga arregaçada, pólos, malhas leves).
  * **Fase 4 — Penthouse Privada / Tech Headquarters (Tech Lead / Indie Founder):**
    * *Vibe:* Pináculo da carreira e independência financeira ("Elite Coder").
    * *Cenário:* Andar superior com vista panorâmica da cidade e arranha-céus pela janela, mesa elevatória minimalista em madeira nobre, monitor ultrawide com lightbar, acústica e estética perfeitas.
  * **Gatilho de Desbloqueio & Curva de Níveis:**
    * A transição de cenário dá-se **automaticamente ao atingir os patamares de Nível de Carreira/XP**.
    * A transição da Fase 1 para a Fase 2 é mais rápida (para incentivar o novo jogador com a primeira grande conquista), aumentando progressivamente o tempo necessário entre as fases seguintes para manter uma progressão sustentada sem ser frustrante nem trivial.
* [x] **Iluminação Dinâmica e Clima da Sala:** **Opção C — Tema Selecionável com Suporte a Tempo Real**.
  * O jogador tem total controlo sobre a ambiência visual do quarto nas definições/HUD:
    * Modo Automático: Segue o relógio real do computador (Dia, Entardecer/Golden Hour, Noite com candeeiro e estrelas).
    * Modos Fixos Manuais: Permite fixar permanentemente o seu ambiente preferido (ex: "Sempre Noite Aconchegante", "Sempre Pôr do Sol", "Sempre Dia Claro").
* [x] **Gamificação: Streaks, Missões Diárias & Conquistas com Recompensa:**
  * **Streak de Dias Consecutivos:** Fazer pelo menos 1 sprint por dia avança o streak e concede bónus cumulativo em moedas e XP.
  * **Missões Diárias (3 Daily Quests):** Desafios rápidos que renovam a cada 24h para manter o hábito diário fresco e gratificante.
  * **Conquistas & Troféus Úteis:** Conquistas desbloqueiam itens/troféus físicos na estante do quarto e pagam **XP de Carreira significativo + bónus de DevCoins**, tornando os objetivos essenciais para acelerar a subida de nível.
* [x] **Stack Tecnológica Oficial:**
  * **Core Web:** React 19 + TypeScript + Vite.
  * **Estilização & Motion:** Tailwind CSS + Framer Motion.
  * **Gráficos & Viewport:** Fullscreen Immersive Stage (`100vw` $\times$ `100vh`) com Overlays Integrados + Transição para PixiJS / WebGL 2D Spritesheets com shaders de iluminação e assets de jogo autênticos (em vez de meras figuras geométricas SVG).
  * **Engine Temporal:** Dedicated Web Worker (imune ao throttling de abas em background).
  * **Estado & Economia:** Zustand + Módulos Puros TypeScript com testes em Vitest (TDD).
  * **Persistência:** Local-First (IndexedDB / LocalStorage) com arquitetura Cloud-Ready (padrão Repository) e export/import JSON.
  * **Hospedagem & CI/CD:** Vercel / Cloudflare Pages (custo zero permanente).

---

## 3. Backlog Oficial de Issues no GitHub (1 Tarefa por Conversa)

Todos os itens foram mapeados, dimensionados e criados no repositório GitHub como **Issues sequenciais**:

| Issue | Tarefa | Módulo | Descrição Resumida |
| :--- | :--- | :--- | :--- |
| [#1](https://github.com/SS20112006/Codora/issues/1) | **Task 01** | `core` | Setup do projeto (Vite + React 19 + TypeScript + Tailwind CSS + Vitest) |
| [#2](https://github.com/SS20112006/Codora/issues/2) | **Task 02** | `timer` | Motor Pomodoro Web Worker imune a drift (Pausa de Emergência + Hardcore) |
| [#3](https://github.com/SS20112006/Codora/issues/3) | **Task 03** | `economy` | Fórmulas matemáticas de Staking, ROI, XP e proteção de falência (TDD) |
| [#4](https://github.com/SS20112006/Codora/issues/4) | **Task 04** | `state` | Zustand Store com persistência Local-First Cloud-Ready (IndexedDB/JSON) |
| [#5](https://github.com/SS20112006/Codora/issues/5) | **Task 05** | `contracts` | Catálogo de contratos e projetos rotativos (estilo *Tuber Simulator*) |
| [#6](https://github.com/SS20112006/Codora/issues/6) | **Task 06** | `view` | Palco Visual Fase 1: Quarto universitário *The Social Network* Fullscreen |
| [#7](https://github.com/SS20112006/Codora/issues/7) | **Task 07** | `avatar` | Avatar do programador com animações de digitação e pausa |
| [#8](https://github.com/SS20112006/Codora/issues/8) | **Task 08** | `atmosphere`| Iluminação dinâmica e modos selecionáveis da janela (Dia/Pôr do Sol/Noite) |
| [#9](https://github.com/SS20112006/Codora/issues/9) | **Task 09** | `hud` | HUD flutuante imersivo e relógio Pomodoro integrado na cena fullscreen |
| [#10](https://github.com/SS20112006/Codora/issues/10) | **Task 10** | `ui` | Drawer translúcido (*glassmorphism*) para seleção e staking de contratos |
| [#11](https://github.com/SS20112006/Codora/issues/11) | **Task 11** | `audio` | Suite de áudio completa (Música Lo-Fi, Sons de Ambiente, SFX) e Mixer |
| [#12](https://github.com/SS20112006/Codora/issues/12) | **Task 12** | `shop` | Loja de upgrades e acessórios equipáveis visíveis no quarto fullscreen |
| [#13](https://github.com/SS20112006/Codora/issues/13) | **Task 13** | `gamification`| Sistema de Streak diário e 3 Missões Diárias (*Daily Quests*) |
| [#14](https://github.com/SS20112006/Codora/issues/14) | **Task 14** | `achievements`| Conquistas de carreira e estante de troféus com prémios em XP e moedas |
| [#15](https://github.com/SS20112006/Codora/issues/15) | **Task 15** | `idle` | Rendimento passivo offline e modal de boas-vindas (*Welcome Back*) |
| [#16](https://github.com/SS20112006/Codora/issues/16) | **Task 16** | `stages` | Fase 2: Home Office de Júnior Fullscreen, contratos corporativos e roupas |
| [#17](https://github.com/SS20112006/Codora/issues/17) | **Task 17** | `stages` | Fase 3: Escritório de Co-working / Startup Fullscreen, projetos avançados |
| [#18](https://github.com/SS20112006/Codora/issues/18) | **Task 18** | `stages` | Fase 4: Penthouse Tech Headquarters Fullscreen, setup ultrawide |
| [#19](https://github.com/SS20112006/Codora/issues/19) | **Task 19** | `settings` | Painel de definições integrado, export/import de save JSON e reset |
| [#20](https://github.com/SS20112006/Codora/issues/20) | **Task 20** | `release` | Auditoria de acessibilidade WCAG AA, polimento gráfico e deploy |

---

## 4. Histórico de Perguntas & Respostas
* **Q1 (Perspetiva Visual):** Isométrica (2.5D) vs Corte Lateral 2D (Side-view Flat).
  * **Decisão do Utilizador:** Opção B — Vista Frontal / Corte Lateral 2D (Side-view Flat / Estilo Lofi Girl).
* **Q2 (Interrupções & Pausa de Emergência):** Sem pausas (Hardcore) vs Pausa com tempo limite vs Configurável pelo jogador.
  * **Decisão do Utilizador:** Configurável pelo jogador — o utilizador escolhe se quer permitir pausas de emergência ou jogar sem pausas.
* **Q3 (Economia Inicial & Anti-Falência):** 0 Moedas com projetos grátis vs Bolsa inicial.
  * **Decisão do Utilizador:** Projetos a custo 0 (livres de investimento inicial) para novatos e resgate de falência, porém com retorno deliberadamente baixo/modesto para que jogadores avançados não tenham incentivo a spammar e prefiram projetos com staking real.
* **Q4 (Layout & Interface):** Cenário Vivo com HUD Flutuante vs Split Screen Fixo vs Páginas Separadas.
  * **Decisão do Utilizador:** Opção A — Cenário Vivo Imersivo com HUD Flutuante e menus em painéis/drawers translúcidos.
* **Q5 (Avatar & Slots de Sala):** Customização de personagem, transição de cenários e itens comprados.
  * **Decisão do Utilizador:** Roupas atualizam com os níveis de carreira (hoodies no início, camisas nos níveis altos); slots de cenário fixos mas com mapas/ambientes completamente novos a cada patamar; acessórios comprados equipam-se visualmente (ex: headphones no avatar, segundo monitor na secretária).
* **Q6 (Natureza dos Projetos/Sprints):** Projetos do jogo vs tarefas reais escritas pelo utilizador.
  * **Decisão do Utilizador:** Estilo *Tuber Simulator* — projetos pré-definidos contextuais com a fase do jogador (trabalhos da faculdade/pequenos freelances na universidade, escalando para projetos maiores), com custos e retornos dinâmicos para escolha estratégica sem necessidade de digitação.
* **Q7 (Áudio, Ambiente e Música):** Presença de som e flexibilidade de controlo.
  * **Decisão do Utilizador:** Pacote completo disponível (Música Lo-Fi, Sons de Ambiente, SFX e Alerta de Pomodoro), acompanhado obrigatoriamente de um painel de controlo/mixer onde o utilizador pode ligar, desligar ou ajustar individualmente cada som (incluindo silenciar tudo).
* **Q8 (Mecânica Idle & Ganhos Offline):** Rendimento passivo ao regressar vs apenas online vs sem moedas passivas.
  * **Decisão do Utilizador:** Opção A — Rendimento passivo offline clássico de idle game ("Welcome Back!"), com teto máximo configurado para preservar o balanceamento da economia.
* **Q9 (Persistência & Dados):** 100% Local-first estrito vs Local-first com arquitetura cloud-ready vs Login obrigatório.
  * **Decisão do Utilizador:** Opção B — Local-first na v1 (sem atrito, sem registo, export/import JSON) com arquitetura em camadas preparada para ligar nuvem/auth no futuro.
* **Q10 (Cenários & Progressão de Nível):** Definição visual detalhada das 4 fases e gatilho de mudança.
  * **Decisão do Utilizador:** 
    * Fase 1: Quarto universitário "The Social Network" (pizza no chão, lata, hoodies, crocs/chinelos com meia, portátil simples).
    * Fase 2: Home office próprio low-budget mas digno de júnior/estagiário.
    * Fase 3: Co-working / Startup premium com cafezito e projetos maiores.
    * Fase 4: Penthouse com vista de cidade, monitor ultrawide, vibe de coder de topo.
    * Desbloqueio: Progressão automática por XP, com ritmo rápido de Fase 1 para Fase 2 e desaceleração calculada para evitar frustração.
* **Q11 (Iluminação & Ciclo da Janela):** Relógio real vs Avanço por Pomodoro vs Tema selecionável.
  * **Decisão do Utilizador:** Opção C — Tema selecionável nas opções, com suporte a acompanhar o relógio real ou fixar o ambiente favorito (ex: Sempre Noite Aconchegante).
* **Q12 (Gamificação & Retenção Diária):** Streaks, Missões Diárias e Conquistas.
  * **Decisão do Utilizador:** Incluir os 3 elementos (Streak de dias consecutivos, 3 Missões Diárias e Troféus visuais na estante), com as conquistas a concederem recompensas tangíveis em XP de Carreira e DevCoins para acelerar o progresso.
* **Q13 (Stack Tecnológica & Arquitetura):** Validação de React 19 + TypeScript + Vite + Tailwind + SVG DOM + Web Worker + Zustand + Vitest.
  * **Decisão do Utilizador:** Confirmado e aprovado integralmente.
* **Q14 (Fullscreen Imersivo Total & Transição para Game Engine 2D):**
  * **Decisão do Utilizador:**
    1. O jogo é **100% Fullscreen**: o quarto preenche a tela inteira (`100vw` $\times$ `100vh`), sem layout de página web tradicional, sem rodapé de texto solto e sem caixas de vídeo limitadas. Todos os menus, HUDs, drawers e relógios são elementos integrados flutuantes sobre o jogo.
    2. Pesquisa e transição gráfica: as figuras geométricas procedurais (`<rect>`, `<circle>`) devem evoluir para uma Game Engine ou biblioteca de renderização 2D (**PixiJS** com spritesheets e texturas ricas de materiais e iluminação) para transformar verdadeiramente o Codora num jogo visualmente autêntico.

