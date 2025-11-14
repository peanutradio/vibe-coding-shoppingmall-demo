const mongoose = require('mongoose');

// 장바구니 아이템 스키마
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  _id: true,
});

// 장바구니 스키마
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // 한 사용자당 하나의 장바구니만 존재
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalItems: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true, // createdAt과 updatedAt 자동 생성
});

// 총 금액과 총 아이템 수를 자동으로 계산하는 메서드
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return this;
};

// 장바구니에 아이템 추가
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // 이미 존재하는 상품이면 수량 증가
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price; // 가격 업데이트 (가격 변동 대비)
  } else {
    // 새로운 상품이면 추가
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price,
    });
  }

  this.calculateTotals();
  return this;
};

// 장바구니에서 아이템 제거
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  this.calculateTotals();
  return this;
};

// 아이템 수량 업데이트
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) {
      // 수량이 0 이하면 아이템 제거
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    this.calculateTotals();
  }

  return this;
};

// 장바구니 비우기
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalAmount = 0;
  this.totalItems = 0;
  return this;
};

// 저장 전에 총액과 총 아이템 수 자동 계산
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);

