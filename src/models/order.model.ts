import prisma from '../utils/prismaClient';
import { IOrder, IOrderUpdate } from '../interfaces/order.interface';

/**
 * Model for handling database operations related to orders.
 */

class OrderModel {
  /**
   * Creates a new order in the database.
   * 
   * @param {IOrder} orderData - The order data to be saved.
   * @returns {Promise<IOrder>} A promise that resolves to the created order.
   */
  static async createOrder(orderData: IOrder): Promise<IOrder> {
    const newOrder = await prisma.orders.create({
      data: orderData,
    });
    return newOrder;
  }

  /**
   * Retrieves an order by its ID.
   * 
   * @param {number} orderId - The ID of the order to be retrieved.
   * @returns {Promise<IOrder | null>} A promise that resolves to the order if found, or null if not found.
   */
  static async getOrderById(orderId: number): Promise<IOrder | null> {
    try {
      const order = await prisma.orders.findUnique({
        where: {
          id: orderId,
        },
      });

      return order || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing order in the database.
   * 
   * @param {number} orderId - The ID of the order to be updated.
   * @param {IOrderUpdate} updatedData - The data to update the order with.
   * @returns {Promise<IOrder | null>} A promise that resolves to the updated order if the update is successful, or null if the order is not found.
   */
  static async updateOrder(orderId: number, updatedData: IOrderUpdate): Promise<IOrder | null> {
    try {
      const { id, ...updateDataWithoutId } = updatedData;
      const existingOrder = await prisma.orders.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!existingOrder) {
        // Order not found, return null 
        return null;
      }

      const updatedOrder = await prisma.orders.update({
        where: {
          id: orderId,
        },
        data: updateDataWithoutId,
      });

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all orders associated with a given user ID.
   * 
   * @param {number} userId - The user ID to retrieve orders for.
   * @returns {Promise<IOrder[] | null>} A promise that resolves to an array of orders if found, or null if no orders are found.
   */
  static async getOrdersByUserId(userId: number): Promise<IOrder[] | null> {
    try {
      const orders = await prisma.orders.findMany({
        where: {
          userid: userId,
        },
      });

      return orders.length > 0 ? orders : null;
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      throw error;
    }
  }
}

export default OrderModel;
