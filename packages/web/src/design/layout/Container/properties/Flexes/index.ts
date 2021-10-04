const flexes = {
  none: [],
  flex: ['flex'],
  centered: ['flex justify-center items-center'],
  between: ['flex justify-between items-center']
};

type EContainerFlex = keyof typeof flexes;

export default flexes;
export type { EContainerFlex };