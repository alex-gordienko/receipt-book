export const cropLongText = (initialString: string) =>
  initialString.length > 50 ? initialString.substring(0, 50) + '...' : initialString