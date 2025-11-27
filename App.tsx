import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY,
  JUMP_FORCE,
  PLAYER_SIZE,
  OBSTACLE_WIDTH,
  GAP_SIZE,
  GAME_SPEED,
  CANDLE_WIDTH,
  STARTING_CAPITAL,
  MIN_CAPITAL,
  DIFFICULTY,
  OBSTACLE_REWARDS,
  POWERUP_BONUSES,
  VN30_TICKERS,
  MARKET_INDICES,
  MARKET_MOVERS,
  OBSTACLE_TYPES,
  POWERUP_TYPES,
  FUD_HEADLINES,
  QUOTES,
  SITUATION_QUOTES,
  MARKET_EFFECTS,
} from "./constants";
import {
  Obstacle,
  Powerup,
  Candle,
  Particle,
  FloatingText,
  MarketMover,
  LeaderboardEntry,
  GameState,
} from "./types";
import { soundManager } from "./services/SoundManager";
import GameRenderer from "./components/GameRenderer";

const getQuote = (situation: string) => {
  const quotes = SITUATION_QUOTES[situation];
  if (quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
};

export default function HodlHeroGame() {
  // Game State
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [profit, setProfit] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Economy
  const [capital, setCapital] = useState(STARTING_CAPITAL);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winTrades, setWinTrades] = useState(0);
  const [lossTrades, setLossTrades] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [biggestLoss, setBiggestLoss] = useState(0);
  const [cashoutMode, setCashoutMode] = useState(false);

  // Player
  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [playerExpression, setPlayerExpression] = useState("😎");
  const [isInvincible, setIsInvincible] = useState(false);
  const [hasSpeedBoost, setHasSpeedBoost] = useState(false);
  const [hasDoublePoints, setHasDoublePoints] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // World
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [vnIndex, setVnIndex] = useState({
    value: 1250,
    change: 0.5,
    trend: "up",
  });
  const [marketIndices, setMarketIndices] = useState(MARKET_INDICES);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Events
  const [activeMarketMover, setActiveMarketMover] =
    useState<MarketMover | null>(null);
  const [marketMoverTimer, setMarketMoverTimer] = useState(0);
  const [marketEffect, setMarketEffect] = useState<string | null>(null);
  const [lastMarketMoverTime, setLastMarketMoverTime] = useState(0);

  // Easter Eggs
  const [buffettActive, setBuffettActive] = useState(false);
  const [buffettX, setBuffettX] = useState(GAME_WIDTH);
  const [bossCallActive, setBossCallActive] = useState(false);
  const [bossCallProgress, setBossCallProgress] = useState(0);
  const [bossCallTimer, setBossCallTimer] = useState(0);
  const [extraLives, setExtraLives] = useState(0);
  const [buffettCollected, setBuffettCollected] = useState(false);

  // UI
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { name: "Warren B.", score: 88888, character: "🧓", date: "2024-01-15" },
    { name: "Diamond", score: 50000, character: "💎", date: "2024-01-14" },
    { name: "HODLER", score: 35000, character: "🦍", date: "2024-01-13" },
  ]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [lastGameRank, setLastGameRank] = useState<number | null>(null);

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastObstacleRef = useRef(0);
  const lastPowerupRef = useRef(0);
  const frameCountRef = useRef(0);
  const currentDifficultyRef = useRef(DIFFICULTY.INITIAL_OBSTACLE_INTERVAL);

  const generateCandles = useCallback(() => {
    const newCandles: Candle[] = [];
    const shuffledTickers = [...VN30_TICKERS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 25; i++) {
      const isGreen = Math.random() > 0.4;
      const basePrice = 10 + Math.random() * 190;
      newCandles.push({
        x: i * CANDLE_WIDTH,
        height: 50 + Math.random() * 150,
        wickTop: 10 + Math.random() * 30,
        wickBottom: 10 + Math.random() * 30,
        isGreen,
        baseY: GAME_HEIGHT - 100 - Math.random() * 200,
        ticker: shuffledTickers[i % shuffledTickers.length],
        price: basePrice,
        priceChange: isGreen
          ? (1 + Math.random() * 7).toFixed(2)
          : (-(1 + Math.random() * 7)).toFixed(2),
        animPhase: Math.random() * Math.PI * 2,
        animSpeed: 0.02 + Math.random() * 0.03,
        animAmplitude: 20 + Math.random() * 40,
        targetY: 0,
      });
    }
    return newCandles;
  }, []);

  const initGame = useCallback(() => {
    setPlayerY(GAME_HEIGHT / 2);
    setPlayerVelocity(0);
    setScore(0);
    setCombo(1);
    setProfit(0);
    setCapital(STARTING_CAPITAL);
    setTotalTrades(0);
    setWinTrades(0);
    setLossTrades(0);
    setBiggestWin(0);
    setBiggestLoss(0);
    setCashoutMode(false);
    setObstacles([]);
    setPowerups([]);
    setCandles(generateCandles());
    setParticles([]);
    setPlayerExpression("😎");
    setIsInvincible(false);
    setHasSpeedBoost(false);
    setHasDoublePoints(false);
    setIsFrozen(false);
    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setFloatingTexts([]);
    setVnIndex({
      value: 1200 + Math.random() * 100,
      change: (Math.random() - 0.5) * 4,
      trend: Math.random() > 0.5 ? "up" : "down",
    });
    setTickerOffset(0);
    setActiveMarketMover(null);
    setMarketMoverTimer(0);
    setMarketEffect(null);
    setLastMarketMoverTime(0);
    setBuffettActive(false);
    setBuffettX(GAME_WIDTH);
    setBossCallActive(false);
    setBossCallProgress(0);
    setBossCallTimer(0);
    setBuffettCollected(false);
    setShowLeaderboard(false);
    setShowNameInput(false);
    setPlayerName("");
    setLastGameRank(null);
    lastObstacleRef.current = 0;
    lastPowerupRef.current = 0;
    frameCountRef.current = 0;
    currentDifficultyRef.current = DIFFICULTY.INITIAL_OBSTACLE_INTERVAL;
  }, [generateCandles]);

  const startGame = () => {
    soundManager.init();
    soundManager.start();
    initGame();
    setGameState("playing");
  };

  const cashout = useCallback(() => {
    soundManager.init();
    setCashoutMode(true);
    setGameState("gameOver");
    if (profit >= 0) soundManager.newHighScore();
    else soundManager.gameOver();

    if (score > highScore) setHighScore(score);

    // Auto-prompt leaderboard
    const minScore =
      leaderboard.length >= 10 ? leaderboard[leaderboard.length - 1].score : 0;
    if (score > minScore || leaderboard.length < 10) {
      setTimeout(() => setShowNameInput(true), 1500);
    }
  }, [profit, score, highScore, leaderboard]);

  const checkCollision = (px: number, py: number, obstacle: Obstacle) => {
    const gapSize = obstacle.dynamicGapSize || GAP_SIZE;
    const playerBox = {
      x: px + 5,
      y: py + 5,
      width: PLAYER_SIZE - 15,
      height: PLAYER_SIZE - 15,
    };
    const topBox = {
      x: obstacle.x,
      y: 0,
      width: OBSTACLE_WIDTH,
      height: obstacle.gapY,
    };
    const bottomBox = {
      x: obstacle.x,
      y: obstacle.gapY + gapSize,
      width: OBSTACLE_WIDTH,
      height: GAME_HEIGHT - obstacle.gapY - gapSize,
    };
    const collidesWith = (a: any, b: any) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
    return (
      collidesWith(playerBox, topBox) || collidesWith(playerBox, bottomBox)
    );
  };

  const applyPowerup = (powerup: Powerup) => {
    const bonus = POWERUP_BONUSES[powerup.type] || 100000;
    const bonusText =
      bonus >= 1000000
        ? `+${(bonus / 1000000).toFixed(1)}M`
        : `+${(bonus / 1000).toFixed(0)}K`;

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `${powerup.effect} ${bonusText}`,
        x: powerup.x,
        y: powerup.y,
        life: 60,
        color: powerup.color,
      },
    ]);
    setCapital((c) => c + bonus);
    setProfit((p) => p + bonus);

    switch (powerup.type) {
      case "coffee":
        soundManager.coffee();
        setHasSpeedBoost(true);
        setCurrentQuote(getQuote("coffee"));
        setTimeout(() => setHasSpeedBoost(false), 3000);
        break;
      case "shield":
        soundManager.shield();
        setIsInvincible(true);
        setCurrentQuote(getQuote("shield"));
        setTimeout(() => setIsInvincible(false), 5000);
        break;
      case "rocket":
        soundManager.rocket();
        setPlayerVelocity(-20);
        setScore((s) => s + 200);
        setCurrentQuote(getQuote("rocket"));
        break;
      case "diamond":
        soundManager.diamond();
        setHasDoublePoints(true);
        setCurrentQuote(getQuote("diamond"));
        setTimeout(() => setHasDoublePoints(false), 10000);
        break;
    }
  };

  const jump = useCallback(() => {
    if (bossCallActive) {
      soundManager.bossTap();
      setBossCallProgress((p) => {
        const newProgress = p + 12;
        if (newProgress >= 100) {
          soundManager.bossSuccess();
          setBossCallActive(false);
          setScore((s) => s + 500);
          setFloatingTexts((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: "+500 SAFE!",
              x: GAME_WIDTH / 2,
              y: GAME_HEIGHT / 2,
              life: 60,
              color: "#00ff88",
            },
          ]);
          setCurrentQuote("Phù! Sếp không thấy gì! 😅");
        }
        return Math.min(newProgress, 100);
      });
      return;
    }

    if (gameState === "playing") {
      soundManager.jump();
      setPlayerVelocity(JUMP_FORCE);
      setParticles((prev) => [
        ...prev,
        ...Array(5)
          .fill(null)
          .map(() => ({
            x: 80,
            y: playerY + PLAYER_SIZE / 2,
            vx: -2 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 4,
            life: 20,
            color: "#ffd700",
          })),
      ]);
    } else if (gameState === "menu") {
      startGame();
    }
  }, [gameState, playerY, bossCallActive]);

  // Main Game Loop using requestAnimationFrame through useEffect + setInterval
  // We use setInterval at 60fps to match the original logic's frame-based physics
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = () => {
      frameCountRef.current++;
      let speed = hasSpeedBoost ? GAME_SPEED * 1.5 : GAME_SPEED;
      if (isFrozen) speed = speed * 0.4;

      if (marketEffect === "pump") speed = speed * 0.85;
      else if (marketEffect === "dump") speed = speed * 1.2;
      else if (marketEffect === "chaos")
        speed = speed * (0.8 + Math.random() * 0.5);

      setPlayerVelocity((v) => v + GRAVITY);
      setPlayerY((y) => {
        const newY = y + playerVelocity;
        if (newY < 0) return 0;
        if (newY > GAME_HEIGHT - PLAYER_SIZE) {
          if (!isInvincible && extraLives > 0) {
            setExtraLives((l) => l - 1);
            setIsInvincible(true);
            setTimeout(() => setIsInvincible(false), 2000);
            soundManager.shield();
            setPlayerVelocity(JUMP_FORCE * 1.5);
            return GAME_HEIGHT / 2;
          } else if (!isInvincible) {
            const floorPenalty = 300000;
            setCapital((c) => {
              const newC = c - floorPenalty;
              if (newC <= MIN_CAPITAL) {
                soundManager.gameOver();
                setGameState("gameOver");
                if (score > highScore) {
                  setHighScore(score);
                  soundManager.newHighScore();
                }
                return 0;
              }
              return newC;
            });
            setProfit((p) => p - floorPenalty);
            setTotalTrades((t) => t + 1);
            setLossTrades((l) => l + 1);
            setBiggestLoss((bl) => Math.max(bl, floorPenalty));
            setCombo(1);
            soundManager.hit();
            setIsInvincible(true);
            setPlayerVelocity(JUMP_FORCE * 1.5);
            setTimeout(() => setIsInvincible(false), 1000);
            return GAME_HEIGHT / 2;
          }
          return GAME_HEIGHT - PLAYER_SIZE;
        }
        return newY;
      });

      setPlayerExpression(
        playerY < GAME_HEIGHT / 3
          ? "🤑"
          : playerY > (GAME_HEIGHT * 2) / 3
          ? "😱"
          : "😎"
      );

      setCandles((prev) => {
        const updated = prev.map((c) => ({
          ...c,
          x: c.x - speed,
          animPhase: c.animPhase + c.animSpeed,
          targetY: Math.sin(c.animPhase + c.animSpeed) * c.animAmplitude,
        }));

        if (Math.max(...updated.map((c) => c.x)) < GAME_WIDTH) {
          const isGreen = Math.random() > 0.4;
          updated.push({
            x: Math.max(...updated.map((c) => c.x)) + CANDLE_WIDTH,
            height: 50 + Math.random() * 150,
            wickTop: 10 + Math.random() * 30,
            wickBottom: 10 + Math.random() * 30,
            isGreen,
            baseY: GAME_HEIGHT - 100 - Math.random() * 200,
            ticker:
              VN30_TICKERS[Math.floor(Math.random() * VN30_TICKERS.length)],
            price: 10 + Math.random() * 190,
            priceChange: isGreen
              ? (1 + Math.random() * 7).toFixed(2)
              : (-(1 + Math.random() * 7)).toFixed(2),
            animPhase: Math.random() * Math.PI * 2,
            animSpeed: 0.02 + Math.random() * 0.03,
            animAmplitude: 20 + Math.random() * 40,
            targetY: 0,
          });
        }
        return updated.filter((c) => c.x > -CANDLE_WIDTH);
      });

      // Spawning
      if (frameCountRef.current > DIFFICULTY.GRACE_PERIOD) {
        currentDifficultyRef.current = Math.max(
          DIFFICULTY.MIN_OBSTACLE_INTERVAL,
          currentDifficultyRef.current * DIFFICULTY.DIFFICULTY_INCREASE_RATE
        );
        if (
          frameCountRef.current - lastObstacleRef.current >
          currentDifficultyRef.current
        ) {
          let availableTypes = OBSTACLE_TYPES.filter((t) =>
            score < 500 ? t.type !== "margin" : true
          );
          const type =
            availableTypes[Math.floor(Math.random() * availableTypes.length)];
          const gapSize = GAP_SIZE + 30 * (1 - Math.min(1, score / 5000));

          setObstacles((prev) => [
            ...prev,
            {
              x: GAME_WIDTH,
              gapY: 80 + Math.random() * (GAME_HEIGHT - gapSize - 160),
              ...type,
              passed: false,
              dynamicGapSize: gapSize,
              headline:
                type.type === "fud"
                  ? FUD_HEADLINES[
                      Math.floor(Math.random() * FUD_HEADLINES.length)
                    ]
                  : undefined,
              bombTimer: type.type === "margin" ? 0 : undefined,
              whaleY: type.type === "whale" ? 0 : undefined,
              whaleDir:
                type.type === "whale"
                  ? Math.random() > 0.5
                    ? 1
                    : -1
                  : undefined,
              flameIntensity: type.type === "fomo" ? Math.random() : undefined,
            },
          ]);
          lastObstacleRef.current = frameCountRef.current;
        }
      }

      if (
        frameCountRef.current - lastPowerupRef.current >
          DIFFICULTY.POWERUP_INTERVAL &&
        Math.random() < DIFFICULTY.POWERUP_SPAWN_CHANCE
      ) {
        const pt =
          POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
        setPowerups((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            y: 100 + Math.random() * (GAME_HEIGHT - 200),
            ...pt,
          },
        ]);
        lastPowerupRef.current = frameCountRef.current;
      }

      // Obstacle Logic
      setObstacles((prev) =>
        prev
          .map((obs) => {
            const newObs = { ...obs, x: obs.x - speed };
            if (newObs.type === "whale" && newObs.whaleY !== undefined) {
              newObs.whaleY += (newObs.whaleDir || 1) * 2;
              if (Math.abs(newObs.whaleY) > 30)
                newObs.whaleDir = -(newObs.whaleDir || 1);
            }
            if (newObs.type === "margin")
              newObs.bombTimer = ((newObs.bombTimer || 0) + 1) % 30;

            if (!newObs.passed && newObs.x + OBSTACLE_WIDTH < 80) {
              newObs.passed = true;
              const reward = OBSTACLE_REWARDS[newObs.type]?.pass || 500000;
              const finalReward = Math.floor(reward * combo);
              setCapital((c) => c + finalReward);
              setProfit((p) => p + finalReward);
              setTotalTrades((t) => t + 1);
              setWinTrades((w) => w + 1);
              setBiggestWin((bw) => Math.max(bw, finalReward));
              setScore((s) => s + (hasDoublePoints ? 100 : 50) * combo);
              soundManager.pass();
              if (combo < 5) {
                setCombo((c) => {
                  const nc = Math.min(c + 0.5, 5);
                  if (nc > c) soundManager.combo();
                  return nc;
                });
              }
              setFloatingTexts((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  text: `+${(finalReward / 1000).toFixed(0)}K 💰`,
                  x: 100,
                  y: playerY,
                  life: 60,
                  color: "#00ff00",
                },
              ]);
              setCurrentQuote(
                combo >= 3 ? getQuote("combo") : getQuote("pass")
              );
            }

            if (newObs.type === "ice" && !newObs.passed && !isFrozen) {
              const inZone = newObs.x < 130 && newObs.x + OBSTACLE_WIDTH > 30;
              const inGap =
                playerY + 10 > newObs.gapY &&
                playerY + PLAYER_SIZE - 10 <
                  newObs.gapY + (newObs.dynamicGapSize || GAP_SIZE);
              if (inZone && inGap) {
                soundManager.ice();
                setIsFrozen(true);
                setTimeout(() => setIsFrozen(false), 2000);
              }
            }

            if (!isInvincible && checkCollision(80, playerY, newObs)) {
              if (extraLives > 0) {
                setExtraLives((l) => l - 1);
                setIsInvincible(true);
                setTimeout(() => setIsInvincible(false), 2000);
                soundManager.shield();
              } else {
                const rewardDef = OBSTACLE_REWARDS[newObs.type];
                const penalty =
                  rewardDef?.hitType === "percent"
                    ? Math.floor(capital * Math.abs(rewardDef.hit))
                    : Math.abs(rewardDef.hit || 0);
                setCapital((c) => {
                  const nc = c - penalty;
                  if (nc <= MIN_CAPITAL) {
                    soundManager.gameOver();
                    setGameState("gameOver");
                    if (score > highScore) {
                      setHighScore(score);
                      soundManager.newHighScore();
                    }
                    return 0;
                  }
                  return nc;
                });
                setProfit((p) => p - penalty);
                setTotalTrades((t) => t + 1);
                setLossTrades((l) => l + 1);
                setBiggestLoss((bl) => Math.max(bl, penalty));
                setCombo(1);
                soundManager.hit();
                setIsInvincible(true);
                setTimeout(() => setIsInvincible(false), 1000);
              }
            }
            return newObs;
          })
          .filter((o) => o.x > -OBSTACLE_WIDTH)
      );

      // Powerups
      setPowerups((prev) =>
        prev
          .filter((p) => {
            const dx = 80 + PLAYER_SIZE / 2 - p.x;
            const dy = playerY + PLAYER_SIZE / 2 - p.y;
            if (Math.sqrt(dx * dx + dy * dy) < 40) {
              soundManager.collect();
              applyPowerup(p);
              return false;
            }
            return p.x > -40;
          })
          .map((p) => ({ ...p, x: p.x - speed }))
      );

      // Particles & Texts
      setParticles((prev) =>
        prev
          .filter((p) => p.life > 0)
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
      );
      setFloatingTexts((prev) =>
        prev
          .filter((t) => t.life > 0)
          .map((t) => ({ ...t, y: t.y - 1, life: t.life - 1 }))
      );

      // Score Tick
      if (frameCountRef.current % 30 === 0) {
        setScore((s) => {
          const ns = s + (hasDoublePoints ? 20 : 10) * combo;
          if (Math.floor(ns / 1000) > Math.floor(s / 1000))
            soundManager.milestone();
          return ns;
        });
      }

      // Market Mover Events
      if (
        !activeMarketMover &&
        score > 200 &&
        frameCountRef.current - lastMarketMoverTime > 300 &&
        Math.random() < 0.01
      ) {
        const mover =
          MARKET_MOVERS[Math.floor(Math.random() * MARKET_MOVERS.length)];
        const quote =
          mover.quotes[Math.floor(Math.random() * mover.quotes.length)];
        setActiveMarketMover({ ...mover, currentQuote: quote });
        setMarketMoverTimer(180);
        setMarketEffect(quote.effect);
        setLastMarketMoverTime(frameCountRef.current);
        soundManager.marketMoverAlert();
      }
      if (activeMarketMover && marketMoverTimer > 0) {
        setMarketMoverTimer((t) => {
          if (t - 1 <= 0) {
            setActiveMarketMover(null);
            setMarketEffect(null);
          }
          return t - 1;
        });
      }

      // Boss Call Logic
      if (score >= 2000 && !bossCallActive && Math.random() < 0.0008) {
        setBossCallActive(true);
        setBossCallProgress(0);
        setBossCallTimer(5);
        soundManager.bossCall();
      }
      if (bossCallActive && frameCountRef.current % 60 === 0) {
        setBossCallTimer((t) => {
          if (t - 1 <= 0) {
            soundManager.bossFail();
            setBossCallActive(false);
            setProfit((p) => Math.floor(p * 0.7));
          }
          return t - 1;
        });
        soundManager.bossCall();
      }
      if (bossCallActive) setBossCallProgress((p) => Math.max(0, p - 0.5));

      // Buffett
      if (
        score >= 3000 &&
        !buffettActive &&
        !buffettCollected &&
        Math.random() < 0.002
      ) {
        setBuffettActive(true);
        setBuffettX(GAME_WIDTH + 100);
        soundManager.buffett();
      }
      if (buffettActive && !buffettCollected) {
        setBuffettX((x) => {
          if (x - 2 < -100) setBuffettActive(false);
          return x - 2;
        });
        const dx = 80 + PLAYER_SIZE / 2 - buffettX;
        const dy = playerY + PLAYER_SIZE / 2 - 80;
        if (Math.sqrt(dx * dx + dy * dy) < 60) {
          soundManager.buffettCollect();
          setBuffettCollected(true);
          setExtraLives((l) => l + 1);
          setScore((s) => s + 1000);
        }
      }
    };

    gameLoopRef.current = window.setInterval(loop, 1000 / 60);
    return () => clearInterval(gameLoopRef.current!);
  }, [
    gameState,
    playerVelocity,
    playerY,
    isInvincible,
    hasSpeedBoost,
    isFrozen,
    combo,
    score,
    marketEffect,
    activeMarketMover,
    bossCallActive,
    buffettActive,
    extraLives,
    hasDoublePoints,
    marketMoverTimer,
    checkCollision,
    applyPowerup,
  ]);

  // Key Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showNameInput) {
        if (e.key === "Enter") {
          if (playerName.trim())
            setLeaderboard((prev) =>
              [
                ...prev,
                {
                  name: playerName.trim(),
                  score,
                  character: "😎",
                  date: new Date().toISOString().split("T")[0],
                },
              ]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
            );
          else
            setLeaderboard((prev) =>
              [
                ...prev,
                {
                  name: "Anonymous",
                  score,
                  character: "😎",
                  date: new Date().toISOString().split("T")[0],
                },
              ]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
            );
          setShowNameInput(false);
          setShowLeaderboard(true);
        } else if (e.key === "Backspace")
          setPlayerName((prev) => prev.slice(0, -1));
        else if (e.key.length === 1 && playerName.length < 12)
          setPlayerName((prev) => prev + e.key);
        return;
      }
      if (showLeaderboard) {
        if (e.code === "Escape" || e.code === "Space") {
          setShowLeaderboard(false);
          if (gameState === "gameOver") startGame();
        }
        return;
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (gameState === "gameOver") startGame();
        else jump();
      }
      if (e.code === "Escape" && gameState === "playing") cashout();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, showNameInput, showLeaderboard, playerName, score, gameState]);

  // Menu Animation Loop
  useEffect(() => {
    if (gameState === "menu" || gameState === "gameOver") {
      const id = setInterval(() => {
        setTickerOffset((prev) => (prev + 2) % 2000);
        frameCountRef.current++;
      }, 50);
      return () => clearInterval(id);
    }
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0a1a2a] overflow-hidden">
      <div className="mb-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.5)] tracking-widest">
          📈 HODL HERO 🎮
        </h1>
        <p className="text-green-400 text-sm md:text-base tracking-wider">
          Lướt Sóng Chứng Khoán - Dễ Hơn Trading Thật!
        </p>
      </div>

      <GameRenderer
        gameState={gameState}
        playerY={playerY}
        playerExpression={playerExpression}
        isInvincible={isInvincible}
        hasSpeedBoost={hasSpeedBoost}
        hasDoublePoints={hasDoublePoints}
        isFrozen={isFrozen}
        extraLives={extraLives}
        candles={candles}
        obstacles={obstacles}
        powerups={powerups}
        particles={particles}
        floatingTexts={floatingTexts}
        buffettActive={buffettActive}
        buffettCollected={buffettCollected}
        buffettX={buffettX}
        activeMarketMover={activeMarketMover}
        marketMoverTimer={marketMoverTimer}
        bossCallActive={bossCallActive}
        bossCallTimer={bossCallTimer}
        bossCallProgress={bossCallProgress}
        currentQuote={currentQuote}
        marketIndices={marketIndices}
        tickerOffset={tickerOffset}
        frameCount={frameCountRef.current}
        score={score}
        combo={combo}
        capital={capital}
        profit={profit}
        vnIndex={vnIndex}
        highScore={highScore}
        soundEnabled={soundEnabled}
        startProfit={STARTING_CAPITAL}
        gracePeriodActive={
          gameState === "playing" &&
          frameCountRef.current <= DIFFICULTY.GRACE_PERIOD
        }
        onJump={jump}
        onCashout={cashout}
        onToggleSound={() => setSoundEnabled(soundManager.toggle())}
      />

      {/* Menu Overlay */}
      {gameState === "menu" && !showLeaderboard && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/80 p-8 rounded-xl border border-green-500 text-center pointer-events-auto backdrop-blur-sm shadow-[0_0_50px_rgba(0,255,136,0.2)]">
            <h2 className="text-4xl text-green-400 mb-6 font-bold tracking-widest">
              READY TO TRADE?
            </h2>
            <div className="space-y-4 w-64">
              <button
                onClick={startGame}
                className="w-full py-4 bg-green-500 rounded-lg font-bold text-[#0a1628] text-xl hover:bg-green-400 transition shadow-[0_0_15px_rgba(0,255,136,0.5)]"
              >
                🚀 BẮT ĐẦU
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="w-full py-3 bg-yellow-400 rounded-lg font-bold text-[#0a1628] text-lg hover:bg-yellow-300 transition"
              >
                🏆 BẢNG XẾP HẠNG
              </button>
              <button
                onClick={() => setSoundEnabled(soundManager.toggle())}
                className="w-full py-2 bg-gray-800 rounded-lg font-bold text-gray-300 text-sm hover:bg-gray-700 transition border border-gray-600"
              >
                {soundEnabled ? "🔊 ÂM THANH: BẬT" : "🔇 ÂM THANH: TẮT"}
              </button>
            </div>
            <div className="mt-6 text-sm text-gray-400 font-mono">
              <p className="mb-1">Space / Tap to Jump</p>
              <p>Esc to Cashout</p>
            </div>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="w-full max-w-md p-6 bg-[#1a1a2e] border border-gray-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <h2 className="text-3xl text-yellow-400 text-center mb-6 font-bold tracking-wider">
              TOP TRADERS
            </h2>
            <div className="space-y-2 mb-6">
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10"
                >
                  <span className="text-gray-400 w-8">#{i + 1}</span>
                  <span className="text-white flex-1 text-left pl-4 text-lg">
                    {entry.character} {entry.name}
                  </span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition text-lg"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {showNameInput && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center p-8 bg-[#1a1a2e] border border-green-500 rounded-xl shadow-[0_0_50px_rgba(0,255,136,0.3)]">
            <h2 className="text-4xl text-yellow-400 mb-2 font-bold">
              NEW HIGH SCORE!
            </h2>
            <p className="text-green-400 text-2xl mb-8 font-mono">
              {score.toLocaleString()}
            </p>
            <input
              autoFocus
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
              placeholder="ENTER NAME"
              className="bg-transparent border-b-2 border-green-500 text-center text-3xl text-white outline-none mb-8 w-64 font-bold placeholder-gray-600"
            />
            <p className="text-gray-500 text-sm animate-pulse">
              Press ENTER to save
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs mb-2">Developed for FintechAI</p>
      </div>
    </div>
  );
}
