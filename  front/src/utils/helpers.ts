export const validateWikiTitle = (title: string): boolean => {
  if (!title || title.trim().length === 0) return false;
  return /^[a-zA-Z0-9_()\s-]+$/.test(title);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateRandomWikiTitle = (): string => {
  const titles = [
    'Python_(programming_language)',
    'Artificial_intelligence',
    'Machine_learning',
    'World_Wide_Web',
    'Computer_science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};
