const sizes = {
  base: [],
  full: ['w-full'],
  auto: ['w-auto'],
};

type EButtonSize = keyof typeof sizes;

export default sizes;
export type { EButtonSize };