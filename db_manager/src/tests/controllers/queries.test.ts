import { Request, Response } from 'express';
import * as queryController from '../../controllers/queries.js';
import * as service from '../../database/crud/query.js';
import { verifyId, verifyIdentity } from '../../services/verification.js';
import { errorHandler } from '../../services/errors.js';

jest.mock('../../database/crud/query.js');
jest.mock('../../services/verification.js');
jest.mock('../../services/errors.js');

describe('Query Controller', () => {
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

  describe('createQuery', () => {
    it('should call service.createQuery and return query json on success', async () => {
      req.body = { userId: '123', prompt: 'prompt', response: 'response' };
      req.cookies = { token: 'test-token' };

      const fakeQuery = { id: '1', userId: '123', prompt: 'prompt', response: 'response' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (verifyIdentity as jest.Mock).mockReturnValue(res);
      (service.createQuery as jest.Mock).mockResolvedValue(fakeQuery);

      await queryController.createQuery(req as Request, res as Response);

      expect(verifyId).toHaveBeenCalledWith('123');
      expect(verifyIdentity).toHaveBeenCalledWith('test-token', '123', res);
      expect(service.createQuery).toHaveBeenCalledWith('prompt', 'response', '123');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(fakeQuery);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = { userId: '123', prompt: 'prompt', response: 'response' };
      req.cookies = { token: 'test-token' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (verifyIdentity as jest.Mock).mockReturnValue(res);
      (service.createQuery as jest.Mock).mockRejectedValue(error);

      await queryController.createQuery(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('deleteQuery', () => {
    it('should call service.deleteQuery and return query json on success', async () => {
      const fakeQuery = { id: '456' };
      req.params = { id: '456' };

      (verifyId as jest.Mock).mockReturnValue('456');
      (service.deleteQuery as jest.Mock).mockResolvedValue(fakeQuery);

      await queryController.deleteQuery(req as Request, res as Response);

      expect(verifyId).toHaveBeenCalledWith('456');
      expect(service.deleteQuery).toHaveBeenCalledWith('456');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(fakeQuery);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '456' };

      (verifyId as jest.Mock).mockReturnValue('456');
      (service.deleteQuery as jest.Mock).mockRejectedValue(error);

      await queryController.deleteQuery(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getQueryById', () => {
    it('should call service.getQuery and return query json on success', async () => {
      const fakeQuery = { id: '789' };
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getQuery as jest.Mock).mockResolvedValue(fakeQuery);

      await queryController.getQueryById(req as Request, res as Response);

      expect(verifyId).toHaveBeenCalledWith('789');
      expect(service.getQuery).toHaveBeenCalledWith('789');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(fakeQuery);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getQuery as jest.Mock).mockRejectedValue(error);

      await queryController.getQueryById(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getAllQueries', () => {
    it('should call service.getAllQueries and return queries json on success', async () => {
      const fakeQueries = [{ id: '1' }, { id: '2' }];
      (service.getAllQueries as jest.Mock).mockResolvedValue(fakeQueries);

      await queryController.getAllQueries(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.getAllQueries).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeQueries);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      (service.getAllQueries as jest.Mock).mockRejectedValue(error);

      await queryController.getAllQueries(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('editQuery', () => {
    it('should call service.updateQuery and return query json on success', async () => {
      const fakeQuery = { id: '999', prompt: 'updated', response: 'updated response' };
      req.body = { id: '999', prompt: 'updated', response: 'updated response' };

      (verifyId as jest.Mock).mockReturnValue('999');
      (service.updateQuery as jest.Mock).mockResolvedValue(fakeQuery);

      await queryController.editQuery(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith('999');
      expect(service.updateQuery).toHaveBeenCalledWith('999', 'updated', 'updated response');
      expect(res.json).toHaveBeenCalledWith(fakeQuery);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = { id: '999', prompt: 'updated', response: 'updated response' };

      (verifyId as jest.Mock).mockReturnValue('999');
      (service.updateQuery as jest.Mock).mockRejectedValue(error);

      await queryController.editQuery(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });
});
