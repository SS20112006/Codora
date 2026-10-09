import type { ProjectContract } from '@/features/economy/types'

export interface ContractCardProps {
  contract: ProjectContract
  playerCoins: number
  hasActiveProject?: boolean
  onSelectContract: (contract: ProjectContract) => void
  disabled?: boolean
  className?: string
}

export interface ContractsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onConfirmContract?: (contract: ProjectContract) => void
  contracts?: ProjectContract[]
  className?: string
}
