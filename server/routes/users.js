const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
} = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 로그인
router.post('/login', login);

// 토큰으로 현재 유저 정보 가져오기 (인증 필요)
router.get('/me', authenticateToken, getCurrentUser);

// CREATE - 새로운 유저 생성
router.post('/', createUser);

// READ - 모든 유저 조회
router.get('/', getAllUsers);

// READ - 특정 유저 조회 (ID로)
router.get('/:id', getUserById);

// UPDATE - 유저 정보 수정
router.put('/:id', updateUser);

// DELETE - 유저 삭제
router.delete('/:id', deleteUser);

module.exports = router;

