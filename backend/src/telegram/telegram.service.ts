import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  name: string;
}

@Injectable()
export class TelegramService {
  private readonly weatherApiKey: string;

  constructor(private configService: ConfigService) {
    this.weatherApiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
  }

  async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.weatherApiKey}&units=metric`,
      );
      const data = response.data;

      return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        name: data.name,
      };
    } catch (error) {
      console.error('Weather fetch error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }

  async fetchWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.weatherApiKey}&units=metric`,
      );
      const data = response.data;

      return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        name: data.name,
      };
    } catch (error) {
      console.error('Weather fetch error:', error.message);
      throw new Error(`Failed to fetch weather for ${city}`);
    }
  }
}
