export function isCollectibleLetter(char: string): boolean {
  return /^[A-Z]$/.test(char);
}
