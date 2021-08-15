export const getStatusCode = (input: string): string => {
  const regex = /\[(.*?)\]/;
  const code = regex.exec(`${input}`);
  return (code && code[1]) || "";
};

export const getDataItems = (input: any): any[] => {
  if (!input || !input.ItemsList || !input.ItemsList.item) {
    return [];
  }
  return convertObjectToArray(input.ItemsList.item);
};

// workaround to handle single object do not return as array
export const convertObjectToArray = (inputs: any): any[] => {
  return inputs.constructor === Array ? inputs : [ inputs as any ];
};

export const refreshScreen = (): void => {
  window.location.reload();
};

export const sleep = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
