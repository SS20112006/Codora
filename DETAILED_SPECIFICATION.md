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
* **Q5:** *(Em curso)*
