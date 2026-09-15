import Fuse from 'fuse.js';

export function createNameSearch<T>(items: T[], getName: (item: T) => string) {
  const fuse = new Fuse(items.map((item) => ({ item, name: getName(item) })), {
    keys: ['name'],
    threshold: 0.35,
    ignoreLocation: true,
    ignoreDiacritics: true,
  });

  return (query: string): T[] => {
    const trimmedQuery = query.trim();
    return trimmedQuery ? fuse.search(trimmedQuery).map(({ item }) => item.item) : items;
  };
}
