import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Briefcase,
  Coins,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react'
import { useGameStore } from '@/features/state'
import type { ProjectContract } from '@/features/economy/types'
import { ContractCard } from './ContractCard'
import type { ContractsDrawerProps } from './types'

export const ContractsDrawer: React.FC<ContractsDrawerProps> = ({
  isOpen,
  onClose,
  onConfirmContract,
  contracts: propContracts,
  className = '',
}) => {
  const storeContracts = useGameStore((state) => state.availableContracts)
  const refreshContractsMarket = useGameStore((state) => state.refreshContractsMarket)
  const playerCoins = useGameStore((state) => state.profile.devCoins)
  const activeProject = useGameStore((state) => state.activeProject)
  const startProject = useGameStore((state) => state.startProject)

  const contracts = propContracts ?? storeContracts

  // Close on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectContract = (contract: ProjectContract) => {
    // 1. Lock the coins and set active project via store
    const started = startProject(contract)
    if (!started) return

    // 2. Notify parent listener to launch pomodoro countdown with contract duration
    onConfirmContract?.(contract)

    // 3. Close the drawer seamlessly
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Translucent Backdrop: allows user to see their room in the background */}
          <motion.div
            key="contracts-backdrop"
            data-testid="contracts-drawer-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
          />

          {/* Smooth Sliding Drawer with Glassmorphism */}
          <motion.aside
            key="contracts-drawer"
            data-testid="contracts-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mercado de Contratos e Staking"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg bg-codora-surface/95 backdrop-blur-2xl border-l border-codora-border shadow-2xl z-50 flex flex-col text-codora-text ${className}`}
          >
            {/* Header: Title, Balance & Close */}
            <div className="p-4 sm:p-6 border-b border-codora-border bg-codora-surface/90 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold typography-display leading-tight text-codora-text tracking-tight">
                      Mercado de Contratos
                    </h3>
                    <p className="text-xs typography-text text-codora-text-muted">
                      Escolhe um desafio, aposta com staking e foca-te
                    </p>
                  </div>
                </div>

                {/* Close Button (Apple HIG touch target 44x44px) */}
                <button
                  type="button"
                  data-testid="btn-close-contracts-drawer"
                  aria-label="Fechar painel de contratos"
                  onClick={onClose}
                  className="min-touch-target p-2.5 rounded-xl text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-transparent hover:border-codora-border transition active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-bar: Player Balance & Market Refresh Action */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-codora-border/50">
                <div
                  data-testid="drawer-player-balance"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-codora-bg/70 border border-codora-border text-xs"
                >
                  <Coins className="w-3.5 h-3.5 text-codora-coin shrink-0" />
                  <span className="text-codora-text-muted">Saldo Atual:</span>
                  <strong className="text-codora-text font-bold">{playerCoins} DevCoins</strong>
                </div>

                <button
                  type="button"
                  data-testid="btn-refresh-contracts-market"
                  onClick={refreshContractsMarket}
                  className="min-touch-target px-3 py-1.5 rounded-lg text-xs font-medium text-codora-text-muted hover:text-codora-text bg-codora-bg/60 hover:bg-white/5 border border-codora-border flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renovar Mercado</span>
                </button>
              </div>
            </div>

            {/* Active Project Banner if one is ongoing */}
            {activeProject && (
              <div
                data-testid="drawer-active-project-notice"
                className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200"
              >
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">
                    Tens um projeto ativo: &ldquo;{activeProject.title}&rdquo;
                  </span>
                  <p className="mt-0.5 text-amber-200/80">
                    Se aceitares um novo contrato, o atual será substituído.
                  </p>
                </div>
              </div>
            )}

            {/* Scrollable Contracts List */}
            <div
              data-testid="contracts-list"
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            >
              {contracts && contracts.length > 0 ? (
                contracts.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    playerCoins={playerCoins}
                    hasActiveProject={Boolean(activeProject)}
                    onSelectContract={handleSelectContract}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-codora-text-muted space-y-3">
                  <Sparkles className="w-8 h-8 text-amber-400/50 mx-auto" />
                  <p className="text-sm">Nenhum contrato disponível no momento.</p>
                  <button
                    type="button"
                    onClick={refreshContractsMarket}
                    className="min-touch-target px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Gerar Novos Contratos
                  </button>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="p-3 sm:p-4 border-t border-codora-border bg-codora-surface/80 text-center text-[11px] text-codora-text-muted">
              <span>
                O staking bloqueia as tuas moedas durante o Pomodoro. Conclui com sucesso para
                receber o lucro e XP!
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContractsDrawer
