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
  
  
describe('orderController', () => {
  describe('createOrder', () => {
    it('should create a new order and return 201 status', async () => {
      OrderModel.createOrder = jest.fn().mockResolvedValue({
        id: 1,
        mini: 45,
        userid: 2,
        price: 675,
        package: 'aucun',
        status: 'PENDING',
        serialnumbers: [],
        createdat: '2024-01-22T18:00:35.967Z',
        updatedat: '2024-01-22T18:00:35.967Z',
      });
      const req = httpMocks.createRequest({
        body: {
          mini: 10,
          package: 'aucun',
        },
        user: { userId: 2 },
      });
      const res = httpMocks.createResponse();

      await OrderController.createOrder(req, res);
    });

    it('should failed to create a new order and return 400 status', async () => {
      OrderModel.createOrder = jest.fn().mockResolvedValue(null);
      const req = httpMocks.createRequest({
        body: {
          package: 'aucun',
        },
        user: { userId: 2 },
      });
      const res = httpMocks.createResponse();

      await OrderController.createOrder(req, res);
      expect(res.statusCode).toBe(400);
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
  
  describe('getOrdersByUserId', () => {
    it('should retrieve all orders by userId and return 200', async () => {

      OrderModel.getOrdersByUserId = jest.fn().mockResolvedValue([
        {
          id: 1,
          mini: 45,
          userid: 2,
          price: 675,
          package: 'aucun',
          discount: 0,
          status: 'DELIVERED',
          serialnumbers: [
            'dae0b572-0168-4490-8978-d2d21d220e0a',
            'cd851afe-a4c9-478d-9ea7-8aaecdec2c4a',
            '00b1d1ed-7a7b-46ac-95b8-6bf09a2c3f40',
            'bc9b2c74-7276-4bf8-b1bc-7d00ae52de84',
            '169dc848-30d0-4fd7-8c4b-574e8b3a35d4',
            'a7b30e76-f9ea-41a5-ae4d-3f7dfb72fca8',
            'b2c6ddc0-7ce9-499f-aa52-ef61258f4e83',
            '908e8d7f-9076-4ad8-b275-27e25ebd64c2',
            '6508b426-3219-4559-8177-274f31bd67dd',
            '5dbcb11e-8f67-494a-8cfe-5ef3290d7dcd',
            'b3e6a556-8497-4228-b8b5-a09b686e4021',
            'd26eaa5f-05e4-4dcc-8230-92b45978c816',
            '46711da4-8789-4bac-a29c-03ef0bf96c05',
            'a2ecc480-bd29-4089-9cc9-f4586f611d48',
            '0de75d68-6abc-4e5f-b3f3-46188291c045',
            'b7c8fade-f1a4-41d9-987f-c4f747012ca1',
            '14e0e316-fac4-4f51-b2f2-74f8dd152fdf',
            'ece33359-262d-4c39-bbbc-eb75e43d08c8',
            '2e3b2a85-efa2-44c6-9cab-66de16cdc2fe',
            'dc9ee996-4cce-4969-afbf-0327e7384e94',
            '5e63df4e-689e-4080-9c03-c920cb9887d5',
            '8ae978d2-7acb-4de7-a5f5-a074dd6af370',
            '2896377c-eefd-4123-a92b-aca0e56640db',
            '7dc4197b-8b91-47dc-9b1e-ee7b574bc2f9',
            '83cef519-0c23-459b-974c-d55e8d471f8e',
            '59b1ef45-8094-4322-b6d3-b12c40331f63',
            '6c91a85e-1b34-4cbf-b135-17749bde604b',
            '7779f5e5-8c34-4234-92b2-3514f29bfa14',
            '74b2ac4e-6b86-495b-a334-ac9806a58d1a',
            '482d9ef9-c14c-47a0-8861-05b9996dfe2b',
            '0aabcf94-d4a0-49f8-a7f6-19fbfe47d857',
            'e616c92e-1eb2-47fe-af1f-2041f3e12f0b',
            '4e025a3a-bd8f-40ad-ac2a-df75336b3512',
            '2569e242-f9ec-495e-9c7d-2e8d03f8e7d5',
            'f7a1cd55-d7d5-4366-8238-ed60290d4e82',
            'f2300f3b-a645-4b18-a407-2e749d40b585',
            'fbcdb0fc-b42b-45ce-a2ba-5fb9b92f9a4d',
            'c1f3aaff-6027-4cc2-90d4-f49217f2c497',
            '8788588a-6a98-4b4e-85c4-ca064e9537b7',
            '37258dd5-669d-43dc-90f1-69673dea4bae',
            '163095cd-5cb6-4bca-a266-e89e939e2880',
            '27044cf5-a0d7-47c1-8042-ddc8e4447610',
            'dd85493b-ba8a-4b74-8f98-38fe17f08d31',
            '9de987a4-1c5a-43d7-b85e-d2af32648aaf',
            '84c96104-b647-49ac-8660-a2e5348f1158',
          ],
          invoice: '{"price":675,"discount":"9.00 euros each figure"}',
          createdat: '2024-01-22T18:00:35.967Z',
          updatedat: '2024-01-22T18:00:35.967Z',
        },
      ]);


      const req = httpMocks.createRequest({
        user: { userId: 2 },
      });
      const res = httpMocks.createResponse();

      await OrderController.getOrdersByUserId(req, res);
      expect(res.statusCode).toBe(200);
    });
    it('should return 404 if incorrect userId', async () => {

      OrderModel.getOrdersByUserId = jest.fn().mockResolvedValue(null);
  
  
      const req = httpMocks.createRequest({
        user: { userId: '' },
      });
      const res = httpMocks.createResponse();
  
      await OrderController.getOrdersByUserId(req, res);
      expect(res.statusCode).toBe(404);
    });
  });


});