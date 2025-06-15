
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";
type Dict = Record<string, string>;

interface I18nContextValue {
  lang: Language;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLang: (l: Language) => void;
}

const defaultDict: Dict = {};
const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  dir: "ltr",
  t: k => k,
  setLang: () => {}
});

const LANG_KEY = "mm_lang";

const loadDict = async (lang: Language): Promise<Dict> => {
  try {
    const resp = await fetch(`/locales/${lang}/common.json`);
    return await resp.json();
  } catch { return {} }
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(LANG_KEY) as Language) || "en";
    }
    return "en";
  });
  const [dict, setDict] = useState<Dict>(defaultDict);

  useEffect(() => {
    loadDict(lang).then(setDict);
    // Set html[lang] and dir for RTL/LTR
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }, []);

  const t = useCallback((k: string) => (dict[k] ?? k), [dict]);
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
export const useI18n = () => useContext(I18nContext);
