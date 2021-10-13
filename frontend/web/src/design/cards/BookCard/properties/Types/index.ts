const types = {
  compact: {
    hide: ['author', 'buttons'],
    classes: ['w-full h-full flex flex-col rounded-xl bg-gray-900 p-4'],
  },
  default: {
    hide: [],
    classes: ['w-full h-full flex flex-col rounded-xl bg-gray-900 p-4'],
  },
};

type EBookCardType = keyof typeof types;

export default types;
export type { EBookCardType };