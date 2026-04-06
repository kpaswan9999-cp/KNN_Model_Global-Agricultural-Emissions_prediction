const HISTORY_KEY = 'ecopredict_history';

export const saveToHistory = (result, inputs) => {
  const history = getHistory();
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    inputs,
    result
  };
  
  // Keep only the last 50 entries to avoid bloat
  const updatedHistory = [newEntry, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return newEntry;
};

export const getHistory = () => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteFromHistory = (id) => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
