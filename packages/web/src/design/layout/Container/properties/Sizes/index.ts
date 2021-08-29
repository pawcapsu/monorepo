const sizes = {
  auto: ['w-auto'],
  half: ['w-1/2'],
  full: ['w-full']
};

type EContainerSize = keyof typeof sizes;

export default sizes;
export type { EContainerSize };