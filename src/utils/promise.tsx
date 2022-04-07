export const forever = new Promise(() => {});

export const raf = () => new Promise(requestAnimationFrame);

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
