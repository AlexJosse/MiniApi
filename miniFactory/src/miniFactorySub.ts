require('dotenv').config();

import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

import { OrderStatus } from './constant';

const initializeRedis = async () => {
  const redisClient = createClient({
    url: process.env.REDIS_HOST,
  });
  const client = await redisClient.connect();
  return client;
};


const generateUUIDs = (count: number): string[] => {
  return Array.from({ length: count }, () => uuidv4());
};

const handleOrderMessage = async (messageJSON: string) => {
  try {
    const order = JSON.parse(messageJSON);
    const serialNumbers: string[] = generateUUIDs(order.mini);
    let updatedStatus = 'ERROR'; // Default to "ERROR" in case of an unexpected status

    // Determine the next status based on the current status
    switch (order.status) {
      case OrderStatus.PENDING:
        updatedStatus = OrderStatus.PROCESSING;
        break;
      case OrderStatus.PROCESSING:
        updatedStatus = OrderStatus.SHIPPED;
        break;
      case OrderStatus.SHIPPED:
        updatedStatus = OrderStatus.DELIVERED;
        break;
      default:
        updatedStatus = OrderStatus.ERROR;
    }

    const updatedOrder = {
      ...order,
      status: updatedStatus,
      serialnumbers: serialNumbers,
    };

    console.log('orders informations', updatedOrder.id, updatedOrder.status);
    const updatedOrderJSON = JSON.stringify(updatedOrder);
    return updatedOrderJSON;
  } catch (error) {
    console.error('Error parsing order message:', error);
  }
};


// Subscribe to Redis channel and handle messages
initializeRedis().then(async (client) => {
  const clientPublisher = await initializeRedis();

  client.subscribe('orderUpdates', async (message) => {
    const response = await handleOrderMessage(message);
    clientPublisher.publish('orderUpdatesResponse', response as string);
  });
});