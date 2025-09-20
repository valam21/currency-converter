// src/app/components/ui/FavoritesList.tsx

'use client';

import { useState } from 'react';
import { Heart, Star, Trash2, ArrowRightLeft, Plus } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useCurrencyStore } from '@/store/currencyStore';
import { getCurrencyFlag } from '@/utils/helpers';

export default function FavoritesList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { favorites, removeFromFavorites, toggleFavorite, canAddFavorite } = useFavorites();
  const { selectedFrom, selectedTo, setSelectedFrom, setSelectedTo } = useCurrencyStore();

  const handleQuickConvert = (from: string, to: string) => {
    setSelectedFrom(from);
    setSelectedTo(to);
  };

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromFavorites(id);
  };

  const handleAddCurrentPair = () => {
    if (canAddFavorite(selectedFrom, selectedTo)) {
      toggleFavorite(selectedFrom, selectedTo);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">
              Favorite Pairs
            </h3>
            <span className="text-sm text-gray-500">
              ({favorites.length}/10)
            </span>
          </div>

          {favorites.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 mb-4">No favorite pairs yet</p>
            
            {canAddFavorite(selectedFrom, selectedTo) && (
              <button
                onClick={handleAddCurrentPair}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedFrom}/{selectedTo}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {favorites
              .slice(0, isExpanded ? favorites.length : 3)
              .map((favorite) => (
                <div
                  key={favorite.id}
                  className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleQuickConvert(favorite.from, favorite.to)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={getCurrencyFlag(favorite.from)}
                        alt={`${favorite.from} flag`}
                        className="w-5 h-3 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="font-mono font-semibold text-sm">
                        {favorite.from}
                      </span>
                    </div>

                    <ArrowRightLeft className="w-4 h-4 text-gray-400" />

                    <div className="flex items-center space-x-2">
                      <img
                        src={getCurrencyFlag(favorite.to)}
                        alt={`${favorite.to} flag`}
                        className="w-5 h-3 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="font-mono font-semibold text-sm">
                        {favorite.to}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleRemoveFavorite(favorite.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-error transition-all"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {!isExpanded && favorites.length > 3 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  +{favorites.length - 3} more pairs
                </button>
              </div>
            )}

            {canAddFavorite(selectedFrom, selectedTo) && (
              <button
                onClick={handleAddCurrentPair}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">
                  Add {selectedFrom}/{selectedTo}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
