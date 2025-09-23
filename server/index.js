// server.js
const createApp = require('./src/app');

const app = createApp();

// Vercel 환경이 아닐 경우 (로컬 개발 환경일 경우) 에만 서버를 리슨합니다.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Development server listening on port ${PORT}`);
  });
}

// Vercel은 이 export된 app을 사용하여 서버리스 함수를 생성합니다.
module.exports = app;
