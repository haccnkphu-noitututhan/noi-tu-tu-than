import React, { useState, useEffect } from 'react';
import { Play, Users, Bot, Edit3, MessageSquare } from 'lucide-react';
import type { GameMode, GameState, Player } from './types/game';
import { loadDictionary, getRandomStarterWord } from './engine/wordValidator';
import { AudioManager } from './engine/audioManager';
import { DeathBot } from './engine/deathBot';
import { P2PNetwork, type NetworkMessage } from './engine/p2pNetwork';

// UI Components
import { TopNavbar } from './components/TopNavbar';
import { HeroBanner } from './components/HeroBanner';
import { RoomManagerBar } from './components/RoomManagerBar';
import { StatusTicker } from './components/StatusTicker';
import { SecretTrapBox } from './components/SecretTrapBox';
import { GameModeSelector } from './components/GameModeSelector';
import { GameArena } from './components/GameArena';
import { SoundboardDock, type ReactionType } from './components/SoundboardDock';
import { RulesModal } from './components/RulesModal';
import { MatchSummaryPage } from './components/MatchSummaryPage';
import { ProfileModal } from './components/ProfileModal';
import { RenderAvatar } from './components/ComicAvatars';
import { RoundPunishmentConfig, type PunishmentConfig, PRESET_PUNISHMENTS } from './components/RoundPunishmentConfig';
import { LiveChatDrawer, type ChatMessage } from './components/LiveChatDrawer';
import { ReactionEffects, type FloatingReaction } from './components/ReactionEffects';

const AVATAR_KEYS = ['ninja', 'ghost', 'reaper', 'demon', 'wizard', 'cyborg', 'judge', 'alien'];

// Safe helper to find next alive player without infinite while loop
function getNextAliveIndex(players: Player[], currentIndex: number, direction: 1 | -1 = 1): number {
  if (!players || players.length === 0) return 0;
  const aliveCount = players.filter(p => p.isAlive).length;
  if (aliveCount === 0) return 0;

  let next = (currentIndex + direction + players.length) % players.length;
  let count = 0;
  while (!players[next]?.isAlive && count < players.length) {
    next = (next + direction + players.length) % players.length;
    count++;
  }
  return next;
}

// Error Boundary to prevent any white screen crash
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('Captured Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAF8F2]">
          <div className="bg-white neo-border-thick rounded-3xl p-6 max-w-md w-full shadow-neo text-center">
            <h2 className="text-xl font-black uppercase text-rose-600 mb-2">ĐÃ CÓ LỖI XẢY RA</h2>
            <p className="text-xs font-semibold text-gray-600 mb-4">
              Hệ thống đã phục hồi trạng thái an toàn. Bạn có thể bấm nút bên dưới để tiếp tục.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="neo-btn bg-[#FEE227] text-black px-6 py-2 rounded-full font-black text-xs uppercase cursor-pointer"
            >
              [ PHỤC HỒI & TẢI LẠI TRANG ]
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameApp />
    </ErrorBoundary>
  );
}

