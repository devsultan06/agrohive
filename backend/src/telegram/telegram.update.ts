import { Update, Start, Command, On, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (user) {
      await ctx.reply(
        `Welcome back, ${user.fullName}! 🌾\n\nI'm ready to help you with AgroHive.\n\nCommands:\n/products - Browse available products\n/orders - View your recent orders\n/weather [city] - Get current weather\n/profile - View your linked profile\n/help - See all commands`,
      );
    } else {
      await ctx.reply(
        'Welcome to AgroHive Bot! 🌾\n\nIt looks like your Telegram account is not linked to an AgroHive profile yet.\n\nType <code>/link your@email.com</code> to connect your account.',
        { parse_mode: 'HTML' },
      );
    }
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(
      '❓ <b>How to use AgroHive Bot:</b>\n\n' +
        '1️⃣ <b>Link your account:</b> Type <code>/link your@email.com</code>\n' +
        '2️⃣ <b>Browse Products:</b> Type <code>/products</code>\n' +
        '3️⃣ <b>Check Weather:</b> Type <code>/weather Lagos</code>\n' +
        '4️⃣ <b>Recent Orders:</b> Type <code>/orders</code>\n' +
        '5️⃣ <b>Your Profile:</b> Type <code>/profile</code>\n\n' +
        '<i>Once linked, you will receive real-time notifications from the AgroHive app here!</i>',
      { parse_mode: 'HTML' },
    );
  }

  @Command('weather')
  async onWeather(@Ctx() ctx: Context) {
    const message = (ctx.message as any).text;
    const city = message.split(' ')[1];

    if (!city) {
      return ctx.reply('Please provide a city name. Example: /weather Lagos');
    }

    try {
      const data = await this.telegramService.fetchWeatherByCity(city);
      const weatherMsg = `🌤 Weather in ${data.name}:\n\n🌡 Temp: ${data.temp}°C\n💧 Humidity: ${data.humidity}%\n🌬 Wind: ${data.windSpeed} m/s\n📝 Description: ${data.description}`;
      await ctx.reply(weatherMsg);
    } catch (error) {
      await ctx.reply(`❌ ${error.message}`);
    }
  }

  @Command('link')
  async onLink(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const message = (ctx.message as any).text;
    const email = message.split(' ')[1];

    if (!email) {
      return ctx.reply('Please provide your AgroHive email. Example: /link user@example.com');
    }

    try {
      const telegramId = ctx.from.id.toString();
      await this.usersService.linkTelegram(email, telegramId);
      await ctx.reply('✅ Success! Your Telegram account has been linked to ' + email);
    } catch (error) {
      await ctx.reply(`❌ Failed to link account: ${error.message}`);
    }
  }

  @Command('profile')
  async onProfile(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      return ctx.reply('You haven\'t linked your account yet. Use /link <email> first.');
    }

    await ctx.reply(
      `👤 Linked Profile:\n\nName: ${user.fullName}\nEmail: ${user.email}\nUsername: @${user.username}\nVerified: ${user.isVerified ? '✅' : '❌'}`,
    );
  }

  @Command('orders')
  async onOrders(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      return ctx.reply('You haven\'t linked your account yet. Use /link <email> to see your orders.');
    }

    try {
      const orders = await this.ordersService.findUserOrders(user.id);

      if (orders.length === 0) {
        return ctx.reply('📦 You haven\'t placed any orders yet. Visit the AgroHive app to start shopping!');
      }

      let orderMsg = '📦 <b>Your Recent Orders:</b>\n\n';

      orders.slice(0, 5).forEach((order) => {
        const statusEmoji =
          order.status === 'DELIVERED'
            ? '✅'
            : order.status === 'SHIPPED'
            ? '🚚'
            : order.status === 'CANCELLED'
            ? '❌'
            : '⏳';

        orderMsg += `🆔 <b>${order.orderNumber}</b>\n`;
        orderMsg += `💰 Total: ₦${order.totalAmount.toLocaleString()}\n`;
        orderMsg += `📊 Status: ${statusEmoji} ${order.status}\n`;
        orderMsg += `📅 Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
        orderMsg += '-------------------\n';
      });

      await ctx.reply(orderMsg, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply(`❌ Failed to fetch orders: ${error.message}`);
    }
  }

  @Command('products')
  async onProducts(@Ctx() ctx: Context) {
    try {
      const products = await this.productsService.findAll({ limit: 8 });

      if (products.length === 0) {
        return ctx.reply('🚜 No products available right now. Check back later!');
      }

      let productMsg = '🚜 <b>Available Products:</b>\n\n';

      products.forEach((p) => {
        productMsg += `🛒 <b>${p.name}</b>\n`;
        productMsg += `💰 Price: ₦${p.price.toLocaleString()}\n`;
        productMsg += `📁 Category: ${p.category}\n`;
        productMsg += `📦 Stock: ${p.stock > 0 ? p.stock + ' available' : '❌ Out of stock'}\n`;
        productMsg += '-------------------\n';
      });

      productMsg += '\n<i>Visit the AgroHive app to purchase!</i>';

      await ctx.reply(productMsg, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply(`❌ Failed to fetch products: ${error.message}`);
    }
  }
}
