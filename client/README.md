# Shopping Mall Client

Vite + React를 사용한 쇼핑몰 데모 클라이언트입니다.

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 프로덕션 빌드
```bash
npm run build
```

4. 빌드 미리보기
```bash
npm run preview
```

## 프로젝트 구조

```
client/
├── src/
│   ├── api/          # API 통신 설정 (axios)
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── pages/        # 페이지 컴포넌트
│   ├── utils/        # 유틸리티 함수
│   ├── App.jsx       # 메인 앱 컴포넌트
│   ├── main.jsx      # 진입점
│   └── index.css     # 전역 스타일
├── public/           # 정적 파일
├── vite.config.js    # Vite 설정
└── package.json      # 패키지 의존성
```

## 서버 연동

- 개발 서버 포트: `3000`
- API 프록시: `/api` → `http://localhost:5000`
- 서버가 포트 5000에서 실행 중이어야 합니다.

## 주요 기능

- ⚡️ Vite로 빠른 개발 환경
- ⚛️ React 19 최신 버전
- 🔄 HMR (Hot Module Replacement)
- 📦 Axios를 통한 API 통신
- 🎨 기본 스타일링 설정
