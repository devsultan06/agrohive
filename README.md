# AgroHive 🚜📦

AgroHive is a modern, all-in-one agricultural platform designed to empower farmers and agricultural enthusiasts. It features a **React Native mobile application**, a **React web frontend**, and a **Node.js/NestJS backend service**.

🔗 **Live Links:**

- **Landing Page:** [https://agrohive.vercel.app](https://agrohive.vercel.app)
- **Admin Dashboard:** [https://agrohive.vercel.app/admin/login](https://agrohive.vercel.app/admin/login)

---

## 📖 Project Overview

### 🎯 Problem Statement

Farmers across Nigeria face significant challenges in achieving sustainable and profitable farming. Access to modern farming tools, such as UK-used and locally sourced equipment, remains a hurdle due to high costs and limited availability. Additionally, farmers lack a platform to connect with each other, share knowledge, and collaborate on best practices. The absence of a trusted marketplace leaves them unable to purchase products from fellow farmers at affordable prices or sell their produce at fair rates. These issues hinder growth, innovation, and community development within the agricultural sector, leaving farmers isolated and under-resourced.

### 🚩 Objectives & Goals

- **Enhance Farmers' Access to Technology:** Provide a seamless platform where farmers can easily access modern agricultural tools, including UK-used, locally used, and brand-new equipment at affordable prices.
- **Knowledge Sharing:** Create a platform for farmers to learn about farming tools and connect with fellow farmers for peer-to-peer support.

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
- **Dynamic Farming Guides:** Database-backed video tutorials for modern farming techniques.

### 🌦️ Farmer Utilities

- **Weather Tracker:** Geolocation-based weather updates and farming recommendations.
- **Paystack Payment Integration:** Secure, seamless checkout with real-time webhook synchronization.
- **Orders Tracking:** Detailed order history with tracking timelines (Processing -> Shipped -> Delivered).
- **Multiple Shipping Support:** Address management with saved locations.

### 🤖 Telegram Bot Integration

- **Real-time Notifications:** Instant mirroring of push notifications for order status, payments, and product arrivals.
- **Account Linking:** One-click deep-linking from the mobile app to Telegram for secure account association.
- **Utility Commands:**
  - `/orders`: View recent order history and delivery status.
  - `/products`: Browse the top products in the marketplace.
  - `/weather [city]`: Fetch real-time weather and farming recommendations.
  - `/profile`: View linked AgroHive account details.
  - `/stats` (Admin Only): View platform-wide business analytics (Total Users, Revenue, Order Count).

### 🛠️ Admin & Web

- **Detail Order Management:** Explore comprehensive order details, items, and customer info.
- **Advanced Data Visualization:** Real-time monthly revenue trends and business analytics.
- **Content Moderation:** Full control over users, products, posts, and reviews.

---

## 🚀 Tech Stack

### 📱 Mobile App

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Language:** TypeScript
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Payments:** Paystack Webview Integration

### 🌐 Web Frontend

- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Charts:** Chart.js for revenue analytics.
- **Language:** TypeScript

### ⚙️ Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) ([Prisma ORM](https://www.prisma.io/))
- **Webhook Integration:** Paystack automated payment status updates.

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
3. Setup Environment Variables:
   Add the following to your `.env` file:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   OPENWEATHER_API_KEY=your_weather_api_key_here
   ```
4. Run Prisma migrations: `npx prisma generate`
5. Start development server: `npm run start:dev`

---

## 📄 License

This project is licensed under the MIT License.

---

_AgroHive — Growing the future, together._ 🌿
