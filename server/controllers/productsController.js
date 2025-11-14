const Product = require('../models/Product');

// CREATE - 새로운 상품 생성
const createProduct = async (req, res) => {
  try {
    // 관리자 권한 확인
    const userType = req.user?.userType?.toLowerCase();
    if (userType !== 'admin' && userType !== 'admiin') {
      return res.status(403).json({ 
        message: '상품 등록은 관리자만 가능합니다.' 
      });
    }

    const { sku, name, price, category, image, description } = req.body;

    // 필수 필드 검증
    if (!sku || !name || !price || !category || !image) {
      return res.status(400).json({ 
        message: '필수 필드가 누락되었습니다.', 
        required: ['sku', 'name', 'price', 'category', 'image'] 
      });
    }

    // 카테고리 검증
    if (!['상의', '하의', '악세사리'].includes(category)) {
      return res.status(400).json({ 
        message: '카테고리는 상의, 하의, 악세사리 중 하나여야 합니다.' 
      });
    }

    // 가격 검증
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        message: '가격은 0 이상의 숫자여야 합니다.' 
      });
    }

    const product = new Product({
      sku: sku.toUpperCase().trim(), // SKU는 대문자로 변환
      name: name.trim(),
      price,
      category,
      image: image.trim(),
      description: description ? description.trim() : '', // description은 선택사항
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: '상품이 성공적으로 생성되었습니다.',
      product: savedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: '이미 존재하는 SKU입니다.' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: '유효성 검증 실패', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: '상품 생성 실패', 
      error: error.message 
    });
  }
};

// READ - 모든 상품 조회
const getAllProducts = async (req, res) => {
  try {
    // 쿼리 파라미터로 카테고리 필터링 및 페이지네이션 지원
    const { category, page, limit } = req.query;
    const query = category ? { category } : {};

    // 전체 개수 조회
    const totalCount = await Product.countDocuments(query);
    
    // limit가 제공된 경우에만 페이지네이션 적용
    if (limit !== undefined) {
      const pageNum = parseInt(page || 1, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;
      
      // 페이지네이션 적용하여 상품 조회
      const products = await Product.find(query)
        .sort({ createdAt: -1 }) // 최신순 정렬
        .skip(skip)
        .limit(limitNum);
      
      // 전체 페이지 수 계산
      const totalPages = Math.ceil(totalCount / limitNum);
      
      return res.json({
        message: '상품 목록 조회 성공',
        count: products.length,
        totalCount,
        currentPage: pageNum,
        totalPages,
        products,
      });
    } else {
      // limit가 없으면 전체 상품 반환
      const products = await Product.find(query)
        .sort({ createdAt: -1 }); // 최신순 정렬
      
      return res.json({
        message: '상품 목록 조회 성공',
        count: products.length,
        totalCount: products.length,
        products,
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: '상품 목록 조회 실패', 
      error: error.message 
    });
  }
};

// READ - 특정 상품 조회 (ID로)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.' 
      });
    }

    res.json({
      message: '상품 조회 성공',
      product,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: '유효하지 않은 상품 ID입니다.' 
      });
    }
    res.status(500).json({ 
      message: '상품 조회 실패', 
      error: error.message 
    });
  }
};

// READ - SKU로 상품 조회
const getProductBySku = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      sku: req.params.sku.toUpperCase() 
    });
    
    if (!product) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.' 
      });
    }

    res.json({
      message: '상품 조회 성공',
      product,
    });
  } catch (error) {
    res.status(500).json({ 
      message: '상품 조회 실패', 
      error: error.message 
    });
  }
};

// UPDATE - 상품 정보 수정
const updateProduct = async (req, res) => {
  try {
    // 관리자 권한 확인
    const userType = req.user?.userType?.toLowerCase();
    if (userType !== 'admin' && userType !== 'admiin') {
      return res.status(403).json({ 
        message: '상품 수정은 관리자만 가능합니다.' 
      });
    }

    const { sku, name, price, category, image, description } = req.body;

    // 카테고리 검증 (제공된 경우)
    if (category && !['상의', '하의', '악세사리'].includes(category)) {
      return res.status(400).json({ 
        message: '카테고리는 상의, 하의, 악세사리 중 하나여야 합니다.' 
      });
    }

    // 가격 검증 (제공된 경우)
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ 
        message: '가격은 0 이상의 숫자여야 합니다.' 
      });
    }

    const updateData = {};
    if (sku !== undefined) updateData.sku = sku.toUpperCase().trim();
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image.trim();
    if (description !== undefined) updateData.description = description.trim();

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.' 
      });
    }

    res.json({
      message: '상품 정보가 성공적으로 수정되었습니다.',
      product,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: '유효하지 않은 상품 ID입니다.' 
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: '이미 존재하는 SKU입니다.' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: '유효성 검증 실패', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: '상품 수정 실패', 
      error: error.message 
    });
  }
};

// DELETE - 상품 삭제
const deleteProduct = async (req, res) => {
  try {
    // 관리자 권한 확인
    const userType = req.user?.userType?.toLowerCase();
    if (userType !== 'admin' && userType !== 'admiin') {
      return res.status(403).json({ 
        message: '상품 삭제는 관리자만 가능합니다.' 
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        message: '상품을 찾을 수 없습니다.' 
      });
    }

    res.json({
      message: '상품이 성공적으로 삭제되었습니다.',
      deletedProduct: {
        id: product._id,
        sku: product.sku,
        name: product.name,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: '유효하지 않은 상품 ID입니다.' 
      });
    }
    res.status(500).json({ 
      message: '상품 삭제 실패', 
      error: error.message 
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySku,
  updateProduct,
  deleteProduct,
};

