// AI Thần Chết: Solo & Boss Battle Mode
import { getFollowUpWords, getSyllables, normalizeWord } from './wordValidator';

export interface BotTurnResult {
  word?: string;
  failed: boolean;
  isTrap?: boolean;
  isDeadEnd?: boolean;
  endingSyllable?: string;
}

export class DeathBot {
  public static async makeMove(
    previousWord: string,
    usedWords: string[],
    difficulty: 'easy' | 'medium' | 'hard' = 'hard'
  ): Promise<BotTurnResult> {
    const prevSyllables = getSyllables(previousWord);
    const targetFirst = prevSyllables[prevSyllables.length - 1];

    // Think time simulation
    const thinkMs = difficulty === 'easy' ? 2200 : difficulty === 'medium' ? 1500 : 1000;
    await new Promise(r => setTimeout(r, thinkMs));

    // Get candidate words
    const candidates = getFollowUpWords(targetFirst);
    const normUsed = new Set(usedWords.map(normalizeWord));
    const available = candidates.filter(w => !normUsed.has(normalizeWord(w)));

    if (available.length === 0) {
      return { failed: true };
    }

    // In easy mode, small chance of bot "giving up"
    if (difficulty === 'easy' && Math.random() < 0.25) {
      return { failed: true };
    }

    if (difficulty === 'hard') {
      // Find the most lethal word: ending syllable has fewest follow-up words!
      let bestWord = available[0];
      let minFollowUps = 9999;
      let chosenEnding = '';

      // Evaluate up to 30 candidates to keep it fast
      const sample = available.slice(0, 30);
      for (const cand of sample) {
        const syls = getSyllables(cand);
        const nextTarget = syls[syls.length - 1];
        const nextFollowUps = getFollowUpWords(nextTarget).filter(w => !normUsed.has(normalizeWord(w)));
        
        if (nextFollowUps.length < minFollowUps) {
          minFollowUps = nextFollowUps.length;
          bestWord = cand;
          chosenEnding = nextTarget;
        }
      }

      return {
        word: bestWord,
        failed: false,
        isTrap: minFollowUps <= 2,
        isDeadEnd: minFollowUps === 0,
        endingSyllable: chosenEnding,
      };
    }

    // Medium: Random pick from available
    const randomPick = available[Math.floor(Math.random() * available.length)];
    const syls = getSyllables(randomPick);
    const ending = syls[syls.length - 1];
    const followUps = getFollowUpWords(ending).filter(w => !normUsed.has(normalizeWord(w)));

    return {
      word: randomPick,
      failed: false,
      isTrap: followUps.length <= 2,
      isDeadEnd: followUps.length === 0,
      endingSyllable: ending,
    };
  }
}
