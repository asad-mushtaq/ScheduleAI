// subscriptions.controller.test.ts
import { Request, Response } from 'express';
import * as subscriptionController from '../../controllers/subscriptions.js';
import * as service from '../../database/crud/subscription.js';
import { verifyId } from '../../services/verification.js';
import { errorHandler } from '../../services/errors.js';

jest.mock('../../database/crud/subscription.js');
jest.mock('../../services/verify-params.js');
jest.mock('../../services/errors.js');

describe('Subscription Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      setHeader: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createSubscription', () => {
    it('should create and return a new subscription', async () => {
      const fakeSub = { id: 'abc123', name: 'Pro Plan' };
      req.body = { name: 'Pro Plan', priceUsd: '19.99', queryLimit: '1000' };

      (service.createSubscription as jest.Mock).mockResolvedValue(fakeSub);

      await subscriptionController.createSubscription(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.createSubscription).toHaveBeenCalledWith('Pro Plan', 19.99, 1000);
      expect(res.json).toHaveBeenCalledWith(fakeSub);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed');
      req.body = { name: 'Pro Plan', priceUsd: '19.99', queryLimit: '1000' };

      (service.createSubscription as jest.Mock).mockRejectedValue(error);

      await subscriptionController.createSubscription(req as Request, res as Response);
      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('deleteSubscription', () => {
    it('should delete a subscription and return response', async () => {
      const fakeSub = { id: 'abc123' };
      req.params = { id: 'abc123' };

      (verifyId as jest.Mock).mockReturnValue('abc123');
      (service.deleteSubscription as jest.Mock).mockResolvedValue(fakeSub);

      await subscriptionController.deleteSubscription(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.deleteSubscription).toHaveBeenCalledWith('abc123');
      expect(res.json).toHaveBeenCalledWith(fakeSub);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed');
      req.params = { id: 'abc123' };

      (verifyId as jest.Mock).mockReturnValue('abc123');
      (service.deleteSubscription as jest.Mock).mockRejectedValue(error);

      await subscriptionController.deleteSubscription(req as Request, res as Response);
      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getAllSubscriptions', () => {
    it('should return all subscriptions', async () => {
      const fakeSubs = [{ id: '1' }, { id: '2' }];
      (service.getAllSubscriptions as jest.Mock).mockResolvedValue(fakeSubs);

      await subscriptionController.getAllSubscriptions(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.getAllSubscriptions).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeSubs);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed');
      (service.getAllSubscriptions as jest.Mock).mockRejectedValue(error);

      await subscriptionController.getAllSubscriptions(req as Request, res as Response);
      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });
});