import { MarketIndex, MarketMover, Quote } from './types';

// Game Physics & Dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -11;
export const PLAYER_SIZE = 50;
export const OBSTACLE_WIDTH = 60;
export const GAP_SIZE = 200;
export const GAME_SPEED = 3.5;
export const CANDLE_WIDTH = 40;

// Economy
export const STARTING_CAPITAL = 10000000;
export const MIN_CAPITAL = 0;

// Difficulty
export const DIFFICULTY = {
  INITIAL_OBSTACLE_INTERVAL: 180,
  MIN_OBSTACLE_INTERVAL: 100,
  DIFFICULTY_INCREASE_RATE: 0.995,
  POWERUP_SPAWN_CHANCE: 0.5,
  POWERUP_INTERVAL: 200,
  GRACE_PERIOD: 120,
};

export const OBSTACLE_REWARDS: Record<string, { pass: number; hit: number; hitType?: string; name: string }> = {
  fud: { pass: 500000, hit: -200000, name: 'Tin FUD' },
  margin: { pass: 1000000, hit: -0.3, hitType: 'percent', name: 'Margin Call' },
  whale: { pass: 800000, hit: -500000, name: 'Cá Mập' },
  fomo: { pass: 600000, hit: -400000, name: 'FOMO' },
  ice: { pass: 400000, hit: -100000, name: 'Đóng Băng' },
};

export const POWERUP_BONUSES: Record<string, number> = {
  coffee: 100000,
  shield: 200000,
  rocket: 500000,
  diamond: 300000,
};

export const OBSTACLE_TYPES = [
  { type: 'fud', emoji: '📰', label: 'FUD NEWS', color: '#ff6b6b' },
  { type: 'margin', emoji: '💣', label: 'MARGIN CALL', color: '#ff4757' },
  { type: 'whale', emoji: '🐋', label: 'WHALE ALERT', color: '#5352ed' },
  { type: 'fomo', emoji: '🔥', label: 'FOMO ZONE', color: '#ffa502' },
  { type: 'ice', emoji: '❄️', label: 'ĐÓNG BĂNG', color: '#00d4ff' },
] as const;

export const POWERUP_TYPES = [
  { type: 'coffee', emoji: '☕', effect: 'SPEED BOOST!', color: '#8B4513' },
  { type: 'shield', emoji: '🛡️', effect: 'STOP LOSS!', color: '#00d2d3' },
  { type: 'rocket', emoji: '🚀', effect: 'TO THE MOON!', color: '#ff9ff3' },
  { type: 'diamond', emoji: '💎', effect: 'DIAMOND HANDS!', color: '#54a0ff' },
] as const;

export const MARKET_EFFECTS = {
  pump: { color: '#00ff88', icon: '📈', label: 'PUMP!' },
  dump: { color: '#ff4757', icon: '📉', label: 'DUMP!' },
  chaos: { color: '#ffd700', icon: '🌀', label: 'CHAOS!' },
};

export const VN30_TICKERS = [
  'VNM', 'VCB', 'VIC', 'VHM', 'VRE', 'VPB', 'TCB', 'MBB', 'HPG', 'MSN',
  'FPT', 'MWG', 'NVL', 'PLX', 'POW', 'SAB', 'SSI', 'STB', 'TPB', 'GAS',
  'BID', 'CTG', 'GVR', 'HDB', 'ACB', 'BCM', 'BVH', 'PDR', 'SHB', 'VJC',
];

