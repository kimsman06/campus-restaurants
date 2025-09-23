import React from 'react';
import styled from '@emotion/styled';
import RestaurantList from '../components/RestaurantList';
import { useLikedRestaurants } from '../context/LikedRestaurantsContext';

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
`;

function FavoritesPage() {
  const { likedRestaurants } = useLikedRestaurants();

  return (
    <PageContainer>
      <Title>❤️ 내가 좋아요한 맛집</Title>
      {likedRestaurants.length > 0 ? (
        <RestaurantList restaurants={likedRestaurants} />
      ) : (
        <p style={{ textAlign: 'center' }}>아직 좋아요한 맛집이 없습니다.</p>
      )}
    </PageContainer>
  );
}

export default FavoritesPage;