import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Torrent {
  link: string;
  // Добавьте другие свойства торрента, если необходимо
}

interface FavoritesContextType {
  favoriteTorrents: Torrent[];
  addToFavorites: (torrent: Torrent) => void;
  removeFromFavorites: (torrentToRemove: Torrent) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteTorrents, setFavoriteTorrents] = useState<Torrent[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteTorrents');
    if (storedFavorites) {
      setFavoriteTorrents(JSON.parse(storedFavorites));
    }
  }, []);

  const addToFavorites = (torrent: Torrent) => {
    const updatedFavorites = [...favoriteTorrents, torrent];
    setFavoriteTorrents(updatedFavorites);
    localStorage.setItem('favoriteTorrents', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (torrentToRemove: Torrent) => {
    const updatedFavorites = favoriteTorrents.filter(torrent => torrent.link !== torrentToRemove.link);
    setFavoriteTorrents(updatedFavorites);
    localStorage.setItem('favoriteTorrents', JSON.stringify(updatedFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favoriteTorrents, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
