const sizes = {
  auto: ['w-auto'],
  half: ['w-1/2'],
  third: ['w-1/3'],
  "two-thirds": ['w-2/3'],
  quarter: ['w-1/4'],
  "three-quarters": ['w-3/4'],
  full: ['w-full']
};

type EContainerSize = keyof typeof sizes;

export default sizes;
export type { EContainerSize };