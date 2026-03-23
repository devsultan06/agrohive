# AgroHive 🚜📦

AgroHive is a modern, all-in-one agricultural platform designed to empower farmers and agricultural enthusiasts. It features a **React Native mobile application**, a **React web frontend**, and a **Node.js/NestJS backend service**.

---

## 📖 Project Overview

### 🎯 Problem Statement

Farmers across Nigeria face significant challenges in achieving sustainable and profitable farming. Access to modern farming tools, such as UK-used and locally sourced equipment, remains a hurdle due to high costs and limited availability. Additionally, farmers lack a platform to connect with each other, share knowledge, and collaborate on best practices. The absence of a trusted marketplace leaves them unable to purchase products from fellow farmers at affordable prices or sell their produce at fair rates. These issues hinder growth, innovation, and community development within the agricultural sector, leaving farmers isolated and under-resourced.

### 🚩 Objectives & Goals

- **Enhance Farmers' Access to Technology:** Provide a seamless platform where farmers can easily access modern agricultural tools, including UK-used, locally used, and brand-new equipment at affordable prices.
- **Knowledge Sharing:** Create a platform for farmers to learn about farming tools and connect with fellow farmers for peer-to-peer support.

### ⚙️ Our Process

1. **Discover:** Understanding farmer needs and market gaps.
2. **Define:** Strategizing solutions for equipment accessibility.
3. **Ideate:** Creating features like the marketplace and social connect.
4. **Design:** Building a premium, user-friendly interface for all platforms.

### 🏢 Business Challenges

- **Limited Tech Adoption:** Overcoming hesitation to embrace modern agricultural tools.
- **High Cost of Equipment:** Bridging the gap for farmers struggling to afford technology.
- **Fragmented Marketplace:** Solving the difficulty in connecting buyers with reliable sellers.
- **Lack of Awareness:** Educating farmers on available UK-used and local-used equipment options.

---

## ✨ Key Features

### 🛒 Marketplace

- **Product Listings:** High-quality farming equipment (drones, rotavators, sprayers).
- **Advanced Filtering:** Filter by category, price range, and ratings.
- **Detailed Views:** Comprehensive product descriptions, reviews, and rating systems.
- **Cart & Wishlist:** Seamless shopping experience with local persistence.

### 👥 Community & Social

- **AgroConnect:** A social feed for farmers to share posts, like, and comment.
- **Direct Messaging:** Real-time chat interface to connect with experts and sellers.
- **Profile Management:** Personalized user profiles with bio, follower/following counts, and post history.
- **Farming Guide:** Curated tutorials and guides for modern farming techniques.

### 🌦️ Farmer Utilities

- **Weather Tracker:** Geolocation-based weather updates and farming recommendations.
- **Orders Tracking:** Detailed order history with tracking timelines (Processing -> Shipped -> Delivered).
- **Address Management:** Multiple shipping address support.

### 🛠️ User Experience

- **Side Menu:** Quick access to all app sections.
- **Dark Mode Support:** Clean, premium aesthetic with tailored color palettes.
- **Interactive UI:** Smooth animations powered by React Native Reanimated.

---

## 🚀 Tech Stack

### 📱 Mobile App

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Language:** TypeScript
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

### 🌐 Web Frontend

- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

### ⚙️ Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) ([Prisma ORM](https://www.prisma.io/))
- **Language:** TypeScript

---

## 📂 Project Structure

```text
agrohive/
├── app/                    # Mobile Application (React Native / Expo)
├── backend/                # Backend Service (NestJS)
└── web/                    # Web Frontend (React / Vite)
```

---

## 🛠️ Monorepo Management

This project is organized as a monorepo.

- **Git Management:** Use the root Git repository for all commits.
- **Environment Variables:** Each service has its own `.env` file within its directory.
- **Dependencies:** Run `npm install` within each subdirectory (`app/`, `backend/`, `web/`) separately.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd agrohive
   ```

### 📱 Mobile App (`app/`)

1. Navigate to the app directory: `cd app`
2. Install dependencies: `npm install`
3. Start Expo: `npx expo start`

### 🌐 Web Frontend (`web/`)

1. Navigate to the web directory: `cd web`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### ⚙️ Backend (`backend/`)

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Run Prisma migrations: `npx prisma generate`
4. Start development server: `npm run start:dev`

---

## 📄 License

This project is licensed under the MIT License.

---

_AgroHive — Growing the future, together._ 🌿
