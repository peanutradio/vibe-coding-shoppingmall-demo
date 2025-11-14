const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CREATE - 새로운 유저 생성
const createUser = async (req, res) => {
  try {
    const { email, name, password, userType, address } = req.body;

    // 필수 필드 검증
    if (!email || !name || !password || !userType) {
      return res.status(400).json({ 
        message: '필수 필드가 누락되었습니다.', 
        required: ['email', 'name', 'password', 'userType'] 
      });
    }
    
    // userType 검증
    if (!['customer', 'admin'].includes(userType)) {
      return res.status(400).json({ 
        message: 'userType은 customer 또는 admin이어야 합니다.' 
      });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      name,
      password: hashedPassword, // 암호화된 비밀번호 저장
      userType,
      address: address || '', // address는 선택사항, 없으면 빈 문자열로 저장
    });

    const savedUser = await user.save();
    
    // password는 응답에서 제외
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    // address가 없어도 필드를 포함시킴 (빈 문자열)
    if (!userResponse.address) {
      userResponse.address = '';
    }

    res.status(201).json({
      message: '유저가 성공적으로 생성되었습니다.',
      user: userResponse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }
    res.status(500).json({ message: '유저 생성 실패', error: error.message });
  }
};

// READ - 모든 유저 조회
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // password 제외
    res.json({
      message: '유저 목록 조회 성공',
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: '유저 목록 조회 실패', error: error.message });
  }
};

// READ - 특정 유저 조회 (ID로)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    res.json({
      message: '유저 조회 성공',
      user,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: '유효하지 않은 유저 ID입니다.' });
    }
    res.status(500).json({ message: '유저 조회 실패', error: error.message });
  }
};

// UPDATE - 유저 정보 수정
const updateUser = async (req, res) => {
  try {
    const { email, name, password, userType, address } = req.body;

    // userType 검증 (제공된 경우)
    if (userType && !['customer', 'admin'].includes(userType)) {
      return res.status(400).json({ 
        message: 'userType은 customer 또는 admin이어야 합니다.' 
      });
    }

    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (password !== undefined) {
      // 비밀번호 업데이트 시 암호화
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }
    if (userType !== undefined) updateData.userType = userType;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    res.json({
      message: '유저 정보가 성공적으로 수정되었습니다.',
      user,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: '유효하지 않은 유저 ID입니다.' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }
    res.status(500).json({ message: '유저 수정 실패', error: error.message });
  }
};

// DELETE - 유저 삭제
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    res.json({
      message: '유저가 성공적으로 삭제되었습니다.',
      deletedUser: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: '유효하지 않은 유저 ID입니다.' });
    }
    res.status(500).json({ message: '유저 삭제 실패', error: error.message });
  }
};

// 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({
        message: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    // 이메일로 유저 찾기
    const user = await User.findOne({ email: email.toLowerCase() });

    // 유저가 없으면
    if (!user) {
      return res.status(401).json({
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 비밀번호가 틀리면
    if (!isPasswordValid) {
      return res.status(401).json({
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: '7d', // 7일 후 만료
      }
    );

    // 유저 정보 (비밀번호 제외)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: '로그인 성공',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      message: '로그인 처리 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// 토큰으로 현재 유저 정보 가져오기
const getCurrentUser = async (req, res) => {
  try {
    // authenticateToken 미들웨어에서 req.user에 유저 정보가 저장됨
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: '유저를 찾을 수 없습니다.',
      });
    }

    res.json({
      message: '유저 정보 조회 성공',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: '유저 정보 조회 실패',
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
};

