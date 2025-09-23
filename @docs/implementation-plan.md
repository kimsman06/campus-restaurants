# 세부 구현 계획서

이 문서는 `development-plan.md`를 기반으로 각 단계별 세부 구현 계획을 정의합니다.

---

### **Phase 1: 백엔드 API 개편 및 카카오맵 연동**

**목표:** 학교 이름으로 주변 맛집을 검색하여 반환하는 백엔드 API를 구축합니다.

1.  **[Backend] 라이브러리 설치**
    -   `server` 디렉토리에서 아래 명령어를 실행하여 API 요청 및 환경 변수 관리를 위한 라이브러리를 설치합니다.
    ```bash
    npm install axios dotenv
    ```

2.  **[Backend] 환경 변수 설정**
    -   `server` 디렉토리 최상위에 `.env` 파일을 생성하고, 발급받은 카카오맵 REST API 키를 추가합니다.
    -   **파일명:** `server/.env`
    ```
    KAKAO_API_KEY=YOUR_KAKAO_REST_API_KEY
    ```

3.  **[Backend] 맛집 서비스 로직 수정 (`restaurants.service.js`)**
    -   `axios`와 `dotenv`를 import 합니다.
    -   카카오맵 키워드 검색 API를 호출하는 `searchRestaurants` 함수를 새로 구현합니다. 이 함수는 학교 이름을 받아 관련 식당 목록(이름, 주소, 평점 등)을 반환합니다.
    -   기존 `getAllRestaurants` 함수를 수정하여, `school` 검색어가 인자로 들어올 경우 `searchRestaurants`를 호출하고, 아닐 경우 기존처럼 `restaurants.json`의 데이터를 반환하도록 분기 처리합니다.

4.  **[Backend] 컨트롤러 수정 (`restaurants.controller.js`)**
    -   `getRestaurants` 컨트롤러 함수가 `req.query.school` 값을 확인합니다.
    -   해당 값이 존재하면 `restaurantService.getAllRestaurants(school)` 형태로 서비스 함수를 호출하도록 수정합니다.

---

### **Phase 2: 프론트엔드 검색 기능 구현**

**목표:** 사용자가 학교 이름을 검색하고, API를 통해 받은 맛집 목록을 화면에 표시합니다.

1.  **[Frontend] 메인 페이지 UI 수정 (`HomePage.jsx`)**
    -   `react-router-dom`의 `useNavigate`와 `react`의 `useState`, `useEffect` 훅을 사용합니다.
    -   학교 이름을 입력받을 `<input>`과 검색 `<button>`을 포함한 검색 폼을 구현합니다.
    -   `useEffect`를 사용하여 컴포넌트 마운트 시 `localStorage`에서 이전에 검색한 학교 이름을 불러와 입력창에 설정합니다.
    -   검색 버튼 클릭 시, 입력된 학교 이름을 `localStorage`에 저장하고, `useNavigate`를 이용해 `/list?school={학교이름}` 경로로 이동시킵니다.

2.  **[Frontend] API 서비스 수정 (`api.jsx`)**
    -   `getRestaurants` 함수가 `school` 이름을 인자로 받도록 수정합니다.
    -   `school` 인자가 존재할 경우, `/api/restaurants?school=${school}` 형태의 URL로 GET 요청을 보내도록 수정합니다.

3.  **[Frontend] 맛집 목록 페이지 수정 (`ListPage.jsx`)**
    -   `react-router-dom`의 `useSearchParams` 훅을 사용하여 URL로부터 `school` 쿼리 파라미터를 가져옵니다.
    -   `@tanstack/react-query`의 `useQuery` 훅이 `api.jsx`의 `getRestaurants` 함수를 호출할 때, 가져온 `school` 파라미터를 전달하도록 수정합니다.
    -   API 응답에 따라 맛집 목록 또는 "검색 결과 없음" 메시지를 표시합니다.

---

### **Phase 3: '좋아요' 기능 및 페이지 구현**

**목표:** 사용자가 선호하는 맛집을 저장하고 모아볼 수 있는 개인화 기능을 추가합니다.

1.  **[Frontend] '좋아요' 커스텀 훅 생성 (`useLikedRestaurants.js`)**
    -   `client/src/hooks` 디렉토리를 생성합니다.
    -   `localStorage`에서 'likedRestaurants' 키의 데이터를 읽고 쓰는 로직을 포함하는 `useLikedRestaurants` 훅을 새로 작성합니다.
    -   이 훅은 '좋아요' 목록(ID 배열), '좋아요' 추가 함수, '좋아요' 제거 함수를 반환합니다.

2.  **[Frontend] 맛집 카드 UI 수정 (`RestaurantCard.jsx`)**
    -   `useLikedRestaurants` 훅을 사용하여 해당 맛집이 '좋아요' 목록에 있는지 확인합니다.
    -   `react-icons` 등을 활용해 '좋아요' 버튼(예: 빈 하트/채워진 하트)을 추가합니다.
    -   버튼 클릭 시, `useLikedRestaurants` 훅에서 반환된 함수를 호출하여 '좋아요' 상태를 토글합니다.

3.  **[Frontend] '좋아요' 페이지 생성 (`FavoritesPage.jsx`)**
    -   `client/src/pages`에 `FavoritesPage.jsx` 파일을 새로 생성합니다.
    -   `useLikedRestaurants` 훅을 사용해 '좋아요'한 맛집 ID 목록을 가져옵니다.
    -   `useQuery`를 사용해 전체 맛집 정보를 가져온 뒤, '좋아요'한 ID 목록과 일치하는 맛집만 필터링하여 화면에 렌더링합니다.

4.  **[Frontend] 라우팅 및 네비게이션 수정 (`App.jsx`, `Header.jsx`)**
    -   `App.jsx`의 `Routes` 안에 `FavoritesPage`를 위한 라우트를 추가합니다. (예: `<Route path="/favorites" element={<FavoritesPage />} />`)
    -   `Header.jsx`에서 기존 '맛집 제보' 네비게이션 링크를 '좋아요 목록' (`/favorites`) 링크로 변경합니다. 이로서 기존 등록 페이지는 UI상에서 접근할 수 없게 됩니다.
