export function getSavedItem(key: string): any {
  const saved = localStorage.getItem(key);

  return saved ? JSON.parse(saved) : null;
}

export function saveItem(key: string, item: any): void {
  localStorage.setItem(key, JSON.stringify(item));
}

export function deleteItem(key: string) {
  localStorage.removeItem(key);
}
