export function getWord(): string {
  const words = ["apple", "guitar", "elephant", "bicycle", "volcano"];
  return words[Math.floor(Math.random() * words.length)] ?? "sea otter";
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
