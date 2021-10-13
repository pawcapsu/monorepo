const sizes = {
  base: ["text-md", "mb-1"],
  md: ["text-xl", "font-medium", "mb-2"],
  xl: ["text-2xl", "font-bold", "mb-3"],
  'extra-xl': ["text-5xl", "font-bold", "mb-4"],
};

type EHeadingSize = keyof typeof sizes;

export default sizes;
export type { EHeadingSize };