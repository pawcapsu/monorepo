const types = {
  base: [],
  full: ['w-full h-screen'],
};

type EContainerType = keyof typeof types;

export default types;
export type { EContainerType };