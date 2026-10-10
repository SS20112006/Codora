import React from 'react'
import {
  Coins,
  Check,
  Headphones,
  Monitor,
  Coffee,
  SunMedium,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { ShopItemCardProps } from './types'

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  isOwned,
  isEquipped,
  canAfford,
  onPurchase,
  onEquip,
  onUnequip,
  className = '',
}) => {
  const getItemIcon = () => {
    switch (item.slot) {
      case 'headphones':
        return <Headphones className="w-5 h-5 text-violet-400" />
      case 'secondMonitor':
        return <Monitor className="w-5 h-5 text-sky-400" />
      case 'coffeeMug':
        return <Coffee className="w-5 h-5 text-amber-400" />
      case 'deskLamp':
        return <SunMedium className="w-5 h-5 text-emerald-400" />
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />
    }
  }

  const getCategoryLabel = () => {
    switch (item.category) {
      case 'audio':
        return 'Áudio'
      case 'hardware':
        return 'Hardware'
      case 'desk':
        return 'Secretária'
      case 'lighting':
        return 'Iluminação'
      default:
        return item.category
    }
  }

  return (
    <article
      data-testid={`shop-card-${item.id}`}
      aria-label={`Item: ${item.name}`}
      className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-md backdrop-blur-md relative overflow-hidden group ${
        isEquipped
          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/5'
          : isOwned
          ? 'bg-codora-surface/85 border-codora-border hover:border-slate-500/60'
          : 'bg-codora-surface/75 border-codora-border hover:border-sky-500/40'
      } ${className}`}
    >
      {/* Top Header: Icon, Tags, Status */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              {getItemIcon()}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-codora-text-muted">
                {getCategoryLabel()}
              </span>
              {item.tag && (
                <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  {item.tag}
                </span>
              )}
            </div>
          </div>

          {/* Equipped pill */}
          {isEquipped && (
            <span
              data-testid={`badge-equipped-${item.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            >
              <Check className="w-3 h-3 text-emerald-400" />
              Equipado
            </span>
          )}
          {isOwned && !isEquipped && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/20 border border-slate-500/30 text-slate-300">
              No Inventário
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base sm:text-lg font-bold typography-display text-codora-text tracking-tight group-hover:text-sky-300 transition-colors">
          {item.name}
        </h4>

        {/* Description */}
        <p className="mt-1 text-xs typography-text text-codora-text-muted leading-relaxed">
          {item.description}
        </p>

        {/* Benefit Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-violet-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{item.benefit}</span>
        </div>
      </div>

      {/* Bottom Footer: Price & Action CTA */}
      <div className="pt-3 border-t border-codora-border/60 flex items-center justify-between gap-3">
        {/* Price tag */}
        <div className="flex items-center gap-1.5 text-xs text-codora-text-muted">
          {isOwned ? (
            <span className="text-emerald-400 font-medium">Adquirido</span>
          ) : (
            <>
              <Coins className="w-4 h-4 text-codora-coin shrink-0" />
              <strong className="text-base font-bold text-codora-text">
                {item.price}
              </strong>
              <span>DevCoins</span>
            </>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isEquipped ? (
            <button
              type="button"
              data-testid={`btn-unequip-${item.id}`}
              onClick={() => onUnequip(item)}
              aria-label={`Desequipar ${item.name}`}
              className="min-touch-target px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-codora-text-muted hover:text-codora-text border border-codora-border transition active:scale-95 cursor-pointer"
            >
              Desequipar
            </button>
          ) : isOwned ? (
            <button
              type="button"
              data-testid={`btn-equip-${item.id}`}
              onClick={() => onEquip(item)}
              aria-label={`Equipar ${item.name}`}
              className="min-touch-target px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20 transition active:scale-95 cursor-pointer"
            >
              Equipar
            </button>
          ) : (
            <button
              type="button"
              data-testid={`btn-buy-${item.id}`}
              disabled={!canAfford}
              onClick={() => onPurchase(item)}
              aria-label={`Comprar ${item.name} por ${item.price} DevCoins`}
              className={`min-touch-target px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                canAfford
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{canAfford ? 'Comprar' : 'Saldo Insuficiente'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
