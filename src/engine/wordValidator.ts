// Word Validator & Dictionary Engine
// Ponytail compliant: small, direct, zero-bloat, NO hints

let dictionarySet: Set<string> | null = null;
let wordsByFirstSyllable: Map<string, string[]> = new Map();
let isDictionaryLoading = false;

// Normalize Vietnamese word
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');
}

// Split into syllables
export function getSyllables(word: string): string[] {
  return normalizeWord(word).split(' ').filter(Boolean);
}

// Load dictionary from public static file
export async function loadDictionary(): Promise<{ count: number }> {
  if (dictionarySet && dictionarySet.size > 0) {
    return { count: dictionarySet.size };
  }

  if (isDictionaryLoading) {
    while (isDictionaryLoading) {
      await new Promise(r => setTimeout(r, 50));
    }
    return { count: dictionarySet ? dictionarySet.size : 0 };
  }

  isDictionaryLoading = true;
  try {
    const res = await fetch('/words.txt');
    if (!res.ok) {
      throw new Error(`Failed to load words: ${res.statusText}`);
    }
    const text = await res.text();
    const lines = text.split('\n');
    
    dictionarySet = new Set<string>();
    wordsByFirstSyllable = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = normalizeWord(lines[i]);
      if (!line) continue;
      
      const syllables = line.split(' ');
      if (syllables.length === 2) {
        dictionarySet.add(line);

        const first = syllables[0];
        let list = wordsByFirstSyllable.get(first);
        if (!list) {
          list = [];
          wordsByFirstSyllable.set(first, list);
        }
        list.push(line);
      }
    }

    return { count: dictionarySet.size };
  } catch (err) {
    console.error('Dictionary load error, using fallback seed words:', err);
    dictionarySet = new Set([
      'tử thần', 'thần chết', 'chết tiệt', 'tiệt trùng', 'trùng hợp', 'hợp lý',
      'lý do', 'do dự', 'dự báo', 'báo cáo', 'cáo trạng', 'trạng nguyên', 'nguyên nhân',
      'luyến tiếc', 'tiếc nuối', 'nuối tiếc'
    ]);
    return { count: dictionarySet.size };
  } finally {
    isDictionaryLoading = false;
  }
}

// Check if a word is in dictionary
export function isInDictionary(word: string): boolean {
  if (!dictionarySet) return true;
  return dictionarySet.has(normalizeWord(word));
}

// Get all possible follow-up words given a last syllable
export function getFollowUpWords(lastSyllable: string): string[] {
  const norm = normalizeWord(lastSyllable);
  return wordsByFirstSyllable.get(norm) || [];
}

// Validate candidate word: supports both full 2-word phrase or just the suffix word!
export interface ValidationResult {
  valid: boolean;
  reason?: string;
  isTrap?: boolean;
  isDeadEnd?: boolean;
  endingSyllable?: string;
  resolvedWord?: string;
}

export function validateCandidateWord(
  candidateInput: string,
  previousWord: string,
  usedWords: string[]
): ValidationResult {
  let normCandidate = normalizeWord(candidateInput);
  let syllables = getSyllables(normCandidate);

  // If user only typed 1 word (suffix) and we have a previous word:
  // Automatically combine with previous word's last syllable!
  // e.g. "luyến tiếc" -> user types "nuối" -> auto-combined into "tiếc nuối"
  if (syllables.length === 1 && previousWord) {
    const prevSyllables = getSyllables(previousWord);
    const requiredFirst = prevSyllables[prevSyllables.length - 1];
    normCandidate = normalizeWord(`${requiredFirst} ${syllables[0]}`);
    syllables = getSyllables(normCandidate);
  }

  // Must be 2 syllables
  if (syllables.length !== 2) {
    return { valid: false, reason: 'Vui lòng nhập từ đuôi (ví dụ: "nuối") hoặc cả cụm 2 từ!' };
  }

  // Check first syllable matches last syllable of previous word
  if (previousWord) {
    const prevSyllables = getSyllables(previousWord);
    const requiredFirst = prevSyllables[prevSyllables.length - 1];
    if (syllables[0] !== requiredFirst) {
      return { 
        valid: false, 
        reason: `Từ này phải bắt đầu bằng chữ "${requiredFirst.toUpperCase()}"!` 
      };
    }
  }

  // Must not have been used in current match
  const normUsed = usedWords.map(normalizeWord);
  if (normUsed.includes(normCandidate)) {
    return { valid: false, reason: `Từ "${normCandidate}" đã được sử dụng rồi!` };
  }

  // Must exist in Vietnamese dictionary
  if (dictionarySet && dictionarySet.size > 0 && !dictionarySet.has(normCandidate)) {
    return { valid: false, reason: `Từ "${normCandidate}" không có trong từ điển tiếng Việt!` };
  }

  // Detect Dead End / Trap
  const endingSyllable = syllables[1];
  const allFollowUps = getFollowUpWords(endingSyllable);
  const usedSet = new Set(normUsed);
  const availableFollowUps = allFollowUps.filter(w => !usedSet.has(normalizeWord(w)));

  const isDeadEnd = availableFollowUps.length === 0;
  const isTrap = availableFollowUps.length > 0 && availableFollowUps.length <= 3;

  return { valid: true, isTrap, isDeadEnd, endingSyllable, resolvedWord: normCandidate };
}

// Random starter word
const STARTER_WORDS = [
  'chiến tranh', 'hòa bình', 'phiêu lưu', 'bí mật', 'vương quốc', 'hạnh phúc',
  'tử thần', 'phép thuật', 'sát thủ', 'hoàng gia', 'thần kỳ', 'thiên nhiên',
  'công lý', 'anh hùng', 'thám tử', 'kho báu', 'huyền thoại', 'vũ trụ',
  'sấm sét', 'bão tố', 'ngọn lửa', 'đại dương', 'mặt trời', 'sóng thần', 'thách thức'
];

export function getRandomStarterWord(): string {
  return STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
}
