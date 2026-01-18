// Source - https://stackoverflow.com/a/7228322
// Posted by Francisc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-18, License - CC BY-SA 4.0

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