export const MARKET_INDICES: MarketIndex[] = [
  { symbol: 'VN-INDEX', baseValue: 1250, value: 1250, change: 0, emoji: '🇻🇳', color: '#00ff88' },
  { symbol: 'HNX', baseValue: 230, value: 230, change: 0, emoji: '📊', color: '#00d4ff' },
  { symbol: 'UPCOM', baseValue: 92, value: 92, change: 0, emoji: '📈', color: '#ffd700' },
  { symbol: 'BITCOIN', baseValue: 97500, value: 97500, change: 0, emoji: '₿', color: '#f7931a' },
  { symbol: 'ETHEREUM', baseValue: 3650, value: 3650, change: 0, emoji: 'Ξ', color: '#627eea' },
  { symbol: 'GOLD', baseValue: 2650, value: 2650, change: 0, emoji: '🥇', color: '#ffd700' },
  { symbol: 'S&P 500', baseValue: 5980, value: 5980, change: 0, emoji: '🇺🇸', color: '#ff6b6b' },
  { symbol: 'NASDAQ', baseValue: 19200, value: 19200, change: 0, emoji: '💻', color: '#00ff88' },
  { symbol: 'DOW JONES', baseValue: 44200, value: 44200, change: 0, emoji: '📉', color: '#5352ed' },
  { symbol: 'NIKKEI', baseValue: 38400, value: 38400, change: 0, emoji: '🇯🇵', color: '#ff4757' },
  { symbol: 'SHANGHAI', baseValue: 3350, value: 3350, change: 0, emoji: '🇨🇳', color: '#ff6348' },
  { symbol: 'USD/VND', baseValue: 25450, value: 25450, change: 0, emoji: '💵', color: '#2ed573' },
  { symbol: 'EUR/USD', baseValue: 1.052, value: 1.052, change: 0, emoji: '💶', color: '#3742fa' },
  { symbol: 'DẦU THÔ', baseValue: 71.5, value: 71.5, change: 0, emoji: '🛢️', color: '#2f3542' },
];

export const FUD_HEADLINES = [
  "Fed tăng lãi suất! 📈", "Lạm phát kỷ lục!", "Suy thoái đến rồi! 📉", "GDP âm 2 quý!",
  "CEO bán tháo cổ phiếu!", "Điều tra gian lận! 🚨", "Tin đồn phá sản! 💀", "BCTC sai lệch!",
  "Cổ phiếu penny lên sàn!", "Cảnh báo margin! ⚠️", "Sàn sập! 📉", "Black Monday 2.0!",
  "Cá mập xả hàng!", "Insider bán 10 triệu $!", "Quỹ lớn rút vốn!",
  "Exchange bị hack! 🔓", "Stablecoin mất peg!", "Rug pull cảnh báo!", "SEC điều tra!",
  "Thanh khoản cạn kiệt!", "Tự doanh bán ròng!", "Margin call hàng loạt!", "Cổ đông lớn tháo chạy!",
];

export const QUOTES = [
  "HODL to the moon! 🚀", "Diamond hands forever! 💎🙌", "Trust the process! 💎", "Wen moon ser? 🌙",
  "Ôi không, vợ tôi sẽ giết tôi! 😭", "Chốt lời 5% rồi tăng 500%... 🤡", "Lại mua đỉnh bán đáy rồi! 📉",
  "Tiền ảo, lỗ thật! 💸", "Mình chỉ xem chart 5 phút thôi... ⏰", "Sếp đâu rồi? 👀",
  "F5 refresh portfolio mỗi 3 giây 🔄", "Giá này không mua thì mua giá nào? 🤔", "Buy the dip! 📈",
  "Vay thêm margin thôi! 💳", "Đầu tư dài hạn mà... 📊", "Paper hands = poor hands 📄",
  "Bán thận mua coin! 🫘", "Cầm sổ đỏ đi vay! 🏠", "Cá mập đang xả hàng! 🐋", "Portfolio ATH! 🏆",
];

