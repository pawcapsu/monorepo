const sizes = {
  small: ['w-1/4'],
  base: ['w-1/3'],
  medium: ['w-1/2'],
}

type EBookCardSize = keyof typeof sizes;

export default sizes;
export type { EBookCardSize };