import express from 'express';
import { userRoutes, ordersRoutes } from './routes';
import { createTableIfNotExists } from './utils/initDatabase';
import { RedisClient } from './utils/redisClient';
import OrderModel from './models/order.model';
import { IOrderUpdate } from './interfaces/order.interface';

const app = express();
const port = process.env.PORT || 3000;

const handleRedisMessage = async (message: string) => {
  try {
    const orderToUpdate:IOrderUpdate = JSON.parse(message);
    const { id } = orderToUpdate;
    const { status } = orderToUpdate;
    const orderUpdated = await OrderModel.updateOrder(id, orderToUpdate);
    if (status === 'PENDING' || status === 'PROCESSING' || status === 'SHIPPED') {
      const redisClient = new RedisClient(process.env.REDIS_URL!);
      await redisClient.connect();
      const orderJSON = JSON.stringify(orderUpdated);
      await redisClient.publish('orderUpdates', orderJSON);
      await redisClient.disconnect();
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

async function initializeMiniApi() {
  try {
    // First, ensure the table exists and create if they don't exist (users and orders tables)
    await createTableIfNotExists();

    app.use(express.json());

    const redisClient = new RedisClient(process.env.REDIS_URL!);

    // Connect to Redis
    await redisClient.connect();

    // Subscribe to the Redis channel
    redisClient.subscribe('orderUpdatesResponse', async (message) => {
      handleRedisMessage(message);
    });

    app.use('/api/users', userRoutes);
    app.use('/api/orders', ordersRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize the application:', error);
  }
}

initializeMiniApi();