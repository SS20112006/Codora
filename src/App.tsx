import React, { useState } from 'react'
import {
  Coins,
  Zap,
  Users,
  Timer,
  Terminal,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react'

export const App: React.FC = () => {
  const [sprintRunning, setSprintRunning] = useState(false)
  const [devCoins] = useState(0)
  const [devXp] = useState(0)
  const [activeUsers] = useState(0)

  return (
    <div className="min-h-screen bg-codora-bg text-codora-text font-sans flex flex-col selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navigation / HUD Bar */}
      <header className="border-b border-codora-border bg-codora-surface/80 backdrop-blur-md px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-violet-500/20 to-emerald-500/20 border border-codora-border flex items-center justify-center">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold typography-display leading-tight text-codora-text tracking-tight">
                Codora
              </h1>
              <p className="text-xs typography-text text-codora-text-muted">
                Fase 1: Quarto Universitário
              </p>
            </div>
          </div>

          {/* Currency / Stats Indicators */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Coins className="w-4 h-4 text-codora-coin" />
              <span className="font-semibold text-codora-text">{devCoins}</span>
              <span className="text-xs text-codora-text-muted">DevCoins</span>
            </div>

            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Zap className="w-4 h-4 text-codora-xp" />
              <span className="font-semibold text-codora-text">{devXp}</span>
              <span className="text-xs text-codora-text-muted">XP (Estudante)</span>
            </div>

            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Users className="w-4 h-4 text-codora-users" />
              <span className="font-semibold text-codora-text">{activeUsers}</span>
              <span className="text-xs text-codora-text-muted">Users</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content / Stage Placeholder */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6 justify-center">
        <section className="bg-codora-surface/60 border border-codora-border rounded-2xl p-8 backdrop-blur-sm text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Core Scaffold v0.1.0 Ativo</span>
            </div>

            <h2 className="text-3xl font-extrabold typography-display text-codora-text">
              O Simulador de Carreira Alimentado por Foco
            </h2>

            <p className="typography-text text-codora-text-muted text-base leading-relaxed max-w-xl">
              Transforma o teu tempo de estudo e programação em progressão real:
              investe DevCoins, corre Pomodoros no quarto de dormitório e evolui até à tua Penthouse.
            </p>

            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setSprintRunning(!sprintRunning)}
                className="min-touch-target px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                {sprintRunning ? (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>Pausar Sessão</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Sprint Gratuito (25m)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-6 flex items-center gap-2 text-xs typography-text text-codora-text-muted bg-codora-bg/80 border border-codora-border px-4 py-2 rounded-xl">
              <Timer className="w-4 h-4 text-orange-400" />
              <span>
                Status do Cronómetro: <strong className="text-codora-text">{sprintRunning ? 'A decorrer (Sprint Ativo)' : 'Pronto para arrancar'}</strong>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-codora-border px-6 py-4 text-center text-xs text-codora-text-muted typography-text">
        <p>Codora — React 19 + TypeScript + Vite + Tailwind CSS + Vitest</p>
      </footer>
    </div>
  )
}

export default App
