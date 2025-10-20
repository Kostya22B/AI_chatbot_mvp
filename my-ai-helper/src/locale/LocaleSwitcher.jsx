import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import ru from '../locales/jp.json'; // ваше второе JSON

const bundles = { en, ru };

const LocaleContext = createContext({
  localeKey: 'en',
  t: (k) => k,
  strings: bundles.en,
  toggleLocale: () => {}
});

export const LocaleProvider = ({ children, persistKey = 'app_locale' }) => {
  const [localeKey, setLocaleKey] = useState(() => {
    try { return localStorage.getItem(persistKey) || 'en'; } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem(persistKey, localeKey); } catch (e) { /* ignore */ }
  }, [localeKey, persistKey]);

  // функция-переводчик
  const t = (key) => {
    return (bundles[localeKey] && bundles[localeKey][key]) || (bundles['en'] && bundles['en'][key]) || key;
  };

  // объект словаря (для backward-compatibility)
  const strings = bundles[localeKey] || bundles['en'];

  const toggleLocale = (next) => {
    if (next && bundles[next]) { setLocaleKey(next); return; }
    setLocaleKey((p) => (p === 'en' ? 'ru' : 'en'));
  };

  return (
    <LocaleContext.Provider value={{ localeKey, t, strings, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);

export const LocaleToggleButton = ({ className = '', labels = { en: 'EN', ru: 'RU' } }) => {
  const { localeKey, toggleLocale } = useLocale();
  return (
    <button onClick={() => toggleLocale()} className={`px-3 py-1 rounded-md border ${className}`} title="Toggle locale">
      {labels[localeKey] ?? localeKey}
    </button>
  );
};
