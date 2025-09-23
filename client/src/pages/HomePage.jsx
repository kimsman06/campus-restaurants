/* src/pages/HomePage.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { FaMapMarkedAlt, FaHeart, FaStar } from 'react-icons/fa';

const HomeContainer = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const SearchWrapper = styled.div`
  margin: 2rem auto;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 30px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const Card = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #667eea;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

function HomePage() {
  const [school, setSchool] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const savedSchool = localStorage.getItem('schoolName');
    if (savedSchool) {
      setSchool(savedSchool);
    }
  }, []);

  useEffect(() => {
    if (location.state?.focusSearch) {
      searchInputRef.current?.focus();
    }
  }, [location.state]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && school.trim() !== '') {
      localStorage.setItem('schoolName', school.trim());
      navigate(`/list?school=${encodeURIComponent(school.trim())}`);
    }
  };

  return (
    <HomeContainer>
      <Title>우리 학교 맛집을 찾아보세요!</Title>
      <Subtitle>캠퍼스 주변 숨은 맛집들을 한눈에</Subtitle>

      <SearchWrapper>
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder="학교를 검색해보세요..."
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </SearchWrapper>
      
      <CardGrid>
        <Card to="/" state={{ focusSearch: true }}>
          <FaMapMarkedAlt />
          <h3>맛집 둘러보기</h3>
          <p>학교 이름으로 맛집을 검색하세요</p>
        </Card>
        
        <Card to="/popular">
          <FaStar />
          <h3>인기 맛집</h3>
          <p>가장 인기있는 맛집</p>
        </Card>
        
        <Card to="/favorites">
          <FaHeart />
          <h3>좋아요 목록</h3>
          <p>내가 선택한 맛집 모아보기</p>
        </Card>
      </CardGrid>
    </HomeContainer>
  );
}

export default HomePage;