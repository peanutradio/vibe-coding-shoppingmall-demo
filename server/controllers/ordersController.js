const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const https = require('https');

// 주문번호 생성 함수 (YYYYMMDD + 랜덤 6자리)
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000); // 6자리 랜덤 숫자
  return `${year}${month}${day}${random}`;
};

// 포트원 API 토큰 발급
const getIamportToken = () => {
  return new Promise((resolve, reject) => {
    const IMP_KEY = process.env.IMP_KEY || 'imp84574064'; // 포트원 API Key
    const IMP_SECRET = process.env.IMP_SECRET || ''; // 포트원 Secret Key (환경변수에서 가져오기)

    if (!IMP_SECRET) {
      reject(new Error('포트원 Secret Key가 설정되지 않았습니다.'));
      return;
    }

    const postData = JSON.stringify({
      imp_key: IMP_KEY,
      imp_secret: IMP_SECRET,
    });

    const options = {
      hostname: 'api.iamport.kr',
      port: 443,
      path: '/users/getToken',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.code === 0 && result.response && result.response.access_token) {
            resolve(result.response.access_token);
          } else {
            reject(new Error(result.message || '포트원 토큰 발급 실패'));
          }
        } catch (error) {
          reject(new Error('포트원 토큰 응답 파싱 실패'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// 포트원 결제 정보 조회 및 검증
const verifyPayment = async (impUid, expectedAmount) => {
  try {
    const token = await getIamportToken();

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.iamport.kr',
        port: 443,
        path: `/payments/${impUid}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.code === 0 && result.response) {
              const payment = result.response;
              
              // 결제 상태 검증
              if (payment.status !== 'paid') {
                reject(new Error(`결제가 완료되지 않았습니다. 상태: ${payment.status}`));
                return;
              }

              // 결제 금액 검증
              if (payment.amount !== expectedAmount) {
                reject(new Error(`결제 금액이 일치하지 않습니다. 예상: ${expectedAmount}, 실제: ${payment.amount}`));
                return;
              }

              resolve(payment);
            } else {
              reject(new Error(result.message || '결제 정보 조회 실패'));
            }
          } catch (error) {
            reject(new Error('결제 정보 응답 파싱 실패'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  } catch (error) {
    throw error;
  }
};

// CREATE - 새로운 주문 생성
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      items, // 직접 주문 생성 시 사용
      recipientName,
      shippingAddress,
      phone,
      address,
      detailAddress,
      zipCode,
      deliveryRequest,
      paymentMethod,
      useCart = false, // 장바구니에서 주문 생성 여부
      imp_uid, // 포트원 결제 고유번호
      merchant_uid, // 주문 고유번호
    } = req.body;

    // 필수 필드 검증
    if (!recipientName || !shippingAddress || !phone || !address || !zipCode || !paymentMethod) {
      return res.status(400).json({
        message: '필수 필드가 누락되었습니다.',
        required: ['recipientName', 'shippingAddress', 'phone', 'address', 'zipCode', 'paymentMethod'],
      });
    }

    // 결제 방법 검증
    if (!['card', 'bank', 'kakao', 'naver'].includes(paymentMethod)) {
      return res.status(400).json({
        message: '결제 방법은 card, bank, kakao, naver 중 하나여야 합니다.',
      });
    }

    let orderItems = [];
    let totalAmount = 0;

    // 장바구니에서 주문 생성
    if (useCart) {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          message: '장바구니가 비어있습니다.',
        });
      }

      // 장바구니 아이템을 주문 아이템으로 변환
      orderItems = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      }));

      totalAmount = cart.totalAmount || 0;
      
      // totalAmount 검증
      if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({
          message: '주문 금액이 올바르지 않습니다.',
        });
      }
    } else {
      // 직접 주문 생성
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: '주문할 상품이 없습니다.',
        });
      }

      // 상품 정보 확인 및 주문 아이템 생성
      for (const item of items) {
        if (!item.productId || !item.quantity || !item.price) {
          return res.status(400).json({
            message: '주문 아이템 정보가 올바르지 않습니다. (productId, quantity, price 필요)',
          });
        }

        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            message: `상품을 찾을 수 없습니다. (ID: ${item.productId})`,
          });
        }

        orderItems.push({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        totalAmount += item.price * item.quantity;
      }
      
      // totalAmount 검증
      if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({
          message: '주문 금액이 올바르지 않습니다.',
        });
      }
    }

    // orderItems 검증
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: '주문할 상품이 없습니다.',
      });
    }

    // 결제 상태 초기화
    let paymentStatus = 'pending';

    // 결제 정보가 있는 경우 주문 중복 체크 및 결제 검증
    if (imp_uid && merchant_uid) {
      // 1. merchant_uid로 이미 주문이 생성되었는지 확인
      const existingOrderByMerchant = await Order.findOne({ 
        $or: [
          { merchant_uid: merchant_uid },
          { imp_uid: imp_uid }
        ]
      });

      if (existingOrderByMerchant) {
        return res.status(409).json({
          message: '이미 처리된 주문입니다.',
          orderId: existingOrderByMerchant._id,
          orderNumber: existingOrderByMerchant.orderNumber,
        });
      }

      // 2. 포트원 결제 검증
      try {
        const paymentInfo = await verifyPayment(imp_uid, totalAmount);
        
        // 결제 정보 추가 검증
        if (paymentInfo.merchant_uid !== merchant_uid) {
          return res.status(400).json({
            message: '주문 고유번호가 일치하지 않습니다.',
          });
        }

        // 결제 상태를 completed로 설정
        paymentStatus = 'completed';
      } catch (paymentError) {
        return res.status(400).json({
          message: '결제 검증에 실패했습니다.',
          error: paymentError.message,
        });
      }
    }

    // 주문번호 생성 (중복 체크)
    let orderNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10; // 최대 시도 횟수 제한
    
    while (!isUnique && attempts < maxAttempts) {
      orderNumber = generateOrderNumber();
      const existingOrder = await Order.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique || !orderNumber) {
      return res.status(500).json({
        message: '주문번호 생성에 실패했습니다. 다시 시도해주세요.',
      });
    }

    // 최종 검증
    if (!orderNumber || !totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        message: '주문 정보가 올바르지 않습니다.',
        details: {
          orderNumber: orderNumber || '없음',
          totalAmount: totalAmount || 0,
        },
      });
    }

    // 주문 생성
    const orderData = {
      orderNumber,
      user: userId,
      items: orderItems,
      totalAmount,
      recipientName,
      shippingAddress,
      phone,
      address,
      detailAddress,
      zipCode,
      deliveryRequest,
      paymentMethod,
      paymentStatus,
      orderStatus: 'pending',
    };

    // 결제 정보가 있으면 추가
    if (imp_uid) {
      orderData.imp_uid = imp_uid;
    }
    if (merchant_uid) {
      orderData.merchant_uid = merchant_uid;
    }

    const order = new Order(orderData);

    const savedOrder = await order.save();

    // 장바구니에서 주문 생성한 경우 장바구니 비우기
    if (useCart) {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.clearCart();
        await cart.save();
      }
    }

    // 주문 정보와 함께 상품 정보 populate
    await savedOrder.populate('items.product');
    await savedOrder.populate('user', 'name email');

    res.status(201).json({
      message: '주문이 성공적으로 생성되었습니다.',
      order: savedOrder,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '유효성 검증 실패',
        error: error.message,
      });
    }
    res.status(500).json({
      message: '주문 생성 실패',
      error: error.message,
    });
  }
};

// READ - 모든 주문 조회
const getAllOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.user?.userType?.toLowerCase();

    // 관리자는 모든 주문 조회, 일반 사용자는 자신의 주문만 조회
    const query = (userType === 'admin' || userType === 'admiin') 
      ? {} 
      : { user: userId };

    // 쿼리 파라미터로 필터링 및 페이지네이션 지원
    const { orderStatus, paymentStatus, page, limit } = req.query;
    
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // 전체 개수 조회
    const totalCount = await Order.countDocuments(query);

    // limit가 제공된 경우에만 페이지네이션 적용
    if (limit !== undefined) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const orders = await Order.find(query)
        .populate('items.product')
        .populate('user', 'name email')
        .sort({ createdAt: -1 }) // 최신순 정렬
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(totalCount / limitNum);

      return res.json({
        message: '주문 목록 조회 성공',
        count: orders.length,
        totalCount,
        currentPage: pageNum,
        totalPages,
        orders,
      });
    } else {
      // limit가 없으면 전체 주문 반환
      const orders = await Order.find(query)
        .populate('items.product')
        .populate('user', 'name email')
        .sort({ createdAt: -1 }); // 최신순 정렬

      return res.json({
        message: '주문 목록 조회 성공',
        count: orders.length,
        totalCount: orders.length,
        orders,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: '주문 목록 조회 실패',
      error: error.message,
    });
  }
};

// READ - 특정 주문 조회
const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.user?.userType?.toLowerCase();
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: '주문을 찾을 수 없습니다.',
      });
    }

    // 관리자가 아니면 본인 주문만 조회 가능
    if (userType !== 'admin' && userType !== 'admiin') {
      if (order.user._id.toString() !== userId.toString()) {
        return res.status(403).json({
          message: '다른 사용자의 주문은 조회할 수 없습니다.',
        });
      }
    }

    res.json({
      message: '주문 조회 성공',
      order,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: '유효하지 않은 주문 ID입니다.',
      });
    }
    res.status(500).json({
      message: '주문 조회 실패',
      error: error.message,
    });
  }
};

// READ - 주문번호로 주문 조회
const getOrderByOrderNumber = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.user?.userType?.toLowerCase();
    const orderNumber = req.params.orderNumber;

    const order = await Order.findOne({ orderNumber })
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: '주문을 찾을 수 없습니다.',
      });
    }

    // 관리자가 아니면 본인 주문만 조회 가능
    if (userType !== 'admin' && userType !== 'admiin') {
      if (order.user._id.toString() !== userId.toString()) {
        return res.status(403).json({
          message: '다른 사용자의 주문은 조회할 수 없습니다.',
        });
      }
    }

    res.json({
      message: '주문 조회 성공',
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: '주문 조회 실패',
      error: error.message,
    });
  }
};

// UPDATE - 주문 정보 수정 (주문 상태, 결제 상태 등)
const updateOrder = async (req, res) => {
  try {
    const userType = req.user?.userType?.toLowerCase();
    
    // 관리자만 주문 수정 가능
    if (userType !== 'admin' && userType !== 'admiin') {
      return res.status(403).json({
        message: '주문 수정은 관리자만 가능합니다.',
      });
    }

    const {
      orderStatus,
      paymentStatus,
      shippingAddress,
      phone,
      address,
      detailAddress,
      zipCode,
      deliveryRequest,
      trackingNumber,
      estimatedDeliveryDate,
    } = req.body;

    const updateData = {};

    // 주문 상태 검증 및 업데이트
    if (orderStatus !== undefined) {
      if (!['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'].includes(orderStatus)) {
        return res.status(400).json({
          message: '유효하지 않은 주문 상태입니다.',
        });
      }
      updateData.orderStatus = orderStatus;
    }

    // 결제 상태 검증 및 업데이트
    if (paymentStatus !== undefined) {
      if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
        return res.status(400).json({
          message: '유효하지 않은 결제 상태입니다.',
        });
      }
      updateData.paymentStatus = paymentStatus;
    }

    // 배송 정보 업데이트
    if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (detailAddress !== undefined) updateData.detailAddress = detailAddress.trim();
    if (zipCode !== undefined) updateData.zipCode = zipCode.trim();
    if (deliveryRequest !== undefined) updateData.deliveryRequest = deliveryRequest.trim();
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber.trim();
    if (estimatedDeliveryDate !== undefined) updateData.estimatedDeliveryDate = estimatedDeliveryDate;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: '주문을 찾을 수 없습니다.',
      });
    }

    res.json({
      message: '주문 정보가 성공적으로 수정되었습니다.',
      order,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: '유효하지 않은 주문 ID입니다.',
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '유효성 검증 실패',
        error: error.message,
      });
    }
    res.status(500).json({
      message: '주문 수정 실패',
      error: error.message,
    });
  }
};

// DELETE - 주문 삭제 (관리자만 가능)
const deleteOrder = async (req, res) => {
  try {
    const userType = req.user?.userType?.toLowerCase();
    
    // 관리자만 주문 삭제 가능
    if (userType !== 'admin' && userType !== 'admiin') {
      return res.status(403).json({
        message: '주문 삭제는 관리자만 가능합니다.',
      });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: '주문을 찾을 수 없습니다.',
      });
    }

    res.json({
      message: '주문이 성공적으로 삭제되었습니다.',
      deletedOrder: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: '유효하지 않은 주문 ID입니다.',
      });
    }
    res.status(500).json({
      message: '주문 삭제 실패',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByOrderNumber,
  updateOrder,
  deleteOrder,
};

