export const getDisplayValue = (value: any, defaultValue: string = 'N/A') => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};

export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Geçersiz Tarih';
  }

  if (format === 'short') {
    return dateObj.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return dateObj.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
