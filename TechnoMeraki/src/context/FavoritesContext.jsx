// src/context/FavoritesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  // Cargar desde localStorage al iniciar
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('📦 Favoritos cargados desde localStorage:', parsed);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error al leer favoritos de localStorage:', error);
    }
    return [];
  });

  // Guardar en localStorage cada vez que favoriteIds cambie
  useEffect(() => {
    console.log('💾 Guardando favoritos en localStorage:', favoriteIds);
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Función para agregar/quitar favorito
  const toggleFavorite = (id) => {
    setFavoriteIds(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(favId => favId !== id) : [...prev, id];
      console.log(`🔄 Toggle favorite ${id}: ${isFav ? 'removido' : 'agregado'}`, newFavs);
      return newFavs;
    });
  };

  const isFavorite = (id) => favoriteIds.includes(id);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};