function GameApp() {
  // Audio state
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isBgmOn, setIsBgmOn] = useState(false);

  // Modals & Drawers
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Live Chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Floating Reaction Visual Effects (Colorful badges drifting upwards)
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // Alert Announcement banner
  const [announcement, setAnnouncement] = useState('');

  // Player identity
  const [myPlayerId] = useState(() => 'p_' + Math.random().toString(36).substring(2, 9));
  const [myAvatar, setMyAvatar] = useState(() => AVATAR_KEYS[Math.floor(Math.random() * AVATAR_KEYS.length)]);
  const [myName, setMyName] = useState(() => 'Đấu Sĩ #' + Math.floor(100 + Math.random() * 900));

  // Punishment configuration
  const [punishmentConfig, setPunishmentConfig] = useState<PunishmentConfig>({
    totalRounds: 3,
    activeRoundIndex: 0,
    roundPunishments: [
      PRESET_PUNISHMENTS[0],
      PRESET_PUNISHMENTS[1],
      PRESET_PUNISHMENTS[2],
    ],
  });

  // Room state
  const [gameState, setGameState] = useState<GameState>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    const initialRoomId = urlRoom ? urlRoom.toUpperCase() : P2PNetwork.generateRoomCode();
    const initialStarterWord = getRandomStarterWord();

    const hostPlayer: Player = {
      id: myPlayerId,
      name: 'Đấu Sĩ #' + Math.floor(100 + Math.random() * 900),
      avatar: myAvatar,
      isHost: !urlRoom,
      hp: 3,
      isAlive: true,
      score: 0,
    };

    return {
      roomId: initialRoomId,
      mode: 'standard',
      status: 'lobby',
      players: [hostPlayer],
      currentTurnIndex: 0,
      currentWord: initialStarterWord,
      history: [],
      turnTimeLeft: 10,
      maxTurnTime: 10,
      turnDirection: 1,
      trapWordsSecret: [],
    };
  });

  const isHost = gameState.players.find(p => p.id === myPlayerId)?.isHost ?? true;

  // Initialize Dictionary once
  useEffect(() => {
    loadDictionary().then(({ count }) => {
      console.log(`Loaded ${count} Vietnamese words.`);
    });
  }, []);

  // Update profile
  const handleSaveProfile = (newName: string, newAvatar: string) => {
    setMyName(newName);
    setMyAvatar(newAvatar);

    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.id === myPlayerId ? { ...p, name: newName, avatar: newAvatar } : p
      );
      const updated = { ...prev, players: updatedPlayers };
      if (isHost) {
        P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: updated });
      }
      return updated;
    });
  };

  // Sync Audio manager states
  const handleToggleSound = () => {
    const next = AudioManager.toggleSound();
    setIsSoundOn(next);
  };

  const handleToggleBgm = () => {
    const next = AudioManager.toggleBGM();
    setIsBgmOn(next);
  };

  // Spawn a floating reaction on screen
  const spawnReactionEffect = (type: ReactionType, authorName: string) => {
    const newR: FloatingReaction = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      authorName,
      leftPercent: Math.floor(12 + Math.random() * 76),
    };
    setFloatingReactions(prev => [...prev.slice(-15), newR]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newR.id));
    }, 1900);
  };

  // Trigger Reaction Sound & Dedicated Visual Effect
  const handleTriggerReaction = (type: ReactionType, soundKey: string) => {
    AudioManager.playReactionSound(soundKey);
    spawnReactionEffect(type, myName);

    const msg: NetworkMessage = {
      type: 'REACTION',
      effectType: type,
      authorName: myName,
    };
    if (isHost) {
      P2PNetwork.broadcast(msg);
    } else {
      P2PNetwork.sendToHost(msg);
    }
  };

  // Send Direct Chat Message
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: myPlayerId,
      senderName: myName,
      senderAvatar: myAvatar,
      text,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, newMsg]);

    const netMsg: NetworkMessage = {
      type: 'CHAT_MESSAGE',
      message: newMsg,
    };
    if (isHost) {
      P2PNetwork.broadcast(netMsg);
    } else {
      P2PNetwork.sendToHost(netMsg);
    }
  };

  // Add bot player for Solo / Testing
  const handleAddBot = () => {
    setGameState(prev => {
      const botId = 'bot_' + Math.random().toString(36).substring(2, 7);
      const botPlayer: Player = {
        id: botId,
        name: 'Thần Chết AI',
        avatar: 'reaper',
        isHost: false,
        hp: 3,
        isAlive: true,
        score: 0,
      };
      const updated = {
        ...prev,
        players: [...prev.players, botPlayer]
      };
      if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: updated });
      return updated;
    });
  };

  // Switch Game Mode
  const handleSelectMode = (mode: GameMode) => {
    setGameState(prev => {
      let players = [...prev.players];
      if (mode === 'boss' && !players.some(p => p.id.startsWith('bot_'))) {
        players.push({
          id: 'bot_boss',
          name: 'BOSS THẦN CHẾT',
          avatar: 'reaper',
          isHost: false,
          hp: 5,
          isAlive: true,
          score: 0,
        });
      }
      const updated = { ...prev, mode, players };
      if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: updated });
      return updated;
    });
  };

  // Add secret trap word in lobby
  const handleAddTrapWord = (word: string) => {
    setGameState(prev => ({
      ...prev,
      trapWordsSecret: [...new Set([...prev.trapWordsSecret, word.toLowerCase().trim()])]
    }));
  };

  const handleRemoveTrapWord = (word: string) => {
    setGameState(prev => ({
      ...prev,
      trapWordsSecret: prev.trapWordsSecret.filter(w => w !== word)
    }));
  };

  // Join Room as Guest
  const handleJoinRoom = async (targetRoomId: string) => {
    const success = await P2PNetwork.joinRoom(
      targetRoomId,
      { id: myPlayerId, name: myName, avatar: myAvatar },
      (msg) => {
        if (msg.type === 'STATE_UPDATE') {
          setGameState(msg.state);
        } else if (msg.type === 'REACTION') {
          AudioManager.playReactionSound(msg.effectType);
          spawnReactionEffect(msg.effectType as ReactionType, msg.authorName || 'Đối thủ');
        } else if (msg.type === 'CHAT_MESSAGE') {
          setChatMessages(prev => [...prev, msg.message]);
        }
      }
    );

    if (success) {
      setGameState(prev => ({
        ...prev,
        roomId: targetRoomId,
        players: prev.players.map(p => p.id === myPlayerId ? { ...p, isHost: false } : p)
      }));
    } else {
      console.warn(`Could not connect to room ${targetRoomId}`);
    }
  };

  // Create new room
  const handleNewRoom = () => {
    const newId = P2PNetwork.generateRoomCode();
    window.location.href = window.location.pathname + `?room=${newId}`;
  };

  // Initialize P2P Room for Host on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');

    if (urlRoom) {
      // Guest joined via link
      handleJoinRoom(urlRoom.toUpperCase());
    } else {
      // User is Host: open peer room
      P2PNetwork.createRoom(
        gameState.roomId,
        (msg, _peerId) => {
          if (msg.type === 'JOIN_REQUEST') {
            setGameState(prev => {
              if (prev.players.some(p => p.id === msg.player.id)) return prev;
              const newPlayer: Player = {
                id: msg.player.id,
                name: msg.player.name,
                avatar: msg.player.avatar,
                isHost: false,
                hp: 3,
                isAlive: true,
                score: 0,
              };
              const updated = {
                ...prev,
                players: [...prev.players, newPlayer],
              };
              P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: updated });
              return updated;
            });
          } else if (msg.type === 'PLAYER_ACTION') {
            if (msg.action === 'FORFEIT') {
              handleForfeitTurn(msg.payload.playerId);
            } else if (msg.action === 'SUBMIT_WORD') {
              handleWordSubmit(
                msg.payload.word,
                msg.payload.isTrap,
                msg.payload.isDeadEnd,
                msg.payload.endingSyllable
              );
            }
          } else if (msg.type === 'REACTION') {
            AudioManager.playReactionSound(msg.effectType);
            spawnReactionEffect(msg.effectType as ReactionType, msg.authorName || 'Đối thủ');
            P2PNetwork.broadcast(msg);
          } else if (msg.type === 'CHAT_MESSAGE') {
            setChatMessages(prev => [...prev, msg.message]);
            P2PNetwork.broadcast(msg);
          }
        }
      ).catch(err => console.warn('P2P Host init error:', err));
    }

    return () => {
      P2PNetwork.disconnect();
    };
  }, []);

  // Start Match with a completely RANDOM starter word!
  const handleStartGame = () => {
    const randomStarter = gameState.trapWordsSecret.length > 0 && Math.random() < 0.25
      ? gameState.trapWordsSecret[Math.floor(Math.random() * gameState.trapWordsSecret.length)]
      : getRandomStarterWord();

    const maxTime = gameState.mode === 'bomb' ? 8 : 10;

    const newState: GameState = {
      ...gameState,
      status: 'playing',
      currentWord: randomStarter,
      history: [{
        word: randomStarter,
        authorId: 'system',
        authorName: 'Khởi đầu',
        timestamp: Date.now(),
      }],
      currentTurnIndex: 0,
      turnTimeLeft: maxTime,
      maxTurnTime: maxTime,
      winner: undefined,
      players: gameState.players.map(p => ({
        ...p,
        hp: p.id.startsWith('bot_boss') ? 5 : 3,
        isAlive: true,
        score: 0,
      })),
    };

    setAnnouncement('');
    setGameState(newState);
    if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: newState });
    AudioManager.playDing();
  };

  // Turn timer loop: Host runs authoritative timer and penalizes timeout (-1 HP, -5 pts)
  useEffect(() => {
    if (gameState.status !== 'playing' || !isHost) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;

        // If time ran out!
        if (prev.turnTimeLeft <= 1) {
          AudioManager.playBoom();
          AudioManager.playBuzzer();

          const activeIdx = prev.currentTurnIndex;
          const timedOutPlayer = prev.players[activeIdx];

          // Active player loses 1 heart and 5 penalty points
          const updatedPlayers = prev.players.map((p, idx) => {
            if (idx === activeIdx) {
              const newHp = Math.max(0, p.hp - 1);
              return {
                ...p,
                hp: newHp,
                isAlive: newHp > 0,
                score: Math.max(0, (p.score || 0) - 5),
              };
            }
            return p;
          });

          // Check if game over (<= 1 player alive)
          const alivePlayers = updatedPlayers.filter(p => p.isAlive);
          if (alivePlayers.length <= 1) {
            AudioManager.playDeathBell();
            const champion = alivePlayers[0];
            const finalPlayers = updatedPlayers.map(p =>
              p.id === champion?.id ? { ...p, score: (p.score || 0) + 50 } : p
            );
            const finishedState: GameState = {
              ...prev,
              status: 'gameover',
              players: finalPlayers,
              winner: champion ? { ...champion, score: (champion.score || 0) + 50 } : undefined,
            };
            P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: finishedState });
            return finishedState;
          }

          // Advance turn safely and reset to a fresh random starter word
          const freshWord = getRandomStarterWord();
          const nextIdx = getNextAliveIndex(updatedPlayers, activeIdx, prev.turnDirection);
          const acceleratedTime = Math.max(5, prev.maxTurnTime - 1);

          setAnnouncement(`[ HẾT GIỜ! ] Đấu sĩ ${timedOutPlayer.name} bị Thần Chết trừ 1 tim! Khởi đầu lại với từ: "${freshWord.toUpperCase()}"`);
          setTimeout(() => setAnnouncement(''), 4500);

          const nextState: GameState = {
            ...prev,
            players: updatedPlayers,
            currentWord: freshWord,
            currentTurnIndex: nextIdx,
            turnTimeLeft: acceleratedTime,
            maxTurnTime: acceleratedTime,
          };
          P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: nextState });
          return nextState;
        }

        // Ticking audio cue
        if (prev.turnTimeLeft <= 3) {
          AudioManager.playTick(2);
        }

        return {
          ...prev,
          turnTimeLeft: prev.turnTimeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, isHost]);

  // Handle Bot Turn automatically
  useEffect(() => {
    if (gameState.status !== 'playing' || !isHost) return;
    const currentActive = gameState.players[gameState.currentTurnIndex];

    if (currentActive && currentActive.id.startsWith('bot_') && currentActive.isAlive) {
      const used = gameState.history.map(h => h.word);
      const difficulty = gameState.mode === 'boss' ? 'hard' : 'medium';

      DeathBot.makeMove(gameState.currentWord, used, difficulty).then((botRes) => {
        if (botRes.failed || !botRes.word) {
          // Bot failed / timed out
          AudioManager.playBuzzer();
          setGameState(prev => {
            const activeIdx = prev.currentTurnIndex;
            const botPlayer = prev.players[activeIdx];
            const updatedPlayers = prev.players.map((p, idx) => {
              if (idx === activeIdx) {
                const newHp = Math.max(0, p.hp - 1);
                return { ...p, hp: newHp, isAlive: newHp > 0, score: Math.max(0, (p.score || 0) - 5) };
              }
              return p;
            });
            const alive = updatedPlayers.filter(p => p.isAlive);
            if (alive.length <= 1) {
              const champion = alive[0];
              const finalPlayers = updatedPlayers.map(p =>
                p.id === champion?.id ? { ...p, score: (p.score || 0) + 50 } : p
              );
              const fin: GameState = { ...prev, status: 'gameover', players: finalPlayers, winner: champion ? { ...champion, score: (champion.score || 0) + 50 } : undefined };
              P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: fin });
              return fin;
            }

            const freshWord = getRandomStarterWord();
            const nextIdx = getNextAliveIndex(updatedPlayers, activeIdx, prev.turnDirection);
            setAnnouncement(`[ THẦN CHẾT BÍ TỪ! ] ${botPlayer.name} bị trừ 1 tim! Khởi đầu mới với từ: "${freshWord.toUpperCase()}"`);
            setTimeout(() => setAnnouncement(''), 4500);

            const nxt: GameState = {
              ...prev,
              players: updatedPlayers,
              currentWord: freshWord,
              currentTurnIndex: nextIdx,
              turnTimeLeft: prev.maxTurnTime,
            };
            P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: nxt });
            return nxt;
          });
        } else {
          // Bot succeeded
          handleWordSubmit(botRes.word, botRes.isTrap, botRes.isDeadEnd, botRes.endingSyllable);
        }
      });
    }
  }, [gameState.currentTurnIndex, gameState.status, isHost]);

  // Forfeit / Give up turn when stuck on a word
  const handleForfeitTurn = (_targetPlayerId: string) => {
    setGameState((prev) => {
      if (prev.status !== 'playing') return prev;
      const activeIdx = prev.currentTurnIndex;
      const forfeitingPlayer = prev.players[activeIdx];

      AudioManager.playBoom();
      AudioManager.playBuzzer();

      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === activeIdx) {
          const newHp = Math.max(0, p.hp - 1);
          return {
            ...p,
            hp: newHp,
            isAlive: newHp > 0,
            score: Math.max(0, (p.score || 0) - 5),
          };
        }
        return p;
      });

      const alivePlayers = updatedPlayers.filter(p => p.isAlive);
      if (alivePlayers.length <= 1) {
        AudioManager.playDeathBell();
        const champion = alivePlayers[0];
        const finalPlayers = updatedPlayers.map(p =>
          p.id === champion?.id ? { ...p, score: (p.score || 0) + 50 } : p
        );
        const finishedState: GameState = {
          ...prev,
          status: 'gameover',
          players: finalPlayers,
          winner: champion ? { ...champion, score: (champion.score || 0) + 50 } : undefined,
        };
        if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: finishedState });
        return finishedState;
      }

      const freshWord = getRandomStarterWord();
      const nextIdx = getNextAliveIndex(updatedPlayers, activeIdx, prev.turnDirection);
      const nextTime = Math.max(5, prev.maxTurnTime - 1);

      setAnnouncement(`[ BÍ TỪ! ] ${forfeitingPlayer.name} chấp nhận bị phạt -1 TIM để qua lượt! Từ mới: "${freshWord.toUpperCase()}"`);
      setTimeout(() => setAnnouncement(''), 4500);

      const nextState: GameState = {
        ...prev,
        players: updatedPlayers,
        currentWord: freshWord,
        currentTurnIndex: nextIdx,
        turnTimeLeft: nextTime,
        maxTurnTime: nextTime,
      };
      if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: nextState });
      return nextState;
    });
  };

  // Submit word from Player or Bot (Handles Instant Dead-End Kill!)
  const handleWordSubmit = (
    newWord: string,
    isTrap?: boolean,
    isDeadEnd?: boolean,
    endingSyllable?: string
  ) => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      const activeIdx = prev.currentTurnIndex;
      const activePlayer = prev.players[activeIdx];

      const newHistoryItem = {
        word: newWord,
        authorId: activePlayer.id,
        authorName: activePlayer.name,
        timestamp: Date.now(),
        isTrap: isTrap || isDeadEnd,
      };

      if (prev.trapWordsSecret.includes(newWord.toLowerCase())) {
        newHistoryItem.isTrap = true;
      }

      // Check for LETHAL DEAD-END (No follow-up words exist in dictionary!)
      if (isDeadEnd) {
        AudioManager.playBoom();
        AudioManager.playDeathBell();

        // Victim is the next player in order
        const victimIdx = getNextAliveIndex(prev.players, activeIdx, prev.turnDirection);
        const victim = prev.players[victimIdx];

        // Deduct victim HP immediately & Reward killer +35 points!
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === victimIdx) {
            const newHp = Math.max(0, p.hp - 1);
            return { ...p, hp: newHp, isAlive: newHp > 0 };
          }
          if (idx === activeIdx) {
            return { ...p, score: (p.score || 0) + 35 };
          }
          return p;
        });

        // Set lethal kill announcement
        const killerMsg = `TỪ TỬ THẦN KẾT LIỄU! "${newWord.toUpperCase()}" kết thúc bằng "${(endingSyllable || '').toUpperCase()}" không có từ nào nối tiếp! ${victim?.name || 'Nạn nhân'} bị trừ 1 tim ngay lập tức!`;
        setAnnouncement(killerMsg);
        setTimeout(() => setAnnouncement(''), 5000);

        // Check if game over
        const alivePlayers = updatedPlayers.filter(p => p.isAlive);
        if (alivePlayers.length <= 1) {
          const champion = alivePlayers[0];
          const finalPlayers = updatedPlayers.map(p =>
            p.id === champion?.id ? { ...p, score: (p.score || 0) + 50 } : p
          );
          const finishedState: GameState = {
            ...prev,
            status: 'gameover',
            players: finalPlayers,
            winner: champion ? { ...champion, score: (champion.score || 0) + 50 } : undefined,
            history: [newHistoryItem, ...prev.history],
          };
          if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: finishedState });
          return finishedState;
        }

        // Match continues with a FRESH random starter word!
        const freshWord = getRandomStarterWord();
        const nextTurnAfterVictim = getNextAliveIndex(updatedPlayers, victimIdx, prev.turnDirection);
        const nextMaxTime = prev.maxTurnTime;
        const freshState: GameState = {
          ...prev,
          currentWord: freshWord,
          history: [
            {
              word: freshWord,
              authorId: 'system',
              authorName: 'Khởi đầu mới',
              timestamp: Date.now(),
            },
            newHistoryItem,
            ...prev.history,
          ],
          players: updatedPlayers,
          currentTurnIndex: nextTurnAfterVictim,
          turnTimeLeft: nextMaxTime,
          maxTurnTime: nextMaxTime,
        };

        if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: freshState });
        return freshState;
      }

      // Normal valid word flow:
      const nextIdx = getNextAliveIndex(prev.players, activeIdx, prev.turnDirection);
      const nextMaxTime = Math.max(5, prev.maxTurnTime - (prev.history.length % 5 === 0 ? 1 : 0));

      const earnedPoints = isTrap ? 20 : 10;
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === activeIdx) {
          return { ...p, score: (p.score || 0) + earnedPoints };
        }
        return p;
      });

      const updatedState: GameState = {
        ...prev,
        currentWord: newWord,
        history: [newHistoryItem, ...prev.history],
        players: updatedPlayers,
        currentTurnIndex: nextIdx,
        turnTimeLeft: nextMaxTime,
        maxTurnTime: nextMaxTime,
      };

      if (isHost) P2PNetwork.broadcast({ type: 'STATE_UPDATE', state: updatedState });
      return updatedState;
    });
  };

  // Submit word from GameArena (handles Host vs Guest routing)
  const handleArenaSubmitWord = (
    word: string,
    isTrap?: boolean,
    isDeadEnd?: boolean,
    endingSyllable?: string
  ) => {
    if (isHost) {
      handleWordSubmit(word, isTrap, isDeadEnd, endingSyllable);
    } else {
      P2PNetwork.sendToHost({
        type: 'PLAYER_ACTION',
        action: 'SUBMIT_WORD',
        payload: { word, isTrap, isDeadEnd, endingSyllable }
      });
    }
  };

  // Forfeit from GameArena (handles Host vs Guest routing)
  const handleArenaForfeit = () => {
    if (isHost) {
      handleForfeitTurn(myPlayerId);
    } else {
      P2PNetwork.sendToHost({
        type: 'PLAYER_ACTION',
        action: 'FORFEIT',
        payload: { playerId: myPlayerId }
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pb-24 px-3 sm:px-6 pt-3 max-w-6xl mx-auto selection:bg-[#FEE227]">
      {/* Floating Reaction Visual Effects (Colors drifting upwards) */}
      <ReactionEffects reactions={floatingReactions} />

      {/* Top Navbar */}
      <TopNavbar
        roomId={gameState.roomId}
        isHost={isHost}
        statusText={
          gameState.status === 'playing'
            ? 'Đang giao tranh sinh tử'
            : gameState.status === 'gameover'
            ? 'Kết thúc • Bản án phán quyết'
            : 'Sảnh Chờ • Sẵn sàng'
        }
        onNewRoom={handleNewRoom}
      />

      {/* Main Content Area: 3 Dedicated Full-Page States */}
      {gameState.status === 'playing' ? (
        <div className="w-full mt-3">
          <GameArena
            gameState={gameState}
            myPlayerId={myPlayerId}
            onSubmitWord={handleArenaSubmitWord}
            onForfeitTurn={handleArenaForfeit}
            onLeaveMatch={() => setGameState(prev => ({ ...prev, status: 'lobby' }))}
            announcement={announcement}
          />
        </div>
      ) : gameState.status === 'gameover' ? (
        <div className="w-full mt-3">
          <MatchSummaryPage
            winner={gameState.winner}
            players={gameState.players}
            history={gameState.history}
            activePunishment={
              punishmentConfig.roundPunishments[punishmentConfig.activeRoundIndex] ||
              punishmentConfig.roundPunishments[0]
            }
            onPlayAgain={handleStartGame}
            onReturnToLobby={() => setGameState(prev => ({ ...prev, status: 'lobby' }))}
            isHost={isHost}
          />
        </div>
      ) : (
        <main className="w-full flex flex-col gap-4 mt-3">
          {/* Hero Banner */}
          <HeroBanner
            isSoundOn={isSoundOn}
            isBgmOn={isBgmOn}
            onToggleSound={handleToggleSound}
            onToggleBgm={handleToggleBgm}
            onOpenRules={() => setIsRulesOpen(true)}
          />

          {/* Room Manager Bar */}
          <RoomManagerBar
            currentRoomId={gameState.roomId}
            onJoinRoom={handleJoinRoom}
          />

          {/* Status Ticker */}
          <StatusTicker
            roomId={gameState.roomId}
            isHost={isHost}
            playerCount={gameState.players.length}
          />

          {/* Secret Trap Box */}
          <SecretTrapBox
            trapWords={gameState.trapWordsSecret}
            onAddTrapWord={handleAddTrapWord}
            onRemoveTrapWord={handleRemoveTrapWord}
          />

          {/* Game Mode Selector */}
          <GameModeSelector
            selectedMode={gameState.mode}
            onSelectMode={handleSelectMode}
            isHost={isHost}
          />

          {/* Round Punishment Configuration (Matching User's Image!) */}
          <RoundPunishmentConfig
            config={punishmentConfig}
            onChange={setPunishmentConfig}
            isHost={isHost}
          />

          {/* Players in Lobby & Start Action */}
          <div className="w-full bg-white neo-border-thick rounded-3xl p-5 shadow-neo flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span>DANH SÁCH ĐẤU SĨ SẴN SÀNG ({gameState.players.length} NGƯỜI)</span>
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  Gửi link phòng cho bạn bè hoặc thêm Bot Thần Chết để bắt đầu thi đấu ngay!
                </p>
              </div>

              {/* Action buttons on Lobby: Change Profile & Add Bot & Chat */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="neo-btn flex items-center gap-1.5 bg-white hover:bg-gray-100 text-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>[ CHAT ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="neo-btn flex items-center gap-1.5 bg-[#FEE227] hover:bg-yellow-400 text-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>[ ĐỔI TÊN & AVATAR ]</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddBot}
                  className="neo-btn flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-black" />
                  <span>[ + THÊM THẦN CHẾT AI ]</span>
                </button>
              </div>
            </div>

            {/* Player Cards in Lobby (Vector Comic Avatars) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {gameState.players.map((p) => (
                <div
                  key={p.id}
                  className="neo-border bg-[#FFFDF8] rounded-2xl p-3 flex items-center gap-3 shadow-neo-sm"
                >
                  <div className="w-12 h-12 bg-white neo-border rounded-xl flex items-center justify-center shrink-0 shadow-neo-sm">
                    <RenderAvatar avatarId={p.avatar} className="w-9 h-9" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black uppercase text-black truncate">
                      {p.name} {p.id === myPlayerId ? '(Tôi)' : ''}
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase">
                      {p.isHost ? 'CHỦ TỌA' : 'ĐẤU SĨ'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Match Button */}
            {isHost ? (
              <button
                onClick={handleStartGame}
                className="neo-btn w-full bg-[#FEE227] hover:bg-yellow-400 text-black py-4 rounded-full font-black text-sm sm:text-base uppercase flex items-center justify-center gap-2 shadow-neo cursor-pointer tracking-wider mt-2"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>[ MỞ TÒA / BẮT ĐẦU ĐẤU TRƯỜNG SINH TỬ ]</span>
              </button>
            ) : (
              <div className="w-full bg-gray-50 neo-border rounded-full py-3 text-center text-xs sm:text-sm font-bold text-gray-500 uppercase italic">
                Đang chờ Chủ Tọa phòng {gameState.roomId} bấm mở đấu trường...
              </div>
            )}
          </div>
        </main>
      )}

      {/* Floating Sticky Soundboard Dock */}
      <SoundboardDock
        onTriggerReaction={handleTriggerReaction}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
      />

      {/* Live Direct Chat Drawer */}
      <LiveChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        myPlayerId={myPlayerId}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentName={myName}
        currentAvatar={myAvatar}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
