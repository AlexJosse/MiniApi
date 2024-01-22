import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import OrderModel from '../models/order.model';
import { IOrder, IOrderUpdate } from '../interfaces/order.interface';
import { RedisClient } from '../utils/redisClient';
import { OrderStatus, Package } from '../constant';
import { createOrderSchema } from './joi-schemas/order.schema';

// interface for authenticated request
interface AuthRequest extends ExpressRequest {
  user: { userId: number };
}

/**
 * Controller for order-related operations.
 */

export class OrderController {
  /**
   * Creates a new order.
   * 
   * @param {ExpressRequest} req - The express request object containing the order data.
   * @param {ExpressResponse} res - The express response object.
   * 
   * This method calculates the price and discount for the order, sets the status to PENDING,
   * and then creates a new order in the database. The created order is then published
   * to Redis and returned in the response.
   */
  static async createOrder(req: ExpressRequest, res: ExpressResponse) {
    try {
      const authReq = req as AuthRequest;
      const validation = createOrderSchema.validate(req.body);
      if (validation.error) {
        return res.status(400).json({ message: validation.error.details[0].message });
      }
      let orderData: IOrder = req.body;
      const userId: number = authReq.user.userId;

      // Calculate price and discount
      const basePrice = orderData.mini >= 50 ? 9.00 : 15.00;
      let totalPrice = orderData.mini * basePrice;
      let discount = 0;

      if (orderData.package === Package.FAMILY && orderData.mini < 50) {
        discount = totalPrice * 0.20;
        totalPrice -= discount;
      }

      const newOrderData: IOrder = {
        ...orderData,
        userid: userId,
        status: OrderStatus.PENDING,
        price: totalPrice,
        discount: discount,
        invoice: JSON.stringify({
          price: totalPrice,
          discount: orderData.mini && '9.00 euros each figure',
        }),
      };

      const newOrder = await OrderModel.createOrder(newOrderData);
      
      const redisClient = new RedisClient(process.env.REDIS_URL!);
      await redisClient.connect();
      const orderJSON = JSON.stringify(newOrder);
      await redisClient.publish('orderUpdates', orderJSON);
      await redisClient.disconnect();

      res.status(201).json(newOrder);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Updates an existing order.
   * 
   * @param {ExpressRequest} req - The express request object containing the order update data.
   * @param {ExpressResponse} res - The express response object.
   * 
   * This method updates an order based on the provided order ID and update data.
   * The updated order is then published to Redis and returned in the response.
   * If the order is not found, it responds with a 404 status.
   */
  static async updateOrder(req: ExpressRequest, res: ExpressResponse) {
    try {
      // const authReq = req as AuthRequest;
      // const userId: number = authReq.user.userId;
      const orderId: number = parseInt(req.params.id); // Get the order ID from the URL parameter
      const updatedData: IOrderUpdate = req.body;

      const existingOrder = await OrderModel.getOrderById(orderId);

      if (!existingOrder) {
        // Order not found, return a 404 response
        return res.status(404).json({ message: 'Order not found' });
      }

      // if userId is different of the order user id throw error
  
      // Update the order data with the provided values
      const updatedOrder = await OrderModel.updateOrder(orderId, updatedData);
      console.log(updatedOrder);
      if (!updatedOrder) {
        // Handle the case where the order couldn't be updated
        return res.status(500).json({ message: 'Failed to update order' });
      }

      // Publish the updated order to Redis if needed (similar to the createOrder function)

      // Return the updated order in the response
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Retrieves orders by a user ID.
   * 
   * @param {ExpressRequest} req - The express request object.
   * @param {ExpressResponse} res - The express response object.
   * 
   * This method fetches all orders associated with the authenticated user's ID.
   * If no orders are found, it responds with a 404 status.
   */
  static async getOrdersByUserId(req: ExpressRequest, res: ExpressResponse) {
    try {
      const authReq = req as AuthRequest;
      const userId: number = authReq.user.userId; // Assuming you authenticate and get userId from JWT payload

      const orders = await OrderModel.getOrdersByUserId(userId);

      if (!orders) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

}

export default OrderController;
