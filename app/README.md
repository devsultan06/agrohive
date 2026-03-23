# AgroHive Mobile App 📱

The mobile application for the AgroHive platform, built with **Expo** (React Native).

## 🚀 Features

- **🛍️ Marketplace:** Browse and purchase high-quality farming equipment.
- **🌱 AgroConnect:** Social platform for sharing farming updates and knowledge.
- **🌦️ Weather Tracker:** Real-time weather data and alerts for farmers.
- **💬 Messaging:** Direct chat with experts and sellers.
- **📦 Order Tracking:** Dynamic timelines for your purchases.
- **🔔 Notifications:** Rich notification system for likes, comments, and alerts.

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file with:

   ```env
   EXPO_PUBLIC_WEATHER_API_KEY=your_key_here
   API_URL=http://your_backend_url
   ```

3. **Start the app:**
   ```bash
   npx expo start
   ```

---

## 🔔 Notification System Reference

This section outlines the notification types currently implemented on the frontend. Backend services should emit events corresponding to these types.

### Notification Types

| TypeKey            | Icon       | Description                                    | Trigger Example                                   |
| :----------------- | :--------- | :--------------------------------------------- | :------------------------------------------------ |
| **`like`**         | ❤️ Heart   | Social interaction: user likes a post.         | "John Doe liked your post"                        |
| **`comment`**      | 💬 Bubble  | Social interaction: user comments on a post.   | "Sarah commented on your post"                    |
| **`follow`**       | 👤 Person+ | Social interaction: user follows another user. | "GreenFarm Ltd started following you"             |
| **`order`**        | 📦 Box     | Order status updates (shipped, delivered).     | "Your order #123 has been delivered"              |
| **`weather`**      | 🌦️ Cloud   | Critical weather alerts for farming.           | "Heavy rain expected tomorrow"                    |
| **`promo`**        | 🏷️ Tag     | Marketing promotions and discounts.            | "20% Off on Tools"                                |
| **`system`**       | ⚙️ Gear    | Account updates or app-wide announcements.     | "Profile updated successfully"                    |
| **`mention`**      | @ symbol   | Social interaction: user mentioned in a post.  | "John mentioned you in a comment"                 |
| **`restock`**      | 🔄 Arrow   | Market: product back in stock.                 | "Drip Irrigation Kit is back in stock!"           |
| **`price_drop`**   | 📉 Chart   | Market: price of a favorited item dropped.     | "Price alert: Fertilizer is now 10% cheaper!"     |
| **`expert_reply`** | 👨‍🌾 Farmer  | Community: expert answered a question.         | "Dr. Green replied to your question about pests." |
| **`pest_alert`**   | 🐛 Bug     | Farming: local pest outbreak waring.           | "Fall Armyworm detected in your region."          |

### Data Structure (Example)

```json
{
  "id": "uuid",
  "type": "like", // one of the keys above
  "title": "New Like",
  "message": "John Doe liked your post...",
  "time": "2 mins ago", // or timestamp
  "read": false
}
```
