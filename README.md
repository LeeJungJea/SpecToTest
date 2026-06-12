# SpecToTest

**SpecToTest**는 API 명세(Specification)를 기반으로 프론트엔드 및 백엔드 테스트 코드를 자동으로 생성해 주는 강력한 개발자 도구입니다. API 스펙 설계부터 테스트 작성까지의 과정을 자동화하여 개발 생산성을 극대화합니다.

**🌟 Live Demo:** [https://spec-suite-spec-to-test.vercel.app](https://spec-suite-spec-to-test.vercel.app)

---

## 🚀 주요 특징 (Features)

- **테스트 케이스 다각화**: 단순히 정상 동작(Happy Path)뿐만 아니라, 다양한 에러 케이스(400, 401, 403, 404, 500 등)와 엣지 케이스(null 응답, 필드 누락 등)에 대한 테스트 코드를 함께 생성합니다.
- **다양한 프레임워크 및 언어 지원**:
  - **프론트엔드 (10개)**: React TypeScript, Next.js, Vue 3, Nuxt.js, Angular, Svelte, Solid.js, Preact, Vanilla TS, Vanilla JS
  - **백엔드 (10개)**: Java Spring Boot, Node.js (TypeScript), Python FastAPI, Go (Gin), C# .NET, PHP Laravel, Ruby on Rails, Kotlin Ktor, Rust Actix, Elixir Phoenix
- **실시간 코드 프리뷰**: 왼쪽 패널에서 API 명세를 입력하거나 수정한 내용이 오른쪽 패널에 즉각적인 테스트 코드로 반영됩니다.
- **모던 개발 기술 스택**: React, TypeScript, Vite, Lucide React 아이콘 라이브러리 및 커스텀 CSS 변수를 활용하여 모던하고 감각적인 DevTools 테마의 UI를 구현했습니다.

---

## 🛠️ 지원 프레임워크 및 테스트 도구 스택

### 💻 Frontend (API Client Mocking)
- **React / Next.js / Solid.js / Preact / Vanilla JS & TS**: Jest / Vitest + Mocking
- **Vue 3 / Nuxt.js**: Vitest / Jest + Composable 테스트
- **Angular**: Injectable Service Test + HttpClientTestingModule + Jasmine
- **Svelte**: Jest / Vitest + Writable Store Mocking

### ⚙️ Backend (API Endpoint Integration Test)
- **Java Spring Boot**: JUnit 5 + MockMvc / WebTestClient
- **Node.js (TypeScript)**: Jest / Mocha + Supertest
- **Python FastAPI**: pytest + FastAPI TestClient
- **Go (Gin)**: go testing + net/http/httptest
- **C# .NET**: xUnit + WebApplicationFactory
- **PHP Laravel**: Pest / PHPUnit + HTTP Tests
- **Ruby on Rails**: RSpec Rails
- **Kotlin Ktor**: Ktor Server Testing Library
- **Rust Actix**: Actix Web Test framework
- **Elixir Phoenix**: Phoenix ConnCase / ExUnit

---

## 📦 설치 및 로컬 실행 방법 (Installation & Setup)

1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/LeeJungJea/SpecToTest.git
   cd SpecToTest
   ```

2. 종속성 패키지를 설치합니다:
   ```bash
   npm install
   ```

3. 로컬 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

4. 브라우저에서 안내된 로컬 주소(기본값 `http://localhost:5173`)로 접속합니다.

---

## 📄 라이선스 (License)

Copyright (c) 2026 Lee Jung Jea

이 프로젝트는 MIT 라이선스 하에 배포되며 자유롭게 사용 및 수정이 가능합니다. 자세한 사항은 [LICENSE](LICENSE) 파일을 참조하세요.
