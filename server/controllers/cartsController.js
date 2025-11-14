const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET - 현재 사용자의 장바구니 조회
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      // 장바구니가 없으면 새로 생성
      cart = new Cart({
        user: userId,
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
      await cart.save();
    }

    res.json({
      message: '장바구니 조회 성공',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: '장바구니 조회 실패',
      error: error.message,
    });
  }
};

// POST - 장바구니에 아이템 추가
const addItemToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    // 필수 필드 검증
    if (!productId || !quantity) {
      return res.status(400).json({
        message: '필수 필드가 누락되었습니다.',
        required: ['productId', 'quantity'],
      });
    }

    // 수량 검증
    if (quantity < 1) {
      return res.status(400).json({
        message: '수량은 1 이상이어야 합니다.',
      });
    }

    // 상품 존재 확인
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: '상품을 찾을 수 없습니다.',
      });
    }

    // 장바구니 찾기 또는 생성
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // 장바구니에 아이템 추가
    cart.addItem(productId, quantity, product.price);
    await cart.save();

    // 상품 정보와 함께 반환
    await cart.populate('items.product');

    res.json({
      message: '장바구니에 상품이 추가되었습니다.',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: '장바구니에 상품 추가 실패',
      error: error.message,
    });
  }
};

// PUT - 장바구니 아이템 수량 수정
const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: '수량은 1 이상이어야 합니다.',
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: '장바구니를 찾을 수 없습니다.',
      });
    }

    // 상품이 장바구니에 있는지 확인
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: '장바구니에 해당 상품이 없습니다.',
      });
    }

    // 수량 업데이트
    cart.updateItemQuantity(productId, quantity);
    await cart.save();

    await cart.populate('items.product');

    res.json({
      message: '장바구니 아이템이 수정되었습니다.',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: '장바구니 아이템 수정 실패',
      error: error.message,
    });
  }
};

// DELETE - 장바구니에서 아이템 제거
const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: '장바구니를 찾을 수 없습니다.',
      });
    }

    // 상품이 장바구니에 있는지 확인
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: '장바구니에 해당 상품이 없습니다.',
      });
    }

    // 아이템 제거
    cart.removeItem(productId);
    await cart.save();

    await cart.populate('items.product');

    res.json({
      message: '장바구니에서 상품이 제거되었습니다.',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: '장바구니에서 상품 제거 실패',
      error: error.message,
    });
  }
};

// DELETE - 장바구니 비우기
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: '장바구니를 찾을 수 없습니다.',
      });
    }

    cart.clearCart();
    await cart.save();

    res.json({
      message: '장바구니가 비워졌습니다.',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: '장바구니 비우기 실패',
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};

