export interface MarketIndex {
  symbol: string;
  baseValue: number;
  value: number;
  change: number;
  emoji: string;
  color: string;
}

export interface Quote {
  text: string;
  effect: 'pump' | 'dump' | 'chaos';
  marketImpact: number;
}

export interface MarketMover {
  id: string;
  name: string;
  avatar: string;
  color: string;
  bgColor: string;
  quotes: Quote[];
  currentQuote?: Quote;
}

export interface Obstacle {
  x: number;
  gapY: number;
  passed: boolean;
  type: 'fud' | 'margin' | 'whale' | 'fomo' | 'ice';
  emoji: string;
  label: string;
  color: string;
  dynamicGapSize?: number;
  // Type specific properties
  headline?: string;
  bombTimer?: number;
  whaleY?: number;
  whaleDir?: number;
  flameIntensity?: number;
  iceShards?: Array<{ x: number; y: number; size: number }>;
}

export interface Powerup {
  x: number;
  y: number;
  type: 'coffee' | 'shield' | 'rocket' | 'diamond';
  emoji: string;
  effect: string;
  color: string;
}

export interface Candle {
  x: number;
  height: number;
  wickTop: number;
  wickBottom: number;
  isGreen: boolean;
  baseY: number;
  ticker: string;
  price: number;
  priceChange: string;
  animPhase: number;
  animSpeed: number;
  animAmplitude: number;
  targetY: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  life: number;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  character: string;
  date: string;
}

export type GameState = 'menu' | 'playing' | 'gameOver';