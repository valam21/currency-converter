// src/hooks/useFavorites.ts

import { useCurrencyStore } from '@/store/currencyStore';

export const useFavorites = () => {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useCurrencyStore();

  const toggleFavorite = (from: string, to: string) => {
    if (isFavorite(from, to)) {
      const favorite = favorites.find(fav => fav.from === from && fav.to === to);
      if (favorite) {
        removeFromFavorites(favorite.id);
      }
    } else {
      addToFavorites(from, to);
    }
  };

  const canAddFavorite = (from: string, to: string) => {
    return !isFavorite(from, to) && favorites.length < 10;
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    canAddFavorite,
  };
};
