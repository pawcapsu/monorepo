const types = {
  // Solid button type
  solid: [ 'text-white', 'bg-indigo-500', 'hover:bg-indigo-600', 'active:bg-indigo-800' ],

  // Ghost button type
  ghost: [ 'text-white', 'bg-gray-800', 'hover:bg-gray-700', 'active:bg-gray-600' ],
};

type EButtonType = keyof typeof types;

export default types;
export type { EButtonType };