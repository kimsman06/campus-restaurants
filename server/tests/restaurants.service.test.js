// tests/restaurants.service.test.js
const axios = require('axios');
const restaurantService = require('../src/services/restaurants.service');

// axios 모듈 전체를 모킹합니다.
jest.mock('axios');

describe('RestaurantService', () => {
  beforeEach(() => {
    // 각 테스트가 실행되기 전에 모든 모의(mock)를 초기화합니다.
    jest.clearAllMocks();
  });

  describe('getAllRestaurants', () => {
    it('should return local restaurant data if no school query is provided', async () => {
      const restaurants = await restaurantService.getAllRestaurants();
      expect(Array.isArray(restaurants)).toBe(true);
      // restaurants.json에 기본적으로 3개의 데이터가 있다고 가정합니다.
      expect(restaurants.length).toBe(3);
      expect(restaurants[0].name).toBe('송림식당');
    });

    it('should call searchRestaurants and return mapped data when school query is provided', async () => {
      const mockKakaoResponse = {
        data: {
          documents: [
            {
              id: '98765',
              place_name: '카카오테스트맛집',
              category_name: '음식점 > 분식',
              address_name: '테스트 주소',
              road_address_name: '테스트 도로명 주소',
              rating: '4.8',
              place_url: 'http://kakao.test.com/98765'
            }
          ]
        }
      };
      // axios.get이 mockKakaoResponse를 반환하도록 설정합니다.
      axios.get.mockResolvedValue(mockKakaoResponse);

      const restaurants = await restaurantService.getAllRestaurants('테스트대학교');

      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants.length).toBe(1);
      expect(restaurants[0].name).toBe('카카오테스트맛집');
            expect(restaurants[0].id).toBe(98765);

      // axios.get이 올바른 인자와 함께 호출되었는지 확인합니다.
      expect(axios.get).toHaveBeenCalledWith(
        'https://dapi.kakao.com/v2/local/search/keyword.json',
        {
          headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
          params: { query: '테스트대학교 맛집', size: 15 },
        }
      );
    });
  });

  test('getAllRestaurantsSync returns data immediately', () => {
    const restaurants = restaurantService.getAllRestaurantsSync();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });
});