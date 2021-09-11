const sizes = {
  base: ['text-base', 'opacity-80'],
  md: ['text-md', 'opacity-80'],
  xl: ['text-xl', 'opacity-80']
};

type EParagraphSize = keyof typeof sizes;

export default sizes;
export type { EParagraphSize };