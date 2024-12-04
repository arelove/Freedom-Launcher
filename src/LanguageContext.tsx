import React, { createContext, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Инициализируем язык через useState
  const [language, setLanguageState] = useState<string>(i18n.language || 'ru');
  
  // Оборачиваем в useCallback, чтобы зависимость не менялась каждый рендер
  const setLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
