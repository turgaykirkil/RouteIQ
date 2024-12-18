export const getDisplayValue = (value: any, defaultValue: string = 'N/A') => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};
