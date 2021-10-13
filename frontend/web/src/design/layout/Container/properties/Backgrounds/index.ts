const backgrounds = {
  dark: ['bg-gray-900'],
  'light-dark': ['bg-gray-800']
};

type EContainerBackground = keyof typeof backgrounds;

export default backgrounds;
export type { EContainerBackground };