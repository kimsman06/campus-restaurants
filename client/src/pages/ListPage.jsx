/* src/pages/ListPage.jsx */
import React, { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import RestaurantList from '../components/RestaurantList';
import { restaurantAPI } from '../services/api';
import { ClipLoader } from 'react-spinners';

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  span {
    color: #667eea;
  }
`;

const FilterContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const LoaderWrapper = styled.div`
  padding: 2rem;
  text-align: center;
`;

function ListPage() {
  const [searchParams] = useSearchParams();
  const school = searchParams.get('school');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const categories = ['전체', '한식', '중식', '일식', '양식', '아시아음식', '분식', '카페'];

  const { ref, inView } = useInView();

  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status 
  } = useInfiniteQuery({
    queryKey: ['restaurants', school],
    queryFn: ({ pageParam = 1 }) => restaurantAPI.getRestaurants(school, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!school,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);


  const allRestaurants = data?.pages.flatMap(page => page.data) || [];

  const filteredData = selectedCategory === '전체' 
    ? allRestaurants
    : allRestaurants.filter(r => r.category === selectedCategory);

  return (
    <PageContainer>
      <Title>
        {school ? <span>{school}</span> : '전체'} 맛집 목록
      </Title>
      
      <FilterContainer>
        {categories.map(category => (
          <FilterButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </FilterButton>
        ))}
      </FilterContainer>

      {status === 'loading' ? (
        <LoaderWrapper>
          <ClipLoader color="#667eea" size={50} />
          <p>맛집 정보를 불러오는 중...</p>
        </LoaderWrapper>
      ) : status === 'error' ? (
        <p>에러가 발생했습니다: {error.message}</p>
      ) : (
        <>
          {filteredData.length > 0 ? (
            <RestaurantList restaurants={filteredData} />
          ) : (
            <p>{school} 주변 맛집을 찾지 못했습니다.</p>
          )}

          <LoaderWrapper ref={ref}>
            {isFetchingNextPage
              ? <ClipLoader color="#667eea" size={35} />
              : hasNextPage
              ? '더 많은 맛집을 보려면 스크롤하세요.'
              : '마지막 맛집입니다.'
            }
          </LoaderWrapper>
        </>
      )}
    </PageContainer>
  );
}

export default ListPage;