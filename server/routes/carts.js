const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cartsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 모든 장바구니 라우트는 인증 필요
router.use(authenticateToken);

// GET - 현재 사용자의 장바구니 조회
router.get('/', getCart);

// POST - 장바구니에 아이템 추가
router.post('/items', addItemToCart);

// PUT - 장바구니 아이템 수량 수정
router.put('/items/:productId', updateCartItem);

// DELETE - 장바구니에서 아이템 제거
router.delete('/items/:productId', removeItemFromCart);

// DELETE - 장바구니 비우기
router.delete('/', clearCart);

module.exports = router;

