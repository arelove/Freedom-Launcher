import React, { createContext, useContext, useState, ReactNode } from 'react';
import BottomMenu from './BottomMenu';

// Создаем типы для контекста
interface BottomMenuContextType {
    isOpen: boolean;
    toggleMenu: () => void;
    handleSaveToFile?: () => void; // Добавляем функцию для сохранения
  }
  
  // Создаем контекст
  const BottomMenuContext = createContext<BottomMenuContextType | undefined>(undefined);
  
  export const useBottomMenu = () => {
    const context = useContext(BottomMenuContext);
    if (!context) {
      throw new Error('useBottomMenu должен быть использован внутри BottomMenuProvider');
    }
    return context;
  };
  
  // Провайдер контекста
  export const BottomMenuProvider: React.FC<{ children: ReactNode, handleSaveToFile?: () => void }> = ({ children, handleSaveToFile }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
      setIsOpen((prevState) => !prevState);
    };
  
    return (
      <BottomMenuContext.Provider value={{ isOpen, toggleMenu, handleSaveToFile }}>
        {children}
        <BottomMenu open={isOpen} onClose={toggleMenu} />
      </BottomMenuContext.Provider>
    );
  };
