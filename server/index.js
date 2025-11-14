const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
// MONGODB_ATLAS_URI가 있으면 사용, 없으면 로컬 MongoDB 사용
const mongoUri = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/shopping-mall';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const dbType = process.env.MONGODB_ATLAS_URI ? 'MongoDB Atlas' : '로컬 MongoDB';
  console.log(`${dbType} 연결 성공`);
})
.catch((err) => console.error('MongoDB 연결 실패:', err));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Shopping Mall API 서버가 실행 중입니다.' });
});

// API 라우트
app.get('/api', (req, res) => {
  res.json({ message: 'API 라우트가 정상적으로 작동합니다.' });
});

// User 라우트 (로그인 포함)
app.use('/api/users', require('./routes/users'));

// Product 라우트
app.use('/api/products', require('./routes/products'));

// Cart 라우트
app.use('/api/carts', require('./routes/carts'));

// Order 라우트
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

