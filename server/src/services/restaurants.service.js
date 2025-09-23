// src/services/restaurants.service.js
require('dotenv').config();
const path = require('path');
const { readFile } = require('fs/promises');
const { readFileSync } = require('fs');
const axios = require('axios');
const ogs = require('open-graph-scraper');
const Restaurant = require('../models/restaurant.model');

const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
const DEFAULT_IMAGE = 'https://via.placeholder.com/300'; // 유효한 플레이스홀더 이미지
let restaurantCache = loadRestaurantsSync();

function loadRestaurantsSync() {
  const raw = readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function loadRestaurantsAsync() {
  const raw = await readFile(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function ensureCache() {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = await loadRestaurantsAsync();
  }
  return restaurantCache;
}

function cloneCollection(collection) {
  return collection.map((restaurant) => new Restaurant(restaurant));
}

async function searchRestaurants(query, page) {
  const KAKAO_API_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';
  try {
    const response = await axios.get(KAKAO_API_URL, {
      params: { 
        query: `${query} 맛집`, 
        size: 8, // 한 페이지에 보여줄 아이템 수
        page: Number(page), 
        category_group_code: 'FD6',
        radius: 2000, // 2km 반경
      },
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
      },
    });

    const { documents, meta } = response.data;

    if (documents.length === 0) {
      return { data: [], nextPage: null, isEnd: true };
    }

    const restaurantPromises = documents.map(async (doc) => {
      let imageUrl = DEFAULT_IMAGE;
      try {
        const { result } = await ogs({ url: doc.place_url, timeout: 2000 });
        if (result.ogImage && result.ogImage[0].url) {
          imageUrl = result.ogImage[0].url;
        }
      } catch (error) {
        console.error(`OG 스크래핑 실패: ${doc.place_url}`, error.message);
      }

      return new Restaurant({
        id: doc.id,
        name: doc.place_name,
        category: doc.category_name.split(' > ')[1] || doc.category_name.split(' > ')[0],
        location: doc.road_address_name || doc.address_name,
        phone: doc.phone || '정보 없음',
        image: imageUrl,
        place_url: doc.place_url,
      });
    });

    const restaurants = await Promise.all(restaurantPromises);
    
    return {
      data: restaurants,
      nextPage: meta.is_end ? null : Number(page) + 1,
      isEnd: meta.is_end,
    };

  } catch (error) {
    console.error('카카오 API 오류:', error.response ? error.response.data : error.message);
    throw new Error('카카오 API에서 데이터를 가져오는 데 실패했습니다.');
  }
}

async function getAllRestaurants(schoolQuery, page = 1) {
  if (schoolQuery) {
    return searchRestaurants(schoolQuery, page);
  }
  await ensureCache();
  // 기본 데이터에 대한 페이지네이션 (간단한 버전)
  const data = cloneCollection(restaurantCache);
  return { data, nextPage: null, isEnd: true };
}

function getAllRestaurantsSync() {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = loadRestaurantsSync();
  }
  return cloneCollection(restaurantCache);
}

async function getRestaurantById(id) {
  await ensureCache();
  const numericId = Number(id);
  return restaurantCache.find((restaurant) => restaurant.id === numericId) || null;
}

async function getPopularRestaurants(limit = 5) {
  const restaurants = await getAllRestaurants();
  return restaurants.data
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

module.exports = {
  getAllRestaurants,
  getAllRestaurantsSync,
  getRestaurantById,
  getPopularRestaurants,
  loadRestaurantsSync,
  loadRestaurantsAsync,
};
