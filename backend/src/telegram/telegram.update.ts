import { Update, Start, Command, On, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { UsersService } from '../users/users.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly usersService: UsersService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const user = await this.usersService.findByTelegramId(telegramId);

    if (user) {
      await ctx.reply(
        `Welcome back, ${user.fullName}! 🌾\n\nI'm ready to help you with AgroHive.\n\nCommands:\n/weather [city] - Get current weather\n/profile - View your linked profile`,
      );
    } else {
      await ctx.reply(
        'Welcome to AgroHive Bot! 🌾\n\nIt looks like your Telegram account is not linked to an AgroHive profile yet.\n\nUse /link <your_email> to connect your account.',
      );
    }
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
}
