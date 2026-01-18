/**
 * Profanity Filter for Sloth Names
 * 
 * Checks for bad words and variations (l33t speak, etc.)
 */

// Bad words list (add more as needed)
const BAD_WORDS = [
  // Explicit
  'fuck', 'shit', 'cunt', 'cock', 'dick', 'pussy', 'ass', 'asshole',
  'bitch', 'bastard', 'damn', 'piss', 'wanker', 'twat', 'bollocks',
  // Slurs (abbreviated for safety, expand as needed)
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'spic', 'chink', 'kike',
  // Sexual
  'porn', 'xxx', 'sex', 'penis', 'vagina', 'dildo', 'whore', 'slut',
  // Variations people try
  'f u c k', 'fck', 'fuk', 'phuck', 'phuk',
  'sh1t', 'sh!t', 's h i t',
  'b1tch', 'b!tch',
  'a$$', '@ss', 'a s s',
  'd1ck', 'd!ck',
  'c0ck',
];

// L33t speak mappings
const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '8': 'b',
  '@': 'a',
  '$': 's',
  '!': 'i',
};

/**
 * Normalize text for comparison
 * - Lowercase
 * - Remove spaces
 * - Convert l33t speak
 */
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  
  // Remove spaces and special chars (except letters)
  normalized = normalized.replace(/[^a-z0-9@$!]/g, '');
  
  // Convert l33t speak
  for (const [leet, letter] of Object.entries(LEET_MAP)) {
    normalized = normalized.split(leet).join(letter);
  }
  
  return normalized;
}

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  const normalized = normalizeText(text);
  
  for (const word of BAD_WORDS) {
    const normalizedWord = normalizeText(word);
    if (normalized.includes(normalizedWord)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate a sloth name
 */
export interface NameValidation {
  valid: boolean;
  error?: string;
}

export function validateSlothName(name: string): NameValidation {
  // Trim whitespace
  const trimmed = name.trim();
  
  // Check length
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmed.length > 20) {
    return { valid: false, error: 'Name must be 20 characters or less' };
  }
  
  // Check for valid characters (letters, numbers, spaces, underscores, hyphens)
  if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
    return { valid: false, error: 'Name can only contain letters, numbers, spaces, underscores, and hyphens' };
  }
  
  // Check for profanity
  if (containsProfanity(trimmed)) {
    return { valid: false, error: 'Name contains inappropriate language' };
  }
  
  // Check it doesn't start with @ (reserved for X handles)
  if (trimmed.startsWith('@')) {
    return { valid: false, error: 'Name cannot start with @' };
  }
  
  return { valid: true };
}

/**
 * Sanitize name for storage
 */
export function sanitizeName(name: string): string {
  return name.trim().slice(0, 20);
}
