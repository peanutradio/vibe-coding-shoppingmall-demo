# Shopping Mall Server

Node.js, Express, MongoDB를 사용한 쇼핑몰 데모 서버입니다.

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일을 열어 MongoDB 연결 문자열을 설정하세요.

3. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## MongoDB 설정

### 로컬 MongoDB 사용
```env
MONGODB_URI=mongodb://localhost:27017/shopping-mall
```

### MongoDB Atlas 사용
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-mall
```

