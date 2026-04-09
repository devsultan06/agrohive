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
    const startPayload = (ctx as any).startPayload;

    if (startPayload) {
      try {
        const linkedUser = await this.usersService.linkTelegramById(startPayload, telegramId);
        return await ctx.reply(
          `✅ <b>Account Linked</b>\n\nWelcome to AgroHive, ${linkedUser.fullName}. Your account is now connected.\n\nYou will receive order updates and market alerts here.`,
          { parse_mode: 'HTML' },
        );
      } catch (error) {
        await ctx.reply(`⚠️ Failed to link account automatically: ${error.message}`);
      }
    }

    const user = await this.usersService.findByTelegramId(telegramId);

    if (user) {
      await ctx.reply(
        `Welcome back, ${user.fullName}.\n\nI'm ready to help you with AgroHive.\n\nCommands:\n/products - Browse products\n/orders - View recent orders\n/weather [city] - Get weather\n/profile - View profile\n/help - All commands`,
      );
    } else {
      await ctx.reply(
        'Welcome to AgroHive Bot.\n\nYour Telegram account is not linked to a profile yet.\n\nType <code>/link your@email.com</code> to connect.',
        { parse_mode: 'HTML' },
      );
    }
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(
      '<b>AgroHive Bot Guide:</b>\n\n' +
        '1. <b>Link account:</b> Type <code>/link your@email.com</code>\n' +
        '2. <b>Browse Products:</b> Type <code>/products</code>\n' +
        '3. <b>Check Weather:</b> Type <code>/weather [city]</code>\n' +
        '4. <b>Recent Orders:</b> Type <code>/orders</code>\n' +
        '5. <b>Profile:</b> Type <code>/profile</code>\n\n' +
        '<i>Once linked, notifications will be mirrored here.</i>',
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
      const weatherMsg = `Weather in ${data.name}:\n\nTemp: ${data.temp}°C\nHumidity: ${data.humidity}%\nWind: ${data.windSpeed} m/s\nDescription: ${data.description}`;
      await ctx.reply(weatherMsg);
    } catch (error) {
      await ctx.reply(`Error: ${error.message}`);
    }
  }

  @Command('link')
  async onLink(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const message = (ctx.message as any).text;
    const email = message.split(' ')[1];

    if (!email) {
      return ctx.reply('Please provide your email. Example: /link user@example.com');
    }

    try {
      const telegramId = ctx.from.id.toString();
      await this.usersService.linkTelegram(email, telegramId);
      await ctx.reply('✅ Success! Your account has been linked to ' + email);
    } catch (error) {
      await ctx.reply(`Error: ${error.message}`);
    }
  }

  @Command('profile')
  async onProfile(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      return ctx.reply("You haven't linked your account yet. Use /link [email].");
    }

    await ctx.reply(
      `<b>Linked Profile:</b>\n\nName: ${user.fullName}\nEmail: ${user.email}\nStatus: ${user.isVerified ? 'Verified' : 'Unverified'}`,
      { parse_mode: 'HTML' },
    );
  }

  @Command('orders')
  async onOrders(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      return ctx.reply("You haven't linked your account yet.");
    }

    try {
      const orders = await this.ordersService.findUserOrders(user.id);

      if (orders.length === 0) {
        return ctx.reply("You haven't placed any orders yet.");
      }

      let orderMsg = '<b>Your Recent Orders:</b>\n\n';

      orders.slice(0, 5).forEach((order) => {
        orderMsg += `ID: <b>${order.orderNumber}</b>\n`;
        orderMsg += `Total: ₦${order.totalAmount.toLocaleString()}\n`;
        orderMsg += `Status: ${order.status}\n`;
        orderMsg += `Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
        orderMsg += '-------------------\n';
      });

      await ctx.reply(orderMsg, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply(`Error: ${error.message}`);
    }
  }

  @Command('products')
  async onProducts(@Ctx() ctx: Context) {
    try {
      const products = await this.productsService.findAll({ limit: 8 });

      if (products.length === 0) {
        return ctx.reply('No products available right now.');
      }

      let productMsg = '<b>Available Products:</b>\n\n';

      products.forEach((p) => {
        productMsg += `<b>${p.name}</b>\n`;
        productMsg += `Price: ₦${p.price.toLocaleString()}\n`;
        productMsg += `Stock: ${p.stock > 0 ? p.stock + ' left' : 'Out of stock'}\n`;
        productMsg += '-------------------\n';
      });

      productMsg += '\n<i>Visit the app to purchase.</i>';

      await ctx.reply(productMsg, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply(`Error: ${error.message}`);
    }
  }

  @Command('stats')
  async onStats(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user || user.role !== 'ADMIN') {
      return ctx.reply('Error: Only Admins can view platform stats.');
    }

    try {
      const stats = await this.usersService.getGeneralStats();
      const linkedUsers = await (this.usersService as any).prisma.user.count({
        where: { telegramId: { not: null } },
      });

      let statsMsg = '📊 <b>Platform Stats:</b>\n\n';
      statsMsg += `Total Users: ${stats.totalUsers}\n`;
      statsMsg += `Linked Bots: ${linkedUsers}\n`;
      statsMsg += `Active Products: ${stats.activeListings}\n`;
      statsMsg += `Total Orders: ${stats.totalOrders}\n`;
      statsMsg += `Revenue: ₦${stats.totalRevenue.toLocaleString()}\n`;

      await ctx.reply(statsMsg, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply(`Error: ${error.message}`);
    }
  }
}
