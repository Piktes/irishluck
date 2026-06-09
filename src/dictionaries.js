const dictionaries = {
  tr: () => import('./dictionaries/tr.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
};

export const locales = ['tr', 'en'];
export const defaultLocale = 'tr';

export const getDictionary = async (locale) => {
  const norm = locales.includes(locale) ? locale : defaultLocale;
  return dictionaries[norm]();
};
