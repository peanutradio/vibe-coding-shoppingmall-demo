const mongoose = require('mongoose');

// 주문 상품 아이템 스키마
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  _id: true,
});

// 주문 스키마
const orderSchema = new mongoose.Schema({
  // 주문기본정보
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // 주문상품정보
  items: [orderItemSchema],
  
  // 금액정보
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // 배송정보
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  detailAddress: {
    type: String,
    required: false,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryRequest: {
    type: String,
    required: false,
    trim: true,
  },
  
  // 결제정보
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'bank', 'kakao', 'naver'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  imp_uid: {
    type: String,
    required: false,
    trim: true,
  },
  merchant_uid: {
    type: String,
    required: false,
    trim: true,
    unique: true,
    sparse: true, // null 값은 중복 허용
  },
  
  // 주문 상태
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'],
    default: 'pending',
  },
  
  // 배송 추적 정보
  trackingNumber: {
    type: String,
    required: false,
    trim: true,
  },
  estimatedDeliveryDate: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true, // createdAt과 updatedAt 자동 생성
});

module.exports = mongoose.model('Order', orderSchema);



