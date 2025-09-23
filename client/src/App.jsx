import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import FavoritesPage from './pages/FavoritesPage'; // 좋아요 페이지 import

// Components
import Header from './components/Header';
import NotFound from './components/NotFound';

// Styles
import GlobalStyles from './styles/GlobalStyles';

import { LikedRestaurantsProvider } from './context/LikedRestaurantsContext';

// React Query Client 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LikedRestaurantsProvider>
        <BrowserRouter>
          <GlobalStyles />
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/list" element={<ListPage />} />
                <Route path="/favorites" element={<FavoritesPage />} /> {/* 좋아요 페이지 라우트 추가 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>© 2025 Campus Foodmap | Made with React</p>
            </footer>
          </div>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </LikedRestaurantsProvider>
    </QueryClientProvider>
  );
}

export default App;
