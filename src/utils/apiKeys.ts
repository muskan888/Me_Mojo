
export const getApiKey = (service: string): string | null => {
  const savedKeys = localStorage.getItem('memojo-api-keys');
  if (!savedKeys) return null;
  
  const keys = JSON.parse(savedKeys);
  return keys[service] || null;
};

export const hasApiKey = (service: string): boolean => {
  return !!getApiKey(service);
};

export const setApiKey = (service: string, key: string): void => {
  const savedKeys = localStorage.getItem('memojo-api-keys');
  const keys = savedKeys ? JSON.parse(savedKeys) : {};
  
  keys[service] = key;
  localStorage.setItem('memojo-api-keys', JSON.stringify(keys));
};

export const getAllApiKeys = (): Record<string, string> => {
  const savedKeys = localStorage.getItem('memojo-api-keys');
  return savedKeys ? JSON.parse(savedKeys) : {};
};
