import React from 'react'
import type { CoderAvatarProps } from './types'

export const CoderAvatar: React.FC<CoderAvatarProps> = ({
  className = '',
  state,
  isFocusing,
  hasHeadphones = false,
  footwear = 'slides_with_socks',
  hoodieColor,
  accessories = {},
  transform,
  'data-testid': testId = 'coder-avatar',
}) => {
  // Determine resolved state: explicit state prop takes precedence, otherwise isFocusing determines coding vs resting
  const resolvedState =
    state ?? (isFocusing === true ? 'coding' : isFocusing === false ? 'resting' : 'coding')

  const isCoding = resolvedState === 'coding'

  // Dynamic colors with default Harvard college coder palette
  const mainHoodieColor = hoodieColor ?? '#1e293b'
  const darkerHoodieColor = '#0f172a'
  const lighterHoodieColor = '#334155'

  return (
    <g
      id="coder-avatar"
      data-testid={testId}
      data-avatar-state={resolvedState}
      className={`coder-avatar codora-avatar transition-transform duration-300 ${className}`}
      transform={transform}
      role="group"
      aria-label={`Avatar do programador (${isCoding ? 'A programar com foco' : 'Em pausa relaxada'})`}
    >
      <defs>
        {/* Subtle SVG inline styles to ensure animations work in all host environments */}
        <style>
          {`
            @keyframes inline-typing-left {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-3px) rotate(-1.5deg); }
              100% { transform: translateY(0.5px) rotate(0.8deg); }
            }
            @keyframes inline-typing-right {
              0% { transform: translateY(0.5px) rotate(0.8deg); }
              50% { transform: translateY(-3.5px) rotate(2deg); }
              100% { transform: translateY(-0.5px) rotate(-1deg); }
            }
            @keyframes inline-breathe {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-2px) scale(1.008); }
            }
            @keyframes inline-focus-head {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-1.2px) rotate(0.8deg); }
            }
            @keyframes inline-resting-head {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-1.5px) rotate(-1.5deg); }
            }
            .animate-avatar-typing-left {
              animation: inline-typing-left 0.18s ease-in-out infinite alternate;
              transform-origin: 468px 322px;
            }
            .animate-avatar-typing-right {
              animation: inline-typing-right 0.16s ease-in-out infinite alternate;
              transform-origin: 472px 324px;
            }
            .animate-avatar-focus-head {
              animation: inline-focus-head 1.4s ease-in-out infinite;
              transform-origin: 470px 290px;
            }
            .animate-avatar-breathe {
              animation: inline-breathe 3.5s ease-in-out infinite;
              transform-origin: 465px 355px;
            }
            .animate-avatar-resting-head {
              animation: inline-resting-head 4.2s ease-in-out infinite;
              transform-origin: 470px 290px;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-avatar-typing-left,
              .animate-avatar-typing-right,
              .animate-avatar-focus-head,
              .animate-avatar-breathe,
              .animate-avatar-resting-head {
                animation: none !important;
              }
            }
          `}
        </style>

        {/* Skin Gradient (Healthy warm student tone) */}
        <linearGradient id="avatarSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbd3b6" />
          <stop offset="70%" stopColor="#e8b28f" />
          <stop offset="100%" stopColor="#d19a77" />
        </linearGradient>

        {/* Hair Gradient (Dark espresso brown) */}
        <linearGradient id="avatarHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e1b10" />
          <stop offset="60%" stopColor="#1e1008" />
          <stop offset="100%" stopColor="#120803" />
        </linearGradient>

        {/* Hoodie Body Gradient */}
        <linearGradient id="avatarHoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighterHoodieColor} />
          <stop offset="50%" stopColor={mainHoodieColor} />
          <stop offset="100%" stopColor={darkerHoodieColor} />
        </linearGradient>

        {/* Sweatpants Gradient (Comfortable heather charcoal) */}
        <linearGradient id="avatarSweatpantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Athletic Socks Gradient (Thick white ribbed cotton) */}
        <linearGradient id="avatarSockGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Slide Sandals Gradient */}
        <linearGradient id="avatarSlideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        {/* Headphones Metallic Ring Gradient */}
        <linearGradient id="avatarHeadphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* ==================================================================== */}
      {/* 1. LOWER BODY: SWEATPANTS & SEATED POSTURE                           */}
      {/* ==================================================================== */}
      <g id="avatar-sweatpants-group" data-testid="avatar-sweatpants">
        {/* Hip & Thighs extending horizontally from chair seat forward to knees */}
        <path
          d="M 444 354 C 440 365 448 375 464 374 L 492 371 C 499 371 503 365 500 357 L 493 352 C 484 350 460 348 444 354 Z"
          fill="url(#avatarSweatpantsGrad)"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Thigh Creases and Folds */}
        <path
          d="M 462 358 Q 476 363 488 359"
          stroke="#1e293b"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* Shins & Calves descending from knee down to ankles */}
        <path
          d="M 488 370 C 496 373 502 380 500 398 L 496 432 C 495 440 488 443 481 441 L 476 436 C 474 425 478 395 488 370 Z"
          fill="url(#avatarSweatpantsGrad)"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Sweatpants Elastic Ribbed Ankle Cuff */}
        <rect
          x="478"
          y="437"
          width="18"
          height="6"
          rx="2"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1"
        />
        <line x1="482" y1="437" x2="482" y2="443" stroke="#334155" strokeWidth="0.8" />
        <line x1="487" y1="437" x2="487" y2="443" stroke="#334155" strokeWidth="0.8" />
        <line x1="492" y1="437" x2="492" y2="443" stroke="#334155" strokeWidth="0.8" />
      </g>

      {/* ==================================================================== */}
      {/* 2. FOOTWEAR: CHINELOS COM MEIAS / SNEAKERS / CROCS                   */}
      {/* ==================================================================== */}
      <g id="avatar-footwear-group" data-testid="avatar-footwear">
        {footwear === 'slides_with_socks' && (
          <g id="avatar-slides-with-socks" data-testid="avatar-footwear-slides-socks">
            {/* White Athletic Tube Sock (Harvard dorm classic) */}
            <path
              d="M 480 442 L 494 442 C 497 447 501 451 506 451 C 510 451 511 454 509 456 L 478 456 C 476 453 477 447 480 442 Z"
              fill="url(#avatarSockGrad)"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            {/* Retro Sporty Double Stripes on Ankle */}
            <line x1="480" y1="445" x2="494" y2="445" stroke="#991b1b" strokeWidth="1.2" />
            <line x1="479" y1="448" x2="493" y2="448" stroke="#1e3a8a" strokeWidth="1.2" />

            {/* Slide Sandal Cushioned Sole resting on floorboards */}
            <rect
              x="474"
              y="455"
              width="36"
              height="5"
              rx="2.2"
              fill="url(#avatarSlideGrad)"
              stroke="#020617"
              strokeWidth="1.2"
            />
            {/* Wide Sporty Slide Footstrap arching over sock */}
            <path
              d="M 484 456 C 484 449 499 448 501 456 Z"
              fill="#0f172a"
              stroke="#020617"
              strokeWidth="1.2"
            />
            {/* Slide Brand Stripe Accent */}
            <path
              d="M 488 455 C 488 451 497 450 498 455"
              stroke="#ffffff"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>
        )}

        {footwear === 'sneakers' && (
          <g id="avatar-sneakers" data-testid="avatar-footwear-sneakers">
            {/* Canvas Sneaker Body */}
            <path
              d="M 480 442 L 493 442 L 507 451 C 511 452 512 455 510 457 L 476 457 C 474 453 476 446 480 442 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            {/* White Rubber Toe Bumper */}
            <path
              d="M 503 451 C 508 451 511 453 510 457 L 501 457 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* White Rubber Sole */}
            <rect
              x="475"
              y="456"
              width="36"
              height="4"
              rx="1.5"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            {/* Laces */}
            <line x1="488" y1="447" x2="497" y2="447" stroke="#ffffff" strokeWidth="1" />
            <line x1="490" y1="450" x2="499" y2="450" stroke="#ffffff" strokeWidth="1" />
          </g>
        )}

        {footwear === 'crocs' && (
          <g id="avatar-crocs" data-testid="avatar-footwear-crocs">
            {/* Foam Clog Body */}
            <path
              d="M 478 444 C 484 443 496 445 506 450 C 511 452 511 457 508 458 L 475 458 C 473 453 474 447 478 444 Z"
              fill="#0d9488"
              stroke="#0f766e"
              strokeWidth="1.2"
            />
            {/* Heel Strap */}
            <path
              d="M 477 447 Q 484 449 487 453"
              stroke="#115e59"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Ventilation Holes */}
            <circle cx="494" cy="449" r="1.3" fill="#134e4a" />
            <circle cx="499" cy="451" r="1.3" fill="#134e4a" />
            <circle cx="504" cy="453" r="1.3" fill="#134e4a" />
            {/* Sole */}
            <rect
              x="474"
              y="457"
              width="35"
              height="3"
              rx="1.2"
              fill="#115e59"
              stroke="#042f2e"
              strokeWidth="0.8"
            />
          </g>
        )}
      </g>

      {/* ==================================================================== */}
      {/* 3. TORSO & HOODIE (College Student Hoodie with Breathing Motion)      */}
      {/* ==================================================================== */}
      <g
        id="avatar-torso-group"
        data-testid="avatar-hoodie"
        className={!isCoding ? 'animate-avatar-breathe' : ''}
      >
        {/* Main Hoodie Torso Body */}
        <path
          d={
            isCoding
              ? /* Leaning forward slightly towards laptop in intense focus */
                'M 446 360 C 440 338 448 316 466 304 C 476 306 488 316 492 334 C 494 345 491 356 478 362 C 466 367 452 366 446 360 Z'
              : /* Reclined comfortably against wooden chair backrest */
                'M 442 360 C 438 338 444 316 462 305 C 472 308 484 318 486 335 C 488 346 485 357 474 362 C 462 366 448 365 442 360 Z'
          }
          fill="url(#avatarHoodieGrad)"
          stroke="#0f172a"
          strokeWidth="1.8"
        />

        {/* Kangaroo Pouch Front Pocket with stitching */}
        <path
          d={
            isCoding
              ? 'M 470 336 L 488 334 C 491 342 489 351 484 354 L 467 356 C 466 348 467 341 470 336 Z'
              : 'M 466 338 L 482 336 C 485 344 483 352 478 355 L 463 357 C 462 350 463 343 466 338 Z'
          }
          fill={darkerHoodieColor}
          stroke="#090d16"
          strokeWidth="1.2"
        />
        {/* Kangaroo Pocket Edge Seam */}
        <path
          d={isCoding ? 'M 472 338 Q 480 348 485 352' : 'M 468 340 Q 476 350 480 354'}
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="2,2"
          fill="none"
          opacity="0.8"
        />

        {/* Drawstrings hanging from hood collar */}
        <g opacity="0.9">
          <line
            x1={isCoding ? '471' : '467'}
            y1={isCoding ? '308' : '310'}
            x2={isCoding ? '473' : '469'}
            y2={isCoding ? '324' : '326'}
            stroke="#f1f5f9"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Metal Aglet Tip 1 */}
          <rect
            x={isCoding ? '472' : '468'}
            y={isCoding ? '324' : '326'}
            width="1.8"
            height="3"
            rx="0.5"
            fill="#94a3b8"
          />

          <line
            x1={isCoding ? '476' : '472'}
            y1={isCoding ? '309' : '311'}
            x2={isCoding ? '477' : '473'}
            y2={isCoding ? '321' : '323'}
            stroke="#f1f5f9"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Metal Aglet Tip 2 */}
          <rect
            x={isCoding ? '476' : '472'}
            y={isCoding ? '321' : '323'}
            width="1.8"
            height="3"
            rx="0.5"
            fill="#94a3b8"
          />
        </g>

        {/* Modular Body Accessory Slot (e.g. lanyard, badge) */}
        {accessories.body && (
          <g id="avatar-accessory-body" data-testid="avatar-accessory-body">
            {accessories.body}
          </g>
        )}
      </g>

      {/* ==================================================================== */}
      {/* 4. HEAD, FACE, HAIR & HOOD (Profile View Facing Right)               */}
      {/* ==================================================================== */}
      <g
        id="avatar-head-group"
        data-testid="avatar-head"
        className={isCoding ? 'animate-avatar-focus-head' : 'animate-avatar-resting-head'}
      >
        {/* Hood Fabric behind neck / draped around back of head */}
        <path
          d={
            isCoding
              ? 'M 454 286 C 448 296 450 310 462 314 C 455 306 454 294 457 286 Z'
              : 'M 450 288 C 444 298 446 312 458 316 C 451 308 450 296 453 288 Z'
          }
          fill={darkerHoodieColor}
          stroke="#090d16"
          strokeWidth="1.2"
        />

        {/* Neck */}
        <path
          d={
            isCoding
              ? 'M 464 295 L 471 294 L 471 308 L 463 307 Z'
              : 'M 460 297 L 467 296 L 467 310 L 459 309 Z'
          }
          fill="url(#avatarSkinGrad)"
        />

        {/* Head Silhouette Base */}
        <circle
          cx={isCoding ? '469' : '465'}
          cy={isCoding ? '283' : '285'}
          r="14"
          fill="url(#avatarSkinGrad)"
        />

        {/* 2D Side Profile Face Structure (Nose, Lips, Chin) */}
        <path
          d={
            isCoding
              ? 'M 474 274 Q 479 278 481 282 L 484 284 L 480 286 L 481 289 C 481 293 477 296 473 296 L 466 295 Z'
              : 'M 470 276 Q 475 280 477 284 L 480 286 L 476 288 L 477 291 C 477 295 473 298 469 298 L 462 297 Z'
          }
          fill="url(#avatarSkinGrad)"
        />

        {/* Ear */}
        <path
          d={
            isCoding
              ? 'M 463 283 C 461 281 461 287 464 288 Z'
              : 'M 459 285 C 457 283 457 289 460 290 Z'
          }
          fill="#d19a77"
        />

        {/* Messy Student Hair Tufts (Late Night Dorm Coder Curls) */}
        <path
          d={
            isCoding
              ? 'M 457 282 C 455 272 463 266 474 268 C 479 269 483 273 482 277 C 479 276 478 274 475 273 C 473 273 470 276 473 278 C 468 277 465 280 467 283 C 462 281 459 284 457 282 Z'
              : 'M 453 284 C 451 274 459 268 470 270 C 475 271 479 275 478 279 C 475 278 474 276 471 275 C 469 275 466 278 469 280 C 464 279 461 282 463 285 C 458 283 455 286 453 284 Z'
          }
          fill="url(#avatarHairGrad)"
        />

        {/* Eyes: Open & Focused with Screen Glow Reflection vs Peaceful Relaxed Closed Curve */}
        {isCoding ? (
          <g id="avatar-eye-coding">
            {/* Focused Eyebrow */}
            <path d="M 473 277 Q 477 277 480 279" stroke="#120803" strokeWidth="1.4" strokeLinecap="round" />
            {/* Eye Sclera */}
            <ellipse cx="477" cy="281" rx="2.5" ry="1.6" fill="#f8fafc" />
            {/* Pupil gazing at glowing laptop screen */}
            <circle cx="478" cy="281" r="1.1" fill="#0f172a" />
            {/* Screen reflection cyan catchlight in pupil */}
            <circle cx="478.4" cy="280.6" r="0.4" fill="#38bdf8" />
          </g>
        ) : (
          <g id="avatar-eye-resting">
            {/* Relaxed Soft Eyebrow */}
            <path d="M 469 279 Q 473 279 476 281" stroke="#1e1008" strokeWidth="1.2" strokeLinecap="round" />
            {/* Contented Closed Eye Arch */}
            <path
              d="M 473 283 Q 475 285 478 283"
              stroke="#1e1008"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Over-ear Studio Headphones Preset (Task 07 / Task 12) */}
        {(hasHeadphones || accessories.head) && (
          <g id="avatar-headphones-group" data-testid="avatar-headphones">
            {hasHeadphones && (
              <g id="default-headphones-preset">
                {/* Padded Headband Arching over Skull */}
                <path
                  d={
                    isCoding
                      ? 'M 462 284 C 460 269 474 265 476 269'
                      : 'M 458 286 C 456 271 470 267 472 271'
                  }
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={
                    isCoding
                      ? 'M 462 284 C 460 270 473 266 475 270'
                      : 'M 458 286 C 456 272 469 268 471 272'
                  }
                  stroke="#334155"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Over-ear Plush Earcup */}
                <ellipse
                  cx={isCoding ? '463' : '459'}
                  cy={isCoding ? '284' : '286'}
                  rx="4.2"
                  ry="6"
                  fill="#090d16"
                  stroke="#1e293b"
                  strokeWidth="1.2"
                />

                {/* Metallic Accent Ring on Earcup */}
                <ellipse
                  cx={isCoding ? '463' : '459'}
                  cy={isCoding ? '284' : '286'}
                  rx="2.6"
                  ry="3.8"
                  fill="url(#avatarHeadphoneGrad)"
                />
              </g>
            )}

            {/* Modular Head Accessory Slot */}
            {accessories.head}
          </g>
        )}
      </g>

      {/* ==================================================================== */}
      {/* 5. ARMS & HANDS (Dynamic Typing vs Resting Animations)               */}
      {/* ==================================================================== */}
      {isCoding ? (
        <g id="avatar-arms-typing-group" data-testid="avatar-arms-typing">
          {/* Far Left Arm (Background Layer reaching to keyboard) */}
          <g className="animate-avatar-typing-left">
            {/* Left Upper Arm & Sleeve */}
            <path
              d="M 468 318 Q 480 326 496 332"
              stroke={darkerHoodieColor}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand & Typing Fingers tapping keyboard */}
            <ellipse cx="503" cy="334" rx="3.5" ry="2" fill="#d19a77" />
            <line x1="503" y1="334" x2="507" y2="335" stroke="#d19a77" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* Near Right Arm (Foreground Layer reaching actively to keyboard) */}
          <g className="animate-avatar-typing-right">
            {/* Right Shoulder & Upper Arm */}
            <path
              d="M 464 316 C 468 326 476 333 490 334 L 512 334"
              stroke={mainHoodieColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hoodie Cuff Ribbing on Right Arm */}
            <line x1="507" y1="332" x2="507" y2="336" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

            {/* Right Hand & Fingers rapidly tapping laptop keys */}
            <ellipse cx="515" cy="334" rx="4" ry="2.2" fill="url(#avatarSkinGrad)" />
            {/* Articulated Typing Fingers */}
            <path
              d="M 515 334 Q 519 332 522 334 M 514 335 Q 518 335 521 336"
              stroke="#e8b28f"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      ) : (
        <g id="avatar-arms-resting-group" data-testid="avatar-arms-resting">
          {/* Relaxed Arms resting on lap / desk during breaks */}
          <g className="animate-avatar-breathe">
            {/* Upper Arm resting along side */}
            <path
              d="M 460 318 C 463 328 468 338 476 345 L 488 349"
              stroke={mainHoodieColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hoodie Wrist Cuff */}
            <line x1="485" y1="347" x2="487" y2="351" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

            {/* Relaxed Rested Hand resting comfortably on thigh */}
            <ellipse cx="492" cy="350" rx="4" ry="2.5" fill="url(#avatarSkinGrad)" />
          </g>
        </g>
      )}

      {/* ==================================================================== */}
      {/* 6. MODULAR CUSTOM ACCESSORY SLOT                                     */}
      {/* ==================================================================== */}
      {accessories.custom && (
        <g id="avatar-accessory-custom" data-testid="avatar-accessory-custom">
          {accessories.custom}
        </g>
      )}
    </g>
  )
}

export default CoderAvatar
