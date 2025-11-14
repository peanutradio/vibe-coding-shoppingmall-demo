const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // SKU는 보통 대문자로 저장
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // 가격은 0 이상이어야 함
  },
  category: {
    type: String,
    required: true,
    enum: ['상의', '하의', '악세사리'],
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true, // createdAt과 updatedAt 자동 생성
});

module.exports = mongoose.model('Product', productSchema);

