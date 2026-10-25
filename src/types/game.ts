export type GameMode = 'standard' | 'bomb' | 'curse' | 'boss';

export type PlayerRole = 'host' | 'player' | 'spectator';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  hp: number; // Max 3
  isAlive: boolean;
  score: number;
  activeCurse?: 'frozen' | 'reverse' | 'shield' | 'banned_letter';
  bannedLetter?: string;
}

export interface WordItem {
  word: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  isTrap?: boolean;
}

export interface ReactionItem {
  id: string;
  emoji: string;
  text: string;
  authorName: string;
  color: string;
}

export interface GameState {
  roomId: string;
  mode: GameMode;
  status: 'lobby' | 'playing' | 'gameover';
  players: Player[];
  currentTurnIndex: number;
  currentWord: string;
  history: WordItem[];
  turnTimeLeft: number;
  maxTurnTime: number;
  bombTimeLeft?: number;
  turnDirection: 1 | -1;
  winner?: Player;
  trapWordsSecret: string[];
}
