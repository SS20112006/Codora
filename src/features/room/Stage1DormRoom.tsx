import React from 'react'
import type { Stage1DormRoomProps } from './types'
import { CoderAvatar } from '../avatar'

export const Stage1DormRoom: React.FC<Stage1DormRoomProps> = ({
  className = '',
  isFocusing = false,
  ambience = 'night',
  slots = {},
  'data-testid': testId = 'stage1-dorm-room',
}) => {
  return (
    <div
      data-testid={testId}
      className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-[#0b0d14] border border-codora-border shadow-2xl select-none ${className}`}
    >
      <svg
        role="img"
        aria-label="Dormitório Universitário da Fase 1: The Social Network"
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
      >
        <title>Dormitório Universitário da Fase 1</title>
        <desc>
          Cenário 2D ortográfico do quarto universitário de Mark Zuckerberg em Harvard,
          com mesa de madeira, portátil, cabos, caixa de pizza e notas na parede.
        </desc>

        <defs>
          {/* Wall Gradients */}
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#141824" />
            <stop offset="70%" stopColor="#181d2c" />
            <stop offset="100%" stopColor="#121622" />
          </linearGradient>

          {/* Wainscot Wood Paneling */}
          <linearGradient id="wainscotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1d15" />
            <stop offset="100%" stopColor="#1d130e" />
          </linearGradient>

          {/* Hardwood Floorboards */}
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#301f16" />
            <stop offset="40%" stopColor="#241710" />
            <stop offset="100%" stopColor="#170f0b" />
          </linearGradient>

          {/* Day, Sunset, and Night Sky Gradients */}
          <linearGradient id="nightSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#05070d" />
            <stop offset="50%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          <linearGradient id="daySkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id="sunsetSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="45%" stopColor="#b91c1c" />
            <stop offset="85%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Laptop Screen Glow Gradient */}
          <radialGradient id="screenGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={isFocusing ? 0.35 : 0.15} />
            <stop offset="60%" stopColor="#0284c7" stopOpacity={isFocusing ? 0.18 : 0.05} />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Desk Wood Finish */}
          <linearGradient id="deskTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a532d" />
            <stop offset="40%" stopColor="#784724" />
            <stop offset="100%" stopColor="#5c3418" />
          </linearGradient>

          <linearGradient id="deskLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#532f17" />
            <stop offset="50%" stopColor="#693c1d" />
            <stop offset="100%" stopColor="#432612" />
          </linearGradient>

          {/* Pizza Box Cardboard */}
          <linearGradient id="pizzaBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b48c60" />
            <stop offset="100%" stopColor="#966f44" />
          </linearGradient>

          {/* Soda Can Metallic Gradient */}
          <linearGradient id="sodaCanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#f87171" />
            <stop offset="70%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* 1. ROOM ARCHITECTURE (Ceiling, Back Wall, Molding, Floor)       */}
        {/* ============================================================== */}
        {/* Back Wall */}
        <rect x="0" y="0" width="960" height="420" fill="url(#wallGrad)" />

        {/* Subtle Harvard Dorm Brick Accent on Far Left/Right */}
        <g opacity="0.12" stroke="#ffffff" strokeWidth="1" fill="none">
          {/* Subtle Brick Lines */}
          <line x1="0" y1="60" x2="60" y2="60" />
          <line x1="0" y1="90" x2="80" y2="90" />
          <line x1="0" y1="120" x2="50" y2="120" />
          <line x1="0" y1="150" x2="70" y2="150" />
          <line x1="880" y1="60" x2="960" y2="60" />
          <line x1="890" y1="90" x2="960" y2="90" />
          <line x1="870" y1="120" x2="960" y2="120" />
          <line x1="900" y1="150" x2="960" y2="150" />
        </g>

        {/* Top Crown Molding */}
        <rect x="0" y="0" width="960" height="14" fill="#0d111a" />
        <line x1="0" y1="14" x2="960" y2="14" stroke="#252c3e" strokeWidth="2" />

        {/* Lower Wainscot Paneling */}
        <rect x="0" y="360" width="960" height="60" fill="url(#wainscotGrad)" />
        <rect x="0" y="356" width="960" height="6" fill="#3d281e" />
        {/* Wainscot Vertical Slats */}
        {[80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880].map((x) => (
          <line key={x} x1={x} y1="362" x2={x} y2="420" stroke="#170f0b" strokeWidth="2" opacity="0.6" />
        ))}

        {/* Baseboard Trim */}
        <rect x="0" y="416" width="960" height="8" fill="#1b110b" />

        {/* Wooden Floorboards */}
        <rect x="0" y="420" width="960" height="120" fill="url(#floorGrad)" />
        {/* Floorboard Separators with perspective depth */}
        <g stroke="#120c08" strokeWidth="1.5" opacity="0.8">
          <line x1="0" y1="445" x2="960" y2="445" />
          <line x1="0" y1="475" x2="960" y2="475" />
          <line x1="0" y1="510" x2="960" y2="510" />
          {/* Vertical seams */}
          <line x1="180" y1="420" x2="180" y2="445" />
          <line x1="420" y1="420" x2="420" y2="445" />
          <line x1="700" y1="420" x2="700" y2="445" />
          <line x1="280" y1="445" x2="280" y2="475" />
          <line x1="560" y1="445" x2="560" y2="475" />
          <line x1="840" y1="445" x2="840" y2="475" />
          <line x1="140" y1="475" x2="140" y2="510" />
          <line x1="460" y1="475" x2="460" y2="510" />
          <line x1="760" y1="475" x2="760" y2="510" />
        </g>

        {/* Floor Decor Slot (Rug / Custom mat) */}
        {slots.floorDecor && (
          <g id="slot-floor-decor" data-testid="dorm-slot-floor-decor">
            {slots.floorDecor}
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. BACKGROUND WINDOW (Harvard Courtyard / Sky View)             */}
        {/* ============================================================== */}
        <g id="window-group" data-testid="dorm-window">
          {/* Outer Window Arch/Frame */}
          <rect x="70" y="45" width="220" height="280" rx="6" fill="#1b120c" stroke="#3d291c" strokeWidth="4" />

          {/* Window Glass / Ambience Content */}
          <g clipPath="url(#windowClip)">
            <clipPath id="windowClip">
              <rect x="76" y="51" width="208" height="268" rx="3" />
            </clipPath>

            {/* Custom Window Ambience Slot (Task 08) or Default Night Ambience */}
            {slots.windowAmbience ? (
              slots.windowAmbience
            ) : (
              <g id="default-window-sky">
                {/* Sky Backdrop based on ambience */}
                <rect
                  x="76"
                  y="51"
                  width="208"
                  height="268"
                  fill={
                    ambience === 'day'
                      ? 'url(#daySkyGrad)'
                      : ambience === 'sunset'
                      ? 'url(#sunsetSkyGrad)'
                      : 'url(#nightSkyGrad)'
                  }
                />

                {/* Day / Sunset Sun or Night Moon & Stars */}
                {ambience === 'day' ? (
                  <circle cx="230" cy="95" r="18" fill="#fef08a" opacity="0.95" filter="url(#glowFilter)" />
                ) : ambience === 'sunset' ? (
                  <circle cx="210" cy="120" r="22" fill="#fbbf24" opacity="0.9" filter="url(#glowFilter)" />
                ) : (
                  <>
                    {/* Stars */}
                    <circle cx="100" cy="80" r="1.5" fill="#ffffff" opacity="0.8" />
                    <circle cx="140" cy="65" r="1.2" fill="#ffffff" opacity="0.6" />
                    <circle cx="190" cy="95" r="1.8" fill="#ffffff" opacity="0.9" />
                    <circle cx="230" cy="75" r="1" fill="#ffffff" opacity="0.5" />
                    <circle cx="260" cy="110" r="1.4" fill="#ffffff" opacity="0.75" />
                    <circle cx="115" cy="130" r="1.2" fill="#ffffff" opacity="0.4" />
                    <circle cx="165" cy="140" r="1" fill="#ffffff" opacity="0.7" />

                    {/* Crescent Moon */}
                    <path
                      d="M 235 85 A 16 16 0 1 0 248 108 A 13 13 0 1 1 235 85 Z"
                      fill="#fef08a"
                      opacity="0.9"
                      filter="url(#glowFilter)"
                    />
                  </>
                )}

                {/* Distant Harvard Rooftop Silhouette & Spire */}
                <path
                  d="M 76 270 L 110 245 L 145 270 L 170 230 L 180 200 L 190 230 L 220 270 L 255 250 L 284 275 L 284 320 L 76 320 Z"
                  fill="#060913"
                />
                {/* Small warm window lights on distant campus building */}
                <rect x="120" y="275" width="5" height="7" fill="#fbbf24" opacity={ambience === 'day' ? 0.2 : 0.7} />
                <rect x="135" y="275" width="5" height="7" fill="#fbbf24" opacity={ambience === 'day' ? 0.2 : 0.5} />
                <rect x="230" y="280" width="5" height="7" fill="#fbbf24" opacity={ambience === 'day' ? 0.2 : 0.8} />
              </g>
            )}
          </g>

          {/* Window Frame Panes (Mullions) */}
          <line x1="180" y1="51" x2="180" y2="319" stroke="#2a1c12" strokeWidth="6" />
          <line x1="76" y1="135" x2="284" y2="135" stroke="#2a1c12" strokeWidth="5" />
          <line x1="76" y1="225" x2="284" y2="225" stroke="#2a1c12" strokeWidth="5" />

          {/* Inner Highlights on Wood */}
          <line x1="78" y1="53" x2="282" y2="53" stroke="#533725" strokeWidth="2" opacity="0.6" />

          {/* Sturdy Window Sill */}
          <rect x="62" y="318" width="236" height="14" rx="2" fill="#342217" stroke="#4a3121" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* 3. WALL NOTES & CORKBOARD (The Social Network Algorithms)       */}
        {/* ============================================================== */}
        <g id="wall-notes-group" data-testid="dorm-wall-notes">
          {/* Wooden Corkboard Frame */}
          <rect x="340" y="50" width="290" height="175" rx="4" fill="#a47545" stroke="#5e3e20" strokeWidth="4" />
          {/* Cork Surface */}
          <rect x="346" y="56" width="278" height="163" rx="2" fill="#c49764" />
          {/* Cork texture lines */}
          <g opacity="0.15" stroke="#523214" strokeWidth="1">
            <line x1="360" y1="70" x2="380" y2="70" />
            <line x1="430" y1="90" x2="455" y2="90" />
            <line x1="510" y1="65" x2="540" y2="65" />
            <line x1="390" y1="140" x2="420" y2="140" />
            <line x1="480" y1="175" x2="510" y2="175" />
            <line x1="560" y1="130" x2="585" y2="130" />
          </g>

          {/* Sticky Note 1: Yellow - FACEMASH Concept Header */}
          <g transform="rotate(-3 380 90)">
            <rect x="360" y="70" width="85" height="55" rx="2" fill="#fef08a" stroke="#eab308" strokeWidth="1" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <circle cx="402" cy="74" r="3" fill="#dc2626" /> {/* Pushpin */}
            <text x="366" y="88" fill="#713f12" fontSize="9" fontWeight="bold" fontFamily="monospace">
              FACEMASH
            </text>
            <text x="366" y="100" fill="#854d0e" fontSize="7" fontFamily="monospace">
              Kirkland vs Eliot
            </text>
            <text x="366" y="112" fill="#a16207" fontSize="6.5" fontFamily="monospace">
              chess rating idea
            </text>
          </g>

          {/* Sticky Note 2: Cyan - Elo Algorithm Formula */}
          <g transform="rotate(2 490 100)">
            <rect x="460" y="75" width="145" height="60" rx="2" fill="#cffafe" stroke="#06b6d4" strokeWidth="1" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <circle cx="532" cy="79" r="3" fill="#2563eb" /> {/* Pushpin */}
            <text x="468" y="93" fill="#155e75" fontSize="8" fontWeight="bold" fontFamily="monospace">
              E_A = 1/(1+10^((R_B-R_A)/400))
            </text>
            <text x="468" y="107" fill="#0e7490" fontSize="7" fontFamily="monospace">
              Eduardo Sav formula
            </text>
            <text x="468" y="121" fill="#0891b2" fontSize="6.5" fontFamily="monospace">
              W_A = actual score (1 or 0)
            </text>
          </g>

          {/* Sticky Note 3: Pink - Architecture / Git Commit */}
          <g transform="rotate(-4 410 165)">
            <rect x="375" y="145" width="105" height="52" rx="2" fill="#fce7f3" stroke="#ec4899" strokeWidth="1" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <circle cx="427" cy="149" r="3" fill="#059669" /> {/* Pushpin */}
            <text x="383" y="163" fill="#9d174d" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              git commit -m 'init'
            </text>
            <text x="383" y="176" fill="#be185d" fontSize="6.5" fontFamily="monospace">
              Apache + PHP + MySQL
            </text>
            <text x="383" y="188" fill="#db2777" fontSize="6" fontFamily="monospace">
              TODO: ship MVP before 2am
            </text>
          </g>

          {/* Diagram Connector String / Red Thread */}
          <path d="M 430 115 Q 460 145 490 120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,2" fill="none" opacity="0.8" />

          {/* Sticky Note 4: Green - Quick Flowchart / Notes */}
          <g transform="rotate(3 550 160)">
            <rect x="520" y="145" width="85" height="50" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <circle cx="562" cy="149" r="3" fill="#eab308" /> {/* Pushpin */}
            <text x="528" y="163" fill="#166534" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              DB Schema
            </text>
            <text x="528" y="175" fill="#15803d" fontSize="6.5" fontFamily="monospace">
              users(id, name, pic)
            </text>
            <text x="528" y="186" fill="#16a34a" fontSize="6.5" fontFamily="monospace">
              ratings(dev_xp, coins)
            </text>
          </g>
        </g>

        {/* Wall Decor Slot (Task 12 posters / shelves) */}
        {slots.wallDecor ? (
          <g id="slot-wall-decor" data-testid="dorm-slot-wall-decor">
            {slots.wallDecor}
          </g>
        ) : (
          /* Default Wall Bookshelf on the right */
          <g id="default-bookshelf">
            {/* Shelf Wood */}
            <rect x="670" y="90" width="190" height="12" rx="2" fill="#532f17" stroke="#3b1f0c" strokeWidth="2" />
            {/* Shelf Brackets */}
            <path d="M 690 102 L 690 125 L 702 102 Z" fill="#29160a" />
            <path d="M 830 102 L 830 125 L 842 102 Z" fill="#29160a" />
            {/* Books Stacked */}
            <rect x="685" y="46" width="14" height="44" rx="1" fill="#1e3a8a" />
            <text x="693" y="75" fill="#93c5fd" fontSize="6" fontFamily="monospace" transform="rotate(-90 693 75)">
              CLRS
            </text>
            <rect x="701" y="52" width="12" height="38" rx="1" fill="#065f46" />
            <rect x="715" y="42" width="16" height="48" rx="1" fill="#831843" />
            <text x="724" y="75" fill="#fbcfe8" fontSize="6" fontFamily="monospace" transform="rotate(-90 724 75)">
              SICP
            </text>
            <rect x="733" y="56" width="10" height="34" rx="1" fill="#713f12" />
            {/* Leaning Book */}
            <g transform="rotate(15 750 88)">
              <rect x="745" y="48" width="12" height="40" rx="1" fill="#475569" />
            </g>
            {/* Harvard Pennant Banner */}
            <polygon points="790,52 855,68 790,84" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <text x="796" y="71" fill="#fef2f2" fontSize="8" fontWeight="bold" fontFamily="serif">
              HARVARD
            </text>
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. EXPOSED CABLES & POWER STRIP ON FLOOR                        */}
        {/* ============================================================== */}
        <g id="cables-group" data-testid="dorm-cables">
          {/* Wall Outlet behind desk */}
          <rect x="580" y="390" width="22" height="28" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="587" cy="400" r="2" fill="#475569" />
          <circle cx="595" cy="400" r="2" fill="#475569" />

          {/* Heavy Multi-Outlet Power Strip on the floor */}
          <rect x="610" y="450" width="95" height="24" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* Red Glowing Rocker Switch */}
          <rect x="616" y="456" width="8" height="12" rx="1" fill="#ef4444" filter="url(#glowFilter)" />
          {/* Sockets */}
          <rect x="632" y="457" width="12" height="10" rx="2" fill="#0f172a" />
          <rect x="652" y="457" width="12" height="10" rx="2" fill="#0f172a" />
          <rect x="672" y="457" width="12" height="10" rx="2" fill="#0f172a" />
          <rect x="692" y="457" width="8" height="10" rx="2" fill="#0f172a" />

          {/* Tangled Cables dangling from desk to power strip and floor */}
          {/* Cable 1: Laptop power cord dangling down */}
          <path
            d="M 505 352 Q 520 390 535 410 T 570 435 Q 600 450 638 460"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cable 2: Snake cable looped on the floor */}
          <path
            d="M 620 468 Q 600 485 570 475 Q 545 465 530 480 Q 510 495 480 485"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cable 3: White charger cable loosely hanging behind desk */}
          <path
            d="M 450 352 Q 460 380 440 405 Q 420 430 450 455"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cable 4: Black cord to wall outlet */}
          <path
            d="M 590 412 Q 600 430 615 455"
            stroke="#020617"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ============================================================== */}
        {/* 5. STUDY DESK & WOODEN CHAIR                                    */}
        {/* ============================================================== */}
        <g id="desk-group" data-testid="dorm-desk">
          {/* Left Desk Leg */}
          <rect x="360" y="348" width="16" height="105" rx="2" fill="url(#deskLegGrad)" stroke="#381e0e" strokeWidth="2" />
          {/* Right Desk Leg */}
          <rect x="730" y="348" width="16" height="105" rx="2" fill="url(#deskLegGrad)" stroke="#381e0e" strokeWidth="2" />
          {/* Back Crossbar for stability */}
          <rect x="376" y="390" width="354" height="12" fill="#432612" stroke="#2c170a" strokeWidth="1.5" />

          {/* Under-desk Drawer Unit on Right Side */}
          <rect x="660" y="352" width="80" height="75" rx="2" fill="#5c3418" stroke="#3b1f0c" strokeWidth="2" />
          {/* Drawer 1 */}
          <rect x="665" y="357" width="70" height="30" rx="1" fill="#6d3e1d" stroke="#4a2711" strokeWidth="1" />
          <rect x="692" y="370" width="16" height="4" rx="2" fill="#d97706" /> {/* Brass handle */}
          {/* Drawer 2 */}
          <rect x="665" y="391" width="70" height="30" rx="1" fill="#6d3e1d" stroke="#4a2711" strokeWidth="1" />
          <rect x="692" y="404" width="16" height="4" rx="2" fill="#d97706" />

          {/* Main Desktop Surface */}
          <rect x="340" y="336" width="420" height="18" rx="3" fill="url(#deskTopGrad)" stroke="#381e0e" strokeWidth="2" />
          {/* Desktop Edge Highlight */}
          <line x1="342" y1="338" x2="758" y2="338" stroke="#a3663b" strokeWidth="2" opacity="0.8" />

          {/* Simple Wooden Dorm Chair */}
          <g id="dorm-chair">
            {/* Backrest Slats */}
            <rect x="445" y="300" width="8" height="65" rx="2" fill="#432612" />
            <rect x="475" y="300" width="8" height="65" rx="2" fill="#432612" />
            <rect x="440" y="295" width="48" height="12" rx="3" fill="#5c3418" stroke="#381e0e" strokeWidth="1.5" />
            {/* Chair Seat */}
            <rect x="430" y="360" width="68" height="10" rx="2" fill="#693c1d" stroke="#381e0e" strokeWidth="1.5" />
            {/* Chair Legs */}
            <line x1="436" y1="370" x2="430" y2="460" stroke="#432612" strokeWidth="6" strokeLinecap="round" />
            <line x1="492" y1="370" x2="498" y2="460" stroke="#432612" strokeWidth="6" strokeLinecap="round" />
            <line x1="432" y1="420" x2="496" y2="420" stroke="#2c170a" strokeWidth="4" />
          </g>

          {/* Desk Lamp Slot (Task 08 / Task 12) or Placeholder */}
          {slots.deskLamp ? (
            <g id="slot-desk-lamp" data-testid="dorm-slot-desk-lamp">
              {slots.deskLamp}
            </g>
          ) : (
            /* Classic Architect Desk Lamp */
            <g id="default-desk-lamp" transform="translate(360, 270)">
              {/* Heavy Base */}
              <ellipse cx="20" cy="65" rx="14" ry="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              {/* Angled Arms */}
              <line x1="20" y1="65" x2="28" y2="35" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="28" y1="35" x2="52" y2="25" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <circle cx="28" cy="35" r="3" fill="#64748b" />
              {/* Lamp Shade Cone */}
              <polygon points="50,15 72,25 60,35" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              {/* Warm Light Glow Cone */}
              <polygon
                points="66,30 30,80 120,80"
                fill="#fef08a"
                opacity={isFocusing ? 0.25 : 0.12}
                filter="url(#glowFilter)"
              />
            </g>
          )}

          {/* Second Monitor Slot (Task 12) */}
          {slots.secondMonitor && (
            <g id="slot-second-monitor" data-testid="dorm-slot-second-monitor">
              {slots.secondMonitor}
            </g>
          )}

          {/* Coffee Mug Slot (Task 12) */}
          {slots.coffeeMug ? (
            <g id="slot-coffee-mug" data-testid="dorm-slot-coffee-mug">
              {slots.coffeeMug}
            </g>
          ) : (
            /* Default Classic White Ceramic Harvard Mug */
            <g id="default-coffee-mug" transform="translate(400, 316)">
              <rect x="0" y="4" width="16" height="17" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Handle */}
              <path d="M 0 8 C -6 8 -6 16 0 16" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
              {/* Coffee Liquid top */}
              <ellipse cx="8" cy="4" rx="7" ry="2" fill="#451a03" />
              {/* Steam wisps when focusing */}
              {isFocusing && (
                <path
                  d="M 6 0 Q 8 -5 6 -10 M 10 1 Q 12 -4 10 -9"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.5"
                  fill="none"
                />
              )}
            </g>
          )}

          {/* Headphones Slot (Task 12) */}
          {slots.headphones && (
            <g id="slot-headphones" data-testid="dorm-slot-headphones">
              {slots.headphones}
            </g>
          )}
        </g>

        {/* ============================================================== */}
        {/* 6. INITIAL STARTER LAPTOP (Open, Angled, Glowing)               */}
        {/* ============================================================== */}
        <g
          id="laptop-group"
          data-testid="dorm-laptop"
          className={isFocusing ? 'is-focusing' : ''}
          transform="translate(480, 275)"
        >
          {/* Radiating Screen Glow Cone */}
          <polygon
            points="35,10 -30,65 110,65"
            fill="url(#screenGlowGrad)"
            opacity={isFocusing ? 0.9 : 0.4}
          />

          {/* Laptop Base / Keyboard Deck */}
          <polygon
            points="0,55 90,55 105,62 -15,62"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Keyboard Keys Recessed Area */}
          <polygon points="6,56 84,56 94,60 -4,60" fill="#0f172a" />
          {/* Glowing Trackpad */}
          <polygon points="36,60 54,60 56,61.5 34,61.5" fill="#475569" />

          {/* Laptop Screen Bezel (Tilted Back) */}
          <polygon
            points="5,8 85,8 90,55 0,55"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Active IDE Screen Display */}
          <polygon points="9,12 81,12 86,51 4,51" fill="#020617" />

          {/* Code Syntax Highlighting Lines inside laptop screen */}
          <g opacity={isFocusing ? 0.95 : 0.75}>
            {/* Tab bar */}
            <line x1="9" y1="16" x2="81" y2="16" stroke="#1e293b" strokeWidth="1" />
            <circle cx="14" cy="14" r="1.5" fill="#ef4444" />
            <circle cx="19" cy="14" r="1.5" fill="#eab308" />
            <circle cx="24" cy="14" r="1.5" fill="#22c55e" />

            {/* Line 1: Keyword + Identifier */}
            <line x1="12" y1="21" x2="26" y2="21" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="21" x2="52" y2="21" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Line 2: Indented Loop / Function */}
            <line x1="18" y1="26" x2="38" y2="26" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="41" y1="26" x2="68" y2="26" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />

            {/* Line 3: Math formula Elo calculation */}
            <line x1="22" y1="31" x2="48" y2="31" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="51" y1="31" x2="76" y2="31" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Line 4: Return statement */}
            <line x1="18" y1="36" x2="32" y2="36" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="35" y1="36" x2="55" y2="36" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />

            {/* Line 5: Closing brace */}
            <line x1="12" y1="41" x2="16" y2="41" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Blinking Cursor */}
            <line
              x1="20"
              y1="41"
              x2="20"
              y2="45"
              stroke="#38bdf8"
              strokeWidth="1.5"
              className={isFocusing ? 'animate-pulse' : ''}
            />
          </g>
        </g>

        {/* ============================================================== */}
        {/* 7. AVATAR SLOT (Task 07 character)                              */}
        {/* ============================================================== */}
        {slots.avatar ? (
          <g id="slot-avatar" data-testid="dorm-slot-avatar">
            {slots.avatar}
          </g>
        ) : (
          <CoderAvatar
            isFocusing={isFocusing}
            hasHeadphones={Boolean(slots.headphones)}
            data-testid="dorm-coder-avatar"
          />
        )}


        {/* ============================================================== */}
        {/* 8. SODA CAN (Aluminum Can with Tab)                             */}
        {/* ============================================================== */}
        <g id="soda-can-group" data-testid="dorm-soda-can" transform="translate(635, 318)">
          {/* Soda Can Body */}
          <rect x="0" y="3" width="14" height="22" rx="3" fill="url(#sodaCanGrad)" stroke="#7f1d1d" strokeWidth="1" />
          {/* Top Metallic Rim */}
          <ellipse cx="7" cy="3" rx="6" ry="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Tab on top */}
          <rect x="5.5" y="1.5" width="3" height="3" rx="0.5" fill="#64748b" />
          {/* Condensation Highlight */}
          <line x1="3" y1="6" x2="3" y2="20" stroke="#ffffff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
          {/* Iconic Cola white wave swirl */}
          <path d="M 2 15 Q 7 11 12 16" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.8" />
        </g>

        {/* ============================================================== */}
        {/* 9. PIZZA BOX ON THE FLOOR (Greasy Harvard Kirkland Dorm Classic)*/}
        {/* ============================================================== */}
        <g id="pizza-box-group" data-testid="dorm-pizza-box" transform="translate(230, 445)">
          {/* Shadow under the box */}
          <ellipse cx="60" cy="40" rx="58" ry="10" fill="#0c0805" opacity="0.6" />

          {/* Bottom Cardboard Box Base */}
          <polygon
            points="0,32 105,25 125,38 18,46"
            fill="url(#pizzaBoxGrad)"
            stroke="#634527"
            strokeWidth="1.5"
          />

          {/* Half-Open Lid / Top Flap */}
          <polygon
            points="0,32 105,25 118,12 12,18"
            fill="#c49b6c"
            stroke="#78532c"
            strokeWidth="1.5"
          />

          {/* Retro Pizza Box Print */}
          <g transform="rotate(-4 55 25)">
            <ellipse cx="55" cy="22" rx="22" ry="10" fill="#ef4444" opacity="0.85" />
            <text x="40" y="25" fill="#fef08a" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
              PIZZA
            </text>
          </g>

          {/* Open corner revealing a greasy triangular pizza slice */}
          <polygon points="25,38 58,34 40,43" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          {/* Pepperoni dots on pizza */}
          <circle cx="34" cy="38" r="2.2" fill="#b91c1c" />
          <circle cx="46" cy="37" r="1.8" fill="#b91c1c" />
          <circle cx="38" cy="41" r="1.5" fill="#b91c1c" />

          {/* Crumpled Napkin next to box */}
          <path d="M 125 36 Q 133 30 140 37 Q 135 44 126 40 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* Empty Crushed Second Soda Can on the floor */}
          <g transform="translate(135, 42) rotate(65)">
            <rect x="0" y="0" width="12" height="18" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
            <ellipse cx="6" cy="0" rx="5" ry="1.5" fill="#cbd5e1" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Stage1DormRoom
