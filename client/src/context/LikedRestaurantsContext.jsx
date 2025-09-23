import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const LIKED_RESTAURANTS_STORAGE_KEY = 'likedRestaurantsData';

// 1. Context 생성
const LikedRestaurantsContext = createContext();

// 2. localStorage에서 데이터 읽어오기 (기존과 동일)
const getLikedRestaurantsFromStorage = () => {
  try {
    const storedValue = localStorage.getItem(LIKED_RESTAURANTS_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    console.error('Error parsing liked restaurants from localStorage', error);
    return [];
  }
};

// 3. Provider 컴포넌트 생성 (상태 관리의 중심)
export function LikedRestaurantsProvider({ children }) {
  const [likedRestaurants, setLikedRestaurants] = useState(getLikedRestaurantsFromStorage());

  useEffect(() => {
    localStorage.setItem(LIKED_RESTAURANTS_STORAGE_KEY, JSON.stringify(likedRestaurants));
  }, [likedRestaurants]);

  const isLiked = useCallback((id) => 
    likedRestaurants.some(restaurant => restaurant.id === id),
    [likedRestaurants]
  );

  const toggleLike = useCallback((restaurant) => {
    const isCurrentlyLiked = likedRestaurants.some(r => r.id === restaurant.id);
    
    if (isCurrentlyLiked) {
      toast.info(`${restaurant.name} 좋아요를 취소했습니다.`);
      setLikedRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    } else {
      toast.success(`${restaurant.name}을(를) 좋아요했습니다! ❤️`);
      setLikedRestaurants(prev => [...prev, restaurant]);
    }
  }, [likedRestaurants]);

  const value = { likedRestaurants, isLiked, toggleLike };

  return (
    <LikedRestaurantsContext.Provider value={value}>
      {children}
    </LikedRestaurantsContext.Provider>
  );
}

// 4. 사용하기 편한 커스텀 훅 생성
export const useLikedRestaurants = () => {
  const context = useContext(LikedRestaurantsContext);
  if (context === undefined) {
    throw new Error('useLikedRestaurants must be used within a LikedRestaurantsProvider');
  }
  return context;
};
