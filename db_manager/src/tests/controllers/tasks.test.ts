import { Request, Response } from 'express';
import * as taskController from '../../controllers/tasks.js';
import * as service from '../../database/crud/task.js';
import { getEvent } from '../../database/crud/event.js';
import { verifyId, verifyAccess } from '../../services/verification.js';
import { errorHandler } from '../../services/errors.js';

jest.mock('../../database/crud/task.js');
jest.mock('../../database/crud/event.js');
jest.mock('../../services/verification.js');
jest.mock('../../services/errors.js');

describe('Task Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { cookies: { token: 'test-token' } };
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
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);
      (service.createTask as jest.Mock).mockResolvedValue(fakeTask);

      await taskController.createTask(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.body.eventId);
      expect(getEvent).toHaveBeenCalledWith('456');
      expect(verifyAccess).toHaveBeenCalledWith('test-token', 'user123', res);
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
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);
      (service.createTask as jest.Mock).mockRejectedValue(error);

      await taskController.createTask(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('deleteTask', () => {
    it('should call service.deleteTask and return task json on success', async () => {
      const fakeTask = { id: '789', eventId: '456' };
      const fakeDeletedTask = { id: '789' };
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getTask as jest.Mock).mockResolvedValue(fakeTask);
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);
      (service.deleteTask as jest.Mock).mockResolvedValue(fakeDeletedTask);

      await taskController.deleteTask(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.getTask).toHaveBeenCalledWith('789');
      expect(getEvent).toHaveBeenCalledWith(fakeTask.eventId);
      expect(verifyAccess).toHaveBeenCalledWith('test-token', 'user123', res);
      expect(service.deleteTask).toHaveBeenCalledWith('789');
      expect(res.json).toHaveBeenCalledWith(fakeDeletedTask);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getTask as jest.Mock).mockRejectedValue(error);

      await taskController.deleteTask(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getTaskById', () => {
    it('should call service.getTask and return task json on success', async () => {
      const fakeTask = { id: '789', eventId: '456' };
      req.params = { id: '789' };

      (verifyId as jest.Mock).mockReturnValue('789');
      (service.getTask as jest.Mock).mockResolvedValue(fakeTask);
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);

      await taskController.getTaskById(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.getTask).toHaveBeenCalledWith('789');
      expect(getEvent).toHaveBeenCalledWith(fakeTask.eventId);
      expect(verifyAccess).toHaveBeenCalledWith('test-token', 'user123', res);
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
      const fakeTask = { id: '101', name: 'Updated Task', eventId: '456' };
      const fakeEditedTask = { id: '101', name: 'Updated Task' };
      req.body = {
        id: '101',
        name: 'Updated Task',
        description: 'Updated Desc',
        completed: 'true',
      };
  
      (verifyId as jest.Mock).mockReturnValue('101');
      (service.getTask as jest.Mock).mockResolvedValue(fakeTask);
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);
      (service.updateTask as jest.Mock).mockResolvedValue(fakeEditedTask);
  
      await taskController.editTask(req as Request, res as Response);
  
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.body.id);
      expect(service.getTask).toHaveBeenCalledWith('101');
      expect(getEvent).toHaveBeenCalledWith(fakeTask.eventId);
      expect(verifyAccess).toHaveBeenCalledWith('test-token', 'user123', res);
      expect(service.updateTask).toHaveBeenCalledWith(
        req.body.id,
        req.body.name,
        req.body.description,
        Boolean(JSON.parse(req.body.completed))
      );
      expect(res.json).toHaveBeenCalledWith(fakeEditedTask);
    });
  
    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = {
        id: '101',
        name: 'Updated Task',
        description: 'Updated Desc',
        completed: 'false',
      };
  
      // Ensure that getTask and getEvent resolve correctly before updateTask is called
      (verifyId as jest.Mock).mockReturnValue('101');
      (service.getTask as jest.Mock).mockResolvedValue({ id: '101', eventId: '456' });
      (getEvent as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (verifyAccess as jest.Mock).mockReturnValue(res);
      (service.updateTask as jest.Mock).mockRejectedValue(error);
  
      await taskController.editTask(req as Request, res as Response);
  
      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });
  
});
