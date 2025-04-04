import { Request, Response } from 'express';
import * as taskController from '../../controllers/tasks.js';
import * as service from '../../database/crud/task.js';
import { verifyId } from '../../services/verification.js';
import { errorHandler } from '../../services/errors.js';

jest.mock('../../database/crud/task.js');
jest.mock('../../services/verification.js');
jest.mock('../../services/errors.js');

describe('Task Controller', () => {
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

  describe('createTask', () => {
    it('should call service.createTask and return task json on success', async () => {
      const fakeTask = { name: 'Test Task' };
      req.body = {
        eventId: '456',
        name: 'Test Task',
        description: 'Test Desc',
        completed: 'true',
      };

      (verifyId as jest.Mock).mockReturnValue('456');
      (service.createTask as jest.Mock).mockResolvedValue(fakeTask);

      await taskController.createTask(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.body.eventId);
      expect(service.createTask).toHaveBeenCalledWith(
        req.body.name,
        req.body.description,
        Boolean(JSON.parse(req.body.completed)),
        '456'
      );
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = {
        eventId: '456',
        name: 'Test Task',
        description: 'Test Desc',
        completed: 'false',
      };

      (verifyId as jest.Mock).mockReturnValue('456');
      (service.createTask as jest.Mock).mockRejectedValue(error);

      await taskController.createTask(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('deleteTask', () => {
    it('should call service.deleteTask and return task json on success', async () => {
      const fakeTask = { id: '789' };
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.deleteTask as jest.Mock).mockResolvedValue(fakeTask);

      await taskController.deleteTask(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.deleteTask).toHaveBeenCalledWith('789');
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.deleteTask as jest.Mock).mockRejectedValue(error);

      await taskController.deleteTask(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getTaskById', () => {
    it('should call service.getTask and return task json on success', async () => {
      const fakeTask = { id: '789' };
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getTask as jest.Mock).mockResolvedValue(fakeTask);

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.getTask).toHaveBeenCalledWith('789');
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getTask as jest.Mock).mockRejectedValue(error);

      await taskController.getTaskById(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getAllTasks', () => {
    it('should call service.getAllTasks and return tasks json on success', async () => {
      const fakeTasks = [{ id: '1' }, { id: '2' }];
      (service.getAllTasks as jest.Mock).mockResolvedValue(fakeTasks);

      await taskController.getAllTasks(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.getAllTasks).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeTasks);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      (service.getAllTasks as jest.Mock).mockRejectedValue(error);

      await taskController.getAllTasks(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('editTask', () => {
    it('should call service.updateTask and return task json on success', async () => {
      const fakeTask = { id: '101', name: 'Updated Task' };
      req.body = {
        id: '101',
        name: 'Updated Task',
        description: 'Updated Desc',
        completed: 'true',
      };

      (service.updateTask as jest.Mock).mockResolvedValue(fakeTask);

      await taskController.editTask(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.updateTask).toHaveBeenCalledWith(
        req.body.id,
        req.body.name,
        req.body.description,
        Boolean(JSON.parse(req.body.completed))
      );
      expect(res.json).toHaveBeenCalledWith(fakeTask);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = {
        id: '101',
        name: 'Updated Task',
        description: 'Updated Desc',
        completed: 'false',
      };

      (service.updateTask as jest.Mock).mockRejectedValue(error);

      await taskController.editTask(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });
});
