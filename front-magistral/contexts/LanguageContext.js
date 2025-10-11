import { createContext, useContext } from 'react';

export const LanguageContext = createContext({
  language: 'es',
  setLanguage: () => {},
  t: (key, fallback) => fallback ?? key
});

export function useLanguage() {
  return useContext(LanguageContext);
}

