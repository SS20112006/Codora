# ADR 0008: Fullscreen Viewport e Adoção de Game Engine 2D (PixiJS) para Evolução Gráfica

* **Status:** Aceite (Accepted)
* **Data:** 2026-10-09
* **Decisores:** Simão Sousa (Lead Developer), Antigravity (Pair AI)
* **Contexto:** Alinhamento estratégico de experiência do utilizador e fidelidade estética do jogo.

---

## 1. Contexto e Problema

O Codora foi concebido como um simulador de carreira/idle dev game inspirado em títulos como *PewDiePie's Tuber Simulator* e *Game Dev Tycoon*. No entanto, as iterações iniciais apresentavam duas limitações de design que comprometiam a imersão de "jogo real":

1. **Layout Estrutural Web:** O quarto universitário estava confinado a uma caixa com aspect-ratio fixo (`aspect-video`) no meio da página, cercado por cabeçalho tradicional, espaçamentos brancos e rodapé de texto, dando a sensação de website corporativo/dashboard e não de um jogo imersivo.
2. **Representação Gráfica com Primitivas Geométricas:** Os elementos do quarto (secretária, computador, avatar, janela) eram desenhados usando primitivas vetoriais matemáticas (`<rect>`, `<circle>`, `<path>`) sem texturas, sombras reais de materiais ou assets de arte de jogo, resultando num aspeto geométrico abstrato em vez de um videojogo comercial.

## 2. Decisões Tomadas

### A. Viewport Fullscreen Imersivo (`100vw` $\times$ `100vh`)
* O cenário da sala passa a ser a base absoluta de toda a aplicação, ocupando 100% da área útil do ecrã (`w-screen h-screen overflow-hidden`).
* Eliminou-se o conceito de documento web paginado (sem barras de rolagem vertical, sem rodapés estáticos).
* **HUDs e Modais Integrados (Overlays):**
  * A `TopHudBar` flutua no topo como barra de estado superior translúcida.
  * O `PomodoroClockWidget` e o `ProjectStatusCard` flutuam na parte inferior sobre o cenário sem obstruir a visão do avatar.
  * Todos os painéis adicionais (Mercado de Contratos, Loja, Conquistas, Definições) abrem em painéis deslizantes laterais (*drawers*) ou modais com *glassmorphism* e *backdrop-blur*, mantendo o quarto sempre visível e vivo no fundo.

### B. Avaliação e Seleção de Motor Gráfico 2D

Para evoluir além das formas geométricas procedurais SVG, foram avaliadas três tecnologias principais:

| Critério | SVG Declarativo Atual | Phaser 3 | PixiJS (`pixi.js` + `@pixi/react`) |
| :--- | :--- | :--- | :--- |
| **Estética Visual** | Limitado a formas planas simples | Excelente (Spritesheets / Atlas) | Excelente (Spritesheets / Shaders / Luz 2D) |
| **Integração com React 19** | Nativo (JSX DOM) | Complexo (Canvas imperativo externo) | Fluido via `@pixi/react` / `<Stage>` |
| **Performance e GPU** | CPU/DOM-bound (quedas com muitas tags) | WebGL acelerado | WebGL / WebGPU ultra rápido |
| **Shaders & Iluminação** | Apenas filtros CSS/SVG básicos | Suporta pipelines WebGL | Shaders nativos para luz de candeeiro/dia |
| **Bundle Size** | 0 KB adicionais | ~1 MB | ~200-300 KB |

**Decisão:** Adotar **PixiJS** com pipeline de **Spritesheets / Texture Atlases 2D**:
* Permite manter o ecossistema React 19 + Zustand para o estado do jogo e HUDs.
* Substitui as primitivas geométricas procedurais por assets ilustrados/pixel-art de alta fidelidade (texturas de madeira nobre, monitores com brilho fosforescente, iluminação volumétrica dinâmica da janela e ciclos de animação frame-a-frame do avatar).

## 3. Consequências e Plano de Transição

* **Positivas:**
  * Sensação imediata de videojogo profissional e imersivo.
  * Interface perfeitamente responsiva e focada no quarto do programador.
  * Escalabilidade para efeitos visuais avançados (partículas de chuva na janela, fumo da chávena de café, iluminação ambiente reativa).
* **Mitigações:**
  * O código SVG atual foi refatorado para preencher o viewport fullscreen imediatamente como transição estável.
  * A integração completa de sprites PixiJS será executada mantendo a compatibilidade estrita com os testes existentes e o core loop de Pomodoro.
