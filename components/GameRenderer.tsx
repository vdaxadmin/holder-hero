import React from 'react';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE, OBSTACLE_WIDTH, GAP_SIZE, CANDLE_WIDTH, MARKET_EFFECTS } from '../constants';
import { Obstacle, Powerup, Candle, Particle, FloatingText, MarketMover, MarketIndex } from '../types';

interface GameRendererProps {
  gameState: string;
  playerY: number;
  playerExpression: string;
  isInvincible: boolean;
  hasSpeedBoost: boolean;
  hasDoublePoints: boolean;
  isFrozen: boolean;
  extraLives: number;
  candles: Candle[];
  obstacles: Obstacle[];
  powerups: Powerup[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  buffettActive: boolean;
  buffettCollected: boolean;
  buffettX: number;
  activeMarketMover: MarketMover | null;
  marketMoverTimer: number;
  bossCallActive: boolean;
  bossCallTimer: number;
  bossCallProgress: number;
  currentQuote: string;
  marketIndices: MarketIndex[];
  tickerOffset: number;
  frameCount: number;
  score: number;
  combo: number;
  capital: number;
  profit: number;
  vnIndex: { value: number; trend: string; change: number };
  highScore: number;
  soundEnabled: boolean;
  startProfit: number; // For start check
  gracePeriodActive: boolean;
  onJump: () => void;
  onCashout: () => void;
  onToggleSound: () => void;
}

const GameRenderer: React.FC<GameRendererProps> = (props) => {
  const {
    gameState, playerY, playerExpression, isInvincible, hasSpeedBoost, hasDoublePoints, isFrozen, extraLives,
    candles, obstacles, powerups, particles, floatingTexts,
    buffettActive, buffettCollected, buffettX,
    activeMarketMover, marketMoverTimer,
    bossCallActive, bossCallTimer, bossCallProgress,
    currentQuote, marketIndices, tickerOffset, frameCount,
    score, combo, capital, profit, vnIndex, soundEnabled, startProfit, gracePeriodActive,
    onJump, onCashout, onToggleSound
  } = props;

  const renderObstacle = (obs: Obstacle, index: number) => {
    const baseX = obs.x;
    const gapY = obs.gapY;
    const gapSize = obs.dynamicGapSize || GAP_SIZE;
    const gapEnd = gapY + gapSize;
    const frame = frameCount;

    if (obs.type === 'fud') {
      return (
        <g key={`obs-${index}`}>
          <rect x={baseX - 5} y={0} width={OBSTACLE_WIDTH + 10} height={gapY} fill="#1a1a2e" stroke="#ff6b6b" strokeWidth={2} rx={4} />
          <rect x={baseX} y={5} width={OBSTACLE_WIDTH} height={25} fill="#ff6b6b" />
          <text x={baseX + OBSTACLE_WIDTH/2} y={22} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">📰 BREAKING</text>
          <text x={baseX + OBSTACLE_WIDTH/2} y={50} textAnchor="middle" fontSize="11" fill="#ff6b6b" fontWeight="bold">
            {obs.headline?.slice(0, 15) || 'FUD NEWS!'}
          </text>
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 20} textAnchor="middle" fontSize="30">📉</text>
          <rect x={baseX - 5} y={gapEnd} width={OBSTACLE_WIDTH + 10} height={GAME_HEIGHT - gapEnd} fill="#1a1a2e" stroke="#ff6b6b" strokeWidth={2} rx={4} />
          <rect x={baseX} y={gapEnd + 5} width={OBSTACLE_WIDTH} height={25} fill="#ff6b6b" />
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 22} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">⚠️ ALERT</text>
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 50} textAnchor="middle" fontSize="24">😱</text>
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapY + gapSize/2 + 5} textAnchor="middle" fontSize="14" fill="#ff6b6b" opacity={0.7}>FUD</text>
        </g>
      );
    }
    
    if (obs.type === 'margin') {
      const bombPulse = Math.sin(frame * 0.3) * 0.3 + 1;
      const fuseGlow = (obs.bombTimer || 0) < 15 ? '#ff0' : '#f00';
      return (
        <g key={`obs-${index}`}>
          <rect x={baseX} y={0} width={OBSTACLE_WIDTH} height={gapY} fill="#2d1f1f" rx={8} />
          <circle cx={baseX + OBSTACLE_WIDTH/2} cy={gapY - 50} r={25 * bombPulse} fill="#333" stroke="#ff4757" strokeWidth={3} />
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 42} textAnchor="middle" fontSize="32">💣</text>
          <path d={`M${baseX + OBSTACLE_WIDTH/2} ${gapY - 75} Q${baseX + OBSTACLE_WIDTH/2 + 10} ${gapY - 85} ${baseX + OBSTACLE_WIDTH/2 + 5} ${gapY - 95}`} stroke={fuseGlow} strokeWidth={3} fill="none" />
          <circle cx={baseX + OBSTACLE_WIDTH/2 + 5} cy={gapY - 95} r={5} fill={fuseGlow} />
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 10} textAnchor="middle" fontSize="12" fill="#ff4757" fontWeight="bold">-50% VỐN!</text>
          <rect x={baseX} y={gapEnd} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - gapEnd} fill="#2d1f1f" rx={8} />
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 58} textAnchor="middle" fontSize="32">💥</text>
          <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 102} textAnchor="middle" fontSize="12" fill="#ff4757">CALL!</text>
          <rect x={baseX} y={gapY} width={OBSTACLE_WIDTH} height={gapSize} fill="rgba(255,0,0,0.1)" />
        </g>
      );
    }

    if (obs.type === 'whale') {
        const whaleY = obs.whaleY || 0;
        return (
          <g key={`obs-${index}`}>
            <rect x={baseX} y={0} width={OBSTACLE_WIDTH} height={gapY} fill="#1a3a5c" rx={8} />
            <g transform={`translate(${baseX + OBSTACLE_WIDTH/2}, ${gapY - 60 + whaleY})`}>
              <text textAnchor="middle" fontSize="48" y={15}>🐋</text>
            </g>
            <text x={baseX + OBSTACLE_WIDTH/2} y={42} textAnchor="middle" fontSize="12" fill="#7c7cf7">ALERT!</text>
            <rect x={baseX} y={gapEnd} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - gapEnd} fill="#1a3a5c" rx={8} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 60} textAnchor="middle" fontSize="36">🌊</text>
            <rect x={baseX} y={gapY} width={OBSTACLE_WIDTH} height={gapSize} fill="rgba(83,82,237,0.1)" />
          </g>
        );
    }

    if (obs.type === 'fomo') {
        const flameIntensity = obs.flameIntensity || 0.5;
        return (
          <g key={`obs-${index}`}>
            <rect x={baseX} y={0} width={OBSTACLE_WIDTH} height={gapY} fill={`rgba(255,${100 + flameIntensity * 100},0,0.9)`} rx={8} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={50} textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">FOMO</text>
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 50} textAnchor="middle" fontSize="30">🚀</text>
            <rect x={baseX} y={gapEnd} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - gapEnd} fill={`rgba(255,${100 + flameIntensity * 100},0,0.9)`} rx={8} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 90} textAnchor="middle" fontSize="24">🦍</text>
            <rect x={baseX} y={gapY} width={OBSTACLE_WIDTH} height={gapSize} fill={`rgba(255,165,2,${0.1 + flameIntensity * 0.1})`} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapY + gapSize/2} textAnchor="middle" fontSize="12" fill="#ffa502" opacity={0.8}>HOT ZONE</text>
          </g>
        );
    }

    if (obs.type === 'ice') {
        return (
          <g key={`obs-${index}`}>
            <rect x={baseX} y={0} width={OBSTACLE_WIDTH} height={gapY} fill="#0a2a4a" rx={8} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={40} textAnchor="middle" fontSize="14" fill="#00d4ff" fontWeight="bold">ĐÓNG</text>
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 30} textAnchor="middle" fontSize="36">❄️</text>
            <rect x={baseX} y={gapEnd} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - gapEnd} fill="#0a2a4a" rx={8} />
            <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 50} textAnchor="middle" fontSize="30">🥶</text>
            <rect x={baseX} y={gapY} width={OBSTACLE_WIDTH} height={gapSize} fill={`rgba(0,212,255,0.05)`} />
          </g>
        );
    }

    return (
      <g key={`obs-${index}`}>
        <rect x={baseX} y={0} width={OBSTACLE_WIDTH} height={gapY} fill={obs.color} rx={8} />
        <text x={baseX + OBSTACLE_WIDTH/2} y={gapY - 20} textAnchor="middle" fontSize="30">{obs.emoji}</text>
        <rect x={baseX} y={gapEnd} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - gapEnd} fill={obs.color} rx={8} />
        <text x={baseX + OBSTACLE_WIDTH/2} y={gapEnd + 30} textAnchor="middle" fontSize="30">{obs.emoji}</text>
      </g>
    );
  };

  return (
    <div 
        className="relative rounded-xl overflow-hidden cursor-pointer w-full max-w-[800px] aspect-[4/3] border-[3px] border-[#00ff88]"
        style={{ boxShadow: '0 0 60px rgba(0,255,136,0.3), inset 0 0 60px rgba(0,0,0,0.5)' }}
        onClick={onJump}
        onTouchStart={(e) => { e.preventDefault(); onJump(); }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="50%" stopColor="#162447" />
              <stop offset="100%" stopColor="#1a1a2e" />
            </linearGradient>
            <linearGradient id="greenCandle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00cc66" />
            </linearGradient>
            <linearGradient id="redCandle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4757" />
              <stop offset="100%" stopColor="#cc0022" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <clipPath id="tickerClip">
              <rect x={0} y={0} width={GAME_WIDTH} height={35} />
            </clipPath>
          </defs>
          
          <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="url(#bgGrad)" />
          
          {/* Background Grid */}
          {Array.from({ length: 20 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 30} x2={GAME_WIDTH} y2={i * 30} stroke="rgba(0,255,136,0.1)" />)}
          {Array.from({ length: 30 }).map((_, i) => <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={GAME_HEIGHT} stroke="rgba(0,255,136,0.1)" />)}
          
          {/* Candles */}
          {candles.map((candle, i) => {
            const animatedY = candle.baseY + (candle.targetY || 0);
            const changeColor = candle.isGreen ? '#00ff88' : '#ff4757';
            return (
              <g key={`candle-${i}`}>
                <line x1={candle.x + CANDLE_WIDTH / 2} y1={animatedY - candle.wickTop} x2={candle.x + CANDLE_WIDTH / 2} y2={animatedY + candle.height + candle.wickBottom} stroke={candle.isGreen ? '#00cc66' : '#cc0022'} strokeWidth={2} />
                <rect x={candle.x + 5} y={animatedY} width={CANDLE_WIDTH - 10} height={candle.height} fill={candle.isGreen ? 'url(#greenCandle)' : 'url(#redCandle)'} rx={3} opacity={0.8} />
                <rect x={candle.x - 5} y={animatedY - candle.wickTop - 38} width={CANDLE_WIDTH + 10} height={18} fill="rgba(0,0,0,0.7)" rx={4} />
                <text x={candle.x + CANDLE_WIDTH / 2} y={animatedY - candle.wickTop - 24} textAnchor="middle" fontSize="16" fill={changeColor} fontWeight="bold" style={{ textShadow: '0 0 5px black' }}>{candle.ticker}</text>
                <text x={candle.x + CANDLE_WIDTH / 2} y={animatedY - candle.wickTop - 8} textAnchor="middle" fontSize="12" fill={changeColor} fontWeight="bold" opacity={0.9}>{candle.isGreen ? '+' : ''}{candle.priceChange}%</text>
              </g>
            );
          })}
          
          {/* Obstacles */}
          {obstacles.map(renderObstacle)}
          
          {/* Powerups */}
          {powerups.map((p, i) => (
            <g key={`powerup-${i}`}>
              <circle cx={p.x} cy={p.y} r={25} fill={p.color} opacity={0.3} filter="url(#glow)" />
              <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize="36">{p.emoji}</text>
            </g>
          ))}
          
          {/* Particles */}
          {particles.map((p, i) => <circle key={`particle-${i}`} cx={p.x} cy={p.y} r={3} fill={p.color} opacity={p.life / 20} />)}
          
          {/* Player */}
          <g transform={`translate(80, ${playerY})`}>
            <circle cx={PLAYER_SIZE / 2} cy={PLAYER_SIZE / 2} r={PLAYER_SIZE / 2 + 5} fill={isFrozen ? 'rgba(0,212,255,0.5)' : isInvincible ? 'rgba(0,210,211,0.4)' : hasDoublePoints ? 'rgba(84,160,255,0.4)' : 'rgba(255,215,0,0.2)'} filter="url(#glow)" />
            <text x={-5} y={PLAYER_SIZE / 2 + 5} fontSize="24">💵</text>
            <text x={PLAYER_SIZE - 5} y={PLAYER_SIZE / 2 + 5} fontSize="24" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>💵</text>
            <circle cx={PLAYER_SIZE / 2} cy={PLAYER_SIZE / 2} r={PLAYER_SIZE / 2 - 5} fill={isFrozen ? '#66d9ff' : isInvincible ? '#00d2d3' : '#ffd700'} stroke="#fff" strokeWidth={2} />
            <text x={PLAYER_SIZE / 2} y={PLAYER_SIZE / 2 + 10} textAnchor="middle" fontSize="32">{isFrozen ? '🥶' : playerExpression}</text>
            <text x={PLAYER_SIZE / 2} y={0} textAnchor="middle" fontSize="24">🎩</text>
          </g>
          
          {/* Floating Text */}
          {floatingTexts.map((t) => <text key={t.id} x={t.x} y={t.y} fill={t.color} fontSize="20" fontWeight="bold" opacity={t.life / 60} style={{ textShadow: '0 0 10px black' }}>{t.text}</text>)}

          {/* Buffett Easter Egg */}
          {buffettActive && !buffettCollected && (
            <g transform={`translate(${buffettX}, 60)`}>
              <circle cx={30} cy={30} r={50} fill="rgba(255,215,0,0.3)" filter="url(#glow)" />
              <text x={15} y={45} fontSize="60">🧓</text>
              <rect x={60} y={0} width={120} height={35} fill="rgba(255,255,255,0.95)" rx={10} />
              <text x={70} y={22} fontSize="12" fill="#333" fontWeight="bold">"Be greedy!"</text>
            </g>
          )}

          {/* Market Mover Popup */}
          {activeMarketMover && marketMoverTimer > 0 && activeMarketMover.currentQuote && (
             <g>
              <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill={activeMarketMover.currentQuote.effect === 'pump' ? 'rgba(0,255,136,0.1)' : 'rgba(255,71,87,0.1)'} opacity={0.2} />
              <g transform={`translate(${GAME_WIDTH / 2 - 175}, 140)`}>
                <rect x={-5} y={-5} width={360} height={115} fill="none" stroke={activeMarketMover.color} strokeWidth={3} rx={20} opacity={0.6} />
                <rect x={0} y={0} width={350} height={105} fill="rgba(20,20,35,0.95)" rx={15} stroke={activeMarketMover.color} strokeWidth={2} />
                <circle cx={40} cy={35} r={25} fill={activeMarketMover.bgColor} stroke={activeMarketMover.color} strokeWidth={2} />
                <text x={40} y={43} textAnchor="middle" fontSize="32">{activeMarketMover.avatar}</text>
                <text x={75} y={25} fill="white" fontSize="16" fontWeight="bold">{activeMarketMover.name}</text>
                <text x={75} y={42} fill="#888" fontSize="14">@{activeMarketMover.id}</text>
                <text x={75} y={70} fill="white" fontSize="18" fontWeight="bold">"{activeMarketMover.currentQuote.text}"</text>
                <rect x={255} y={10} width={85} height={28} fill={MARKET_EFFECTS[activeMarketMover.currentQuote.effect].color} rx={14} />
                <text x={297} y={30} textAnchor="middle" fill="#0a1628" fontSize="14" fontWeight="bold">
                  {MARKET_EFFECTS[activeMarketMover.currentQuote.effect].icon} {MARKET_EFFECTS[activeMarketMover.currentQuote.effect].label}
                </text>
                <rect x={150} y={88} width={190 * (marketMoverTimer / 180)} height={6} fill={activeMarketMover.color} rx={3} />
              </g>
            </g>
          )}

          {/* Boss Call Overlay */}
          {bossCallActive && (
            <g>
              <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill="rgba(0,0,0,0.85)" />
              <rect x={GAME_WIDTH / 2 - 150} y={GAME_HEIGHT / 2 - 200} width={300} height={400} fill="#1a1a2e" rx={30} stroke="#333" strokeWidth={4} />
              <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 - 90} textAnchor="middle" fontSize="60">😠</text>
              <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 - 20} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">SẾP GỌI!</text>
              <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 + 50} textAnchor="middle" fill={bossCallTimer <= 2 ? '#ff4757' : '#ffd700'} fontSize="48" fontWeight="bold">{bossCallTimer}s</text>
              <rect x={GAME_WIDTH / 2 - 100} y={GAME_HEIGHT / 2 + 80} width={200} height={20} fill="#333" rx={10} />
              <rect x={GAME_WIDTH / 2 - 100} y={GAME_HEIGHT / 2 + 80} width={bossCallProgress * 2} height={20} fill={bossCallProgress > 70 ? '#00ff88' : '#ffd700'} rx={10} />
              <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 + 130} textAnchor="middle" fill="#00ff88" fontSize="18" fontWeight="bold">TAP NHANH ĐỂ ẨN APP! 📱</text>
            </g>
          )}

          {/* HUD & Ticker */}
          <g>
            <rect x={0} y={0} width={GAME_WIDTH} height={35} fill="rgba(0,0,0,0.9)" />
            <rect x={0} y={33} width={GAME_WIDTH} height={2} fill="#00ff88" opacity={0.5} />
            <g clipPath="url(#tickerClip)">
              {[0, 1].map(loop => (
                <g key={loop} transform={`translate(${-tickerOffset + loop * 1000}, 0)`}>
                  {marketIndices.map((idx, i) => {
                    const color = idx.change >= 0 ? '#00ff88' : '#ff4757';
                    return (
                      <g key={`${loop}-${i}`} transform={`translate(${i * 130}, 0)`}>
                        <text x={10} y={14} fontSize="12" fill="#888">{idx.emoji}</text>
                        <text x={25} y={14} fontSize="14" fill="#fff" fontWeight="bold">{idx.symbol}</text>
                        <text x={25} y={27} fontSize="14" fill={color} fontWeight="bold">{idx.value >= 1000 ? idx.value.toFixed(0) : idx.value.toFixed(2)}</text>
                        <text x={90} y={27} fontSize="12" fill={color}>{idx.change >= 0 ? '▲' : '▼'}{Math.abs(idx.change).toFixed(2)}%</text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </g>
            
            {/* Score */}
            <rect x={10} y={45} width={180} height={55} fill="rgba(0,0,0,0.85)" rx={10} stroke="#00ff88" strokeWidth={2} />
            <text x={20} y={68} fill="#888" fontSize="12">ĐIỂM SỐ</text>
            <text x={20} y={92} fill="#00ff88" fontSize="32" fontWeight="bold" filter="url(#glow)">💰 {score.toLocaleString()}</text>
            
             {/* Combo */}
            {combo > 1 && (
              <g>
                <rect x={200} y={45} width={90} height={55} fill="rgba(255,215,0,0.2)" rx={10} stroke="#ffd700" strokeWidth={2} />
                <text x={210} y={68} fill="#ffd700" fontSize="12">COMBO</text>
                <text x={245} y={92} textAnchor="middle" fill="#ffd700" fontSize="30" fontWeight="bold">x{combo.toFixed(1)}</text>
              </g>
            )}

            {/* VN-INDEX */}
            <g>
              <rect x={GAME_WIDTH / 2 - 100} y={45} width={200} height={55} fill="rgba(0,0,0,0.85)" rx={10} stroke={vnIndex.trend === 'up' ? '#00ff88' : '#ff4757'} strokeWidth={2} />
              <text x={GAME_WIDTH / 2 - 90} y={65} fill="#888" fontSize="12">🇻🇳 VN-INDEX</text>
              <text x={GAME_WIDTH / 2 - 90} y={92} fill={vnIndex.trend === 'up' ? '#00ff88' : '#ff4757'} fontSize="30" fontWeight="bold">{vnIndex.value.toFixed(2)}</text>
              <text x={GAME_WIDTH / 2 + 70} y={92} fill={vnIndex.trend === 'up' ? '#00ff88' : '#ff4757'} fontSize="18" fontWeight="bold">{vnIndex.trend === 'up' ? '▲' : '▼'}{Math.abs(vnIndex.change).toFixed(2)}%</text>
            </g>

            {/* Sound */}
             <g onClick={(e) => { e.stopPropagation(); onToggleSound(); }} style={{ cursor: 'pointer' }}>
              <rect x={GAME_WIDTH / 2 + 110} y={45} width={45} height={55} fill="rgba(0,0,0,0.7)" rx={10} />
              <text x={GAME_WIDTH / 2 + 132} y={82} textAnchor="middle" fontSize="30">{soundEnabled ? '🔊' : '🔇'}</text>
            </g>

            {/* Capital */}
            <g>
              <rect x={GAME_WIDTH - 200} y={45} width={190} height={55} fill="rgba(0,0,0,0.85)" rx={10} stroke={capital >= startProfit ? '#00ff88' : '#ff4757'} strokeWidth={2} />
              <text x={GAME_WIDTH - 190} y={62} fill="#888" fontSize="11">VỐN HIỆN TẠI</text>
              <text x={GAME_WIDTH - 190} y={82} fill={capital >= startProfit ? '#00ff88' : '#ff4757'} fontSize="20" fontWeight="bold">💰 {(capital / 1000000).toFixed(2)}M</text>
              <text x={GAME_WIDTH - 190} y={96} fill={profit >= 0 ? '#00ff88' : '#ff4757'} fontSize="13">P/L: {profit >= 0 ? '+' : ''}{(profit / 1000000).toFixed(2)}M</text>
            </g>

            {/* Powerups Indicators */}
            <g transform="translate(10, 110)">
              {isInvincible && <text fontSize="30">🛡️</text>}
              {hasSpeedBoost && <text x={40} fontSize="30">☕</text>}
              {hasDoublePoints && <text x={80} fontSize="30">💎</text>}
              {isFrozen && <text x={120} fontSize="30">🥶</text>}
              {extraLives > 0 && <text x={160} fontSize="24" fill="#ffd700">🧓 x{extraLives}</text>}
            </g>

            {/* Quote Bar */}
            {currentQuote && (
                <g>
                    <rect x={GAME_WIDTH / 2 - 160} y={GAME_HEIGHT - 70} width={320} height={35} fill="rgba(0,0,0,0.9)" rx={17} stroke="#ffd700" strokeWidth={1} />
                    <text x={GAME_WIDTH / 2} y={GAME_HEIGHT - 47} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{currentQuote}</text>
                </g>
            )}

            {/* Cashout Button */}
            {!gracePeriodActive && (
              <g onClick={(e) => { e.stopPropagation(); onCashout(); }} style={{ cursor: 'pointer' }}>
                <rect x={10} y={GAME_HEIGHT - 75} width={140} height={40} fill={profit >= 0 ? 'rgba(0,255,136,0.95)' : 'rgba(255,71,87,0.9)'} rx={20} stroke={profit >= 0 ? '#00ff88' : '#ff4757'} strokeWidth={2} />
                <text x={80} y={GAME_HEIGHT - 50} textAnchor="middle" fill={profit >= 0 ? '#0a1628' : '#fff'} fontSize="16" fontWeight="bold">
                  {profit >= 0 ? '💰 CHỐT LỜI' : '🛑 CẮT LỖ'}
                </text>
              </g>
            )}

            {/* Grace Period Overlay */}
            {gracePeriodActive && (
              <g>
                <rect x={GAME_WIDTH / 2 - 140} y={GAME_HEIGHT / 2 - 70} width={280} height={120} fill="rgba(0,255,136,0.2)" rx={20} stroke="#00ff88" strokeWidth={3} />
                <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 - 35} textAnchor="middle" fill="#00ff88" fontSize="32" fontWeight="bold">GET READY!</text>
                <text x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2 - 5} textAnchor="middle" fill="#ffd700" fontSize="20">💰 Vốn: 10,000,000 VND</text>
              </g>
            )}
          </g>
        </svg>
    </div>
  );
};

export default React.memo(GameRenderer);