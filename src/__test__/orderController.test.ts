import { OrderController } from './../controllers/order.controller';
import httpMocks from 'node-mocks-http';
import  OrderModel  from '../models/order.model';
import  { RedisClient }  from '../utils/redisClient';

jest.mock('../utils/redisClient', () => {
  return {
    RedisClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(null),
      publish: jest.fn().mockResolvedValue(null),
      disconnect: jest.fn().mockResolvedValue(null),
    })),
  };
});

beforeAll(() => {
  OrderModel.getOrderById = jest.fn();
});
  
  
describe('UserController', () => {
  describe('createOrder', () => {
    it('should create a new order and return 201 status', async () => {
      OrderModel.createOrder = jest.fn().mockResolvedValue({
        id: 1,
        mini: 45,
        userid: 2,
        price: 675,
        package: 'aucun',
        discount: 0,
        status: 'PENDING',
        serialnumbers: [],
        invoice: '{"price":675,"discount":"9.00 euros each figure"}',
        createdat: '2024-01-22T18:00:35.967Z',
        updatedat: '2024-01-22T18:00:35.967Z',
      });
      const req = httpMocks.createRequest({
        body: {
          mini: 45,
          package: 'aucun',
        },
        user: { userId: 2 },
      });
      const res = httpMocks.createResponse();

      await OrderController.createOrder(req, res);
      expect(res.statusCode).toBe(201);
    });
  });
  describe('updateOrder', () => {
    it('should update an order and return 200 status and new update the order status', async () => {

      OrderModel.getOrderById = jest.fn().mockResolvedValue(1);

      OrderModel.updateOrder = jest.fn().mockResolvedValue({
        id: 1,
        mini: 45,
        userid: 2,
        price: 675,
        package: 'aucun',
        discount: 0,
        status: 'PROCESSING',
        serialnumbers: [],
        invoice: '{"price":675,"discount":"9.00 euros each figure"}',
        createdat: '2024-01-22T18:00:35.967Z',
        updatedat: '2024-01-22T18:00:35.967Z',
      });


      const req = httpMocks.createRequest({
        body: {
          status: 'PROCESSING',
        },
        params: { id: 2 },
      });
      const res = httpMocks.createResponse();

      await OrderController.updateOrder(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
});
