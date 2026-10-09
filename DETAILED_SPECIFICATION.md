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
* [x] **Estrutura de Layout & HUD:** **Opção A — Cenário Vivo Imersivo com HUD Flutuante**.
  * A sala animada 2D é o palco visual de fundo em tela cheia/área central contínua.
  * Barra de status superior limpa (DevCoins, Nível, Streak, indicador de modo).
  * Cronómetro de foco e controlo de sprint integrados de forma orgânica.
  * Menus de gestão (Loja de Mobília/Setup, Seleção de Projetos, Carreira, Configurações) abrem em painéis deslizantes laterais (*drawers*) ou janelas sobrepostas translúcidas (*glassmorphism/blur*), mantendo a sensação aconchegante da sala sempre presente sem recarregar páginas.
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

---

## 3. Backlog Funcional & Módulos em Definição
*(Secção atualizada à medida que as decisões forem tomadas)*

### 3.1. Core Loop & Sessão Pomodoro
* *(Em definição)*

### 3.2. Economia, Moedas & Staking
* *(Em definição)*

### 3.3. Visual da Sala, Avatar & Estilo Gráfico
* *(Em definição)*

### 3.4. Loja, Upgrades & Inventário
* *(Em definição)*

### 3.5. Carreira, Níveis & Ambientes
* *(Em definição)*

### 3.6. Áudio & Atmosfera
* *(Em definição)*

### 3.7. Persistência, Dados & Exportação
* *(Em definição)*

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
* **Q8:** *(Em curso)*
