// tests/restaurants.routes.test.js
const request = require('supertest');
const axios = require('axios');
const createApp = require('../src/app');
const restaurantService = require('../src/services/restaurants.service');

// axios를 모킹합니다.
jest.mock('axios');

describe('Restaurant routes', () => {
  let app;

  beforeEach(() => {
    // 각 테스트 전에 모킹된 함수들을 초기화합니다.
    jest.clearAllMocks();
    // 초기 데이터 로드를 위해 동기 함수를 사용합니다.
    restaurantService.loadRestaurantsSync();
    app = createApp();
  });

  describe('GET /api/restaurants', () => {
    it('should return a list of default restaurants if no query is provided', async () => {
      const response = await request(app).get('/api/restaurants');
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3); // 기본 데이터 3개
    });

    it('should return restaurants from Kakao API when school query is provided', async () => {
      const mockKakaoResponse = {
        data: {
          documents: [
            {
              id: '12345',
              place_name: '카카오맛집',
              category_name: '음식점 > 한식',
              address_name: '카카오 주소',
              road_address_name: '카카오 도로명 주소',
              rating: '4.5',
              place_url: 'http://kakao.place.com/12345'
            }
          ]
        }
      };
      axios.get.mockResolvedValue(mockKakaoResponse);

      const res = await request(app).get('/api/restaurants?school=아주대학교');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('카카오맛집');
      expect(axios.get).toHaveBeenCalledWith(
        'https://dapi.kakao.com/v2/local/search/keyword.json',
        {
          headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
          params: { query: '아주대학교 맛집', size: 15 },
        }
      );
    });
  });

  test('GET /api/restaurants/sync-demo flags synchronous execution', async () => {
    const response = await request(app).get('/api/restaurants/sync-demo');
    expect(response.status).toBe(200);
    expect(response.body.meta.execution).toBe('synchronous');
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const response = await request(app).get('/api/restaurants/1');
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  test('GET /api/restaurants/:id handles missing items', async () => {
    const response = await request(app).get('/api/restaurants/999');
    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain('not found');
  });
});
