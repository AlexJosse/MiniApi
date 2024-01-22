import { createClient } from 'redis';

export class RedisClient {
  private client;

  constructor(url: string) {
    this.client = createClient({
      url: url,
    });

    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.on('connect', () => console.log('Connected to Redis'));
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  async subscribe(channel: string, onMessage: (channel: string, message: string) => void): Promise<void> {
    await this.client.subscribe(channel, (ch, msg) => {
      onMessage(ch, msg);
    });
  }
}