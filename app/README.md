# AgroHive

## Notification System Reference

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