export const SITUATION_QUOTES: Record<string, string[]> = {
  fud: ["Tin giả đây mà! 📰", "Media toàn FUD! 🙄", "Đọc xong muốn bán! 😨"],
  margin: ["Broker gọi kìa! 📞💀", "Leverage cao quá! ⚠️", "RIP tài khoản! 💀"],
  whale: ["Cá mập dump! 🐋📉", "Whale manipulation! 😤", "Big money chơi! 💰"],
  fomo: ["FOMO quá! 🔥", "Lên tàu không kịp! 🚂", "All in thôi! 🦍"],
  ice: ["Đóng băng rồi! 🥶", "Sàn treo lệnh! ❄️", "Thanh khoản cạn! 😵"],
  shield: ["Stop loss! 🛡️", "Risk management! 💪", "Bảo vệ vốn! ✅"],
  rocket: ["To the moon! 🚀", "Pump it! 📈", "Fly high! ⬆️"],
  diamond: ["Diamond hands! 💎", "HODL mạnh! 💪", "Cầm chắc! 🙌"],
  coffee: ["Thức đêm xem chart! ☕", "Caffeine boost! ⚡", "Speed trading! 🏃"],
  pass: ["Né được rồi! 😅", "Thoát nạn! 🙏", "Skill đỉnh! 🎯", "May quá! 🍀", "Qua rồi! ✅"],
  combo: ["Combo đỉnh! 🔥", "On fire! 💯", "Unstoppable! 🚀", "Trading god! 👑"],
};

export const MARKET_MOVERS: MarketMover[] = [
  {
    id: 'tech_billionaire',
    name: 'Tỷ Phú Tech',
    avatar: '🚀',
    color: '#1da1f2',
    bgColor: 'rgba(29,161,242,0.2)',
    quotes: [
      { text: "Tôi nghĩ crypto sẽ...", effect: 'chaos', marketImpact: 15 },
      { text: "To the moon! 🚀🌕", effect: 'pump', marketImpact: 20 },
      { text: "Hmm... có vẻ thú vị 🤔", effect: 'pump', marketImpact: 10 },
      { text: "Selling...", effect: 'dump', marketImpact: -25 },
      { text: "Doge > Bitcoin", effect: 'chaos', marketImpact: 0 },
    ]
  },
  {
    id: 'fed_chair',
    name: 'Chủ Tịch Fed',
    avatar: '🏛️',
    color: '#2e7d32',
    bgColor: 'rgba(46,125,50,0.2)',
    quotes: [
      { text: "Lạm phát chỉ là tạm thời...", effect: 'dump', marketImpact: -15 },
      { text: "Có thể tăng lãi suất 📈", effect: 'dump', marketImpact: -20 },
      { text: "Kinh tế vẫn ổn định", effect: 'pump', marketImpact: 10 },
      { text: "QE có thể quay lại 💸", effect: 'pump', marketImpact: 25 },
      { text: "Higher for longer ⚠️", effect: 'dump', marketImpact: -18 },
    ]
  },
   {
    id: 'crypto_whale',
    name: 'Cá Mập Crypto',
    avatar: '🐋',
    color: '#f7931a',
    bgColor: 'rgba(247,147,26,0.2)',
    quotes: [
      { text: "Just bought the dip 💰", effect: 'pump', marketImpact: 20 },
      { text: "Moving coins to exchange...", effect: 'dump', marketImpact: -25 },
      { text: "WAGMI! 🚀", effect: 'pump', marketImpact: 15 },
      { text: "BTC 100K EOY! 🎯", effect: 'pump', marketImpact: 12 },
      { text: "Exit liquidity? 🤔", effect: 'dump', marketImpact: -20 },
    ]
  },
  {
    id: 'stock_guru',
    name: 'Chuyên Gia CK',
    avatar: '📊',
    color: '#9c27b0',
    bgColor: 'rgba(156,39,176,0.2)',
    quotes: [
      { text: "VN-Index target 1500! 🎯", effect: 'pump', marketImpact: 15 },
      { text: "Correction 20% sắp đến", effect: 'dump', marketImpact: -18 },
      { text: "Bottom đã hình thành 📈", effect: 'pump', marketImpact: 12 },
      { text: "Golden cross xuất hiện! ✨", effect: 'pump', marketImpact: 10 },
      { text: "Death cross cận kề ☠️", effect: 'dump', marketImpact: -15 },
    ]
  },
];