# SpecToTest

**SpecToTest** is a powerful developer tool that instantly generates frontend and backend test codes directly from API specifications. It automates the transition from API design to test implementation, significantly boosting development productivity.

**🌟 Live Demo:** [https://spec-suite-spec-to-test.vercel.app](https://spec-suite-spec-to-test.vercel.app)

---

## 🚀 Features

- **Comprehensive Test Cases**: Generates test codes not only for the happy path (200 OK) but also for various error cases (400, 401, 403, 404, 500, etc.) and edge cases (null response, missing optional fields).
- **Multi-Language & Framework Support**:
  - **Frontend (10)**: React TypeScript, Next.js, Vue 3, Nuxt.js, Angular, Svelte, Solid.js, Preact, Vanilla TS, Vanilla JS
  - **Backend (10)**: Java Spring Boot, Node.js (TypeScript), Python FastAPI, Go (Gin), C# .NET, PHP Laravel, Ruby on Rails, Kotlin Ktor, Rust Actix, Elixir Phoenix
- **Instant Preview**: Any input or modification made to the API specification in the left panel is immediately reflected as test code in the right panel.
- **Modern Tech Stack**: Built with React, TypeScript, Vite, Lucide React, and custom CSS variables, featuring a premium DevTools-style terminal aesthetic.

---

## 🛠️ Supported Frameworks & Testing Tools

### 💻 Frontend (API Client Mocking)
- **React / Next.js / Solid.js / Preact / Vanilla JS & TS**: Jest / Vitest + Mocking
- **Vue 3 / Nuxt.js**: Vitest / Jest + Composable Tests
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
- **Rust Actix**: Actix Web Test Framework
- **Elixir Phoenix**: Phoenix ConnCase / ExUnit

---

## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/LeeJungJea/SpecToTest.git
   cd SpecToTest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## 📄 License

Copyright (c) 2026 Lee Jung Jea

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
