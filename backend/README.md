# AgroHive Backend ⚙️

The core API service for the AgroHive platform, built with **NestJS** and **Prisma ORM**. It provides secure authentication, marketplace management, community social features, and notification workflows.

## 🚀 API Features

- **Auth:** Local and Google OAuth 2.0 with JWT strategies.
- **Products:** CRUD for the marketplace with category and price filtering.
- **Posts:** Community feed with likes, comments, and media support via Cloudinary.
- **Orders:** Managed purchase timelines and status tracking.
- **Notifications:** Multi-channel alerting via Firebase Push and Telegram Bot mirroring.
- **🤖 Telegram Integration:** Custom NestJS-Telegraf implementation for marketplace browsing, order checks, and platform analytics.
- **Resend:** Integrated email system for OTPs and notifications.
- **🌿 Prisma & PostgreSQL:** Robust data modeling and migrations.

---

## 🛠️ Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file from `.env.example` and set up your variables (DB_URL, JWT_SECRET, Firebase config, Cloudinary, etc.).

3. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

## 📂 Development

```bash
# Start development mode (watch)
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

---

## 📋 License

Licensed under the MIT License.
