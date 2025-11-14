const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 모든 주문 라우트는 인증 필요
router.use(authenticateToken);

// CREATE - 새로운 주문 생성
router.post('/', createOrder);

// READ - 모든 주문 조회 (관리자는 모든 주문, 일반 사용자는 자신의 주문만)
// 쿼리 파라미터: ?orderStatus=pending&paymentStatus=completed&page=1&limit=10
router.get('/', getAllOrders);

// READ - 주문번호로 주문 조회
router.get('/order-number/:orderNumber', getOrderByOrderNumber);

// READ - 특정 주문 조회 (ID로)
router.get('/:id', getOrderById);

// UPDATE - 주문 정보 수정 (관리자만 가능)
router.put('/:id', updateOrder);

// DELETE - 주문 삭제 (관리자만 가능)
router.delete('/:id', deleteOrder);

module.exports = router;

